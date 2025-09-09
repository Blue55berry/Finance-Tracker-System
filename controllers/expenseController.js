// server/controllers/expenseController.js
const Expense = require('../models/Expense');
const Receipt = require('../models/Receipt');
const mongoose = require('mongoose');

exports.createExpense = async (req, res) => {
  try {
    const { amount, category, description, date, isRegular } = req.body;
    const expense = new Expense({
      user: req.user.id,
      amount,
      category,
      description,
      date: date || Date.now(),
      isRegular: isRegular || false
    });
    
    await expense.save();

    const receipt = new Receipt({
      user: req.user.id,
      transactionType: 'Expense',
      transactionId: expense._id,
      amount: expense.amount,
      date: expense.date,
      description: expense.description
    });

    await receipt.save();
    
    const io = req.app.get('io');
    io.emit('data-updated');

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });
      
    const count = await Expense.countDocuments(query);

    res.status(200).json({
      expenses,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};

exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense', error: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { amount, category, description, date, isRegular } = req.body;
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { amount, category, description, date, isRegular },
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const io = req.app.get('io');
        io.emit('data-updated');

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error updating expense', error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const io = req.app.get('io');
        io.emit('data-updated');

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error: error.message });
    }
};

exports.getExpenseSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchQuery = { user: mongoose.Types.ObjectId(req.user.id) };

        if (startDate && endDate) {
            matchQuery.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const summary = await Expense.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(summary[0] || { totalAmount: 0, count: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense summary', error: error.message });
    }
};

exports.getExpensesByCategory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchQuery = { user: mongoose.Types.ObjectId(req.user.id) };

        if (startDate && endDate) {
            matchQuery.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const categoryData = await Expense.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        res.status(200).json(categoryData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses by category', error: error.message });
    }
};

exports.getWeeklySummary = async (req, res) => {
  try {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);
    
    const expenses = await Expense.aggregate([
      { 
        $match: { 
          user: mongoose.Types.ObjectId(req.user.id),
          date: { $gte: weekStart, $lte: weekEnd } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const categoryBreakdown = await Expense.aggregate([
      { 
        $match: { 
          user: mongoose.Types.ObjectId(req.user.id),
          date: { $gte: weekStart, $lte: weekEnd } 
        } 
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);
    
    res.status(200).json({ 
      dailyExpenses: expenses,
      categoryBreakdown,
      weekTotal: expenses.reduce((acc, day) => acc + day.totalAmount, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving weekly summary', error: error.message });
  }
};

exports.getExpensesByDay = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchQuery = { user: mongoose.Types.ObjectId(req.user.id) };

        if (startDate && endDate) {
            matchQuery.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const dailyData = await Expense.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json(dailyData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily expenses', error: error.message });
    }
};