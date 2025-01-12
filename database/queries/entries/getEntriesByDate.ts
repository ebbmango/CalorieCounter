import { Entry } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query = "SELECT * FROM entries WHERE date = $date"

export const getEntriesByDate = async (database: SQLiteDatabase, params: { date: Date }): Promise<Entry[]> => {
    // Running the query
    const queryResult = await database.getAllAsync(
        query,
        toSQLiteParams({ date: params.date.toDateString() })
    );

    // Treating the result
    return queryResult.map((row: any) => ({
        id: row.id,
        foodId: row.foodId,
        nutritableId: row.nutritableId,
        date: new Date(row.date),
        amount: row.amount,
        unitId: row.unitId,
        mealId: row.mealId
    }))
}