//Manages printing requests(creation, listing)
const PrintRequest = require('../models/PrintRequest');
const User = require('../models/User');
const Department = require('../models/Department');

exports.submitPrintRequest = async (req, res) => {
    try {
        const { title, description, departmentName, teacherFirstName, teacherLastName, documentType,priority, nombreExemplaires,
             paperSize, colorMode, doubleSided, submissionDateTime } = req.body;
        
        const department = await Department.findOne({ departmentName });
        console.log(departmentName);
        console.log(department);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        const newRequest = new PrintRequest({
            title,
            description,
            departmentName,
            teacherFirstName,
            teacherLastName,
            documentType,
            priority,
            nombreExemplaires,
            paperSize,
            colorMode,
            doubleSided,
            submissionDateTime
        });
        console.log(newRequest);
        await newRequest.save();
        res.status(201).json({ message: 'Print request submitted successfully', request: newRequest });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server encountered an issue', details: error.message });
}

};

exports.approvePrintRequest = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const userId = req.user.id; 
        const user = await User.findById(userId);
        console.log(user);
        
        if (!user || user.role !== 'CHEF_DE_DEPARTEMENT') {
            return res.status(403).json({ message: 'Unauthorized: Only the Chef de Département can approve requests' });
        }
        
        const request = await PrintRequest.findById(id);
        if (!request) return res.status(404).json({ message: 'Print request not found' });
        
        if (request.departmentId !== user.departmentId) {
            return res.status(403).json({ message: 'Unauthorized: You can only approve requests from your department' });
        }
        
        request.status = 'validé';
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

        console.log(`🔹 Fetching requests for department name: ${user.departmentName}`);

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
        const { id } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user || user.role !== 'CHEF_DE_DEPARTEMENT') {
            return res.status(403).json({ message: 'Unauthorized: Only the Chef de Département can reject requests' });
        }
        
        const request = await PrintRequest.findById(id);
        if (!request) return res.status(404).json({ message: 'Print request not found' });
        
        if (request.departmentName !== user.departmentName) {
            return res.status(403).json({ message: 'Unauthorized: You can only reject requests from your department' });
        }
        
        request.status = 'rejeté';
        await request.save();
        res.json({ message: 'Print request rejected', request });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting print request', error });
    }
};

exports.getPrintRequestById = async (req, res) => {
    try {
      const { id } = req.params;
      const request = await PrintRequest.findById(id);
      if (!request) {
        return res.status(404).json({ message: 'Print request not found' });
      }
      res.status(200).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', details: error.message });
    }
  };