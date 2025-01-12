import { Entry } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query = "SELECT * FROM entries WHERE foodId = $foodId"

// Purpose: to check whether a food is referenced by any entry
export const getEntryByFoodId = async (
    database: SQLiteDatabase,
    params: { foodId: number }
): Promise<Entry | null> => (
    await database.getFirstAsync(
        query,
        toSQLiteParams(params)
    )
);