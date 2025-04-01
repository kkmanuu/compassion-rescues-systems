const bcrypt = require('bcrypt');

async function hashPassword() {
  const hashedPassword = await bcrypt.hash('12345', 10);
  console.log('Hashed Password:', hashedPassword);
}

hashPassword();
