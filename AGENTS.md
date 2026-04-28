# Estado compartido — Backend FoodRush (Claude Code + Codex)

Este backend pertenece al proyecto final FoodRush.

**La fuente de verdad principal esta en `../PROYECTO-FoodRush-Frontend/AGENTS.md`** — leer ese archivo para el contexto completo del proyecto (objetivo, decisiones, roadmap). Este archivo solo agrega notas especificas del backend.

# Backend FoodRush

## Stack
- Node 22+, Express 5, Sequelize 6
- PostgreSQL en produccion (`pg`); SQL Server (`mssql`) opcional en local
- Helmet, CORS, express-rate-limit, bcryptjs (instalado, no usado), dotenv

## Decisiones especificas del backend
- `config/config.js` ya esta listo para Render: `production` usa `DATABASE_URL` + SSL.
- `Procfile` (`web: npm start`) → Render lo respeta sin cambios.
- `models/index.js` autoloadea 60+ modelos. Ojo con asociaciones: hay duplicacion comentada que se evita usando `associate` de cada modelo.
- `routes/autoLoader.js` genera CRUD generico para 56 modelos sin custom routes — ⚠️ sin auth, hay que protegerlo en Fase A.
- `.env` contiene configuracion local y NO se debe imprimir. Ojo: esta trackeado por git localmente al 2026-04-28; sacarlo del repo en la siguiente fase y rotar credenciales si llego al remoto.

## Arranque
- Local: `npm start` o `node server.js` (requiere `.env` con `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`).
- Produccion (Render): variables de entorno definidas — ver el AGENTS.md principal seccion "Plan de deploy en Render".

## Endpoints
- `GET /api/health` — health check (devuelve OK si server arriba).
- `GET /api/test-models` — debug, listado de modelos cargados (⚠️ exponer solo en dev).
- `GET|POST|PUT|DELETE /api/productos` — productoController.
- `GET|POST|PUT|DELETE /api/pedidos` — pedidoController + orderController.
- `GET|POST|PUT|DELETE /api/usuarios` + `POST /api/usuarios/login` + `PUT /api/usuarios/:id/password` — userController (⚠️ texto plano, dummy-token).
- `GET|POST|PUT|DELETE /api/tenants` — TenantController.
- 56 rutas mas autoloaded en `/api/<modelName>` desde `routes/autoLoader.js`.

## Seeds
- `seed-all-tables.js` (16KB) — el principal segun nombre.
- `seed-full-data.js` (28KB) — el mas grande, probablemente el real "todo en uno".
- `seed-franchises-frontend.js` — solo franquicias.
- `seed-images.js` — imagenes de productos.
- `seed-mcdonalds.js`, `seed-states.js`, `seed-v2-aligned.js`, `seed-data.js` — seeds parciales o legacy.

Para Render ya se ejecuto este orden: `seed-franchises-frontend.js` -> `seed-full-data.js` -> `seed-images.js`.

## Scripts utiles (`scripts/`)
- `check_db_status.js` — verifica conexion y tablas.
- `check_data.js` — verifica que hay data cargada.
- `list_tables.js` — lista todas las tablas.
- `diagnose_db.js` — diagnostico general.
- `find_constraints.js`, `find_dependencies.js` — exploracion de relaciones.
- `manual_migration.js` — migraciones manuales si las necesita.
- `cleanup_*.js` — limpiar duplicados de tenants.

---

## Current state (eco del AGENTS.md principal)

**Last updated:** 2026-04-28 por Codex GPT-5.5

### Done so far (en este backend)
- Codex creo este AGENTS.md como puente al principal (2026-04-28).
- Claude analizo seguridad y armo plan de Fase A en el AGENTS.md principal.
- Codex completo el deploy backend en Render (2026-04-28):
  - URL live: `https://proyecto-foodrush.onrender.com`.
  - DB nueva: `foodrush-db-v4` (PostgreSQL 16 Free, Oregon).
  - Env vars Render listas: `NODE_ENV=production`, `DATABASE_URL` nueva, `DB_SYNC_ALTER=false`, `DB_CONNECT_RETRIES=10`, `DB_CONNECT_RETRY_DELAY_MS=5000`, `DB_SSL=true`, `JWT_SECRET`, `CORS_ORIGIN=*`.
  - Seeds cargados usando Start Command temporal porque Render Shell no existe en Free.
  - Start Command restaurado a `npm start`; Build Command confirmado como `npm install`.
  - Verificado: `/api/health` 200 production, `/api/tenants` 15 franquicias, `/api/productos?tenant_id=1` 12 productos con imagenes, `/api/test-models` 65 modelos.
- Codex implemento localmente Fase A de seguridad (2026-04-28), aun NO desplegada:
  - `.env` removido del tracking de git sin imprimir valores; el archivo local sigue existiendo.
  - `jsonwebtoken` agregado; login ahora firma JWT real y bcrypt se usa para crear/cambiar contrasenas.
  - Login migra automaticamente a bcrypt al usuario legacy que todavia tenga contrasena en texto plano.
  - Nuevo `middleware/authMiddleware.js` valida Bearer token y evita mismatch de tenant.
  - `tenantMiddleware` reemplaza el default inseguro `tenantId=1` y requiere `X-Tenant-ID` o `tenant_id`.
  - Rutas protegidas: pedidos, mutaciones de productos, mutaciones de tenants, usuarios privados y rutas dinamicas.
  - Publico queda health, tenants GET, login/register y productos GET.
  - `/api/test-models` solo existe fuera de production.
  - Nuevo `scripts/migrate-passwords-to-bcrypt.js`.
  - Verificado: `node --check`, carga local de app con `DATABASE_URL` dummy, `/api/health` 200 y `/api/test-models` 404 en production simulada.

### Next step
- Publicar Fase A: revisar diff, commit/push a `master`, esperar redeploy de Render, ejecutar una vez `node scripts/migrate-passwords-to-bcrypt.js` contra la DB de Render sin exponer secretos y verificar `/api/health`, login JWT, productos publicos y 401 en rutas protegidas sin token.

### Blockers
- `.env` local ya fue removido del tracking, pero falta commit/push para sacarlo del remoto si estaba subido. No imprimir. Rotar credenciales si fue subido a GitHub.
- Render DB Free expira el 2026-05-28 salvo upgrade.
- Fase A esta local, no desplegada aun.
- Migracion bcrypt masiva pendiente en Render; el login migra usuarios legacy de forma gradual.
- `CORS_ORIGIN=*` temporal hasta desplegar frontend y cerrar CORS.
