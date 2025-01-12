import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query = `DELETE FROM entries WHERE id = $entryId;`

export const deleteEntry = (
    database: SQLiteDatabase,
    params: { entryId: number }
) => database.runSync(
    query,
    toSQLiteParams(params)
);
