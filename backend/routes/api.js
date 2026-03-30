const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const shopCtrl = require('../controllers/shopController');
const sosCtrl = require('../controllers/sosController');
const adminCtrl = require('../controllers/adminController');
const fetch = require('node-fetch');

// == Flowise AI Setup matching user request exactly ==
router.post('/ai/assess', async (req, res) => {
    try {
        const { symptoms } = req.body;
        // User provided logic exactly
        const data = { "question": (symptoms[0] || "Hello") };
        
        const response = await fetch(
            "https://cloud.flowiseai.com/api/v1/prediction/f58461a7-3c6e-4f35-b50e-17dfaf229fd9",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );
        const result = await response.json();
        const output = result.text || result.response || "I am here to support your maternal health.";
        
        // Basic naive risk parsing based on keywords just in case
        let riskLevel = "Normal";
        const text = output.toLowerCase();
        if (text.includes('critical') || text.includes('emergency') || text.includes('hospital')) {
            riskLevel = "High";
        } else if (text.includes('doctor') || text.includes('consult')) {
            riskLevel = "Medium";
        }
        
        res.json({ advice: output, riskLevel });
    } catch (e) {
        console.error(e);
        res.status(500).json({ advice: "Connection interrupted. Please try again or seek medical attention if urgent.", riskLevel: "Medium" });
    }
});

// User routes
router.post('/register', userCtrl.registerUser);
router.get('/user/:contact', userCtrl.getUserByContact);

// Shop routes
router.get('/products', shopCtrl.getProducts);
router.post('/order', shopCtrl.placeOrder);

// SOS routes
router.post('/sos', sosCtrl.triggerSos);
router.get('/sos/active', sosCtrl.getActiveAlerts);

// Admin routes
router.post('/admin/seed', async (req, res) => {
    try {
        const Product = require('../models/Product');
        const seedProducts = [
            { name: "Peanut flour (Perukala)", emoji: "🌾", price: 150, benefit: "Anemia control", category: "Supplements" },
            { name: "Ulundhu Kali", emoji: "🫘", price: 200, benefit: "Delivery strength", category: "Traditional" },
            { name: "Kalarchikai", emoji: "🌿", price: 120, benefit: "Uterus tone", category: "Herbal" },
            { name: "Moringa powder (Murungai)", emoji: "🍃", price: 180, benefit: "Blood boost", category: "Herbal" },
            { name: "Ashoka Powder", emoji: "🌸", price: 250, benefit: "Hormonal balance", category: "Herbal" },
            { name: "Jeera powder", emoji: "🫙", price: 100, benefit: "Digestion", category: "Food" },
            { name: "Fenugreek (Vendayam)", emoji: "🌱", price: 140, benefit: "Breast milk", category: "Supplements" },
            { name: "Dates", emoji: "🌴", price: 300, benefit: "Energy", category: "Food" },
            { name: "Ragi flour", emoji: "🌾", price: 160, benefit: "Calcium", category: "Supplements" },
            { name: "Garlic Paste", emoji: "🧄", price: 80, benefit: "Immunity", category: "Food" },
            { name: "Cumin powder (Seeragam)", emoji: "🫖", price: 110, benefit: "Nausea relief", category: "Food" },
            { name: "Poonaikali", emoji: "🌺", price: 220, benefit: "Fertility aid", category: "Herbal" },
            { name: "Thuthuvalai", emoji: "🍵", price: 190, benefit: "Cough relief", category: "Herbal" },
            { name: "Neem powder", emoji: "🍀", price: 170, benefit: "Skin health", category: "Herbal" },
            { name: "Kukku Podi", emoji: "🥛", price: 130, benefit: "Lactation", category: "Traditional" },
            { name: "Arugan Pul", emoji: "🌿", price: 160, benefit: "Morning sickness", category: "Herbal" },
            { name: "Gooseberry (Amla)", emoji: "🫒", price: 140, benefit: "Vitamin C", category: "Food" },
            { name: "Manathakkali", emoji: "🫐", price: 150, benefit: "Eyesight", category: "Supplements" },
            { name: "Kovakkai", emoji: "🥒", price: 120, benefit: "Diabetes control", category: "Supplements" },
            { name: "Pippali", emoji: "🫚", price: 280, benefit: "Respiratory health", category: "Herbal" },
            // New 15 items
            { name: "Shatavari Powder", emoji: "🌸", price: 240, benefit: "Breast milk boost", category: "Herbal" },
            { name: "Barley Flour", emoji: "🌾", price: 120, benefit: "Swelling reduction", category: "Supplements" },
            { name: "Palm Jaggery (Karupatti)", emoji: "🌴", price: 200, benefit: "Natural Iron", category: "Food" },
            { name: "Adhimadhuram Powder", emoji: "🌿", price: 150, benefit: "Cold Relief", category: "Herbal" },
            { name: "Rose Petal Gulkand", emoji: "🌹", price: 180, benefit: "Cooling effect", category: "Traditional" },
            { name: "Turmeric Root", emoji: "🫚", price: 100, benefit: "Antiseptic Shield", category: "Food" },
            { name: "Vallarai Powder", emoji: "🍃", price: 140, benefit: "Memory & Brain", category: "Herbal" },
            { name: "Tulsi Leaves", emoji: "🌿", price: 90, benefit: "Respiratory Guard", category: "Herbal" },
            { name: "Black Sesame (Ellu)", emoji: "🌱", price: 160, benefit: "Bone Health", category: "Food" },
            { name: "Horse Gram", emoji: "🌾", price: 110, benefit: "Body Strength", category: "Supplements" },
            { name: "Ponnanganni Powder", emoji: "🥬", price: 130, benefit: "Eye Care", category: "Herbal" },
            { name: "Karunjiragam", emoji: "🌱", price: 210, benefit: "Infection Shield", category: "Herbal" },
            { name: "Chitarathai Powder", emoji: "🌿", price: 140, benefit: "Throat Relief", category: "Herbal" },
            { name: "Hibiscus Powder", emoji: "🌺", price: 180, benefit: "Scalp Health", category: "Traditional" },
            { name: "Murungai Keerai", emoji: "🍃", price: 120, benefit: "Calcium Iron", category: "Supplements" },
            { name: "Kumkuma Poo (Saffron)", emoji: "🪷", price: 450, benefit: "Brain & Skin glow", category: "Herbal" }
        ];
        await Product.deleteMany();
        await Product.insertMany(seedProducts);
        res.json({ message: "Seeded 36 categorized products!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/admin/dashboard', adminCtrl.getDashboardStats);
router.get('/admin/users', adminCtrl.getAllUsers);
router.get('/admin/orders', adminCtrl.getAllOrders);
router.put('/admin/orders/:orderId', adminCtrl.updateOrderStatus);
router.put('/admin/sos/:alertId/resolve', adminCtrl.resolveAlert);

module.exports = router;
