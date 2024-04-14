import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { catchError, map, switchMap, first, Observable, filter } from 'rxjs';

import { RecordComponent } from '../record/record.component';
import { Record, Alumn } from '../alumni.models';
import { AlumniService } from '../alumni.service';
import { RecordsComponent } from '../records/records.component';

@Component({
  selector: 'app-alumni-alumn',
  templateUrl: './alumn.component.html',
  styleUrl: './alumn.component.css',
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
    RecordComponent,
    RecordsComponent,
  ],
  providers: [AlumniService],
})
export class AlumniAlumnComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    description: [''],
  });
  alumn: Alumn;
  constructor(
    private alumniService: AlumniService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.alumn = { firstName: '', lastName: '' };
  }
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter((params) => params['id'] !== undefined),
        switchMap((params) => {
          const id: string = params['id'];
          return this.alumniService.get(id).pipe(
            map((alumn) => {
              this.alumn = alumn;
              this.form.patchValue(alumn);
            })
          );
        })
      )
      .subscribe();
  }
  onSubmit(): void {
    if (this.form.valid) {
      this.form.disable();
      this.alumn.firstName = this.form.value.firstName || '';
      this.alumn.lastName = this.form.value.lastName || '';
      this.alumn.description = this.form.value.description;
      let obs$: Observable<Alumn>;
      if (this.alumn.id) {
        obs$ = this.alumniService.update(this.alumn);
      } else {
        obs$ = this.alumniService.add(this.alumn);
      }
      obs$
        .pipe(
          first(),
          catchError((err) => {
            this.form.enable();
            return err;
          })
        )
        .subscribe(() => {
          this.form.enable();
          this.form.reset();
          this.router.navigate(['/alumni']);
        });
    }
  }
  onWorkplacesChanged(records: Record[]) {
    this.alumn.workplaces = [...records];
  }
  onStudiesChanged(records: Record[]) {
    this.alumn.studies = [...records];
  }
}
