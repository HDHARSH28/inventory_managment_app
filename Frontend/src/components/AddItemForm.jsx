import { useState } from 'react';
import './AddItemForm.css';

const SIZE_OPTIONS = ['2x2', '4x2', '18x12', '12x12', 'custom'];

function AddItemForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    size: '2x2',
    customSize: '',
    quantity: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      await onAdd({
        name: formData.name.trim(),
        size: formData.size,
        customSize: formData.size === 'custom' ? formData.customSize.trim() : undefined,
        quantity: formData.quantity,
      });

      // Reset form
      setFormData({
        name: '',
        size: '2x2',
        customSize: '',
        quantity: 0,
      });
      setIsOpen(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button className="add-item-button" onClick={() => setIsOpen(true)}>
        + Add New Item
      </button>
    );
  }

  return (
    <div className="add-item-form-container">
      <form className="add-item-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Add New Item</h3>
          <button
            type="button"
            className="close-button"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="name">Item Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter item name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="size">Size *</label>
          <select
            id="size"
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
            <label htmlFor="customSize">Custom Size *</label>
            <input
              type="text"
              id="customSize"
              name="customSize"
              value={formData.customSize}
              onChange={handleChange}
              required
              placeholder="e.g., 6x8"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="quantity">Initial Quantity</label>
          <input
            type="number"
            id="quantity"
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
            className="cancel-button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItemForm;
