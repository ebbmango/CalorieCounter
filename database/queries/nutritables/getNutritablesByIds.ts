import { Nutritable } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

export const getNutritablesByIds = async (
    database: SQLiteDatabase,
    params: { ids: number[] }
): Promise<Nutritable[]> => {

    const { ids } = params;
    if (ids.length === 0) return [];

    // Dynamically building the query
    const placeholders = ids.map((_, index) => `$id${index}`).join(", ");
    const query = `SELECT * FROM nutritables WHERE id IN (${placeholders});` // not good practice

    // Building a dictionary of the sort "id0": "4" 
    const paramDict: Record<string, number> = {};
    params.ids.forEach((id, index) => {
        paramDict[`id${index}`] = id;
    });

    // Querying the database
    const queryReturn = await database.getAllAsync<Nutritable>(
        query,
        toSQLiteParams(paramDict)
    );

    // Treating the return
    return queryReturn.map((table: any) => ({
        // identifiers
        id: table.id,
        foodId: table.foodId,
        // measurements
        measure: table.measure,
        unit: {
            id: table.unitId,
            symbol: table.unitSymbol,
        },
        // macros
        kcals: table.kcals,
        fats: table.fats,
        carbs: table.carbs,
        protein: table.protein,
        // flags
        deleted: !!table.deleted
    }));
}