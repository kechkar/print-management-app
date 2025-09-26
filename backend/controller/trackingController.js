const PrintTracking = require("../models/PrintTracking");
const PrintRequest = require("../models/PrintRequest");

exports.getApprovedPrintRequests = async (req, res) => {
    try {
        if (req.user.role !== "IMPRIMERIE") {
            return res.status(403).json({ message: "Unauthorized: Only IMPRIMERIE can access this" });
        }
        const approvedRequests = await PrintRequest.find({ status: "validé_par_departement" });
        res.json(approvedRequests);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getApprovedRequestsByDepartment = async (req, res) => {
    try {
        if (req.user.role !== "IMPRIMERIE") {
            return res.status(403).json({ message: "Unauthorized: Only IMPRIMERIE can access this" });
        }
        const { department } = req.params;
        const filteredRequests = await PrintRequest.find({ status: "validé_par_departement", departmentId: department });
        res.json(filteredRequests);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.markAsPrinted = async (req, res) => {
    try {
        if (req.user.role !== "IMPRIMERIE") {
            return res.status(403).json({ message: "Unauthorized: Only IMPRIMERIE can perform this action" });
        }

        const { id } = req.params;
        const { statut } = req.body;  // ✅ Extract statut from request body
        const printerId = req.user.id;
        const request = await PrintRequest.findById(id);

        if (!request) {
            return res.status(404).json({ message: "Print request not found" });
        }

        if (request.status !== "validé") {
            return res.status(400).json({ message: "Request is not approved by the department" });
        }

        // ✅ Ensure statut is provided, default to "imprimé"
        const trackingStatus = statut || "imprimé";

        request.status = "imprimé";
        await request.save();

        // ✅ Track printing with statut
        const tracking = new PrintTracking({
            printRequestId: request._id,
            printerId,
            statut: trackingStatus
        });
        await tracking.save();

        res.json({ message: "Print request marked as printed", tracking });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getAllValidatedPrintRequests = async (req, res) => {
    try {
        console.log(req.user.role);
        if (req.user.role !== 'IMPRIMERIE') {
            return res.status(403).json({ message: "Unauthorized: Only IMPRIMERIE can access this." });
        }
        // Fetch all print requests
        const printRequests = await PrintRequest.find({ status: { $in: ['validé', 'imprimé'] } });
        // Process each request to include department info and teacher details (without email)
        const data = printRequests.map(request => ({
            _id: request._id,
            departmentId: request.departmentId,
            teacher: {
                firstName: request.teacherFirstName,
                lastName: request.teacherLastName
            },
            documentType: request.documentType,
            nombreExemplaires: request.nombreExemplaires,
            submissionDateTime: request.submissionDateTime,
            status: request.status
        }));

        res.json(data);
    } catch (error) {
        console.error('Error fetching print requests:', error);
        res.status(500).json({ message: "Error fetching print requests", error });
    }
};

