import { Entry } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query = "SELECT * FROM entries WHERE nutritableId = $nutritableId"

export const getEntriesByNutritable = (database: SQLiteDatabase, params: { nutritableId: number }) => {
    const { nutritableId } = params;

    // Running the query
    const queryResult = database.getAllSync(
        query,
        toSQLiteParams({ nutritableId })
    );

    // Treating the result
    return queryResult

}