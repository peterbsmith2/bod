import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { WeeksPageActions } from './actions';
import { Week } from '@bod/shared/models';

export const WEEKS_FEATURE_KEY = 'weeks';

export interface WeeksState extends EntityState<Week> {
  selectedId?: string | number; // which Weeks record has been selected
  loaded: boolean; // has the Weeks list been loaded
  error?: string | null; // last none error (if any)
}

export const weeksAdapter: EntityAdapter<Week> = createEntityAdapter<Week>();

export const initialState: WeeksState = weeksAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

export const weeksReducer = createReducer(
  initialState,
  on(WeeksPageActions.loadWeek, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(WeeksPageActions.selectWeek, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),
  on(WeeksPageActions.loadWeekSuccess, (state, { week }) =>
    weeksAdapter.setOne(week, { ...state, loaded: true, selectedId: week.id })
  )
);

export function reducer(state: WeeksState | undefined, action: Action) {
  return weeksReducer(state, action);
}
