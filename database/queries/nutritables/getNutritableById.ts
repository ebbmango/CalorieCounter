import { SQLiteDatabase } from "expo-sqlite";
import { Nutritable } from "database/types";
import toSQLiteParams from "utils/toSQLiteParams";

const query = "SELECT * FROM nutritables WHERE id = $id;"

export const getNutritableById = async (
    database: SQLiteDatabase,
    params: { id: number }
): Promise<Nutritable | null> => (
    await database.getFirstAsync<Nutritable>(
        query,
        toSQLiteParams(params)
    )
);