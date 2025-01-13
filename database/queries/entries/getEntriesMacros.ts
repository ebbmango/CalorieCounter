import { EntryMacros } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query =
    `
    SELECT
        e.id AS entryId,
        m.id AS mealId,
        (n.kcals * (e.amount / NULLIF(n.measure, 0))) AS kcals,
        (n.fats * (e.amount / NULLIF(n.measure, 0))) AS fat,
        (n.carbs * (e.amount / NULLIF(n.measure, 0))) AS carbs,
        (n.protein * (e.amount / NULLIF(n.measure, 0))) AS protein
    FROM
        entries e
    JOIN
        meals m ON m.id = e.mealId
    JOIN
        nutritables n ON n.id = e.nutritableId
    WHERE
        e.date = $date
    ORDER BY
        e.id;
`

export const getEntriesMacros = async (
    database: SQLiteDatabase,
    params: { date: Date }
): Promise<EntryMacros[]> => {
    // Running the query
    const queryResult = await database.getAllAsync(
        query,
        toSQLiteParams({
            date: params.date.toDateString(),
        })
    );

    // Treating the result
    return queryResult.map((row: any) => (
        {
            // info
            entryId: row.entryId,
            mealId: row.mealId,
            // macros
            kcals: row.kcals,
            fat: row.fat,
            carbs: row.carbs,
            protein: row.protein
        }
    ))
}
