import { useState, useEffect } from 'react';
import './App.css';
import InventoryList from './components/InventoryList';
import AddItemForm from './components/AddItemForm';
import HistoryTab from './components/HistoryTab';
import SearchBar from './components/SearchBar';
import EditItemForm from './components/EditItemForm';
import QuantityAdjustDialog from './components/QuantityAdjustDialog';
import { getItems, getHistory, createItem, updateItemQuantity, deleteItem, updateItem } from './services/api';

function App() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [quantityDialogMode, setQuantityDialogMode] = useState(null);

  // Fetch items
  const fetchItems = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await getItems(search);
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items. Please check your connection.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch history
  const fetchHistory = async () => {
    try {
      const response = await getHistory();
      setHistory(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchItems(searchQuery);
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [searchQuery, activeTab]);

  const handleAddItem = async (itemData) => {
    try {
      await createItem(itemData);
      await fetchItems(searchQuery);
      if (activeTab === 'history') {
        await fetchHistory();
      }
    } catch (err) {
      setError('Failed to add item. Please try again.');
      console.error('Error adding item:', err);
      throw err;
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async (id, itemData) => {
    try {
      await updateItem(id, itemData);
      await fetchItems(searchQuery);
      if (activeTab === 'history') {
        await fetchHistory();
      }
      setEditingItem(null);
    } catch (err) {
      setError('Failed to update item. Please try again.');
      console.error('Error updating item:', err);
      throw err;
    }
  };

  const handleUpdateQuantity = async (id, change) => {
    try {
      await updateItemQuantity(id, change);
      await fetchItems(searchQuery);
      if (activeTab === 'history') {
        await fetchHistory();
      }
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
      console.error('Error updating quantity:', err);
      throw err;
    }
  };

  const handleQuantityAdjust = async (id, change) => {
    try {
      await updateItemQuantity(id, change);
      await fetchItems(searchQuery);
      if (activeTab === 'history') {
        await fetchHistory();
      }
    } catch (err) {
      setError('Failed to adjust quantity. Please try again.');
      console.error('Error adjusting quantity:', err);
      throw err;
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    try {
      await deleteItem(id);
      await fetchItems(searchQuery);
      if (activeTab === 'history') {
        await fetchHistory();
      }
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === 'inventory' && (
          <div className="inventory-tab">
            <div className="page-header">
              <h2 className="page-title">List of Products</h2>
              <AddItemForm onAdd={handleAddItem} />
            </div>

            <div className="quantity-control-top">
              <button
                className="quantity-adjust-button add-quantity-button"
                onClick={() => setQuantityDialogMode('add')}
              >
                + Add Quantity
              </button>
              <button
                className="quantity-adjust-button remove-quantity-button"
                onClick={() => setQuantityDialogMode('remove')}
              >
                - Remove Quantity
              </button>
            </div>

            <div className="table-controls-top">
              <div className="search-container">
                <label className="search-label">Search:</label>
                <SearchBar onSearch={setSearchQuery} />
              </div>
            </div>

            <InventoryList
              items={items}
              loading={loading}
              onUpdateQuantity={handleUpdateQuantity}
              onDelete={handleDeleteItem}
              onEdit={handleEditItem}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryTab 
            history={history} 
            loading={loading}
          />
        )}

        {editingItem && (
          <EditItemForm
            item={editingItem}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
            onClose={() => setEditingItem(null)}
          />
        )}

        {quantityDialogMode && (
          <QuantityAdjustDialog
            items={items}
            mode={quantityDialogMode}
            onAdjust={handleQuantityAdjust}
            onClose={() => setQuantityDialogMode(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
