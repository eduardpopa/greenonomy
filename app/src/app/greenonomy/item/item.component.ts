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
import { GreenonomyService } from '../greenonomy.service';

@Component({
  selector: 'app-greenonomy-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
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
  ],
  providers: [GreenonomyService],
})
export class ItemComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    uri: ['', Validators.required],
  });
  constructor(
    private greenonomyService: GreenonomyService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {}
  onSubmit(): void {
    if (this.form.valid) {
      this.form.disable();
      const uri = this.form.value.uri || '';
      this.greenonomyService.createItem(uri).subscribe(() => {
        this.form.enable();
        this.form.reset();
        this.router.navigate(['/greenonomy']);
      });
    }
  }
}
