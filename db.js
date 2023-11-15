const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb+srv://jaclyn:8NmgdSqXemirQ82S@cluster0.ouhw8da.mongodb.net/');
        console.log('Db Connected');
    } catch (error) {
        console.log('DB Connection Error');
    }
}

module.exports = {db}