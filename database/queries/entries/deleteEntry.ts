import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";
import { deleteOrphanedFoods } from "../foods/deleteOrphanedFoods";
import { deleteOrphanedNutritables } from "../nutritables/deleteOrphanedNutritables";

const query = `DELETE FROM entries WHERE id = $entryId;`

export const deleteEntry = (
    database: SQLiteDatabase,
    params: { entryId: number }
) => {
    database.runSync(query, toSQLiteParams(params));
    // cleanup:
    // first the nutritables!!!
    deleteOrphanedNutritables(database);
    deleteOrphanedFoods(database);
};
