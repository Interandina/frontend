import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Componentes/home/home.component';
// import { UsersComponent } from './Componentes/users/users.component';
import { UsersComponent } from './Componentes/users/users.component';
import { ClientsComponent } from './Componentes/clients/clients.component';
import { GroupsComponent } from './Componentes/groups/groups.component';
import { DocumentsComponent } from './Componentes/documents/documents.component';
import { SealsComponent } from './Componentes/seals/seals.component';
import { DocdoComponent } from './Componentes/docdo/docdo.component';
import { HvQueryComponent } from './Componentes/hv-query/hv-query.component';
import { HvFinalComponent } from './Componentes/hv-final/hv-final.component';
import { HvDocaduanaComponent } from './Componentes/hv-docaduana/hv-docaduana.component';
import { CPasswordComponent } from './Componentes/c-password/c-password.component';
import { ResetPassComponent } from './Componentes/reset-pass/reset-pass.component';
import { ParamComponent } from './Componentes/param/param.component';
import { HvClientComponent } from './Componentes/hv-client/hv-client.component';
import { HvReviewComponent } from './Componentes/hv-review/hv-review.component';
import { DocanexosComponent } from './Componentes/docanexos/docanexos.component';
import { DownloaddocsComponent } from './Componentes/downloaddocs/downloaddocs.component';
import { HvClientListComponent } from './Componentes/hv-client-list/hv-client-list.component';
import { CalendarComponent } from './Componentes/calendar/calendar.component';

const routes: Routes = [ { path: '', component: HomeComponent, pathMatch: 'full' },
{ path: 'settings_users', component: UsersComponent,  data: { title: 'holamundo' }},
{ path: 'settings_clients', component: ClientsComponent },
{ path: 'settings_groups', component: GroupsComponent },
{ path: 'settings_documents', component: DocumentsComponent },
{ path: 'settings_seals', component: SealsComponent },
{ path: 'settings_docdo', component: DocdoComponent },
// { path: 'hv_clients', component: HvClientComponent },
{ path: 'settings_calendar', component: CalendarComponent },
{ path: 'hv_clients', component: HvClientListComponent },
{ path: 'hv_query', component: HvQueryComponent },
{ path: 'hv_final', component: HvFinalComponent },
{ path: 'hv_review', component: HvReviewComponent },
{ path: 'hv_docaduana', component: HvDocaduanaComponent },
{ path: 'change_password', component: CPasswordComponent },
{ path: 'resetPassword', component: ResetPassComponent },
{ path: 'settings_enviroments', component: ParamComponent },
{ path: 'settings_docanexos', component: DocanexosComponent },
{ path: 'downloaddocs', component: DownloaddocsComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(router: Router) {
    //Si no se accede por routelink, lo devuelve al index cuando el cliente acceda por url
    if(sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined)
      router.navigateByUrl("");
  }
}
