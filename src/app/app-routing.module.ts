import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateApplicationComponent } from './create-application/create-application.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import {SettingsComponent} from "./settings/settings.component";
import {HomeComponent} from './home/home.component';
import { LoginComponent } from './login/login.component';
import {AuthGuardService} from './auth-guard.service';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {
    path: 'home', component: HomeComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'create-application', component: CreateApplicationComponent },
      { path: 'edit-application', component: EditApplicationComponent },
      { path: 'settings', component: SettingsComponent }]
  },
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
