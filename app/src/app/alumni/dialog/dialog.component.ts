import { Component, Inject, Input } from '@angular/core';
import { Record } from '../alumni.models';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { RecordComponent } from '../record/record.component';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, RecordComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { record: Record; title: string }
  ) {}

  onRecordSubmited(record: Record) {
    this.dialogRef.close(record);
  }
  onRecordCanceled() {
    this.dialogRef.close();
  }
}
