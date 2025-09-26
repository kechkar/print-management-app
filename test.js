const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const authRoutes = require('./backend/routes/authRoutes');
const User = require('./backend/models/User');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
    createAdminUser();
}).catch(err => console.log(err));




const createAdminUser = async () => {
    const existingAdmin = await User.findOne({ role: 'ADMIN' });
    if (!existingAdmin) {
        const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
        const admin = new User({
            email: process.env.ADMIN_EMAIL,
            Password: hashedPassword,
            role: 'ADMIN'
        });
        await admin.save();
        console.log('Admin user created:', process.env.ADMIN_EMAIL);
    }
};



app.use('/api/auth', authRoutes);

// Serve frontend files
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));