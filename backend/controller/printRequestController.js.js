//Manages printing requests(creation, listing)
const PrintRequest = require('../models/PrintRequest');
const User = require('../models/User');
const Department = require('../models/Department');

exports.submitPrintRequest = async (req, res) => {
    try {
        const { departmentId, teacherFirstName, teacherLastName, documentType, nombreExemplaires, submissionDateTime } = req.body;
        
        const department = await Department.findOne({ departmentId });
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        const newRequest = new PrintRequest({
            departmentId,
            teacherFirstName,
            teacherLastName,
            documentType,
            nombreExemplaires,
            submissionDateTime
        });
        await newRequest.save();
        res.status(201).json({ message: 'Print request submitted successfully', request: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting print request', error });
    }
};

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
        await request.save();
        res.json({ message: 'Print request approved', request });
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

        console.log(`🔹 Fetching requests for department ID: ${user.departmentId}`);

        const departmentId = user.departmentId.toString(); // Ensure it's a string
        console.log(`🔹 Converted departmentId: ${departmentId}`);

        const requests = await PrintRequest.find({ departmentId });

        console.log(`🔹 Found ${requests.length} requests for department: ${departmentId}`);

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