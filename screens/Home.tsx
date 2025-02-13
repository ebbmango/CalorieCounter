import React, { useEffect, useMemo, useState } from 'react';
import { addDatabaseChangeListener, SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { Colors, View } from 'react-native-ui-lib';
import { Dimensions, Pressable, ScrollView, StyleSheet } from 'react-native';

// Custom Hooks
import { useColors, MacroColors } from 'context/ColorContext';
import { useDate } from 'context/DateContext';

// Utils
import { formatDate } from 'utils/formatDate';
import getAllMeals from 'database/queries/meals/getAllMeals';

// Components
import PieChart from 'components/Screens/Home/PieChart';
import IconSVG from 'components/Shared/icons/IconSVG';
import MealDrawer from 'components/Screens/Home/MealDrawer';
import MacroOverview from 'components/MacroOverview';
import MacroLegendItem from 'components/Screens/List/MacroLegendItem';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useMealSummaries } from 'context/SummariesContext';
import toCapped from 'utils/toCapped';
import { useMeals } from 'database/hooks/useMeals';

type MacroName = keyof MacroColors;

export default function Home() {
  // SECTION 1: UI

  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;

  // SECTION 2: Title and Date Picker

  const date = useDate();
  // const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDatePickerVisible(false);
      date.set(selectedDate);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: formatDate(date.get()),
      headerRight: () => (
        <Pressable onPress={() => setDatePickerVisible(true)}>
          <IconSVG
            name="calendar-1"
            width={32}
            style={{ marginRight: 8 }}
            color={Colors.violet40}
          />
        </Pressable>
      ),
    });
  }, [navigation, date]);

  // SECTION 3: Database Logic

  const database: SQLiteDatabase = useSQLiteContext();

  const { meals } = useMeals({ database });
  const { Day } = useMealSummaries();

  const macronutrients: { name: MacroName; grams: number }[] = [
    { name: 'fat', grams: Day.fat },
    { name: 'protein', grams: Day.protein },
    { name: 'carbs', grams: Day.carbs },
  ];

  // Adding insignificant data to ensure the drawing of the graph even for empty macros
  const chartData = [...macronutrients.map((macro) => macro.grams), 0.0001];
  const chartColors = [...macronutrients.map((macro) => colors.get(macro.name)), Colors.grey50];

  // TODO: Make this whole thing a separate component
  const macroItems = [
    {
      color: colors.get('fat'),
      iconName: 'bacon-solid',
      amount: toCapped(Day.fat, 2),
    },
    {
      color: colors.get('carbs'),
      iconName: 'wheat-solid',
      amount: toCapped(Day.carbs, 2),
    },
    {
      color: colors.get('protein'),
      iconName: 'meat-solid',
      amount: toCapped(Day.protein, 2),
    },
    {
      color: colors.get('kcals'),
      iconName: 'ball-pile-solid',
      amount: toCapped(Day.kcals, 2),
    },
  ] as const;

  // SECTION 4: Component itself
  return (
    <>
      {/* Modal */}
      {isDatePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date.get()}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
        }}>
        {/* Top-level macronutrients' overview */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          {macroItems.map((macro, index) => (
            <MacroOverview
              key={index}
              color={macro.color}
              iconName={macro.iconName}
              amount={macro.amount}
            />
          ))}
        </View>
        {/* Piechart and Legend Box*/}
        <View
          style={{
            flexDirection: 'row',
            width: screenWidth * 0.8,
            gap: 24,
            marginVertical: 24,
          }}>
          {/* Chart */}
          <PieChart data={chartData} colors={chartColors} innerRadius={50} outerRadius={80} />
          {/* Chart's legend */}
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <MacroLegendItem macro="Fat" color={colors.get('fat')} />
            <MacroLegendItem macro="Carbohydrates" color={colors.get('carbs')} />
            <MacroLegendItem macro="Protein" color={colors.get('protein')} />
            <MacroLegendItem macro="Calories" color={colors.get('kcals')} />
          </View>
        </View>
        {/* Meals' List */}
        <View style={{ gap: 10, paddingTop: 10, paddingBottom: 40 }}>
          {meals.map((meal) => {
            return <MealDrawer key={meal.id} meal={meal} />;
          })}
        </View>
      </ScrollView>
    </>
  );
}

StyleSheet;
