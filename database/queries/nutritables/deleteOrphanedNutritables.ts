import { SQLiteDatabase } from "expo-sqlite";

const query = `
DELETE
FROM nutritables
WHERE id IN (
    SELECT n.id 
    FROM nutritables n
    LEFT JOIN entries e
        ON e.nutritableId = n.id
    WHERE n.deleted = 1
      AND e.id IS NULL
);
`

export const deleteOrphanedNutritables = (
    database: SQLiteDatabase
) => database.runSync(query);