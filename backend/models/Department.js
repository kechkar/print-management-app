const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'Mathématiques',
      'Physique',
      'Chimie',
      'Informatique',
      'Biologie',
      'Langues Étrangères'
    ]
  }
});

module.exports = mongoose.model('Department', departmentSchema);