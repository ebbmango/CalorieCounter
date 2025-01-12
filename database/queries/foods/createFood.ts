import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query = "INSERT INTO foods (name, deleted) VALUES ($foodName, 0);";

export const createFood = (
    database: SQLiteDatabase,
    params: { foodName: string }
) => database.runSync(
    query,
    toSQLiteParams(params)
);