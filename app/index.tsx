import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

// My stuff
import MealDrawer from "@/components/MealDrawer";
import getAllMeals from "@/database/queries/mealsQueries";
import PieChart from "@/components/PieChart";
import { useState } from "react";
import MacroOverview from "@/components/MacroOverview";
import DateBanner from "@/components/DateBanner";
import MacroListItem from "@/components/MacroListItem";
import { useColors, MacroColors } from "@/context/ColorContext";

type MacroName = keyof MacroColors;

export default function Index() {
  const database: SQLiteDatabase = useSQLiteContext();
  const queryClient: QueryClient = useQueryClient();

  const colors = useColors();

  const screenWidth = Dimensions.get("window").width;

  // Retrieving the list of daily meals from the database
  const { data: meals = [] } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getAllMeals(database),
    initialData: [],
  });

  const [fat, setFat] = useState(5);
  const [protein, setProtein] = useState(15);
  const [carbohydrates, setCarbohydrates] = useState(10);

  const macronutrients: { name: MacroName; grams: number }[] = [
    { name: "fat", grams: fat },
    { name: "protein", grams: protein },
    { name: "carbohydrates", grams: carbohydrates },
  ];

  const chartData = macronutrients.map((macro) => macro.grams);
  const chartColors = macronutrients.map((macro) => colors.get(macro.name));

  const macroItems = [
    {
      color: colors.get("fat"),
      iconName: "bacon-solid",
      amount: fat,
      unit: "g",
    },
    {
      color: colors.get("carbohydrates"),
      iconName: "wheat-solid",
      amount: carbohydrates,
      unit: "g",
    },
    {
      color: colors.get("protein"),
      iconName: "meat-solid",
      amount: protein,
      unit: "g",
    },
    {
      color: colors.get("calories"),
      iconName: "ball-pile-solid",
      amount: fat * 8 + carbohydrates * 4 + protein * 4,
      unit: "g",
    },
  ] as const;

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          width: screenWidth,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          {macroItems.map((macro, index) => (
            <MacroOverview
              key={index}
              color={macro.color}
              iconName={macro.iconName}
              amount={macro.amount}
              unit={macro.unit}
            />
          ))}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: screenWidth * 0.8,
            gap: 24,
            alignItems: "center",
            marginVertical: 24,
          }}
        >
          <PieChart
            data={chartData}
            colors={chartColors}
            innerRadius={50}
            outerRadius={80}
          />

          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <MacroListItem macro="Fat" color={colors.get("fat")} />
            <MacroListItem
              macro="Carbohydrates"
              color={colors.get("carbohydrates")}
            />
            <MacroListItem macro="Protein" color={colors.get("protein")} />
            <MacroListItem macro="Calories" color={colors.get("calories")} />
          </View>
        </View>

        <View style={{ gap: 10, padding: 10 }}>
          {meals.map((meal) => (
            <MealDrawer key={meal.id} mealName={meal.name} />
          ))}
        </View>
      </ScrollView>
      <DateBanner />
    </>
  );
}

StyleSheet;
