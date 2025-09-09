const Borrowing = require('../models/Borrowing');
const Receipt = require('../models/Receipt');

exports.createBorrowing = async (req, res) => {
  try {
    const { amount, from, description, date, dueDate, paymentMethod } = req.body;
    
    const borrowing = new Borrowing({
      user: req.user.id,
      amount,
      from,
      description,
      date: date || Date.now(),
      dueDate,
      isRepaid: false,
      paymentMethod,
      proof: req.file ? req.file.path : null
    });
    
    await borrowing.save();

    const receipt = new Receipt({
      user: req.user.id,
      transactionType: 'Borrowing',
      transactionId: borrowing._id,
      amount: borrowing.amount,
      date: borrowing.date,
      description: borrowing.description,
      repayDate: borrowing.dueDate,
      paymentMethod: borrowing.paymentMethod,
      proof: borrowing.proof
    });

    await receipt.save();

    const io = req.app.get('io');
    io.emit('data-updated');

    res.status(201).json(borrowing);
  } catch (error) {
    res.status(500).json({ message: 'Error creating borrowing record', error: error.message });
  }
};

exports.getAllBorrowings = async (req, res) => {
  try {
    const { isRepaid } = req.query;
    
    const query = { user: req.user.id };
    
    if (isRepaid !== undefined) {
      query.isRepaid = isRepaid === 'true';
    }
    
    const borrowings = await Borrowing.find(query).sort({ date: -1 });
    res.status(200).json(borrowings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrowings', error: error.message });
  }
};

exports.getBorrowingById = async (req, res) => {
  try {
    const borrowing = await Borrowing.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }
    
    res.status(200).json(borrowing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrowing record', error: error.message });
  }
};

exports.updateBorrowing = async (req, res) => {
  try {
    const { amount, from, description, date, dueDate } = req.body;
    
    const borrowing = await Borrowing.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { amount, from, description, date, dueDate } },
      { new: true }
    );
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }
    
    const io = req.app.get('io');
    io.emit('data-updated');

    res.status(200).json(borrowing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating borrowing record', error: error.message });
  }
};

exports.markAsRepaid = async (req, res) => {
  try {
    const borrowing = await Borrowing.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        $set: { 
          isRepaid: true,
          repaidDate: req.body.repaidDate || Date.now()
        } 
      },
      { new: true }
    );
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }
    
    const io = req.app.get('io');
    io.emit('data-updated');

    res.status(200).json(borrowing);
  } catch (error) {
    res.status(500).json({ message: 'Error marking as repaid', error: error.message });
  }
};

exports.deleteBorrowing = async (req, res) => {
  try {
    const borrowing = await Borrowing.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }
    
    const io = req.app.get('io');
    io.emit('data-updated');

    res.status(200).json({ message: 'Borrowing record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting borrowing record', error: error.message });
  }
};

exports.getBorrowingsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { user: req.user.id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    const borrowings = await Borrowing.find(query).sort({ date: -1 });
    res.status(200).json(borrowings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrowings by date', error: error.message });
  }
};
