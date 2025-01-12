import { Food } from "database/types";
import { SQLiteDatabase } from "expo-sqlite";

const query = "SELECT * FROM foods WHERE deleted = 0;";

export const getAllFoods = async (database: SQLiteDatabase): Promise<Food[]> => {
    const queryResult = await database.getAllAsync(query);
    return queryResult.map((row: any) => ({
      id: row.id,
      name: row.name,
      deleted: !!row.deleted
    }));
  };