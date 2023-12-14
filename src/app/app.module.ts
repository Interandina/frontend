import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
/*Componentes*/
import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './Componentes/nav-menu/nav-menu.component';
import { HomeComponent } from './Componentes/home/home.component';
import { DialogLoginComponent } from './Componentes/dialog-login/dialog-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*Materials*/
import { MaterialModule } from './Componentes/material/material.module';
/*Others*/
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientsComponent } from './Componentes/clients/clients.component';
import { ClientsFormComponent } from './Componentes/clients-form/clients-form.component';
import { GroupsComponent } from './Componentes/groups/groups.component';
import { DocumentsComponent } from './Componentes/documents/documents.component';
import { SealsComponent } from './Componentes/seals/seals.component';
import { DocdoComponent } from './Componentes/docdo/docdo.component';
import { HvQueryComponent } from './Componentes/hv-query/hv-query.component';
import { HvFinalComponent } from './Componentes/hv-final/hv-final.component';
import { HvClientComponent } from './Componentes/hv-client/hv-client.component';
import { HvReviewComponent } from './Componentes/hv-review/hv-review.component';
import { HvDocaduanaComponent } from './Componentes/hv-docaduana/hv-docaduana.component';
import { TableAppComponent } from './Componentes/table-app/table-app.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ModaldinamicComponent } from './Componentes/modaldinamic/modaldinamic.component';
// import { UsersComponent } from './Componentes/users/users.component';
import { UsersComponent } from './Componentes/users/users.component';
import { UserFormComponent } from './Componentes/user-form/user-form.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CPasswordComponent } from './Componentes/c-password/c-password.component';
import { ResetPassComponent } from './Componentes/reset-pass/reset-pass.component';
import { ParamComponent } from './Componentes/param/param.component';
import { ParamFormComponent } from './Componentes/param-form/param-form.component';
import { DocanexosComponent } from './Componentes/docanexos/docanexos.component';
import { DocanexosFormComponent } from './Componentes/docanexos-form/docanexos-form.component';
import { GroupsFormComponent } from './Componentes/groups-form/groups-form.component';
import { ButtonappComponent } from './Componentes/buttonapp/buttonapp.component';
import { SpinnerComponent } from './Componentes/spinner/spinner.component';
import { DatePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { ListFiltersComponent } from './Componentes/list-filters/list-filters.component';
import { DownloaddocsComponent } from './Componentes/downloaddocs/downloaddocs.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    DialogLoginComponent,
    UsersComponent,
    ClientsComponent,
    GroupsComponent,
    DocumentsComponent,
    SealsComponent,
    DocdoComponent,
    HvQueryComponent,
    HvFinalComponent,
    HvDocaduanaComponent,
    ModaldinamicComponent,
    UserFormComponent,
    HvClientComponent,
    HvReviewComponent,
    CPasswordComponent,
    ResetPassComponent,
    ParamComponent,
    ParamFormComponent,
    DocanexosComponent,
    DocanexosFormComponent,
    ClientsFormComponent,
    GroupsFormComponent,
    ButtonappComponent,
    SpinnerComponent,
    ListFiltersComponent,
    DownloaddocsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    TableAppComponent,
    CommonModule,
    MatChipsModule,
    MatInputModule
  ],
  entryComponents: [
    DialogLoginComponent,
    ModaldinamicComponent
  ],
  providers: [
    TableAppComponent,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      }
    },
    CurrencyPipe,
    DatePipe 
  ],
  exports: [MaterialModule, TableAppComponent, CommonModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
