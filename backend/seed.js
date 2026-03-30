require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maternal_health';

const products = [
    {name: 'பொட்டுக்கடலை மாவு (Perukala)', price: 150, benefit: 'Anemia control', emoji: '🌾', category: 'Supplements'},
    {name: 'உளுந்து களி (Ulundhu Kali)', price: 200, benefit: 'Delivery strength', emoji: '🫘', category: 'Traditional'},
    {name: 'கழற்சிக்காய் (Kalarchikai)', price: 120, benefit: 'Uterus tone', emoji: '🌿', category: 'Herbal'},
    {name: 'முருங்கை பொடி (Murungai)', price: 180, benefit: 'Blood boost', emoji: '🍃', category: 'Herbal'},
    {name: 'அசோகா (Ashoka Powder)', price: 250, benefit: 'Hormonal balance', emoji: '🌸', category: 'Herbal'},
    {name: 'ஜீரா பொடி (Jeera)', price: 100, benefit: 'Digestion', emoji: '🫙', category: 'Kitchen'},
    {name: 'வெந்தயம் (Vendayam)', price: 140, benefit: 'Breast milk', emoji: '🌱', category: 'Kitchen'},
    {name: 'பேரிச்சை (Dates)', price: 300, benefit: 'Energy', emoji: '🌴', category: 'Food'},
    {name: 'ராகி மாவு (Ragi)', price: 160, benefit: 'Calcium', emoji: '🌾', category: 'Food'},
    {name: 'பூண்டு விழுது (Garlic Paste)', price: 80, benefit: 'Immunity', emoji: '🧄', category: 'Kitchen'},
    {name: 'தேங்காய்ப்பால் பொடி', price: 120, benefit: 'Brain development', emoji: '🥥', category: 'Food'}
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB...');
        
        await Product.deleteMany();
        console.log('Cleared existing products.');
        
        await Product.insertMany(products);
        console.log('Seeded products successfully!');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
