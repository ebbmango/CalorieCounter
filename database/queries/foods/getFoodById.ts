import { Food } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query = "SELECT * FROM foods WHERE id = $foodId;";

export const getFoodById = async (
    database: SQLiteDatabase,
    params: { foodId: number }
): Promise<Food | null> =>
    await database.getFirstAsync<Food>(
        query,
        toSQLiteParams(params)
    );