import { Component, OnInit } from '@angular/core';
import { Program } from '@bod/models';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { ProgramsPartialState } from '../../+state/programs.reducer';
import { getAllPrograms } from '../../+state/programs.selectors';
import { loadPrograms } from '../../+state/programs.actions';

@Component({
  selector: 'bod-programs',
  templateUrl: './programs.page.html',
  styleUrls: ['./programs.page.scss']
})
export class ProgramsPage implements OnInit {
  unsubscribe$: Subject<any> = new Subject();
  programs$: Observable<Program[]>;
  constructor(
    private store: Store<ProgramsPartialState>,
  ) {
    this.store.dispatch(loadPrograms());
  }

  ngOnInit(): void {
    this.programs$ = this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(getAllPrograms)
      );
  }

}
