import { SQLiteDatabase } from "expo-sqlite";
import toSQLiteParams from "utils/toSQLiteParams";
import { getEntryByFoodId } from "../entries/getEntryByFoodId";

const deleteQuery = `DELETE FROM foods WHERE id = $foodId;`
const flagQuery = `UPDATE foods SET deleted = 1 WHERE id = $foodId;`

export const deleteFood = async (
    database: SQLiteDatabase,
    params: { foodId: number }
) => {
    const entry = await getEntryByFoodId(database, { foodId: params.foodId });

    const query = !entry /* if no entry relies on this item */
        ?
        deleteQuery /* delete it */
        :
        flagQuery /* else flag it */

    return database.runSync(query, toSQLiteParams(params));
};