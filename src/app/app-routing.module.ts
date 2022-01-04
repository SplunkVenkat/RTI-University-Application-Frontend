import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateApplicationComponent } from './create-application/create-application.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [
  { path: 'create-application', component: CreateApplicationComponent },
  { path: 'edit-application', component: EditApplicationComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
