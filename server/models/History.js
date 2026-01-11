import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemSize: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'quantity_added', 'quantity_removed', 'deleted'],
  },
  quantityChange: {
    type: Number,
    default: 0,
  },
  previousQuantity: {
    type: Number,
    default: 0,
  },
  newQuantity: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model('History', historySchema);
