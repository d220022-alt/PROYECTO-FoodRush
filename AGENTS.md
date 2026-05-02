# Estado compartido - Backend FoodRush (Claude Code + Codex)

Este backend pertenece al proyecto final FoodRush.

**La fuente de verdad principal esta en `../PROYECTO-FoodRush-Frontend/AGENTS.md`**. Leer ese archivo para el contexto completo del proyecto (objetivo, decisiones, roadmap). Este archivo solo agrega notas especificas del backend.

# Backend FoodRush

## Stack
- Node 22+, Express 5, Sequelize 6.
- PostgreSQL en produccion (`pg`); SQL Server (`mssql`) opcional en local.
- Helmet, CORS, express-rate-limit, bcryptjs, jsonwebtoken, dotenv.

## Decisiones especificas del backend
- `config/config.js` ya esta listo para Render: `production` usa `DATABASE_URL` + SSL.
- `Procfile` (`web: npm start`) existe, pero Render usa actualmente Start Command `npm start`.
- `models/index.js` autoloadea 60+ modelos. Ojo con asociaciones: hay duplicacion comentada que se evita usando `associate` de cada modelo.
- `routes/autoLoader.js` genera CRUD generico para modelos sin custom routes y ya se monta con `authMiddleware` + `tenantMiddleware`.
- `.env` contiene configuracion local y NO se debe imprimir. Ya fue removido del tracking en el commit `2b6b70e`; sigue pendiente rotar secretos si llegaron a GitHub y purgar historial si se decide hacerlo.

## Arranque
- Local: `npm start` o `node server.js` (requiere `.env` con variables locales).
- Produccion (Render): variables de entorno definidas en dashboard; Start Command verificado como `npm start`.

## Endpoints
- `GET /api/health`: health check publico.
- `GET /api/test-models`: debug; solo existe fuera de `NODE_ENV=production`.
- `GET /api/productos`: publico para catalogo con `tenant_id` o `X-Tenant-ID`; mutaciones protegidas por JWT.
- `GET|POST|PUT|DELETE /api/pedidos`: protegido por JWT.
- `POST /api/usuarios/login` y `POST /api/usuarios`: publicos con tenant; `GET|PUT|DELETE /api/usuarios` y `PUT /api/usuarios/:id/password` protegidos por JWT.
- `GET /api/tenants`: publico; mutaciones protegidas por JWT.
- Rutas autoloaded en `/api/<modelName>`: protegidas por JWT + tenant.

## Seeds
- `seed-all-tables.js`: seed principal por nombre.
- `seed-full-data.js`: seed grande usado en Render.
- `seed-franchises-frontend.js`: franquicias.
- `seed-images.js`: imagenes de productos.
- `seed-mcdonalds.js`, `seed-states.js`, `seed-v2-aligned.js`, `seed-data.js`: seeds parciales o legacy.

Para Render ya se ejecuto este orden: `seed-franchises-frontend.js` -> `seed-full-data.js` -> `seed-images.js`.

## Scripts utiles (`scripts/`)
- `scripts/migrate-passwords-to-bcrypt.js`: migracion one-time de usuarios legacy a bcrypt.
- `check_db_status.js`, `check_data.js`, `list_tables.js`, `diagnose_db.js`: diagnostico de datos/DB.
- `find_constraints.js`, `find_dependencies.js`: exploracion de relaciones.
- `manual_migration.js`: migraciones manuales si se necesitan.
- `cleanup_*.js`: limpieza de tenants/datos duplicados.

---

## Current state (eco del AGENTS.md principal)

**Last updated:** 2026-05-02 por Codex GPT-5.5

