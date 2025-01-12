import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query =
    `
    UPDATE
        nutritables
    SET
        measure = $measure,
        kcals = $kcals,
        carbs = $carbs,
        fats = $fats,
        protein = $protein
    WHERE
        id = $nutritableId;
    `;

export const updateNutritable = (
    database: SQLiteDatabase,
    params: {
        nutritableId: number
        measure: number,
        kcals: number,
        fats: number,
        carbs: number,
        protein: number,
    }
) => (database.runSync(query, toSQLiteParams(params)))