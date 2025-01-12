//// DATABASE
//// The following types are present in the database itself.

// Daily Meals
export interface Meal {
    id: 1 | 2 | 3 | 4 | 5;
    name: 'Breakfast' | 'Morning' | 'Lunch' | 'Afternoon' | 'Dinner';
}

// Measurement Units
export interface Unit {
    id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    symbol: 'g' | 'ml' | 'lb' | 'tsp' | 'tbsp' | 'cup' | 'oz' | 'unit';
}

// Foods
export interface Food {
    id: number;
    name: string;
    deleted: boolean;
}

// Nutritional Tables
export interface Nutritable {
    // ids
    id: number;
    foodId: number;
    // measure
    unit: Unit;
    measure: number;
    // macros
    kcals: number;
    fats: number;
    carbs: number;
    protein: number;
    // flags
    deleted: boolean;
}

// Journal Entries
export interface Entry {
    id: number;
    // references
    mealId: number;
    foodId: number;
    unitId: number;
    nutritableId: number;
    // data
    date: Date;
    amount: number;
}

//// APPLICATION
//// The following types are not present in the database,
//// rather, they are custom queries created to facilitate data handling in the app.

// FOR THE HOME & READ:
// The purpose of this interface is to query the database and calculate the TOTAL
// amount of each macronutrient PER DAY & PER MEAL
export interface EntryMacros {
    entryId: number,
    mealId: number, // to group by meal
    kcals: number,
    fat: number,
    carbs: number,
    protein: number
}

// FOR THE MEALS DRAWER:
// The purpose of this interface is to query the database and LIST each entry
export interface EntryListing {
    entryId: number,
    // Food
    foodName: string,
    foodDeleted: boolean,
    // Measure
    unitSymbol: string,
    amount: number,
    kcals: number,
    // Nutritable
    nutritableDeleted: boolean,
}