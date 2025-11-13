import { Routes } from '@angular/router';
import { CalculatorComponent } from './calculator/calculator';

export const routes: Routes = [
  {
    path: '',
    component: CalculatorComponent
  },
  {
    path: 'calculator',
    component: CalculatorComponent
  }
];
