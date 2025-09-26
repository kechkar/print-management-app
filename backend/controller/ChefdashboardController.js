const PrintRequest = require('../models/PrintRequest');
const User = require('../models/User');


exports.approvePrintRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id; 
        const user = await User.findById(userId);
        
        if (!user || user.role !== 'CHEF_DE_DEPARTEMENT') {
            return res.status(403).json({ message: 'Unauthorized: Only the Chef de Département can approve requests' });
        }
        
        const request = await PrintRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Print request not found' });
        
        if (request.departmentId !== user.departmentId) {
            return res.status(403).json({ message: 'Unauthorized: You can only approve requests from your department' });
        }
        
        request.status = 'validé_par_departement';
      

        const updatedRequests = await PrintRequest.find({ departmentId: user.departmentId, status: 'en_attente' });
console.log(`🔹 Found ${updatedRequests.length} pending requests for department: ${user.departmentId}`);
        await request.save(); // Save the updated request
        res.json({ message: 'Print request approved', request,updatedRequests });
    } catch (error) {
        res.status(500).json({ message: 'Error approving print request', error });
    }
};

exports.getDepartmentRequests = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: Missing user information' });
        }

        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || user.role !== 'CHEF_DE_DEPARTEMENT') {
            return res.status(403).json({ message: 'Unauthorized: Only the Chef de Département can view department requests' });
        }

        console.log(`🔹 Fetching requests for department Name: ${user.departmentName}`);

        const departmentName = user.departmentName.toString(); // Ensure it's a string
        console.log(`🔹 Converted departmentName: ${departmentName}`);

        const requests = await PrintRequest.find({ departmentName });

        console.log(`🔹 Found ${requests.length} requests for department: ${departmentName}`);

        return res.status(200).json({
            message: 'Department requests retrieved successfully',
            requests: requests.length ? requests : [],
        });

    } catch (error) {
        console.error("❌ Error retrieving department requests:", error);
        res.status(500).json({ message: 'Error retrieving department requests', error });
    }
};
exports.rejectPrintRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user || user.role !== 'CHEF_DE_DEPARTEMENT') {
            return res.status(403).json({ message: 'Unauthorized: Only the Chef de Département can reject requests' });
        }
        
        const request = await PrintRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Print request not found' });
        
        if (request.departmentId !== user.departmentId) {
            return res.status(403).json({ message: 'Unauthorized: You can only reject requests from your department' });
        }
        
        request.status = 'rejeté';
        await request.save();
        res.json({ message: 'Print request rejected', request });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting print request', error });
    }
};

// ✅ Get all approved requests for the department
exports.getApprovedRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || user.role !== 'CHEF_DE_DEPARTEMENT') {
            return res.status(403).json({ message: 'Unauthorized: Only the Chef de Département can view approved requests' });
        }

        const approvedRequests = await PrintRequest.find({ departmentName: user.departmentName, status: 'validé' });
        res.json({ message: 'Approved requests retrieved', approvedRequests });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving approved requests', error });
    }
};

// ❌ Get all rejected requests for the department
exports.getRejectedRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || user.role !== 'CHEF_DE_DEPARTEMENT') {
            return res.status(403).json({ message: 'Unauthorized: Only the Chef de Département can view rejected requests' });
        }

        const rejectedRequests = await PrintRequest.find({ departmentId: user.departmentId, status: 'rejeté' });
        res.json({ message: 'Rejected requests retrieved', rejectedRequests });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving rejected requests', error });
    }
};