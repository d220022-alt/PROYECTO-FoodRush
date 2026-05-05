/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Migrate Passwords To Bcrypt. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Buscar en VS Code: script migrate-passwords-to-bcrypt, seed, diagnostico, migracion, Render, datos prueba.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
require('dotenv').config();

const bcrypt = require('bcryptjs');
const { usuarios, sequelize } = require('../models');

const BCRYPT_REGEX = /^\$2[aby]\$\d{2}\$/;
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

async function main() {
  const users = await usuarios.findAll({
    attributes: ['id', 'correo', 'contrasena']
  });

  let migrated = 0;
  let skipped = 0;

  for (const user of users) {
    if (!user.contrasena || BCRYPT_REGEX.test(user.contrasena)) {
      skipped++;
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.contrasena, SALT_ROUNDS);
    await user.update({ contrasena: hashedPassword });
    migrated++;
  }

  console.log(`Usuarios migrados a bcrypt: ${migrated}`);
  console.log(`Usuarios omitidos: ${skipped}`);
}

main()
  .catch(error => {
    console.error('Error migrando contrasenas:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });
