//Defines the demandes_impression table structure
const mongoose = require('mongoose');
const printRequestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    departmentName: { type: String, required: true },
    description: { type: String },
    teacherFirstName: { type: String, required: true },
    teacherLastName: { type: String, required: true },
    documentType: { 
        type: String, 
        enum: ['Examen', 'Test', 'Série de TD', 'Série de TP'], 
        required: true 
    },
    nombreExemplaires: { type: Number, required: true },
    submissionDateTime: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['en attente', 'validé', 'rejeté',"imprimé"], default: 'en attente' },
    paperSize: { type: String,enum: ['A3', 'A4','A5','Letter'] },
    colorMode: { type: String, enum: ['Noir et blanc', 'Couleur'] },
    doubleSided: { type: Boolean },
    priority: { type: String, enum: ['Basse','Normale', 'Haute', 'Urgente'] }
});
module.exports = mongoose.model('PrintRequest', printRequestSchema);