### Done so far (en este backend)
- Codex creo este `AGENTS.md` como puente al principal (2026-04-28).
- Claude analizo seguridad y armo plan de Fase A en el `AGENTS.md` principal.
- Codex completo el deploy backend en Render (2026-04-28):
  - URL live: `https://proyecto-foodrush.onrender.com`.
  - DB nueva: `foodrush-db-v4` (PostgreSQL 16 Free, Oregon).
  - Env vars Render listas: `NODE_ENV=production`, `DATABASE_URL` nueva, `DB_SYNC_ALTER=false`, `DB_CONNECT_RETRIES=10`, `DB_CONNECT_RETRY_DELAY_MS=5000`, `DB_SSL=true`, `JWT_SECRET`, `CORS_ORIGIN=*`.
  - Seeds cargados usando Start Command temporal porque Render Shell no existe en Free.
  - Start Command restaurado a `npm start`; Build Command confirmado como `npm install`.
- Codex implemento y desplego Fase A de seguridad backend (2026-04-28):
  - `.env` removido del tracking de git sin imprimir valores; el archivo local sigue existiendo.
  - `jsonwebtoken` agregado; login ahora firma JWT real y bcrypt se usa para crear/cambiar contrasenas.
  - Login migra automaticamente a bcrypt al usuario legacy que todavia tenga contrasena en texto plano.
  - Nuevo `middleware/authMiddleware.js` valida Bearer token y evita mismatch de tenant.
  - `tenantMiddleware` reemplaza el default inseguro `tenantId=1`; acepta `X-Tenant-ID` o `tenant_id` y evita interpretar `*.onrender.com` como subdominio tenant.
  - Rutas protegidas: pedidos, mutaciones de productos, mutaciones de tenants, usuarios privados y rutas dinamicas.
  - Publico queda health, tenants GET, login/register y productos GET.
  - `/api/test-models` solo existe fuera de production.
  - Nuevo `scripts/migrate-passwords-to-bcrypt.js`.
  - Commits publicados en `master`: `2b6b70e feat: secure backend auth and tenants` y `7f287f5 fix: honor tenant query on render host`.
- Render desplegado manualmente despues de ambos commits:
  - Deploy temporal para migracion bcrypt: `node scripts/migrate-passwords-to-bcrypt.js && npm start`.
  - Logs de Render confirmaron `Usuarios migrados a bcrypt: 3`.
  - Start Command restaurado y verificado como `npm start`.
- Verificacion de produccion OK tras restaurar Start Command:
  - `GET /api/health` -> 200.
  - `GET /api/tenants` -> 200.
  - `GET /api/productos?tenant_id=1` -> 200.
  - `GET /api/pedidos?tenant_id=1` sin token -> 401.
  - `GET /api/usuarios?tenant_id=1` sin token -> 401.
  - `GET /api/test-models` -> 404.
  - Prueba controlada de auth: crear usuario temporal -> login JWT real (3 partes) -> `GET /api/usuarios` con token 200 -> usuarios temporales `codex-backend-check-*` desactivados.
- Codex avanzo el siguiente paso de cierre de secretos (2026-04-28):
  - `.env` historico en git contenia solo nombres de variables locales `DB_*`; no contenia `DATABASE_URL` ni `JWT_SECRET` segun revision segura sin imprimir valores.
  - Scripts de mantenimiento con password local hardcodeado saneados para leer `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASS`/`DB_PASSWORD` y `DB_PORT` desde entorno.
  - Commit publicado: `088ac9a chore: read maintenance db credentials from env`.
  - `node --check` OK en los 7 scripts tocados.
- Codex completo rotacion de secretos persistentes en Render (2026-04-29):
  - Usuario autorizo regenerar secretos si el backend quedaba estable.
  - Deploy Hook privado de Render regenerado desde Settings.
  - `JWT_SECRET` reemplazado por un secreto nuevo generado localmente/sin imprimir valores y guardado en Render Environment.
  - Render hizo rebuild/redeploy despues del cambio.
  - Verificacion post-rotacion OK: `/api/health` 200, `/api/productos?tenant_id=1` 200, `/api/pedidos?tenant_id=1` sin token 401, `/api/test-models` 404.
  - Prueba JWT post-rotacion OK: usuario temporal `codex-jwt-rotate-check-*` creado, login devolvio token JWT de 3 partes, `GET /api/usuarios` con token 200 y usuario temporal desactivado.
  - Archivo temporal local usado para intento inicial de secreto eliminado.
