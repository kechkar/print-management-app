const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    F_name: String,
    L_name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['ADMIN', 'ENSEIGNANT', 'IMPRIMERIE', 'CHEF_DE_DEPARTEMENT'] },
    departmentName: String,
    secretKey: String
});
module.exports = mongoose.model('User', UserSchema);