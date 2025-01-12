import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { addDatabaseChangeListener, useSQLiteContext } from 'expo-sqlite';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useDate } from 'context/DateContext';
import { getEntriesMacros } from 'database/queries/entries/getEntriesMacros';
import { createMealSummaries } from 'database/utils/createMealSummaries';

export type MacroSummary = {
  mealId: 0 | 1 | 2 | 3 | 4 | 5;
  kcals: number;
  protein: number;
  fat: number;
  carbs: number;
};

type MealSummaries = Record<
  'Day' | 'Breakfast' | 'Morning' | 'Lunch' | 'Afternoon' | 'Dinner',
  MacroSummary
>;

// If you want mealId: 0 in your MacroSummary type, define it as a union or do something else:
export type ExtendedMacroSummary = MacroSummary & {
  mealId: 0 | 1 | 2 | 3 | 4 | 5;
};

type MealSummariesContextType = MealSummaries;
const MealSummariesContext = createContext<MealSummariesContextType | undefined>(undefined);

export function useMealSummaries() {
  const context = useContext(MealSummariesContext);
  if (!context) {
    throw new Error('useMealSummaries must be used within a MealSummariesProvider');
  }
  return context;
}

type MealSummariesProviderProps = {
  children: ReactNode;
};

export function MealSummariesProvider({ children }: MealSummariesProviderProps) {
  const database = useSQLiteContext();
  const date = useDate().get();

  const {
    data: entries = [],
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ['entries', date.toDateString()],
    queryFn: () => getEntriesMacros(database, { date }),
    initialData: [],
  });

  useEffect(() => {
    const listener = addDatabaseChangeListener((change) => {
      if (change.tableName === 'nutritables' || change.tableName === 'entries') {
        refetch();
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  const mealSummaries: MealSummaries = React.useMemo(() => {
    if (!isFetched) {
      return {
        Day: { mealId: 0, kcals: 0, fat: 0, carbs: 0, protein: 0 },
        Breakfast: { mealId: 1, kcals: 0, fat: 0, carbs: 0, protein: 0 },
        Morning: { mealId: 2, kcals: 0, fat: 0, carbs: 0, protein: 0 },
        Lunch: { mealId: 3, kcals: 0, fat: 0, carbs: 0, protein: 0 },
        Afternoon: { mealId: 4, kcals: 0, fat: 0, carbs: 0, protein: 0 },
        Dinner: { mealId: 5, kcals: 0, fat: 0, carbs: 0, protein: 0 },
      };
    }
    
    const summariesMap = createMealSummaries(entries);

    return {
      Day: {
        mealId: 0,
        kcals: summariesMap[0]?.kcals ?? 0,
        fat: summariesMap[0]?.fat ?? 0,
        carbs: summariesMap[0]?.carbs ?? 0,
        protein: summariesMap[0]?.protein ?? 0,
      },
      Breakfast: {
        mealId: 1,
        kcals: summariesMap[1]?.kcals ?? 0,
        fat: summariesMap[1]?.fat ?? 0,
        carbs: summariesMap[1]?.carbs ?? 0,
        protein: summariesMap[1]?.protein ?? 0,
      },
      Morning: {
        mealId: 2,
        kcals: summariesMap[2]?.kcals ?? 0,
        fat: summariesMap[2]?.fat ?? 0,
        carbs: summariesMap[2]?.carbs ?? 0,
        protein: summariesMap[2]?.protein ?? 0,
      },
      Lunch: {
        mealId: 3,
        kcals: summariesMap[3]?.kcals ?? 0,
        fat: summariesMap[3]?.fat ?? 0,
        carbs: summariesMap[3]?.carbs ?? 0,
        protein: summariesMap[3]?.protein ?? 0,
      },
      Afternoon: {
        mealId: 4,
        kcals: summariesMap[4]?.kcals ?? 0,
        fat: summariesMap[4]?.fat ?? 0,
        carbs: summariesMap[4]?.carbs ?? 0,
        protein: summariesMap[4]?.protein ?? 0,
      },
      Dinner: {
        mealId: 5,
        kcals: summariesMap[5]?.kcals ?? 0,
        fat: summariesMap[5]?.fat ?? 0,
        carbs: summariesMap[5]?.carbs ?? 0,
        protein: summariesMap[5]?.protein ?? 0,
      },
    };
  }, [entries, isFetched]);

  return (
    <MealSummariesContext.Provider value={mealSummaries}>{children}</MealSummariesContext.Provider>
  );
}
