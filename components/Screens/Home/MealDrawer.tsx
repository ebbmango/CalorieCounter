import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { ExpandableSection, Text, View, Colors, Button, Drawer, Icon } from 'react-native-ui-lib';

import IconSVG from '../../Shared/icons/IconSVG';
import RotatingCaret from './RotatingCaret';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import { EntryListing, Food, Meal } from 'database/types';
import { addDatabaseChangeListener, SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useQuery } from '@tanstack/react-query';
// import { deleteEntry, getEntriesByMealAndDate } from 'database/queries/entriesQueries';

import { useDate } from 'context/DateContext';
import { getNutritablesByIds } from 'database/queries/nutritables/getNutritablesByIds';
import { getFoodsByIds } from 'database/queries/foods/getFoodsByIds';
import proportion from 'utils/proportion';
import { getAllUnits } from 'database/queries/units/getAllUnits';
import useUnits from 'database/hooks/useUnits';
import { deleteEntry } from 'database/queries/entries/deleteEntry';
import { getEntriesByMealAndDate } from 'database/queries/entries/getEntriesByMealAndDate';
import { getEntriesListing } from 'database/queries/entries/getEntriesListing';

type MealDrawerProps = {
  meal: Meal;
};

type DrawerHeaderProps = {
  mealName: string;
  expanded: boolean;
};

type DrawerBodyProps = {
  meal: Meal;
  listings: EntryListing[];
};

export default function MealDrawer({ meal }: MealDrawerProps) {
  const [expanded, setExpanded] = useState(false);

  const date = useDate();
  const database: SQLiteDatabase = useSQLiteContext();

  // FETCHING all relevant ENTRIES
  const {
    data: entries = [],
    refetch: refetchEntries,
    isFetched: entriesFetched,
    isLoading: entriesLoading,
  } = useQuery({
    queryKey: [meal, `entries`],
    queryFn: () => getEntriesListing(database, { date: date.get(), mealId: meal.id }),
    initialData: [],
  });

  useEffect(() => {
    refetchEntries();
  }, [date.get()]);

  useEffect(() => {
    const listener = addDatabaseChangeListener((change) => refetchEntries());
    return () => {
      listener.remove();
    };
  });

  return (
    <ExpandableSection
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      sectionHeader={<DrawerHeader mealName={meal.name} expanded={expanded} />}>
      <DrawerBody meal={meal} listings={entries} />
    </ExpandableSection>
  );
}

// This is the header for each meal's drawer.
// It should contain: kcals overview, meal name, caret.
function DrawerHeader({ expanded, mealName }: DrawerHeaderProps) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View
      style={[
        styles.sectionHeader,
        {
          width: screenWidth * 0.8,
          borderBottomLeftRadius: expanded ? 0 : 10,
          borderBottomRightRadius: expanded ? 0 : 10,
        },
      ]}>
      <View>{/* kcals overview comes here */}</View>
      <Text grey10 text70>
        {mealName}
      </Text>
      <RotatingCaret
        size={16}
        rotated={expanded}
        color={expanded ? Colors.grey50 : Colors.grey20}
      />
    </View>
  );
}

// This is the body for each meal's drawer.
// It should contain: each food, its amount, its caloric total; "add food" button.
function DrawerBody({ meal, listings }: DrawerBodyProps) {
  const database: SQLiteDatabase = useSQLiteContext();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.sectionBody}>
      {/* Each entry COMES HERE*/}
      {listings.map(
        (listing) =>
          listing && (
            <View flex row center style={{ overflow: 'visible', gap: 6 }} key={listing.entryId}>
              {listing.nutritableDeleted ? (
                <IconSVG
                  name="triangle-exclamation-solid"
                  width={20}
                  color={Colors.violet40}
                  style={{
                    marginVertical: 'auto',
                  }}
                />
              ) : null}
              <Drawer
                disableHaptic
                itemsTintColor=""
                style={{ flex: 1, borderRadius: 100 }}
                bounciness={100}
                fullSwipeRight
                onFullSwipeRight={() => deleteEntry(database, { entryId: listing.entryId })}
                rightItems={[
                  {
                    customElement: (
                      <View centerH>
                        <IconSVG
                          name="trash-circle-solid"
                          color={Colors.violet40}
                          width={28}
                          // style={{ marginRight: 2 }}
                        />
                      </View>
                    ),
                    style: { borderRadius: 100 },
                    background: Colors.grey80,
                    onPress: () => {
                      deleteEntry(database, { entryId: listing.entryId });
                    },
                  },
                ]}>
                <View
                  row
                  key={listing.entryId}
                  style={{
                    flex: 1,
                    width: screenWidth * 0.8 * 0.88 - (listing.nutritableDeleted ? 26 : 0),
                  }}>
                  <View
                    flex
                    style={{
                      // width:
                      paddingStart: 20,
                      paddingEnd: 8,
                      backgroundColor: Colors.violet80,
                      paddingVertical: 8,
                      borderTopStartRadius: 100,
                      borderBottomStartRadius: 100,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                    {/* <Text violet40>{`${entry.kcals} kcal `}</Text> */}
                    <Text style={{ flex: 1, fontSize: 16 }}>{listing.foodName}</Text>
                    <Text violet50>{`${listing.amount}${listing.unitSymbol}`}</Text>
                  </View>
                  <View
                    row
                    center
                    style={{
                      backgroundColor: Colors.violet50,
                      borderTopEndRadius: 100,
                      borderBottomEndRadius: 100,
                      minWidth: 68,
                      paddingEnd: 12,
                      paddingStart: 8,
                      paddingVertical: 4,
                      gap: 4,
                    }}>
                    <IconSVG name="ball-pile-solid" color={Colors.violet40} width={12} />
                    <Text violet40>{listing.kcals}</Text>
                  </View>
                </View>
              </Drawer>
            </View>
          )
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('List', { meal })}
        style={{
          flex: 1,
          width: 40,
          height: 40,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.violet70,
        }}>
        <IconSVG name={'plus-solid'} width={16} color={Colors.violet40} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    height: 'auto',
    backgroundColor: Colors.white,
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionBody: {
    gap: 8,
    backgroundColor: Colors.grey80,
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
