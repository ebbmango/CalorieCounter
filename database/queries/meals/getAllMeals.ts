import { Meal } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";

const query = "SELECT * FROM meals;";

const getAllMeals = async (
    database: SQLiteDatabase
): Promise<Meal[]> => {
    // Querying the database
    const queryResult = await database.getAllAsync(query);
    // Mapping the database rows to Meal objects
    return queryResult.map((row: any) => ({
        id: row.id,
        name: row.name,
    }));
};

export default getAllMeals;