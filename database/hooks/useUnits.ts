import { useQuery } from '@tanstack/react-query';
import { SQLiteDatabase } from 'expo-sqlite';
import { getAllUnits } from 'database/queries/units/getAllUnits';
import { Unit } from 'database/types';

type unitsData = {
    units: Unit[];
    unitsFetched: boolean;
    unitsLoading: boolean;
}

const useUnits = (database: SQLiteDatabase): unitsData => {
    const {
        data: units,
        isFetched: unitsFetched,
        isLoading: unitsLoading,
    } = useQuery({
        queryKey: [`allUnits`],
        queryFn: () => getAllUnits(database),
        initialData: [],
    });

    return { units, unitsFetched, unitsLoading };
}

export default useUnits