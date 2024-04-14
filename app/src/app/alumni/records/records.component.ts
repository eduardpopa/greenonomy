import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, AsyncPipe, NgFor, UpperCasePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { RecordComponent } from '../record/record.component';
import { Record } from '../alumni.models';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    MatListModule,
    RecordComponent,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css',
})
export class RecordsComponent {
  @Input() title: string;
  @Input() createTitle: string;
  @Input() icon: string;
  @Input() records: Record[];
  @Output() changed: EventEmitter<Record[]> = new EventEmitter();
  constructor(public dialog: MatDialog) {}
  onAddRecord() {
    if (!this.records) {
      this.records = [];
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: this.createTitle,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.records.push(result);
        this.changed.emit([...this.records]);
      }
    });
  }
  onRecordRemove(index: number) {
    this.records.splice(index, 1);
    this.changed.emit([...this.records]);
  }
  onRecordEdit(index: number) {
    const record = this.records[index];
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Edit ${record.name}.`,
        record: record,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.records[index] = result;
        this.changed.emit([...this.records]);
      }
    });
  }
}
