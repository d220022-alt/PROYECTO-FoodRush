# Documentación de Rutas API (Dinámicas)

Se ha implementado un sistema de carga automática de rutas. Ahora **todas** las tablas de la base de datos tienen endpoints CRUD disponibles.

## Rutas Generadas
Basado en los modelos detectados, las siguientes rutas están disponibles (reemplazando `host` por tu servidor, ej: `http://localhost:3000`):

### Modelos de Negocio
- `/api/categorias`
- `/api/clientes`
- `/api/facturas`
- `/api/pagos`
- `/api/promociones`
- `/api/sucursales`
- `/api/repartidores`

### Logs y Auditoría
- `/api/auditlogs`
- `/api/errores_sistema`
- `/api/accesosfallidos`

### Configuración y Tenant
- `/api/configuracion`
- `/api/permisos`
- `/api/roles`

> **Nota:** La lista anterior es un resumen. Cualquier archivo en la carpeta `models/*.js` tiene su ruta correspondiente `/api/[nombre_modelo]`.

## Operaciones Disponibles
Para cada una de estas rutas, puedes usar:

| Método | Endpoint | Descripción | Ejemplo Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/[modelo]` | Listar todos | - |
| `GET` | `/api/[modelo]/:id` | Obtener uno | - |
| `POST` | `/api/[modelo]` | Crear nuevo | `{ "campo": "valor" }` |
| `PUT` | `/api/[modelo]/:id` | Actualizar | `{ "campo": "nuevo_valor" }` |
| `DELETE` | `/api/[modelo]/:id` | Eliminar/Desactivar | - |

## Filtrado Automático
- **Tenant ID**: Todas las operaciones filtran automáticamente por el `tenant_id` actual.
- **Activo**: Si la tabla tiene columna `activo`, el `DELETE` hará un borrado lógico (soft delete).

## Excepciones
Las siguientes rutas siguen usando sus controladores personalizados (no usan el genérico):
- `/api/productos`
- `/api/pedidos`
- `/api/usuarios`
- `/api/tenants`
