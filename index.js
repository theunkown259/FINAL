const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { db, Testingmodel } = require('./db.js');

const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static('./public/css/'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sample data (replace this with your actual budget data)
const budgetCategories = [
    { name: 'Groceries', budget: 500, spent: 300 },
    { name: 'Entertainment', budget: 200, spent: 180 },
    { name: 'Gifts', budget: 100, spent: 120 },
    { name: 'Take-out', budget: 50, spent: 10 },
    { name: 'New Computer', budget: 600, spent: 0 },
    // Add more categories as needed
];

// Calculate remaining budget for each category
const categoriesWithRemainingBudget = budgetCategories.map(category => {
    const remainingBudget = category.budget - category.spent;
    return { ...category, remainingBudget };
});
const sortedCategories = categoriesWithRemainingBudget.sort((a, b) => a.remainingBudget - b.remainingBudget);

// Start the server
app.get('/', async (req, res) => {
    const usernum = 2;
    try {
        await db();
        const count = parseInt(req.query.count, 10) || 3;
        const timePeriod = parseInt(req.query.period, 10) || 3;

        // Slice the array to get the specified number of categories
        const slicedCategories = sortedCategories.slice(0, count);

        const transactions = await Testingmodel.aggregate([
            { $unwind: '$Transactions' },
            {
                $match: {
                    'Transactions.UserId': usernum,
                },
            },
            {
                $project: {
                    'Transactions.CategoryId': 1,
                    'Transactions.Type': 1,
                    'Transactions.Amount': 1,
                    'Transactions.Currency': 1,
                    'Transactions.Date': 1,
                    'Transactions.Description': 1,
                },
            },
        ]).exec();
        
        //recent History

        const last5Transactions = await Testingmodel.aggregate([
            { $unwind: '$Transactions' },
            { $match: { 'Transactions.UserId': usernum } },
            { $sort: { 'Transactions.Date': -1 } },
            { $limit: 5 },
            {
              $project: {
                'Transactions.Date': 1,
                'Transactions.Amount': 1,
                'Transactions.Type': 1,
              },
            },
          ]).exec();
          
          //total balance
          const totalIncome = transactions
              .filter(transaction => transaction.Transactions.Type === 'Income')
              .reduce((sum, transaction) => sum + transaction.Transactions.Amount, 0);
          
          const totalExpenses = transactions
              .filter(transaction => transaction.Transactions.Type === 'Expense')
              .reduce((sum, transaction) => sum + transaction.Transactions.Amount, 0);
          
          var totalBalance = totalIncome - totalExpenses;

          // thirty days ago

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const thirtydayTransactions = transactions.filter(transaction =>
            transaction.Transactions.Type === 'Income' ||
            (transaction.Transactions.Type === 'Expense' && new Date(transaction.Transactions.Date) >= thirtyDaysAgo)
            );

            const totalIncomeLast30Days = thirtydayTransactions
            .filter(transaction => transaction.Transactions.Type === 'Income')
            .reduce((sum, transaction) => sum + transaction.Transactions.Amount, 0);

            const totalExpensesLast30Days = thirtydayTransactions
            .filter(transaction => transaction.Transactions.Type === 'Expense')
            .reduce((sum, transaction) => sum + transaction.Transactions.Amount, 0);



         //7 days ago
                   // thirty days ago

                   const sevenDaysAgo = new Date();
                   thirtyDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
       
                   const sevendayTransactions = transactions.filter(transaction =>
                   transaction.Transactions.Type === 'Income' ||
                   (transaction.Transactions.Type === 'Expense' && new Date(transaction.Transactions.Date) >= sevenDaysAgo)
                   );
       
                   const totalIncomeLast7Days = sevendayTransactions
                   .filter(transaction => transaction.Transactions.Type === 'Income')
                   .reduce((sum, transaction) => sum + transaction.Transactions.Amount, 0);
       
                   const totalExpensesLast7Days = sevendayTransactions
                   .filter(transaction => transaction.Transactions.Type === 'Expense')
                   .reduce((sum, transaction) => sum + transaction.Transactions.Amount, 0);

        // Calculate categoryLabels and categoryAmounts
        const categoryLabels = Array.from(new Set(transactions.map(transaction => transaction.Transactions.CategoryId)));
        const categoryDescription = Array.from(new Set(transactions.map(transaction => transaction.Transactions.Description))); 
        const categoryAmounts = categoryLabels.map(categoryId =>
            transactions
                .filter(transaction => transaction.Transactions.CategoryId === categoryId)
                .reduce((total, transaction) => total + transaction.Transactions.Amount, 0)
        );
        
        res.render('index.ejs', {
           last5Transactions,
            totalBalance,
            transactions,
            totalExpenses,
            totalIncome,
            categoriesWithRemainingBudget: slicedCategories,
            count,
            timePeriod,
            categoryLabels,
            categoryAmounts,
            categoryDescription,
            totalIncomeLast30Days,
            totalExpensesLast30Days,
            totalIncomeLast7Days,
            totalExpensesLast7Days
        });

    } catch (error) {
        res.status(500).send("Oh no! There's a Server Error.");
        console.log("Internal Server Error", error);
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`WebSocket is open on http://localhost:${port}`);
});