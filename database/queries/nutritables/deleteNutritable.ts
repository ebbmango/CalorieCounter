import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";
import { getEntryByNutritableId } from "../entries/getEntryByNutritableId";

const deleteQuery = `DELETE FROM nutritables WHERE id = $nutritableId;`
const flagQuery = `UPDATE nutritables SET deleted = 1 WHERE id = $nutritableId;`

export const deleteNutritable = async (
    database: SQLiteDatabase,
    params: { nutritableId: number }
) => {
    const entry = await getEntryByNutritableId(database, { nutritableId: params.nutritableId });

    const query = !entry /* if no entry relies on this item */
        ?
        deleteQuery /* delete it */
        :
        flagQuery /* else flag it */

    return database.runSync(query, toSQLiteParams(params));
}