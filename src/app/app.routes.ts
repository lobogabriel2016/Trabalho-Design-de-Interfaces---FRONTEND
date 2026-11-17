import { Routes } from '@angular/router';
import { MarcaCadastroComponent } from './pages/marca/marca-cadastro/marca-cadastro.component';

export const routes: Routes = [
  { path: 'marcas/novo', component: MarcaCadastroComponent },
  { path: '', redirectTo: 'marcas/novo', pathMatch: 'full' }
];