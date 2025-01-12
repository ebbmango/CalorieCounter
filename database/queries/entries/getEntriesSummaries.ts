import { EntrySummary } from "database/types";
import { SQLiteDatabase, SQLiteExecuteAsyncResult } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query =
    `
    SELECT
        e.id AS entryId,
        f.id AS foodId,
        f.name AS foodName,
        f.deleted AS foodDeleted,
        u.id AS unitId,
        u.symbol AS unitSymbol,
        e.amount AS measure,
        n.id AS nutritableId,
        n.deleted AS nutritableDeleted,
        (n.kcals * (e.amount / NULLIF(n.measure, 0))) AS kcals,
        (n.fats * (e.amount / NULLIF(n.measure, 0))) AS fat,
        (n.carbs * (e.amount / NULLIF(n.measure, 0))) AS carbs,
        (n.protein * (e.amount / NULLIF(n.measure, 0))) AS protein
    FROM
        entries e
    JOIN
        foods f ON f.id = e.foodId
    JOIN
        units u ON u.id = e.unitId
    JOIN
        nutritables n ON n.id = e.nutritableId
    WHERE
        e.mealId = $mealId
    AND
        e.date = $date
    ORDER BY
        e.id;
`

export const getEntriesSummaries = async (
    database: SQLiteDatabase,
    params: {
        date: Date,
        mealId: number
    }
): Promise<EntrySummary[]> => {
    // Running the query
    const queryResult = await database.getAllAsync(
        query,
        toSQLiteParams({
            date: params.date.toDateString(),
            mealId: params.mealId
        })
    );

    return queryResult.map((row: any) => (
        {
            entryId: row.entryId,
            food: {
                id: row.foodId,
                name: row.foodName,
                deleted: !!row.foodDeleted
            },
            unit: {
                id: row.unitId,
                symbol: row.unitSymbol
            },
            measure: row.measure,
            nutritable: {
                id: row.nutritableId,
                deleted: !!row.nutritableDeleted,
            },
            macros: {
                kcals: row.kcals,
                fat: row.fat,
                carbs: row.carbs,
                protein: row.protein,
            }
        }
    )
    )
}

