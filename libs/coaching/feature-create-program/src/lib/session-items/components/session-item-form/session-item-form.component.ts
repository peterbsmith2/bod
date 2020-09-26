import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SessionItemFormData } from '@bod/coaching/domain';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SessionItem } from '@bod/shared/models';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'coaching-session-item-form',
  templateUrl: './session-item-form.component.html',
  styleUrls: ['./session-item-form.component.scss'],
})
export class SessionItemFormComponent implements OnInit, OnDestroy {
  unsubscribe$: Subject<any> = new Subject();
  editing = false;
  private _data: SessionItemFormData;
  @Input()
  get data(): SessionItemFormData {
    return this._data;
  }
  set data(data: SessionItemFormData) {
    this._data = data;
    this.form = this.buildForm(data);
    this.exerciseForm = this.buildExerciseForm(data);
  }
  @Output() save: EventEmitter<Partial<SessionItem>> = new EventEmitter();
  form: FormGroup = this.fb.group({
    reps: 0,
    AMRAP: false,
    leftRight: false,
    sets: false,
    weight: 0,
    weightUnit: 'lbs',
    intensity: this.fb.control('', Validators.required),
    tempo: '',
    order: null,
  });

  exerciseForm: FormGroup = this.fb.group({
    id: '',
  });

  get intensities() {
    return <FormArray>this.form.get('intensities');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form
      .get('AMRAP')
      .valueChanges.pipe(
        takeUntil(this.unsubscribe$),
        tap((amrap) => {
          if (amrap) {
            this.form.get('reps').setValue(0);
            this.form.get('reps').disable();
          } else {
            this.form.get('reps').setValue(this.data.sessionItem.reps);
            this.form.get('reps').enable();
          }
        })
      )
      .subscribe();
  }

  buildForm(data: SessionItemFormData) {
    return this.fb.group({
      reps: this.fb.control(data.sessionItem.reps),
      AMRAP: this.fb.control(data.sessionItem.AMRAP),
      leftRight: this.fb.control(false),
      sets: this.fb.control(data.sessionItem.sets),
      weight: this.fb.control(data.sessionItem.weight),
      weightUnit: 'lbs',
      intensity: this.fb.control(
        data.sessionItem.intensity,
        Validators.required
      ),
      tempo: this.fb.control(data.sessionItem.tempo),
    });
  }

  buildExerciseForm(data: SessionItemFormData) {
    return this.fb.group({
      id: this.fb.control(data.sessionItem.exerciseId),
    });
  }

  addIntensity() {
    this.intensities.push(
      this.fb.group({
        name: this.fb.control(''),
      })
    );
  }

  onRemoveIntensity(index: number) {
    this.intensities.removeAt(index);
  }

  onSubmit(form) {
    this.save.emit({
      ...form,
      id: this.data.sessionItem.id,
      order: this.data.sessionItem.order,
    });
  }

  onSaveExercise(value) {
    const defaultIntensity = this.data.exercises.find((e) => e.id === value.id)
      .intensities[0];
    this.save.emit({
      exerciseId: value.id,
      id: this.data.sessionItem.id,
      intensity: defaultIntensity,
    });
    this.editing = false;
    this.form.enable();
  }

  onEditExercise() {
    this.exerciseForm = this.buildExerciseForm(this.data);
    this.editing = true;
    this.form.disable();
  }

  onCancelExercise() {
    this.editing = false;
    this.form.enable();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
