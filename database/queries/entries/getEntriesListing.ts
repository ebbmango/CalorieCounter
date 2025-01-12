import { EntryListing } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query =
    `
    SELECT
        e.id AS entryId,
        f.name AS foodName,
        f.deleted AS foodDeleted,
        u.symbol AS unitSymbol,
        e.amount AS amount,
        n.deleted AS nutritableDeleted,
        (n.kcals * (e.amount / NULLIF(n.measure, 0))) AS kcals,
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

export const getEntriesListing = async (
    database: SQLiteDatabase,
    params: {
        date: Date,
        mealId: number
    }
): Promise<EntryListing[]> => {
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
            entryId: row.entryId,
            // Food
            foodName: row.foodName,
            foodDeleted: row.foodDeleted,
            // Measure
            kcals: row.kcals,
            amount: row.amount,
            unitSymbol: row.unitSymbol,
            // Nutritable
            nutritableDeleted: row.nutritableDeleted,
        }
    ))
}
