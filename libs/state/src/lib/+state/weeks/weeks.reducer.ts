import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as WeeksActions from './weeks.actions';
import { Week } from '@bod/models';

export const WEEKS_FEATURE_KEY = 'weeks';

export interface State extends EntityState<Week> {
  selectedId?: string | number; // which Weeks record has been selected
  loaded: boolean; // has the Weeks list been loaded
  error?: string | null; // last none error (if any)
}

export interface WeeksPartialState {
  readonly [WEEKS_FEATURE_KEY]: State;
}

export const weeksAdapter: EntityAdapter<Week> = createEntityAdapter<
  Week
>();

export const initialState: State = weeksAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const weeksReducer = createReducer(
  initialState,
  on(WeeksActions.loadWeeks, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(WeeksActions.loadWeeksSuccess, (state, { weeks }) =>
    weeksAdapter.addAll(weeks, { ...state, loaded: true })
  ),
  on(WeeksActions.loadWeeksFailure, (state, { error }) => ({ ...state, error })),
  on(WeeksActions.selectWeek, (state, { id }) => ({ ...state, selectedId: id }))
);

export function reducer(state: State | undefined, action: Action) {
  return weeksReducer(state, action);
}
