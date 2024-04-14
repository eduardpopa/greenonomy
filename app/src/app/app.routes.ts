import { Routes } from '@angular/router';
import { AlumniListComponent } from './alumni/list/list.component';
import { AlumniAlumnComponent } from './alumni/alumn/alumn.component';
import { HomeComponent } from './greenonomy/home/home.component';
import { ItemComponent } from './greenonomy/item/item.component';
import { InviteComponent } from './greenonomy/invite/invite.component';

export const routes: Routes = [
  { path: 'alumni', component: AlumniListComponent },
  { path: 'alumni/create', component: AlumniAlumnComponent },
  { path: 'alumni/:id/edit', component: AlumniAlumnComponent },
  { path: 'greeenonomy', component: HomeComponent },
  { path: 'greeenonomy/invite', component: InviteComponent },
  { path: 'greeenonomy/create', component: ItemComponent },
  { path: '**', redirectTo: 'greeenonomy' },
];
