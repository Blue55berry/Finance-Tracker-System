const Receipt = require('../models/Receipt');

// @desc    Get all receipts
// @route   GET /api/receipts
// @access  Private
exports.getReceipts = async (req, res, next) => {
  try {
    const receipts = await Receipt.find({ user: req.user.id });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single receipt
// @route   GET /api/receipts/:id
// @access  Private
exports.getReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
