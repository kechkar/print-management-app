// server.js
const express = require('express');
const connectDB = require('./backend/config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./backend/routes/authRoutes');
const printRequestRoutes = require('./backend/routes/printRequestRoutes.js');
const trackingRoutes = require("./backend/routes/trackingRoutes.js");
const chefDashboardRoutes = require('./backend/routes/ChefdashboardRoutes.js');
const teacherRoutes = require("./backend/routes/teacherDashboardRoutes.js");
const adminRoutes = require('./backend/routes/adminRoutes.js')
dotenv.config();
const app = express();
app.use(cors());
app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
        express.json()(req, res, next);
    } else {
        next();
    }
});
const Port = process.env.PORT || 5000; // Utiliser le port 5000 par défaut


app.use(express.json());
app.use((req, res, next) => {
    console.log(`🔍 Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/print-requests', printRequestRoutes);
app.use("/api/tracking", trackingRoutes);
app.use('/api/dashboard', chefDashboardRoutes);
app.use("/api/teacher", teacherRoutes);
app.use('/api/admin', adminRoutes);
// Connexion à la base de données et démarrage du serveur
connectDB().then(() => {
    app.listen(Port, () => {
        console.log(`Serveur démarré sur le port : ${Port}`);
    });
}).catch(err => {
    console.error("Erreur lors du démarrage du serveur :", err);
});

// Gérer la fermeture propre du serveur
process.on('SIGINT', async () => {
    console.log("Serveur arrêté.");
    process.exit();
});