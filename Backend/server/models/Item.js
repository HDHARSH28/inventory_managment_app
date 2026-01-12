import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    required: true,
    enum: ['2x2', '4x2', '18x12', '12x12', 'custom'],
  },
  customSize: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Item', itemSchema);
