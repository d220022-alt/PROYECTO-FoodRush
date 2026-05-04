/*
  Guia rapida para presentar:
  Script de mantenimiento o carga de datos: Seed All Tables. Se usa para revisar, migrar o sembrar informacion durante pruebas y despliegues.
  Mantener estos comentarios actualizados si cambia el flujo.
*/
require('dotenv').config();
const db = require('./models');

// Configuración general
const SEED_AMOUNT = 2; // Cantidad de registros por tabla
const TENANT_ID = 1;

// Cache para guardar IDs generados y usarlos en llaves foráneas
const idCache = {};

/**
 * Función principal
 */
async function seedAll() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Conexión establecida.');

        // 1. Obtener lista de modelos y sus dependencias
        const models = Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize');

        console.log(`📊 Analizando ${models.length} modelos...`);

        // Mapa de dependencias: Modelo -> [Dependencias]
        const dependencies = {};
        const modelMap = {};

        models.forEach(modelName => {
            const model = db[modelName];
            modelMap[modelName] = model;
            dependencies[modelName] = new Set();

            // Detect dependencies via Associations (since we removed inline references)
            if (model.associations) {
                Object.values(model.associations).forEach(assoc => {
                    // Only care about BelongsTo (Foreign Keys on this model)
                    if (assoc.associationType === 'BelongsTo') {
                        const targetName = assoc.target.name;
                        if (targetName && targetName !== modelName && models.includes(targetName)) {
                            dependencies[modelName].add(targetName);
                        }
                    }
                });
            }

            // Fallback: Check attributes just in case
            const attributes = model.rawAttributes;
            for (const attrName in attributes) {
                const attr = attributes[attrName];
                if (attr.references) {
                    let refModelName = attr.references.model;
                    if (typeof refModelName === 'string') {
                        const found = models.find(m => db[m].tableName === refModelName || m === refModelName);
                        if (found) refModelName = found;
                    }
                    if (refModelName && refModelName !== modelName && models.includes(refModelName)) {
                        dependencies[modelName].add(refModelName);
                    }
                }
            }
        });

        // 2. Ordenamiento Topológico (Kahn's Algorithm simplificado)
        const sortedModels = [];
        const visited = new Set();
        let hasChanged = true;

        while (hasChanged) {
            hasChanged = false;
            const roundCandidates = models.filter(m => !visited.has(m));

            for (const modelName of roundCandidates) {
                const deps = Array.from(dependencies[modelName]);
                const allDepsSatisfied = deps.every(d => visited.has(d));

                if (allDepsSatisfied) {
                    visited.add(modelName);
                    sortedModels.push(modelName);
                    hasChanged = true;
                }
            }
        }

        // Agregar los que quedaron fuera (ciclos o referencias complejas) al final
        const remaining = models.filter(m => !visited.has(m));
        if (remaining.length > 0) {
            console.warn('⚠️ Modelos con dependencias circulares o complejas (se intentarán al final):', remaining);
            sortedModels.push(...remaining);
        }

        console.log('🔄 Orden de carga calculado:', sortedModels.join(' -> '));

        // 3. Insertar datos
        for (const modelName of sortedModels) {
            await seedModel(modelName);
        }

        console.log('\n🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    }
}

/**
 * Inserta registros para un modelo específico
 */
async function seedModel(modelName) {
    const model = db[modelName];
    idCache[modelName] = []; // Inicializar cache de IDs

    console.log(`🌱 Sembrando: ${modelName}`);

    const recordsToCreate = [];

    for (let i = 0; i < SEED_AMOUNT; i++) {
        const record = {};

        for (const key in model.rawAttributes) {
            const attr = model.rawAttributes[key];

            // Saltarse ID autoincrementable y campos de tracking automático
            if (attr.autoIncrement) continue;
            if (attr.defaultValue && !attr.references) continue; // Dejar que la BD ponga el default (fechas, etc)

            // Manejo de Foreign Keys
            // Check if this field marks an association
            let isFK = false;
            let refModelName = null;

            if (attr.references) {
                isFK = true;
                refModelName = attr.references.model;
                if (typeof refModelName === 'string') {
                    const found = Object.keys(db).find(m => db[m].tableName === refModelName || m === refModelName);
                    if (found) refModelName = found;
                }
            } else {
                // Try to find association by foreignKey
                Object.values(model.associations).forEach(assoc => {
                    if (assoc.foreignKey === key && assoc.associationType === 'BelongsTo') {
                        isFK = true;
                        refModelName = assoc.target.name;
                    }
                });
            }

            if (isFK && refModelName) {
                if (key === 'tenant_id') {
                    record[key] = TENANT_ID;
                } else if (idCache[refModelName] && idCache[refModelName].length > 0) {
                    const randomId = idCache[refModelName][Math.floor(Math.random() * idCache[refModelName].length)];
                    record[key] = randomId;
                } else {
                    if (attr.allowNull) {
                        record[key] = null;
                    } else {
                        // console.warn(`   ⚠️ No hay IDs para FK ${key} -> ${refModelName}. INTENTANDO 1.`);
                        record[key] = 1;
                    }
                }
                continue;
            }

            // Generación de Datos Primitivos
            if (key === 'tenant_id') { // Refuerzo por si no está marcado como FK explícito
                record[key] = TENANT_ID;
                continue;
            }

            // Tipos de Datos
            const type = attr.type.key || attr.type.constructor.key;

            switch (type) {
                case 'STRING':
                case 'TEXT':
                case 'CHAR':
                    if (attr.validate && attr.validate.isEmail) {
                        record[key] = `test_${modelName}_${i}_${Date.now()}@example.com`;
                    } else {
                        record[key] = `${modelName} ${key} ${i + 1}`;
                    }
                    break;
                case 'INTEGER':
                case 'BIGINT':
                case 'DECIMAL':
                case 'FLOAT':
                case 'DOUBLE':
                    if (!record[key]) record[key] = Math.floor(Math.random() * 100) + 1;
                    break;
                case 'BOOLEAN':
                    record[key] = true;
                    break;
                case 'DATE':
                case 'DATEONLY':
                    record[key] = new Date();
                    break;
                case 'JSON':
                case 'JSONB':
                    record[key] = { dato: "prueba", valor: i };
                    break;
                default:
                    record[key] = null; // Desconocido -> null
            }
        }

        // Limpieza final de undefined
        Object.keys(record).forEach(k => record[k] === undefined && delete record[k]);
        recordsToCreate.push(record);
    }

    // Insertar en bulto (bulkCreate ignora hooks por defecto en algunas versiones, pero es más rápido)
    try {
        // Usamos create individual para capturar los IDs generados uno por uno si bulk falla al retornar IDs en todos los dialectos
        // O mejor, usamos bulkCreate con returning: true
        const created = await model.bulkCreate(recordsToCreate, { validate: true, returning: true, ignoreDuplicates: true });

        // Guardar IDs en cache
        created.forEach(c => {
            if (c.id) idCache[modelName].push(c.id);
        });

        console.log(`   ✅ Insertados ${created.length} registros.`);

    } catch (error) {
        console.error(`   ❌ Error insertando en ${modelName}:`, error.message);
        // No matamos el proceso, seguimos con la siguiente tabla
    }
}

seedAll();
