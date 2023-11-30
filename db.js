const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('connection url here plz');
        console.log('Db Connected');
    } catch (error) {
        console.log('DB Connection Error');
    }
}

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
const Testingmodel = mongoose.model('mytest', Yourmodel);
///

module.exports = {db,Testingmodel}