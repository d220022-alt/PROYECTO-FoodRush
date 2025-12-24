const db = require('../models');

async function migrate() {
    try {
        console.log("Checking columns...");

        // Add direccion
        try {
            await db.sequelize.query('ALTER TABLE usuarios ADD COLUMN direccion VARCHAR(255) NULL;');
            console.log("✅ Column 'direccion' added.");
        } catch (e) {
            console.log("ℹ️ Column 'direccion' might already exist or error:", e.message);
        }

        // Add zona
        try {
            await db.sequelize.query('ALTER TABLE usuarios ADD COLUMN zona VARCHAR(50) NULL;');
            console.log("✅ Column 'zona' added.");
        } catch (e) {
            console.log("ℹ️ Column 'zona' might already exist or error:", e.message);
        }

        console.log("Migration attempts finished.");
        process.exit(0);
    } catch (error) {
        console.error("Migration fatal error:", error);
        process.exit(1);
    }
}

migrate();
