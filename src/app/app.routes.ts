import { Routes } from '@angular/router';
import { FormularioComponent } from './formulario/formulario.component';

export const routes: Routes = [
  {
    path: 'formulario',
    // loadComponent: () => import('./ruta-al-componente/formulario.component').then(m => m.FormularioComponent)
    component: FormularioComponent,
  },
];
