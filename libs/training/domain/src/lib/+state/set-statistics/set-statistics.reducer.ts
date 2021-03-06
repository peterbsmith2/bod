import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { SetStatisticsActions } from './actions';
import { SetStatistic } from '@bod/shared/models';

export const SETSTATISTICS_FEATURE_KEY = 'setStatistics';

export interface SetStatisticsState extends EntityState<SetStatistic> {
  selectedId?: string | number; // which SetStatistics record has been selected
  loaded: boolean; // has the SetStatistics list been loaded
  error?: string | null; // last known error (if any)
  ascendantsLoaded?: boolean;
}

export const setStatisticsAdapter: EntityAdapter<SetStatistic> = createEntityAdapter<
  SetStatistic
>();

export const initialState: SetStatisticsState = setStatisticsAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const setStatisticsReducer = createReducer(
  initialState,
  on(SetStatisticsActions.loadSetStatisticsWithAscendants, (state) => ({
    ...state,
    ascendantsLoaded: false
  })),
  on(SetStatisticsActions.loadSetStatisticsWithAscendantsSuccess, (state) => ({
    ...state,
    ascendantsLoaded: true
  })),
  on(SetStatisticsActions.loadSetStatistics, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(
    SetStatisticsActions.loadSetStatisticsSuccess,
    SetStatisticsActions.loadSetStatisticsBySessionItemStatisticSuccess,
    (state, { setStatistics }) =>
      setStatisticsAdapter.upsertMany(setStatistics, {
        ...state,
        loaded: true,
      })
  ),
  on(
    SetStatisticsActions.saveSetStatisticSuccess,
    SetStatisticsActions.updateSetStatistic,
    (state, { setStatistic }) =>
      setStatisticsAdapter.upsertOne(setStatistic, {
        ...state,
        loaded: true,
      })
  ),
  on(
    SetStatisticsActions.loadSetStatisticsFailure,
    (state, { error }) => ({ ...state, error })
  )
);

export function reducer(state: SetStatisticsState | undefined, action: Action) {
  return setStatisticsReducer(state, action);
}
