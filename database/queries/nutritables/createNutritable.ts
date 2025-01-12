import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";

const query =
    `
    INSERT INTO nutritables (
        foodId,
        unitId,
        measure,
        kcals,
        protein,
        carbs,
        fats,
        deleted
    )
    VALUES (
        $foodId,
        $unitId,
        $measure,
        $kcals,
        $protein,
        $carbs,
        $fats,
        0
    );`;

export const createNutritable = (
    database: SQLiteDatabase,
    params: {
        foodId: number,
        unitId: number,
        measure: number,
        kcals: number
        protein: number
        carbs: number
        fats: number
    }
) => (database.runSync(
    query,
    toSQLiteParams(params)
));