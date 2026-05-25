/**
 * Relaciones de Drizzle ORM entre tablas del esquema.
 *
 * Las tablas se definen en archivos hermanos (p. ej. `tasks.ts`). Aquí se declaran
 * sus vínculos para consultas relacionales tipadas con `db.query.*` y `with`.
 *
 * Esto no afecta migraciones ni la estructura SQL: solo habilita lecturas anidadas
 * (eager loading) en runtime. Cuando añadas claves foráneas, exporta una relación
 * por tabla implicada.
 *
 * @example
 * // users.ts define `userId` en otra tabla que referencia `tasks`
 * export const tasksRelations = relations(tasks, ({ one, many }) => ({
 *   author: one(users, { fields: [tasks.authorId], references: [users.id] }),
 * }));
 *
 * @see https://orm.drizzle.team/docs/rqb
 */

import { relations } from "drizzle-orm";