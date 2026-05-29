const { sequelize } = require('../config/db');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');
    
    await sequelize.query("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'COD'");
    console.log('Successfully added payment_method column to orders table.');
  } catch (error) {
    // If it already exists, it might throw an error, which is fine to ignore
    if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
      console.log('Column payment_method already exists.');
    } else {
      console.error('Migration failed:', error);
    }
  } finally {
    process.exit(0);
  }
}

run();
