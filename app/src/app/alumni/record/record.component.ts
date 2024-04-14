import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDatepickerModule,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Record } from '../alumni.models';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],

  templateUrl: './record.component.html',
  styleUrl: './record.component.css',
})
export class RecordComponent {
  private formBuilder = inject(FormBuilder);
  form: FormGroup;
  @Input() set record(value: Record) {
    this.form = this.formBuilder.group({
      name: [value ? value.name : '', Validators.required],
      fromDate: [value ? value.fromDate : null],
      toDate: [
        {
          value: value ? value.toDate : null,
          disabled: value ? (value.fromDate ? false : true) : true,
        },
      ],
    });

    if (!!value?.fromDate) {
      this.minToDate = value.fromDate;
    }
  }

  @Output() submitted: EventEmitter<Record> = new EventEmitter<Record>();
  @Output() canceled: EventEmitter<void> = new EventEmitter<void>();
  minToDate: Date | null | undefined;
  maxFromDate: Date | null | undefined;
  minFromDate: Date | null | undefined;
  maxToDate: Date | null | undefined;
  constructor() {
    this.minFromDate = new Date(1970, 1, 1);
    this.maxFromDate = new Date();
    this.minToDate = new Date(1970, 1, 1);
    this.maxToDate = new Date();
  }
  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit({
        name: this.form.value.name || '',
        fromDate: this.form.value.fromDate,
        toDate: this.form.value.toDate,
      });
      this.form.reset();
    }
  }
  onCancel() {
    this.canceled.emit();
  }
  onFromDateChanged(event: MatDatepickerInputEvent<Date>) {
    this.minToDate = event.value;
    if (!event.value) {
      this.form.controls['toDate'].disable();
    } else {
      this.form.controls['toDate'].enable();
    }
  }
  onToDateChanged(event: MatDatepickerInputEvent<Date>) {
    this.maxFromDate = event.value;
  }
}
