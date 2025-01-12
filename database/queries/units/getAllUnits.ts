import { Unit } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";

const query = "SELECT * FROM units;";

export const getAllUnits = async (
    database: SQLiteDatabase
): Promise<Unit[]> => {
    // Querying the database
    const queryResult = await database.getAllAsync(query);
    // Mapping the database rows to Unit objects
    return queryResult.map((row: any) => ({
        id: row.id,
        symbol: row.symbol,
    }));
};

export default getAllUnits;