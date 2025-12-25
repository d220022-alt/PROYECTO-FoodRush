const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
);

// Define User Model minimally for this script
const Usuario = sequelize.define('usuario', {
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    contrasena: DataTypes.STRING,
    direccion: DataTypes.STRING,
    zona: DataTypes.STRING,
    rol: DataTypes.STRING
}, {
    timestamps: false
});

async function checkOrCreateUser() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Check for specific test user
        const testEmail = 'test@foodrush.com';
        let user = await Usuario.findOne({ where: { correo: testEmail } });

        if (user) {
            console.log('\n✅ Test User Exists:');
            console.log(`Email: ${user.correo}`);
            console.log(`Password: 123456 (Assuming this was used at creation)`);
            console.log(`Name: ${user.nombre}`);
        } else {
            console.log('\n⚠️ Test User not found. Creating one...');
            user = await Usuario.create({
                nombre: 'Usuario Test',
                correo: testEmail,
                contrasena: '123456', // Storing plain text for this dev environment based on previous context
                direccion: 'Calle Sol #123, STI',
                zona: 'gurabo',
                rol: 'cliente'
            });
            console.log('\n✅ Test User Created Successfully:');
            console.log(`Email: ${testEmail}`);
            console.log(`Password: 123456`);
        }

        // List all users just in case
        const allUsers = await Usuario.findAll({ limit: 5 });
        console.log('\n--- All Users in DB ---');
        allUsers.forEach(u => console.log(`- ${u.correo} (${u.contrasena})`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkOrCreateUser();
