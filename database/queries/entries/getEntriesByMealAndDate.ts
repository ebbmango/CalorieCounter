import { Entry } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query = "SELECT * FROM entries WHERE date = $date AND mealId = $mealId"

export const getEntriesByMealAndDate = async (database: SQLiteDatabase, params: { date: Date, mealId: number }): Promise<Entry[]> => {
    const { date, mealId } = params;

    // Running the query
    const queryResult = await database.getAllAsync(
        query,
        toSQLiteParams({ date: date.toDateString(), mealId })
    );

    // Treating the result
    return queryResult.map((row: any) => ({
        id: row.id,
        mealId: row.mealId,
        foodId: row.foodId,
        unitId: row.unitId,
        nutritableId: row.nutritableId,
        date: new Date(row.date),
        amount: row.amount,
    }))

}