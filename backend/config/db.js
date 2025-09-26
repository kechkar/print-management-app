// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const Url = process.env.DATABASE_URL;

async function connectDB() {
    try {
        await mongoose.connect(Url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connecté avec Mongoose");
    } catch (err) {
        console.error("Erreur lors de la connexion à la base de données :", err);
        process.exit(1);
    }
}

module.exports = connectDB;