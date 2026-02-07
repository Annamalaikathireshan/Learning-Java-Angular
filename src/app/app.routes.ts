import { Routes } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';
import { LearningHubComponent } from './components/learning-hub/learning-hub.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ValentineComponent } from './components/valentine/valentine.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: 'learning', component: LearningHubComponent },
    { path: 'valentine', component: ValentineComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
