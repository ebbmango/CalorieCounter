import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query =
    `
    INSERT INTO entries (foodId, nutritableId, date, amount, unitId, mealId)
    VALUES ($foodId, $nutritableId, $date, $amount, $unitId, $mealId);
    `

export const createEntry = (
    database: SQLiteDatabase,
    params: {
        foodId: number,
        nutritableId: number,
        date: Date,
        amount: number,
        unitId: number,
        mealId: number
    }
) => {
    // parsing the date parameter to SQLite readable value
    const date = params.date.toDateString() // (timezone issues?)
    return database.runSync(query, toSQLiteParams({ ...params, date: date }));
}