import { useQuery } from "@tanstack/react-query";
import { getFoodsByIds } from "database/queries/foods/getFoodsByIds";
import { getNutritablesByIds } from "database/queries/nutritables/getNutritablesByIds";
import { Entry, EntrySummary, Food, Meal, Nutritable, Unit } from "database/types";
import { addDatabaseChangeListener, SQLiteDatabase } from "expo-sqlite";
import useUnits from "./useUnits";
import { getEntriesByMealAndDate } from "database/queries/entries/getEntriesByMealAndDate";
import { useDate } from "context/DateContext";
import { useEffect, useMemo } from "react";
import proportion from "utils/proportion";

type UseEntriesSummariesProps = {
    meal: Meal;
    database: SQLiteDatabase;
};


export const useEntriesData = ({ meal, database }: UseEntriesSummariesProps): EntrySummary[] => {

    const mealId = meal.id
    const date = useDate().get()

    const entries = getEntriesByMealAndDate(database, { date, mealId })


} 