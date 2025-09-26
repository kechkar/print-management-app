const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./backend/models/User');
const connectDB = require('./backend/config/db');
require('dotenv').config();

async function createAdmin() {
    try {
        await connectDB(); // Ensure database is connected before proceeding

        const existingAdmin = await User.findOne({ role: 'ADMIN' });
        if (!existingAdmin) {
            if (process.env.ADMIN_SECRET !== 'mysecurekey123') {
                console.log('Invalid secret key');
                process.exit(1);
            }
            const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
            const admin = new User({
                email: process.env.ADMIN_EMAIL,
                Password: hashedPassword,
                role: 'ADMIN',
                secretKey: process.env.ADMIN_SECRET
            });
            await admin.save();
            console.log('✅ Admin user created:', process.env.ADMIN_EMAIL);
        } else {
            console.log('ℹ️ Admin already exists');
        }
    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Database connection closed.");
        process.exit(0);
    }
}

if (require.main === module) {
    createAdmin();
}

module.exports = createAdmin;

