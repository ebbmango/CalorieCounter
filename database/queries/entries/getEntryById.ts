import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query = `SELECT * FROM entries WHERE id = $entryId;`

export const getEntryById = (
    database: SQLiteDatabase,
    params: { entryId: number }
) => {
    return database.getFirstSync(query, toSQLiteParams(params))
}
