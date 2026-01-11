import { useState, useMemo } from 'react';
import './QuantityAdjustDialog.css';

function QuantityAdjustDialog({ items, mode, onAdjust, onClose }) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Filter items based on search input
  const filteredItems = useMemo(() => {
    if (!itemName.trim()) return items;
    const searchTerm = itemName.toLowerCase().trim();
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );
  }, [items, itemName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemName.trim()) {
      alert('Please enter an item name');
      return;
    }

    if (quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    // Find exact match or first match from filtered items
    const item = filteredItems.find(item => 
      item.name.toLowerCase() === itemName.toLowerCase().trim()
    ) || filteredItems[0];

    if (!item) {
      alert('Item not found. Please check the item name.');
      return;
    }

    if (mode === 'remove' && item.quantity < quantity) {
      alert(`Cannot remove ${quantity} units. Only ${item.quantity} units available.`);
      return;
    }

    setSubmitting(true);
    try {
      const change = mode === 'add' ? quantity : -quantity;
      await onAdjust(item._id, change);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setSubmitting(false);
    }
  };

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleItemSelect = (selectedItem) => {
    setItemName(selectedItem.name);
  };

  return (
    <div className="quantity-adjust-dialog-overlay" onClick={onClose}>
      <div className="quantity-adjust-dialog" onClick={(e) => e.stopPropagation()}>
        <form className="quantity-adjust-form" onSubmit={handleSubmit}>
          <div className="dialog-header">
            <h3>{mode === 'add' ? 'Add Quantity' : 'Remove Quantity'}</h3>
            <button
              type="button"
              className="close-button"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="item-name-input">Item Name *</label>
            <div className="item-search-container">
              <input
                type="text"
                id="item-name-input"
                value={itemName}
                onChange={handleItemNameChange}
                required
                placeholder="Type to search item name..."
                className="item-name-input"
                autoComplete="off"
              />
              {itemName.trim() && filteredItems.length > 0 && (
                <div className="item-suggestions">
                  {filteredItems.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="item-suggestion"
                      onClick={() => handleItemSelect(item)}
                    >
                      <span className="suggestion-name">{item.name}</span>
                      <span className="suggestion-quantity">(Qty: {item.quantity})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="quantity-input">Quantity *</label>
            <input
              type="number"
              id="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              min="1"
              required
              placeholder="Enter quantity"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`submit-button ${mode === 'add' ? 'add-mode' : 'remove-mode'}`}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : mode === 'add' ? 'Add Quantity' : 'Remove Quantity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuantityAdjustDialog;