- Codex corrigio el fallo `Failed to fetch` en login causado por rate limit sin CORS (2026-05-01):
  - Causa: `app.js` montaba `app.use(limiter)` antes de `cors()`. Cuando el rate limit respondia 429, el navegador no podia leer la respuesta y mostraba `Failed to fetch`.
  - Fix: `cors()` ahora se monta antes del rate limiter global, manteniendo los mismos origenes permitidos y `credentials: true`.
  - Commit publicado en `master`: `731050a fix: apply cors before rate limiting`.
  - Verificacion local OK: forzar 429 en `/api/health` conserva `Access-Control-Allow-Origin` y cuerpo JSON `TOO_MANY_REQUESTS`.
  - Verificacion Render OK: `/api/health` responde 200 con CORS para `https://foodrush-frontend.vercel.app`.
  - Verificacion Vercel OK: la cuenta delivery QA inicia sesion y entra a `/delivery` sin `Failed to fetch`.
- Codex mejoro headers visibles para mensajes de login con rate limit (2026-05-01):
  - `app.js`: `cors()` ahora expone `Retry-After`, `RateLimit-Limit`, `RateLimit-Remaining` y `RateLimit-Reset`.
  - Commit publicado en `master`: `c0598f4 fix: expose login rate limit headers`.
  - Verificacion local OK: `node --check app.js`.
  - Nota: tras ~2 min de polling, Render live todavia no mostraba `Access-Control-Expose-Headers`; dashboard pidio login y no se pudo disparar manualmente sin credenciales. El codigo esta listo en GitHub.
- Codex agrego persistencia dedicada para operaciones administrativas Fase 2 (2026-05-02):
  - Nueva ruta protegida `/api/admin/operations` en `routes/adminOperations.js`, montada en `app.js` con `authMiddleware` + `tenantMiddleware`.
  - Reutiliza tablas existentes para evitar migraciones en Render con `DB_SYNC_ALTER=false`: `rutas.descripcion` guarda zonas operativas con JSON `kind=admin_operation_zone`; `auditlogs` guarda cierres (`admin_operation_closure`) y auditoria (`admin_operation_audit`).
  - Endpoints agregados: `GET /state`, `GET /zones`, `PUT /zones/:id`, `GET|POST /closures`, `GET|POST /audit`.
  - Commit publicado en `master`: `9c08171 feat: persist admin operations`.
  - Verificacion local OK: `node --check routes/adminOperations.js`, `node --check app.js`, carga de `app`, prueba funcional HTTP local con usuario temporal, `GET state`, `PUT zone`, `POST closure`, `GET audit` y limpieza posterior de usuarios/audit logs temporales.
  - Render live todavia devuelve 404 en `/api/admin/operations/state`, asi que falta disparar manual deploy del servicio Render correcto. El frontend ya tiene fallback productivo a `/api/rutas` y `/api/auditlogs`.

### Next step
- Siguiente backend concreto: recuperar acceso al servicio Render correcto de `https://proyecto-foodrush.onrender.com`, disparar manual deploy del commit `9c08171` y verificar que `/api/admin/operations/state` pase de 404 a 401 sin token y a 200 con cuenta admin QA. Despues verificar tambien `Access-Control-Expose-Headers` del commit `c0598f4`.

### Blockers
- `.env` local ya fue removido del tracking y el commit fue pusheado, pero el archivo pudo quedar en historial de GitHub. No imprimir valores. Rotar credenciales afectadas y purgar historial si se quiere cerrar completamente ese riesgo.
- Render DB Free expira el 2026-05-28 salvo upgrade.
- `CORS_ORIGIN=*` sigue temporal en Render. El orden CORS/rate limit ya esta corregido, pero falta cerrar CORS al dominio real del frontend cuando el usuario decida.
- Render live no tomo los commits backend `c0598f4`/`9c08171` automaticamente. En el navegador autenticado de Codex solo aparece el servicio `backend-bff-1`, no el servicio FoodRush; por eso no se pudo disparar manual deploy del backend correcto en esta sesion.
