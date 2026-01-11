import express from 'express';
import History from '../models/History.js';

const router = express.Router();

/**
 * Utility function
 * Keeps only the latest 30 history entries
 */
const cleanupHistory = async () => {
  // Get entries older than the latest 30
  const oldEntries = await History.find()
    .sort({ timestamp: -1 }) // newest first
    .skip(30)                // skip latest 30
    .select('_id');

  if (oldEntries.length === 0) return 0;

  const idsToDelete = oldEntries.map(entry => entry._id);
  const result = await History.deleteMany({
    _id: { $in: idsToDelete }
  });

  return result.deletedCount;
};

/**
 * Run cleanup immediately when server starts (after small delay)
 */
setTimeout(async () => {
  try {
    const deleted = await cleanupHistory();
    console.log(`[Server Start] Cleanup: Deleted ${deleted} old history entries. Keeping last 30.`);
  } catch (error) {
    console.error('Initial cleanup error:', error);
  }
}, 1000);

/**
 * DELETE /history/cleanup
 * Manually trigger cleanup
 */
router.delete('/cleanup', async (req, res) => {
  try {
    const deleted = await cleanupHistory();

    res.json({
      message:
        deleted === 0
          ? 'Nothing to delete. History has 30 or fewer entries.'
          : `Deleted ${deleted} old history entries`,
      deleted
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /history/all
 * Delete all history entries except the last 10
 */
router.delete('/all', async (req, res) => {
  try {
    const totalCount = await History.countDocuments();
    
    if (totalCount <= 30) {
      return res.json({ 
        message: 'History has 30 or fewer entries, nothing to delete',
        deleted: 0 
      });
    }

    // Get the 30 most recent entries
    const recentHistory = await History.find()
      .sort({ timestamp: -1 })
      .limit(30)
      .select('_id');
    
    const recentIds = recentHistory.map(h => h._id);
    
    // Delete all entries NOT in the recent 30
    const result = await History.deleteMany({
      _id: { $nin: recentIds }
    });

    console.log(`Deleted ${result.deletedCount} history entries. Kept last 30.`);
    
    res.json({
      message: `Deleted ${result.deletedCount} old history entries. Kept last 30 entries.`,
      deleted: result.deletedCount
    });
  } catch (error) {
    console.error('Delete all history error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /history/item/:itemId
 * Get history for a specific item
 */
router.get('/item/:itemId', async (req, res) => {
  try {
    const history = await History.find({ itemId: req.params.itemId })
      .sort({ timestamp: -1 });

    res.json(history);
  } catch (error) {
    console.error('Item history error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /history
 * Auto-cleanup + return latest 30 entries
 */
router.get('/', async (req, res) => {
  try {
    const deleted = await cleanupHistory();
    if (deleted > 0) {
      console.log(`[GET /history] Auto cleanup deleted ${deleted} old entries. Keeping last 30.`);
    }

    const history = await History.find()
      .sort({ timestamp: -1 })
      .limit(30);

    res.json(history);
  } catch (error) {
    console.error('History GET error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
