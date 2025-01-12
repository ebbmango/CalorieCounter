import { Food } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

export const getFoodsByIds = async (database: SQLiteDatabase, params: { ids: number[] }): Promise<Food[]> => {
    const { ids } = params;
    if (ids.length === 0) return [];

    const placeholders = ids.map((_, index) => `$id${index}`).join(", ");
    const query = `SELECT * FROM foods WHERE id IN (${placeholders});` // not good practice

    const paramDict: Record<string, number> = {};
    params.ids.forEach((id, index) => {
        paramDict[`id${index}`] = id;
    });

    return await database.getAllAsync<Food>(query, toSQLiteParams(paramDict))
}