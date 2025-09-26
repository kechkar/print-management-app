const PrintRequest = require("../models/PrintRequest");

// ✅ Get all approved requests for the teacher
exports.getApprovedRequests = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== "ENSEIGNANT") {
            return res.status(403).json({ message: "Unauthorized: Only teachers can access this" });
        }
        const approvedRequests = await PrintRequest.find({
           
            status: "validé_par_departement"
        });
        res.json({ message: "Approved requests retrieved", approvedRequests });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving approved requests", error });
    }
};

// ❌ Get all rejected requests for the teacher
exports.getRejectedRequests = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== "ENSEIGNANT") {
            return res.status(403).json({ message: "Unauthorized: Only teachers can access this" });
        }
        const rejectedRequests = await PrintRequest.find({
            
            status: "rejeté"
        });
        res.json({ message: "Rejected requests retrieved", rejectedRequests });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving rejected requests", error });
    }
};

// 🚀 Get all pending requests for the teacher
exports.getPendingRequests = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== "ENSEIGNANT") {
            return res.status(403).json({ message: "Unauthorized: Only teachers can access this" });
        }
        const pendingRequests = await PrintRequest.find({
           
            status: "en_attente"
        });
        res.json({ message: "Pending requests retrieved", pendingRequests });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving pending requests", error });
    }
};


exports.getAllRequests = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== "ENSEIGNANT") {
            return res.status(403).json({ message: "Unauthorized: Only teachers can access this" });
        }
        const requests = await PrintRequest.find({
            teacherFirstName: user.F_name,
            teacherLastName: user.L_name
        });
        res.json({ message: "All requests retrieved", requests });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving all requests", error });
    }
};

// {
           
//     departmentName: user.departmentName,
//     teacherFirstName: user.F_name,
//     teacherLastName: user.L_name
// }