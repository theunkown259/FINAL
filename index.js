const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const {db} = require('./db.js');

const app = express();
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.static('./public/css/'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


///
const testingSchema = new mongoose.Schema({
    TransactionId: Number,
    UserId: Number,
    CategoryId: Number,
    Type: String,
    Amount: Number,
    Currency: Number,
    date: { type: Date, default: Date.now },
    Description: String,
});

const Testingmodel = mongoose.model('testings',testingSchema);

// Start the server
app.get('/', async(req,res) => {
    const usernum = 2;
    try{
        await db();
        ///
        const transactions = await Testingmodel.find({UserId:usernum}).lean().exec();
        //recent History

        const last5Transactions = await Testingmodel.find({UserId:usernum})
        .sort({ date: -1 })
        .limit(5)
        .lean()
        .exec();


        const totalIncome = transactions
            .filter(transaction => transaction.Type === 'Income')
            .reduce((sum, transaction) => sum + transaction.Amount, 0);

        const totalExpenses = transactions
            .filter(transaction => transaction.Type === 'Expense')
            .reduce((sum, transaction) => sum + transaction.Amount, 0);

        var totalBalance = totalIncome - totalExpenses;

    res.render('index.ejs', {newesttransactions:last5Transactions, totalBalance,transactions,totalExpenses,totalIncome });
    }catch(error){
        res.status(500).send("Oh no! There's a Server Error.");
        console.log("Internal Server Error");
    }

});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`WebSocket is open on http://localhost:${port}`);
});
