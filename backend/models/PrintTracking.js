const mongoose = require("mongoose");

const PrintTrackingSchema = new mongoose.Schema({
    printRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "PrintRequest", required: true },
    printerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date_mise_a_jour: { type: Date, default: Date.now },
    statut: { type: String, enum: ["validé", "imprimé"], required: true }
});
module.exports = mongoose.model("PrintTracking", PrintTrackingSchema);