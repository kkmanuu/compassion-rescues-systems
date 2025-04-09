const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const sequelize = require("../config/database");

async function createAdmin() {
  try {
    await sequelize.sync(); // Sync the database

    const existingAdmin = await Admin.findOne({
      where: { email: "admin@rescue" },
    });

    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      return;
    }

    const hashedPassword = await bcrypt.hash("12345", 10);

    const admin = await Admin.create({
      name: "Admin User",
      email: "admin@rescue",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created:", admin.email);
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

createAdmin();
