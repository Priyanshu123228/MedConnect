require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Medicine = require("./models/Medicine");
const Pharmacy = require("./models/Pharmacy");
const Price = require("./models/Price");
const ExpiryDeal = require("./models/ExpiryDeal");

const runSeed = async () => {
  try {
    await connectDB();

    await Medicine.deleteMany({});
    await Pharmacy.deleteMany({});
    await Price.deleteMany({});
    await ExpiryDeal.deleteMany({});

    // Pharmacies
    const pharmacies = await Pharmacy.insertMany([
      { name: "Apollo Pharmacy", location: "New Delhi" },
      { name: "MedPlus Health Store", location: "Mumbai" },
      { name: "Wellness Forever", location: "Bangalore" },
    ]);

    // Medicines
    const medicines = await Medicine.insertMany([
      {
        name: "Paracetamol 500mg",
        salt: "Paracetamol",
        type: "Generic",
        manufacturer: "Quality Generics Ltd.",
      },
      {
        name: "Crocin Advance 500mg",
        salt: "Paracetamol",
        type: "Branded",
        manufacturer: "GlaxoSmithKline",
      },
      {
        name: "Ibuprofen 400mg",
        salt: "Ibuprofen",
        type: "Generic",
        manufacturer: "PainFree Generics",
      },
      {
        name: "Warfarin 5mg",
        salt: "Warfarin",
        type: "Branded",
        manufacturer: "CardioCare Pharma",
      },
    ]);

    // Helper to find by name
    const m = (name) => medicines.find((med) => med.name === name)._id;
    const p = (name) => pharmacies.find((ph) => ph.name === name)._id;

    // Prices (variation across pharmacies)
    await Price.insertMany([
      // Paracetamol generic
      {
        medicineId: m("Paracetamol 500mg"),
        pharmacyId: p("Apollo Pharmacy"),
        price: 42,
      },
      {
        medicineId: m("Paracetamol 500mg"),
        pharmacyId: p("MedPlus Health Store"),
        price: 48.5,
      },
      {
        medicineId: m("Paracetamol 500mg"),
        pharmacyId: p("Wellness Forever"),
        price: 52,
      },
      // Crocin branded
      {
        medicineId: m("Crocin Advance 500mg"),
        pharmacyId: p("Apollo Pharmacy"),
        price: 120,
      },
      {
        medicineId: m("Crocin Advance 500mg"),
        pharmacyId: p("MedPlus Health Store"),
        price: 130,
      },
    ]);

    const now = new Date();
    const daysFromNow = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // Expiry deals (2+ as requested)
    await ExpiryDeal.insertMany([
      {
        medicineId: m("Ibuprofen 400mg"),
        pharmacyId: p("Apollo Pharmacy"),
        originalPrice: 70,
        discountedPrice: 52.5,
        expiryDate: daysFromNow(30),
        discountPercent: 25,
      },
      {
        medicineId: m("Warfarin 5mg"),
        pharmacyId: p("Wellness Forever"),
        originalPrice: 200,
        discountedPrice: 120,
        expiryDate: daysFromNow(10),
        discountPercent: 40,
      },
    ]);

    console.log("Seed data inserted successfully.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

runSeed();

