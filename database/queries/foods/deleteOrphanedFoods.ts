import { SQLiteDatabase } from "expo-sqlite";

const query = `
DELETE
FROM foods
WHERE id IN (
    SELECT f.id 
    FROM foods f
    LEFT JOIN entries e
        ON e.foodId = f.id
    WHERE f.deleted = 1
      AND e.id IS NULL
);
`

export const deleteOrphanedFoods = (
    database: SQLiteDatabase
) => database.runSync(query);