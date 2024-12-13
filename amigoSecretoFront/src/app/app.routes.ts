import { Routes } from '@angular/router';
import { GruposComponent } from './components/grupos/grupos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'grupos', pathMatch: 'full' }, // Redireciona para  página
  { path: 'grupos', component: GruposComponent },
];
