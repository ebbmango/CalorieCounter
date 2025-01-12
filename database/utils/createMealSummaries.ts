import { EntryMacros } from "database/types";

type MacroSummary = {
    mealId: number;
    kcals: number;
    fat: number;
    carbs: number;
    protein: number;
};

/**
 * Summarizes the macros for each meal
 * and also generates a "Day" summary (mealId = 0).
 */
export function createMealSummaries(
    entries: EntryMacros[]
): Record<number, MacroSummary> {
    const mealSummariesMap: Record<number, MacroSummary> = {};

    for (const { mealId, kcals, fat, carbs, protein } of entries) {
        if (!mealSummariesMap[mealId]) {
            mealSummariesMap[mealId] = {
                mealId,
                kcals: 0,
                fat: 0,
                carbs: 0,
                protein: 0,
            };
        }
        // Accumulate macros per meal
        mealSummariesMap[mealId].kcals += kcals;
        mealSummariesMap[mealId].fat += fat;
        mealSummariesMap[mealId].carbs += carbs;
        mealSummariesMap[mealId].protein += protein;
    }

    let dayTotals: MacroSummary = {
        mealId: 0,
        kcals: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
    };

    for (const mealKey in mealSummariesMap) {
        const mealSummary = mealSummariesMap[mealKey];
        dayTotals.kcals += mealSummary.kcals;
        dayTotals.fat += mealSummary.fat;
        dayTotals.carbs += mealSummary.carbs;
        dayTotals.protein += mealSummary.protein;
    }

    mealSummariesMap[0] = dayTotals;

    return mealSummariesMap;
}
