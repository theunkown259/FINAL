const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const transactions = require('./public/data');
const {db} = require('./db.js');
const app = express();
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.static('./public/css/'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Start the server
app.get('/', async(req,res) => {
    try{
        db();
        //recent History
        var last5Transactions = transactions.slice(-5);

        const totalIncome = transactions
            .filter(transaction => transaction.type === 'Income')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        const totalExpenses = transactions
            .filter(transaction => transaction.type === 'Expense')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        var totalBalance = totalIncome - totalExpenses;

    res.render('index.ejs', {newesttransactions:last5Transactions, totalBalance,transactions });
    }catch(error){
        res.status(500).send("Oh no! There's a Server Error.");
        console.log("Internal Server Error");
    }

});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`WebSocket is open on http://localhost:${port}`);
});