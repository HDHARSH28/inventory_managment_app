import express from 'express';
import Item from '../models/Item.js';
import History from '../models/History.js';

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { size: { $regex: search, $options: 'i' } },
          { customSize: { $regex: search, $options: 'i' } },
        ],
      };
    }
    
    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new item
router.post('/', async (req, res) => {
  try {
    const { name, size, customSize, quantity } = req.body;
    
    if (!name || !size) {
      return res.status(400).json({ error: 'Name and size are required' });
    }
    
    if (size === 'custom' && !customSize) {
      return res.status(400).json({ error: 'Custom size value is required' });
    }
    
    const itemData = {
      name,
      size,
      quantity: quantity || 0,
    };
    
    if (size === 'custom') {
      itemData.customSize = customSize;
    }
    
    const item = new Item(itemData);
    await item.save();
    
    // Create history entry
    await History.create({
      itemId: item._id,
      itemName: item.name,
      itemSize: size === 'custom' ? customSize : size,
      action: 'created',
      quantityChange: item.quantity,
      newQuantity: item.quantity,
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const { name, size, customSize, quantity } = req.body;
    
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (!name || !size) {
      return res.status(400).json({ error: 'Name and size are required' });
    }
    
    if (size === 'custom' && !customSize) {
      return res.status(400).json({ error: 'Custom size value is required' });
    }
    
    const previousQuantity = item.quantity;
    
    item.name = name;
    item.size = size;
    item.quantity = quantity || 0;
    
    if (size === 'custom') {
      item.customSize = customSize;
    } else {
      item.customSize = undefined;
    }
    
    await item.save();
    
    // Create history entry if quantity changed
    if (previousQuantity !== item.quantity) {
      const action = item.quantity > previousQuantity ? 'quantity_added' : 'quantity_removed';
      await History.create({
        itemId: item._id,
        itemName: item.name,
        itemSize: size === 'custom' ? customSize : size,
        action,
        quantityChange: Math.abs(item.quantity - previousQuantity),
        previousQuantity,
        newQuantity: item.quantity,
      });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item quantity
router.patch('/:id/quantity', async (req, res) => {
  try {
    const { change } = req.body; // positive to add, negative to remove
    
    if (typeof change !== 'number') {
      return res.status(400).json({ error: 'Change must be a number' });
    }
    
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const previousQuantity = item.quantity;
    const newQuantity = Math.max(0, previousQuantity + change);
    
    item.quantity = newQuantity;
    await item.save();
    
    // Create history entry
    const action = change > 0 ? 'quantity_added' : 'quantity_removed';
    await History.create({
      itemId: item._id,
      itemName: item.name,
      itemSize: item.size === 'custom' ? item.customSize : item.size,
      action,
      quantityChange: Math.abs(change),
      previousQuantity,
      newQuantity,
    });
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Create history entry before deletion
    await History.create({
      itemId: item._id,
      itemName: item.name,
      itemSize: item.size === 'custom' ? item.customSize : item.size,
      action: 'deleted',
      previousQuantity: item.quantity,
      newQuantity: 0,
    });
    
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
