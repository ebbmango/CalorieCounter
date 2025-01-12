import { Entry } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query = "SELECT * FROM entries WHERE nutritableId = $nutritableId"

// Purpose: to check whether a nutritable is referenced by any entry
export const getEntryByNutritableId = async (
    database: SQLiteDatabase,
    params: { nutritableId: number }
): Promise<Entry | null> => (
    await database.getFirstAsync(
        query,
        toSQLiteParams(params)
    )
);