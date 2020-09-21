import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, combineLatest, Subject } from 'rxjs';
import {
  SessionsFacade,
  SessionItemsFacade,
  SessionItemStatisticsActions,
  SetStatisticsActions,
  SessionItemStatisticsFacade,
  SetStatisticsFacade,
  ExercisesFacade,
  ExercisesApiActions,
  SessionItemBoardCardData,
  SessionItemCardOutput,
} from '@bod/training/domain';
import {
  SessionItem,
  Pages,
  SessionItemStatistic,
  SetStatistic,
} from '@bod/shared/models';
import { distinctUntilChanged, distinctUntilKeyChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'training-session-item',
  templateUrl: './session-item.page.html',
  styleUrls: ['./session-item.page.scss'],
})
export class SessionItemPage implements OnInit, OnDestroy {
  unsubscribe$: Subject<any> = new Subject();
  data$: Observable<SessionItemBoardCardData>;
  sessionItem$: Observable<SessionItem>;
  sessionItemStatistic$: Observable<SessionItemStatistic>;
  setStatistics$: Observable<SetStatistic[]>;
  sessionItemsLoaded$: Observable<boolean>;
  pages$: Observable<Pages>;

  constructor(
    private exercisesState: ExercisesFacade,
    private sessionsState: SessionsFacade,
    private sessionItemsState: SessionItemsFacade,
    private sessionItemStatisticsState: SessionItemStatisticsFacade,
    private route: ActivatedRoute
  ) {
    this.sessionItemsLoaded$ = this.sessionsState.allSessionItems$.pipe(
      filter((sessions) => !!sessions),
      map((sessions) => sessions.every((s) => s))
    );
    this.data$ = combineLatest([
      this.exercisesState.selectedExercises$,
      this.sessionItemsState.selectedSessionItems$,
      this.sessionItemStatisticsState.selectedSessionItemStatistics$,
      this.sessionItemStatisticsState.setStatistics$,
    ]).pipe(
      map(([exercise, sessionItem, sessionItemStatistic, setStatistics]) => ({
        exercise,
        sessionItem,
        sessionItemStatistic,
        setStatistics,
      }))
    );
  }

  ngOnInit(): void {
    this.sessionItemsState.selectedSessionItems$
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((sessionItem) => {
          this.sessionsState.dispatch(
            ExercisesApiActions.loadExercise({ id: sessionItem.exerciseId })
          );
          this.sessionsState.dispatch(
            ExercisesApiActions.selectExercise({ id: sessionItem.exerciseId })
          );
        })
      )
      .subscribe();

    this.sessionItemStatisticsState.selectedSessionItemStatistics$.pipe(
      takeUntil(this.unsubscribe$),
      filter((s) => !!s),
      distinctUntilKeyChanged('id'),
      tap(({ id }) => {
        this.sessionsState.dispatch(
          SetStatisticsActions.loadSetStatisticsBySessionItemStatistic({ id })
        );
      })
    ).subscribe();
    this.route.params
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((params) => {
          this.sessionsState.dispatch(
            SessionItemStatisticsActions.loadSessionItemStatisticBySessionItem({
              id: +params['sessionItemId'],
            })
          );
        })
      )
      .subscribe();
  }

  onSave(output: SessionItemCardOutput) {
    const { sessionItemStatistic, setStatistics } = output;
    /**
     * if there is an id, update the session item statistic
     * else, save a new session item statistic
     */
    if (sessionItemStatistic.id) {
      this.sessionsState.dispatch(
        SessionItemStatisticsActions.updateSessionItemStatistic({
          sessionItemStatistic,
        })
      );
    } else {
      this.sessionsState.dispatch(
        SessionItemStatisticsActions.saveSessionItemStatistic({
          sessionItemStatistic,
        })
      );
    }
    setStatistics.forEach((setStatistic) => {
      if (setStatistic.id) {
        this.sessionsState.dispatch(
          SetStatisticsActions.updateSetStatistic({ setStatistic })
        );
      } else {
        this.sessionsState.dispatch(
          SetStatisticsActions.saveSetStatistic({ setStatistic })
        );
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
