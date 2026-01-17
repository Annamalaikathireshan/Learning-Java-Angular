import { Routes } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';
import { LearningHubComponent } from './components/learning-hub/learning-hub.component';

export const routes: Routes = [
    { path: 'employees', component: EmployeesComponent },
    { path: 'learning', component: LearningHubComponent },
    { path: '', redirectTo: 'employees', pathMatch: 'full' }
];
