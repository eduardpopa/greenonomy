import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgFor, UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, catchError, map, first, of, Subscription } from 'rxjs';
import { AlumniService } from '../alumni.service';
import { Alumn } from '../alumni.models';

@Component({
  selector: 'app-alumni-list',
  standalone: true,
  imports: [
    RouterModule,
    MatExpansionModule,
    MatIconModule,
    MatDividerModule,
    NgFor,
    DatePipe,
    UpperCasePipe,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
  ],
  providers: [AlumniService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class AlumniListComponent implements OnInit, OnDestroy {
  panelOpenState: boolean;
  alumni: Alumn[];
  alumniSub: Subscription;
  constructor(private alumniService: AlumniService) {}
  ngOnInit(): void {
    this.alumniSub = this.alumniService.list().subscribe((data) => {
      this.alumni = data;
    });
  }
  ngOnDestroy(): void {
    this.alumniSub.unsubscribe();
  }
  onDelete(id: string) {
    if (
      confirm('Are you sure to delete? [Better UI with Angular Dialog ...]')
    ) {
      this.alumniService
        .delete(id)
        .pipe(
          first(),
          catchError((err) => {
            console.log('ERROR:', err);
            return of(true);
          })
        )
        .subscribe((result) => {
          if (result) {
            const idx = this.alumni.findIndex((item) => item.id === id);
            this.alumni.splice(idx, 1);
          }
        });
    }
  }
}
