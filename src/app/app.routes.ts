import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { CreateTask } from './components/create-task/create-task';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'create', component: CreateTask },
    { path: '**', redirectTo: '' }
];
