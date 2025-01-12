import { SQLiteDatabase } from "expo-sqlite";
import { Nutritable } from "database/types";
import toSQLiteParams from "utils/toSQLiteParams";

const query =
    `
    SELECT 
        n.id AS id,
        n.foodId,
        u.id AS unitId,
        u.symbol AS unitSymbol,
        n.measure AS measure,
        n.kcals,
        n.carbs,
        n.fats,
        n.protein,
        n.deleted
    FROM 
        nutritables AS n
    INNER JOIN 
        units AS u ON n.unitId = u.id
    WHERE 
        n.foodId = $foodId
    AND
        n.deleted = 0;
    `
    ;


export const getNutritablesByFood = async (
    database: SQLiteDatabase,
    params: { foodId: number }
): Promise<Nutritable[]> => {
    // Querying the database
    const queryResult = await database.getAllAsync(query, toSQLiteParams(params));
    // Mapping the database results to Nutritable objects
    return queryResult.map((table: any) => ({
        // ids
        id: table.id,
        foodId: table.foodId,
        // measurement
        measure: table.measure,
        unit: {
            id: table.unitId,
            symbol: table.unitSymbol,
        },
        // macros
        kcals: table.kcals,
        carbs: table.carbs,
        fats: table.fats,
        protein: table.protein,
        // flag
        deleted: !!table.deleted
    }));
};