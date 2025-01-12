import { SQLiteDatabase } from "expo-sqlite";
import { getAllFoods } from "./getAllFoods";

export const getAllFoodNames = async (
  database: SQLiteDatabase
): Promise<string[]> => (
  await getAllFoods(database)
).map((food) => food.name);