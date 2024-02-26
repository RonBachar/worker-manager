import { Routes } from '@angular/router';
import { ManagerComponent } from './pages/manager/manager.component';
import { AboutComponent } from './pages/about/about.component';
import { HomepageComponent } from './pages/homepage/homepage.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'manage', component: ManagerComponent },
  { path: 'about', component: AboutComponent },
];
