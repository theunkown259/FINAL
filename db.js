const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb+srv://jaclynrae63:5AGTv7RLJnZFsMpq@cluster0.xx9seon.mongodb.net/testDB?retryWrites=true&w=majority');
        console.log('Db Connected');
    } catch (error) {
        console.log('DB Connection Error');
    }
}

module.exports = {db}