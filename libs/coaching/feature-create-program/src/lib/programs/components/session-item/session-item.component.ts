import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SessionItemData } from '@bod/coaching/domain';


@Component({
  selector: 'coaching-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss']
})
export class SessionItemComponent implements OnInit, OnDestroy {
  unsubscribe$: Subject<any> = new Subject();
  form: FormGroup = this.fb.group({
    reps: this.fb.control(0, [Validators.required]),
    AMRAP: this.fb.control(false, [Validators.required]),
    sets: this.fb.control(0, [Validators.required]),
    weight: this.fb.control(0, [Validators.required]),
    intensity: this.fb.control('', [Validators.required]),
    tempo: this.fb.control('', [Validators.required]),
    leftRight: this.fb.control(false, [Validators.required]),
  });
  public leftRight: boolean;

  private _data: SessionItemData;
  @Input()
  get data(): SessionItemData {
    return this._data;
  }
  set data(data: SessionItemData) {
    this._data = data;
    this.buildForm(data);
  }

  private _editable = true;
  @Input()
  get editable() {
    return this._editable;
  }
  set editable(editable) {
    if (!editable) {
      this.disableInputs();
    } else {
      this.enableInputs();
    }
  }

  @Output() update: EventEmitter<SessionItemData> = new EventEmitter();
  @Output() validate: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form.get('AMRAP').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      tap(amrap => {
        if (amrap) {
          this.form.get('reps').setValue(0);
          this.form.get('reps').disable();
        } else {
          this.form.get('reps').enable();
        }
      })
    ).subscribe();

    this.form.statusChanges
    .pipe(
      takeUntil(this.unsubscribe$),
      tap(status => {
        switch (status) {
          case 'VALID': {
            this.validate.emit(true);
            return;
          }
          default: {
            this.validate.emit(false);
            return;
          }
        }
      })
    )
    .subscribe();

    this.form.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged(),
      debounceTime(300),
      tap(value => {
        const data: SessionItemData = {
          ...this.data,
          sessionItem: {
            ...this.data.sessionItem,
            ...value
          }
        };
        this.update.emit(data);
      })
    ).subscribe();
  }

  buildForm(data: SessionItemData) {
    this.form.get('reps').setValue(data.sessionItem.reps || 0);
    this.form.get('AMRAP').setValue(data.sessionItem.AMRAP || false);
    this.form.get('sets').setValue(data.sessionItem.sets || 0);
    this.form.get('leftRight').setValue(data.sessionItem.leftRight || false);
    this.form.get('weight').setValue(data.sessionItem.weight || 0);
    this.form.get('intensity').setValue(data.sessionItem.intensity || '');
    this.form.get('tempo').setValue(data.sessionItem.tempo || '');
    this.leftRight = data.exercise.leftRight;
  }

  disableInputs() {
    this.form.disable();
  }

  enableInputs() {
    this.form.enable();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
