const User = require('../models/User');
const Department = require('../models/Department');
const PrintRequest = require('../models/PrintRequest');

// ✅ Get All Teachers
exports.getAllTeachers = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Unauthorized: Only ADMIN can access this." });
        }
        const teachers = await User.find({ role: "ENSEIGNANT" }).select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching teachers", error });
    }
};

// ✅ Get All Departments + Head + Teacher Count
exports.getAllDepartments = async (req, res) => {
    try {
        // Fetch all unique departments
        const departments = await Department.find();

        // Process each department
        const data = await Promise.all(
            departments.map(async (dept) => {
                // Find chef of department
                const chef = await User.findOne({
                    departmentId: dept.departmentId,
                    role: 'CHEF_DE_DEPARTEMENT'
                }).select('F_name L_name email');

                // Count teachers in department
                const teacherCount = await User.countDocuments({
                    departmentId: dept.departmentId,
                    role: 'ENSEIGNANT'
                });

                return {
                    _id: dept._id,
                    departmentId: dept.departmentId,
                    chefDeDepartement: chef || null, // If no chef found, return null
                    teacherCount
                };
            })
        );

        res.json(data);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: "Error fetching departments", error });
    }
};

// ✅ Get All Print Requests with Full Details
exports.getAllPrintRequests = async (req, res) => {
    try {
        console.log(req.user.role);
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Unauthorized: Only ADMIN can access this." });
        }

        // Fetch all print requests
        const printRequests = await PrintRequest.find();

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