import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingDomainModule } from '@bod/training/domain';
import { StatisticsPage } from './pages/statistics/statistics.page';
import { TrainingFeatureReviewStatisticsRoutingModule } from './training-feature-review-statistics-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ExercisesPage } from './pages/exercises/exercises.page';
import { BodComponentsModule } from '@bod/shared/components';
import { ExercisePage } from './pages/exercise/exercise.page';
import { WeekStatisticsPage } from './pages/week-statistics/week-statistics.page';
import { ReactiveComponentModule } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { WindowRef } from './window-ref.service';
import { MatButtonModule } from '@angular/material/button';
import { SessionItemStatisticCardComponent } from './components/session-item-statistic-card/session-item-statistic-card.component';

@NgModule({
  imports: [
    CommonModule,
    TrainingDomainModule,
    TrainingFeatureReviewStatisticsRoutingModule,
    BodComponentsModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    NgxChartsModule,
    MatButtonModule,
    ReactiveComponentModule,
  ],
  declarations: [
    StatisticsPage,
    ExercisesPage,
    ExercisePage,
    WeekStatisticsPage,
    SessionItemStatisticCardComponent,
  ],
  exports: [],
  providers: [WindowRef],
})
export class TrainingFeatureReviewStatisticsModule {}
