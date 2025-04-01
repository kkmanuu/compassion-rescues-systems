const bcrypt = require('bcrypt');
const User = require('./models/User');
const sequelize = require('./config/database');

async function createAdmin() {
  await sequelize.sync();
  
  const hashedPassword = await bcrypt.hash('12345', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@rescue',
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin user created:', admin.email);
}

createAdmin();
