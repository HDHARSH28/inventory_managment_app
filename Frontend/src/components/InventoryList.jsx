import { useState, useMemo } from 'react';
import './InventoryList.css';

function InventoryList({ items, loading, onUpdateQuantity, onDelete, onEdit }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'name') {
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
      } else if (sortConfig.key === 'size') {
        aValue = (a.size === 'custom' ? a.customSize : a.size)?.toLowerCase() || '';
        bValue = (b.size === 'custom' ? b.customSize : b.size)?.toLowerCase() || '';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  const getDisplaySize = (item) => {
    return item.size === 'custom' ? item.customSize : item.size;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '↕';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  return (
    <div className="inventory-table-container">
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('quantity')} className="sortable">
                Qty. {getSortIcon('quantity')}
              </th>
              <th onClick={() => handleSort('size')} className="sortable">
                Size {getSortIcon('size')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state-cell">
                  No items found. Add your first item to get started!
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{getDisplaySize(item)}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => onEdit && onEdit(item)}
                      title="Edit item"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryList;
