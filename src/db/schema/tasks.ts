import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tasks = pgTable("tasks", {
    id: serial()
        .primaryKey(),
    name: text()
        .notNull(),
    done: boolean()
        .notNull()
        .default(false),
    createdAt: timestamp()
        .defaultNow(),
    updatedAt: timestamp()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks);

export const insertTasksSchema = createInsertSchema(
    tasks,
    {
        name: field => field.min(1).max(500),
    },
).required({
    done: true,
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const patchTasksSchema = insertTasksSchema.partial();