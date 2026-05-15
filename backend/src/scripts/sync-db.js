const { sequelize } = require('../config/db');

async function syncDatabase() {
  try {
    console.log('Starting database synchronization...');
    // alter: true will add missing columns (updated_at, deleted_at) 
    // without dropping existing data or columns.
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
}

syncDatabase();
