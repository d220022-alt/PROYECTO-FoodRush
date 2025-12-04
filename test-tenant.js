const { Client } = require('pg');

async function main() {
  const client = new Client({
    user: "tenant_user",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "FoodRushMultiTenant"
  });

  await client.connect();

  // 1. Establecer tenant_id = 1
  await client.query("SELECT app.set_tenant(1);");

  // 2. Consultar productos como tenant 1
  const result1 = await client.query("SELECT * FROM productos;");
  console.log("Productos Tenant 1:");
  console.table(result1.rows);

  // 3. Cambiar a tenant 2
  await client.query("SELECT app.set_tenant(2);");

  // 4. Consultar productos como tenant 2
  const result2 = await client.query("SELECT * FROM productos;");
  console.log("Productos Tenant 2:");
  console.table(result2.rows);

  await client.end();
}

main();
