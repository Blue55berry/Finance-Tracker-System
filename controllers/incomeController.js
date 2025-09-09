const Income = require('../models/Income');
const Receipt = require('../models/Receipt');
const mongoose = require('mongoose');

exports.createIncome = async (req, res) => {
  try {
    const { amount, source, description, date } = req.body;
    const income = new Income({
      user: req.user.id,
      amount,
      source,
      description,
      date: date || Date.now(),
    });
    
    await income.save();

    const receipt = new Receipt({
      user: req.user.id,
      transactionType: 'Income',
      transactionId: income._id,
      amount: income.amount,
      date: income.date,
      description: income.description
    });

    await receipt.save();

    const io = req.app.get('io');
    io.emit('data-updated');

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: 'Error creating income', error: error.message });
  }
};

exports.getAllIncome = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching income', error: error.message });
  }
};

exports.getIncomeById = async (req, res) => {
    try {
        const income = await Income.findOne({ _id: req.params.id, user: req.user.id });
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income', error: error.message });
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const { amount, source, description, date } = req.body;
        const income = await Income.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { amount, source, description, date },
            { new: true, runValidators: true }
        );

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        const io = req.app.get('io');
        io.emit('data-updated');

        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: 'Error updating income', error: error.message });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        const io = req.app.get('io');
        io.emit('data-updated');

        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting income', error: error.message });
    }
};

exports.getIncomeSummary = async (req, res) => {
  try {
    const totalIncome = await Income.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
        },
      },
    ]);

    res.json({
      totalIncome: totalIncome.length > 0 ? totalIncome[0].totalIncome : 0,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};