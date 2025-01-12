import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNutritablesByFood } from 'database/queries/nutritables/getNutritablesByFood';
import { getFoodById } from 'database/queries/foods/getFoodById';
import { addDatabaseChangeListener, SQLiteDatabase } from 'expo-sqlite';
import useUnits from './useUnits';
import { Food, Meal, Nutritable, Unit } from 'database/types';
import getAllMeals from 'database/queries/meals/getAllMeals';


type UseMealsProps = {
    database: SQLiteDatabase
}

type UseMealsData = {
    meals: Meal[],
    fetched: boolean,
    loading: boolean
}

export const useMeals = ({ database }: UseMealsProps): UseMealsData => {
    const { data: meals = [], isFetched, isLoading } = useQuery({
        queryKey: ['meals'],
        queryFn: () => getAllMeals(database),
        initialData: [],
    });
    return { meals: meals, fetched: isFetched, loading: isLoading }
}
