import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Button, Colors, KeyboardAwareScrollView, Text, View } from 'react-native-ui-lib';
import { Portal } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getAllUnits } from 'database/queries/units/getAllUnits';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';

import { useColors } from 'context/ColorContext';

// components
import Dialogs from 'components/Shared/Dialogs';
import IconSVG from 'components/Shared/icons/IconSVG';
import UnitPicker from 'components/Shared/UnitPicker';
import MacrosBarChart from 'components/Screens/Create/MacrosBarChart';
import MacroInputField from 'components/Screens/Create/MacroInputField';

import { Food, Unit } from 'database/types';
import { getAllFoodNames } from 'database/queries/foods/getAllFoodNames';

import calculateCalories from 'utils/calculateCalories';
import { validateFoodInputs } from 'utils/validation/validateFood';
import { Validation, ValidationStatus } from 'utils/validation/types';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { createNutritable } from 'database/queries/nutritables/createNutritable';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'navigation';

type Props = StaticScreenProps<{
  food: Food;
  units: Unit[];
}>;

// (!!!) This screen produces a warning due to nesting UnitPicker inside a KeyboardAwareScrollView.
// Nevertheless, this is strictly necessary to avoid the keyboard from covering the bottom-most input fields.
export default function Add({ route }: Props) {
  const { food, units } = route.params;

  const colors = useColors();
  const database: SQLiteDatabase = useSQLiteContext();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Stateful nutritional data
  // (!) Attention: whenever kcals would be used, first check whether it has any input.
  // If it doesn't use expectedKcals instead for a smoother user experience.
  const [kcals, setKcals] = useState('');
  const [measure, setMeasure] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');

  // Calculates expected kcals
  const [expectedKcals, setExpectedKcals] = useState('');
  useEffect(() => {
    setExpectedKcals(
      calculateCalories(Number(protein), Number(carbs), Number(fat)).toFixed(2).toString()
    );
  }, [protein, carbs, fat]);

  // TODO: go back to  the db schema and manually set the ids for each unit.
  const [selectedUnit, setSelectedUnit] = useState<Unit>(units[0]);

  // Initializes the validation status
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [validation, setValidation] = useState<Validation>({
    status: ValidationStatus.Valid,
    errors: [],
  });

  // Resets the validation status
  const resetValidation = () => {
    setValidationAttempted(false);
    setValidation({
      status: ValidationStatus.Valid,
      errors: [],
    });
  };

  // Resets the validation status every time a field changes
  useEffect(resetValidation, [kcals, measure, fat, protein, carbs]);

  // Controls the showing of warnings and errors
  const [showDialogs, setShowDialogs] = useState(false);
  useEffect(() => {
    setShowDialogs(validation.status !== ValidationStatus.Valid);
  }, [validation]);

  return (
    <>
      {/* Using a portal is needed because the nested scrollViews mess up the Dialog component  */}
      <Portal.Host>
        <Portal>
          {/* Show the warnings here component is done */}
          <Dialogs show={showDialogs} setShow={setShowDialogs} errors={validation.errors} />
        </Portal>
        <KeyboardAwareScrollView
          behavior="padding"
          nestedScrollEnabled
          extraScrollHeight={160}
          contentContainerStyle={styles.container}>
          <View style={styles.nameBox}>
            <Text style={styles.name}>{food.name}</Text>
          </View>
          {/* Graph */}
          <MacrosBarChart fat={Number(fat)} carbs={Number(carbs)} protein={Number(protein)} />
          {/* Macros & Unit */}
          <View row gap-20>
            {/* Macros */}
            <View flex gap-20>
              {/* Fat */}
              <MacroInputField
                text={fat}
                onChangeText={(text) => setFat(text)}
                color={colors.get('fat')}
                unitSymbol={'g'}
                iconName={'bacon-solid'}
                maxLength={7}
              />
              {/* Carbs */}
              <MacroInputField
                text={carbs}
                onChangeText={(text) => setCarbs(text)}
                color={colors.get('carbs')}
                unitSymbol={'g'}
                iconName={'wheat-solid'}
                maxLength={7}
              />
              {/* Protein */}
              <MacroInputField
                text={protein}
                onChangeText={(text) => setProtein(text)}
                color={colors.get('protein')}
                unitSymbol={'g'}
                iconName={'meat-solid'}
                maxLength={7}
              />
            </View>
            {/* Unit */}
            <View style={styles.unitPickerFlex}>
              <View style={styles.unitIconBox}>
                <IconSVG width={24} name={'ruler-solid'} color={Colors.white} />
                <IconSVG style={styles.unitCaret} color={Colors.violet30} name="caret-down-solid" />
              </View>
              <UnitPicker units={units} onChange={(unit) => setSelectedUnit(unit)} />
            </View>
          </View>
          {/* Quantity & Calories */}
          <View spread gap-20>
            {/* Calories */}
            <MacroInputField
              text={kcals}
              onChangeText={(text) => setKcals(text)}
              unitSymbol={'kcal'}
              unitIndicatorWidth={60}
              iconName={'ball-pile-solid'}
              maxLength={9}
              placeholder={expectedKcals}
            />
            {/* Measure */}
            <MacroInputField
              text={measure}
              onChangeText={(text) => setMeasure(text)}
              unitSymbol={selectedUnit.symbol}
              unitIndicatorWidth={60}
              iconName={'scale-unbalanced-solid'}
              maxLength={7}
            />
          </View>
          {/* Submit Button */}
          <Button
            style={{ borderRadius: 12 }}
            disabled={validation.status === ValidationStatus.Error}
            label={validation.status === ValidationStatus.Warning ? 'Proceed anyway' : 'Add'}
            onPress={() => {
              // Validates the current data
              const tempValidationStatus: Validation = validateFoodInputs({
                name: food.name,
                existingNames: [], // funny workaround, I guess. Should work for now at least.
                kcals: kcals === '' ? expectedKcals : kcals,
                expectedKcals,
                measure,
              });
              // If it is valid OR if it has only warnings but the user still wishes to proceed...
              if (
                tempValidationStatus.status === ValidationStatus.Valid ||
                (tempValidationStatus.status === ValidationStatus.Warning && validationAttempted)
              ) {
                // Creates the nutritable and redirects to the foods list
                createNutritable(database, {
                  foodId: food.id,
                  unitId: selectedUnit.id,
                  measure: Number(measure),
                  kcals: Number(kcals),
                  protein: Number(protein),
                  carbs: Number(carbs),
                  fats: Number(fat),
                });
                navigation.pop();
              } else {
                // Makes this validation result available to the rest of the program.
                setValidation(tempValidationStatus);
                // And signals the validation as attempted (this way we know if the user has already been warned)
                setValidationAttempted(true);
              }
            }}
          />
          {/* </View> */}
        </KeyboardAwareScrollView>
      </Portal.Host>
    </>
  );
}

const styles = StyleSheet.create({
  nameBox: {
    backgroundColor: Colors.violet30,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  name: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  unitPickerFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
    width: 128,
    gap: 8,
  },
  unitIconBox: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.violet30,
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  unitCaret: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
    right: -20,
    zIndex: 1,
  },
  nameField: {
    backgroundColor: Colors.violet30,
    height: 60,
    borderRadius: 20,
  },
  nameInput: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  container: {
    gap: 20,
    padding: 20,
  },
});
