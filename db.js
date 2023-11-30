const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('');
        console.log('DB Connected');

    } catch (error) {
        console.error('DB Connection Error:', error);
    } 
};


///

const transactionSchema = new mongoose.Schema({
    TransactionId: { type: Number, required: true },
    UserId: { type: Number, required: true },
    CategoryId: { type: Number, required: true },
    Type: { type: String, required: true },
    Amount: { type: Number, required: true },
    Currency: { type: String, required: true },
    Date: { type: String, required: true },
    Description: { type: String, required: true },
});

const Yourmodel = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Transactions: [transactionSchema],
});
const Testingmodel = mongoose.model('transactions', Yourmodel);

///


const categorySchema = new mongoose.Schema({
    CategoryId: { type: Number},
    Name: { type: String },
    Description: { type: String },
    Type: { type: String },
    UserId: { type: Number},
});

const yourModelSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Categories: [categorySchema],
});

const CategoryModel = mongoose.model('categories', yourModelSchema);


module.exports = {db, Testingmodel, CategoryModel}