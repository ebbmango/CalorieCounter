import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";


const query = `UPDATE foods SET name = $newFoodName WHERE id = $foodId;`;

export const updateFoodName = (
    database: SQLiteDatabase,
    params: {
        foodId: number,
        newFoodName: string
    }) => (database.runSync(query, toSQLiteParams(params)))