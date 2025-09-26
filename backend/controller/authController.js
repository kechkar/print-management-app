const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Department = require('../models/Department');
require('dotenv').config();

exports.registerChefDepartement = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé. Seul l’admin peut créer un chef de département.' });
    }
  
    try {
      const { F_name, L_name, email, password, departmentName } = req.body;
  
      console.log("📌 Tentative d'enregistrement du chef :", req.body);
  
      // ✅ Vérifie si le département existe déjà
      const existingDepartment = await Department.findOne({ departmentName });
      if (existingDepartment) {
        return res.status(400).json({ message: `Le département "${departmentName}" est déjà existant.` });
      }
  
      // ✅ Vérifie si un utilisateur avec cet email existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: `Un utilisateur avec l’email "${email}" existe déjà.` });
      }
  
      // ✅ Crée le département
      const department = new Department({ departmentName });
      await department.save();
  
      // ✅ Crée le chef de département
      const hashedPassword = await bcrypt.hash(password, 10);
      const newChef = new User({
        F_name,
        L_name,
        email,
        password: hashedPassword,
        role: 'CHEF_DE_DEPARTEMENT',
        departmentName
      });
      await newChef.save();
  
      console.log("✅ Chef de Département enregistré avec succès !");
      res.status(201).json({ message: 'Chef de département créé avec succès', user: newChef });
  
    } catch (error) {
      console.error("❌ Erreur lors de la création du chef de département :", error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  };
  

exports.registerImprimerie = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Only Admin can register Imprimerie staff.' });
    }
    try {
        const { F_name, L_name,email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            F_name,
            L_name,
            email,
            password: hashedPassword,
            role: 'IMPRIMERIE'
        });
        await newUser.save();
        res.status(201).json({ message: 'Imprimerie registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering Imprimerie', error });
    }
};

exports.registerTeacher = async (req, res) => {
    if (req.user.role !== 'CHEF_DE_DEPARTEMENT') {
        return res.status(403).json({ message: 'Access denied. Only Chef de Département can register Teachers.' });
    }
    try {
        const {F_name,L_name, email, password, departementName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            F_name,
            L_name,
            email,
            password: hashedPassword,
            role: 'ENSEIGNANT',
            departementName: departementName
        });
        await newUser.save();
        res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering Teacher', error });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { secretKey, email, password } = req.body;
        if (secretKey !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ message: 'Invalid secret key' });
        }

        const user = await User.findOne({ email, role: 'ADMIN' });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                F_name: user.F_name,
                L_name: user.L_name,
                email: user.email,
                role: user.role
                // Ajoutez d'autres champs si nécessaire
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in as Admin', error });
    }
};

// exports.loginAdmin = async (req, res) => {
//     try {
//       const { secretKey, email, password } = req.body;
//       console.log('[loginAdmin] 🔍 Requête reçue', { email, hasSecretKey: !!secretKey });
  
//       // Étape 1 : secretKey
//       if (secretKey !== process.env.ADMIN_SECRET) {
//         console.warn('[loginAdmin] 🚫 Clé secrète invalide', { provided: secretKey });
//         return res.status(403).json({ message: 'Invalid secret key' });
//       }
//       console.log('[loginAdmin] ✅ Clé secrète validée');
  
//       // Étape 2 : recherche user
//       let user;
//       try {
//         user = await User.findOne({ email, role: 'ADMIN' });
//         console.log('[loginAdmin] 🗄️ Résultat User.findOne', user ? `trouvé (${user._id})` : 'aucun');
//       } catch (dbErr) {
//         console.error('[loginAdmin] ❌ Erreur MongoDB:', dbErr.message, dbErr.stack);
//         throw dbErr;  // remonte vers le catch global
//       }
  
//       // Étape 3 : bcrypt
//       let passwordMatches = false;
//       try {
//         passwordMatches = user && await bcrypt.compare(password, user.password);
//         console.log('[loginAdmin] 🔐 bcrypt.compare:', passwordMatches);
//       } catch (bcryptErr) {
//         console.error('[loginAdmin] ❌ Erreur bcrypt:', bcryptErr.message, bcryptErr.stack);
//         throw bcryptErr;
//       }
  
//       if (!user || !passwordMatches) {
//         console.warn('[loginAdmin] 🚷 Échec d’authentification', { email });
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Étape 4 : génération du JWT
//       let token;
//       try {
//         token = jwt.sign(
//           { userId: user._id, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         console.log('[loginAdmin] 🔑 JWT généré pour', user._id);
//       } catch (jwtErr) {
//         console.error('[loginAdmin] ❌ Erreur jwt.sign:', jwtErr.message, jwtErr.stack);
//         throw jwtErr;
//       }
  
//       // Réponse
//       return res.status(200).json({
//         token,
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         }
//       });
//     } catch (error) {
//       // Log complet de l’erreur pour le debug
//       console.error('[loginAdmin] 💥 Catch global:', error.message, error.stack);
//       // En DEV, on peut renvoyer la stack ; en PROD, mieux la masquer
//       return res.status(500).json({
//         message: 'Error logging in as Admin',
//         error: error.message,
//         stack: error.stack
//       });
//     }
//   };
  


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await User.findOne({ email});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                F_name: user.F_name,
                L_name: user.L_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};