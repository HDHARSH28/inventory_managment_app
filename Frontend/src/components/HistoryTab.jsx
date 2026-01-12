import './HistoryTab.css';

function HistoryTab({ history, loading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getActionLabel = (action) => {
    const labels = {
      created: 'Created',
      quantity_added: 'Quantity Added',
      quantity_removed: 'Quantity Removed',
      deleted: 'Deleted',
    };
    return labels[action] || action;
  };

  const getActionClass = (action) => {
    const classes = {
      created: 'action-created',
      quantity_added: 'action-added',
      quantity_removed: 'action-removed',
      deleted: 'action-deleted',
    };
    return classes[action] || '';
  };

  if (loading) {
    return <div className="loading">Loading history...</div>;
  }

  if (history.length === 0) {
    return <div className="empty-state">No history available yet.</div>;
  }

  return (
    <div className="history-tab">
      <div className="history-list">
        {history.map((entry) => (
          <div key={entry._id} className="history-entry">
            <div className="history-entry-header">
              <div className="history-item-info">
                <span className="history-item-name">{entry.itemName}</span>
                <span className="history-item-size">{entry.itemSize}</span>
              </div>
              <span className={`history-action ${getActionClass(entry.action)}`}>
                {getActionLabel(entry.action)}
              </span>
            </div>

            <div className="history-entry-details">
              {entry.action === 'quantity_added' && (
                <span className="history-change positive">
                  +{entry.quantityChange} units
                </span>
              )}
              {entry.action === 'quantity_removed' && (
                <span className="history-change negative">
                  -{entry.quantityChange} units
                </span>
              )}
              {entry.action === 'created' && (
                <span className="history-change">
                  Initial quantity: {entry.newQuantity}
                </span>
              )}
              {entry.action === 'deleted' && (
                <span className="history-change">
                  Previous quantity: {entry.previousQuantity}
                </span>
              )}

              {entry.action !== 'created' && entry.action !== 'deleted' && (
                <span className="history-quantity">
                  {entry.previousQuantity} → {entry.newQuantity}
                </span>
              )}
            </div>

            <div className="history-entry-footer">
              <span className="history-timestamp">{formatDate(entry.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryTab;
