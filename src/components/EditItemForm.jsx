import { useState, useEffect } from 'react';
import './EditItemForm.css';

const SIZE_OPTIONS = ['2x2', '4x2', '18x12', '12x12', 'custom'];

function EditItemForm({ item, onUpdate, onDelete, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    size: '2x2',
    customSize: '',
    quantity: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        size: item.size || '2x2',
        customSize: item.customSize || '',
        quantity: item.quantity || 0,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }

    if (formData.size === 'custom' && !formData.customSize.trim()) {
      alert('Please enter a custom size');
      return;
    }

    setSubmitting(true);
    try {
      await onUpdate(item._id, {
        name: formData.name.trim(),
        size: formData.size,
        customSize: formData.size === 'custom' ? formData.customSize.trim() : undefined,
        quantity: formData.quantity,
      });
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    setSubmitting(true);
    try {
      await onDelete(item._id);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-item-form-container">
      <form className="edit-item-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Edit Item</h3>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="edit-name">Item Name *</label>
          <input
            type="text"
            id="edit-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter item name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-size">Size *</label>
          <select
            id="edit-size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          >
            {SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {formData.size === 'custom' && (
          <div className="form-group">
            <label htmlFor="edit-customSize">Custom Size *</label>
            <input
              type="text"
              id="edit-customSize"
              name="customSize"
              value={formData.customSize}
              onChange={handleChange}
              required
              placeholder="e.g., 6x8"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="edit-quantity">Quantity</label>
          <input
            type="number"
            id="edit-quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="delete-button-in-form"
            onClick={handleDelete}
            disabled={submitting}
          >
            Delete
          </button>
          <div className="form-actions-right">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditItemForm;
