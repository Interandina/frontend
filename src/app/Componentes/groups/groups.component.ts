import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesComponent } from 'src/app/Services';
import { ClientModel, ModelEditar, ModelGridGroup, ResponseM2 } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';
import { ModaldinamicComponent } from '../modaldinamic/modaldinamic.component';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSelectionListChange } from '@angular/material/list';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})

export class GroupsComponent implements OnInit{
  dataSource = new MatTableDataSource<ModelGridGroup>();
  dataColumns: any[];
  displayedColumns: string[];
  modelEditar: ModelEditar;
  callbackEditar: Function;
  GuardarGrupo = false;
  ClientsWOG:  ClientModel[];
  ClientsWOGCopy:  ClientModel[];
  TmpClientsWOG: number[] = [];
  ClientsWG:  ClientModel[];
  ClientsWGCopy:  ClientModel[];
  TmpClientsWG: number[] = [];
  dataGrid: ModelGridGroup[];
  /*Atributos de la tabla*/
  selectedRowIndex = -1;
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    mp._changePageSize(mp.pageSize); 
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  /********************************************************/
  constructor(private servicio: ServicesComponent, private dialog: MatDialog, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.modelEditar = {
      Title: 'Editar Grupo',
      Componente: 'grupos',
      EditarRow : true,
      WidthDg: '60%',
      HeightDg: '70%',
      EventoBotonEditar: false,
      EditarRowOut: false
    };
    this.callbackEditar = this.GetGroups;
    this.GetGroups();
  }

  openAlertDialog() {
    const dialogRef = this.dialog.open(ModaldinamicComponent,{
      panelClass: 'my-dialog',
      disableClose: true,
      data:{
        buttonText: {
          cancel: 'Cerrar',
          confirm:'Guardar'
        },
        titleag: 'Agregar Grupo',
        componenteag:'grupos',
        widthdiag: '60%',
        heightdiag: '70%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.GetGroups();
    });
  }

  VerFormTipoEmpresa(){
    this.GuardarGrupo = true;
  }

  GetGroups():void{
    this.servicio.SendGetWOutPObsHeaderAut('groups/').then((rta: any) => {
      try
      {
        if(rta == undefined)
        {
          Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
        }
        else
        {
          if(rta.success)
          {
            //console.log(rta);
            this.dataGrid = rta.data;
            //this.dataGrid.forEach(item =>{
              //item.accion = "Agregar Grupo";
              //item.acciones =""
              //this.sanitizer.bypassSecurityTrustHtml("<a>Editar</a>");
              // "<a>Editar</a>"
              //this.sanitizer.bypassSecurityTrustHtml("<a>Editar</a>");
              //"<div [innerHTML]='" +  this.sanitizer.bypassSecurityTrustHtml("<mat-icon>note_add</mat-icon>") +"'/>";
              //this.sanitizer.sanitize(SecurityContext.HTML,this.sanitizer.bypassSecurityTrustHtml('<mat-icon>note_add</mat-icon>'));
              //"<p [innerHTML]=" + this.sanitizer.bypassSecurityTrustHtml('<mat-icon>close</mat-icon>') +"></p>";
              // '<mat-icon>close</mat-icon>'
              // "<div [innerHTML]='item.acciones'></div>"
              //new DOMParser().parseFromString('<mat-icon>close</mat-icon>', "text/html")
              //this.sanitizer.sanitize(SecurityContext.HTML, "<button mat-icon-button><mat-icon>close</mat-icon></button>")
              //"<div [innerHTML]='<mat-icon>close</mat-icon>'></div>"
              //document.body.appendChild(document.createTextNode('<button mat-icon-button aria-label="close dialog" mat-dialog-close title="Cerrar" style="float: right; margin-top:-6.5%; margin-right: 2%;"><mat-icon>close</mat-icon></button>'))
              //new DOMParser().parseFromString('<mat-icon>close</mat-icon>', "text/html").documentElement.textContent;
              //document.body.appendChild(document.createTextNode('<button mat-icon-button aria-label="close dialog" mat-dialog-close title="Cerrar" style="float: right; margin-top:-6.5%; margin-right: 2%;"><mat-icon>close</mat-icon></button>'))
              //'<button mat-icon-button aria-label="close dialog" mat-dialog-close title="Cerrar" style="float: right; margin-top:-6.5%; margin-right: 2%;"><mat-icon>close</mat-icon></button>'.html()
            //});
            //console.log(this.dataGrid);
            this.dataSource = null;
            rta.columns.push({name: "acciones", title: "Acción", display: true})
            this.dataColumns = rta.columns;
            //console.log(this.dataColumns);
            this.dataSource = new MatTableDataSource<ModelGridGroup>(this.dataGrid);
            this.displayedColumns = rta.columns.map((col:any)=>col.name);
          }
          else
            Swal.fire("Error", rta.message, "error");
        }
      }
      catch(e){
        console.log('Ha ocurrido un error inesperado. Motivo:', e);           
        throw e;
      }
    });
  }

  clearArray(){
    this.ClientsWOG = [];
    this.ClientsWG = [];
    this.TmpClientsWG = [];
    this.TmpClientsWOG = [];
  }
  //#region Eventos Grilla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ExportTOExcel(extension:string)
  {
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja_1');

    /* save to file */
    XLSX.writeFile(wb, ('Documento.' + extension));
  }

  setDataSourceAttributes() {
    setTimeout(() =>{ 
      if(this.dataSource != null && this.dataSource != undefined)
      {
        this.paginator._intl.itemsPerPageLabel = "Ítems por página";
        this.paginator._intl.firstPageLabel = "Primera página";
        this.paginator._intl.nextPageLabel = "Siguiente página";
        this.paginator._intl.previousPageLabel = "Anterior página";
        this.paginator._intl.lastPageLabel = "Última página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
    //console.log(this.dataColumns);
  }

  UpdateRowinForm(row:any)
  {
    const dialogRef = this.dialog.open(ModaldinamicComponent,{
      panelClass: 'my-dialog',
      disableClose: true,
      data:{
        buttonText: {
          cancel: 'Cerrar',
          confirm:'Editar'
        },
        titleag: this.modelEditar.Title,
        componenteag: this.modelEditar.Componente,
        dataedit: row,
        widthdiag: this.modelEditar.WidthDg,
        heightdiag: this.modelEditar.HeightDg
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.callbackEditar();
    });
  }

  GetClientsOfGroup(row:any){
    this.selectedRowIndex = row.id;
    this.servicio.SendGetWOutPObsHeaderAut('groups/'+row.id).then((rta: any) => {
      try
      {
        if(rta == undefined)
        {
          Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
        }
        else
        {
          if(rta.success)
          {
            // console.log(rta);
            this.ClientsWOG = rta.clientsAvailables;
            this.ClientsWOGCopy =  rta.clientsAvailables;
            this.ClientsWG = rta.data.clients;
            this.ClientsWGCopy = rta.data.clients;
          }
          else
            Swal.fire("Error", rta.message, "error");
        }
      }
      catch(e){
        console.log('Ha ocurrido un error inesperado. Motivo:', e);           
        throw e;
      }
    });
  }
  //#endregion 

  //#region Eventos Lista
  applyFilterListItems(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    if(filterValue)
    {
      let arrayfilter : ClientModel[] = Array.from(this.ClientsWOGCopy);
      this.ClientsWOG = arrayfilter.filter(i=> i.nameenterprise.trim().toLowerCase().includes(filterValue.trim().toLowerCase()) || i.document.trim().toLowerCase().includes(filterValue.trim().toLowerCase()));
    }
    else
      this.ClientsWOG = this.ClientsWOGCopy;
  }

  applyFilterListClientsInGroup(event: Event)
  {
    let filterValue = (event.target as HTMLInputElement).value;
    if(filterValue)
    {
      let arrayfilter : ClientModel[] = Array.from(this.ClientsWGCopy);
      this.ClientsWG = arrayfilter.filter(i=> i.nameenterprise.trim().toLowerCase().includes(filterValue.trim().toLowerCase()) || i.document.trim().toLowerCase().includes(filterValue.trim().toLowerCase()));
    }
    else
      this.ClientsWG = this.ClientsWGCopy;
  }

  onClickMList(option: MatSelectionListChange){
    if(option.options[0].selected)
      this.TmpClientsWOG.push(option.options[0].value);
    else{
      if(this.TmpClientsWOG != undefined && this.TmpClientsWOG.length > 0 && this.TmpClientsWOG.includes(option.options[0].value))
        this.TmpClientsWOG.splice(this.TmpClientsWOG.indexOf(parseInt(option.options[0].value)), 1);
    }
  }

  onClickMListCWG(option: MatSelectionListChange){
    if(option.options[0].selected)
      this.TmpClientsWG.push(option.options[0].value);
    else{
      if(this.TmpClientsWG != undefined && this.TmpClientsWG.length > 0 && this.TmpClientsWG.includes(option.options[0].value))
        this.TmpClientsWG.splice(this.TmpClientsWG.indexOf(parseInt(option.options[0].value)), 1);
    }
  }

  AddToGruop(){
    if(this.TmpClientsWOG == undefined || this.TmpClientsWOG.length == 0)
      Swal.fire("Cliente(s) no Seleccionado(s)", "Debe seleccionar al menos un cliente para asignar a un grupo!", "warning");
    else{
      Swal.fire({
        title: "Adicionar Clientes en Grupo",
        text: "¿Desea vincular los clientes seleccionados al grupo?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            let request: any = {};
            request.idClients = this.TmpClientsWOG;
            this.servicio.SendPUTWParamObs('groups/join/' + this.selectedRowIndex, request, true).then((rta: ResponseM2) => {
              if(rta.success)
              {
                Swal.fire("Grupo Actualizado", rta.message, "success");
                  this.GetGroups();
                  this.clearArray();
              }
            });
          }
          catch{
            Swal.fire("Error al guardar", "Ha ocurrido un error inesperado!", "error");
          }
        }
      });
    }
  }

  DeleteOfGruop(){
    if(this.TmpClientsWG == undefined || this.TmpClientsWG.length == 0)
      Swal.fire("Cliente(s) no Seleccionado(s)", "Debe seleccionar al menos un cliente para poder elimarlo del grupo!", "warning");
    else{
      Swal.fire({
        title: "Eliminar Clientes del Grupo",
        text: "¿Desea desvincular los clientes seleccionados del grupo?",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Desvincular',
        confirmButtonColor: '#2780e3',
      }).then((result) => {
        if (result.isConfirmed) {
          try
          {
            let request: any = {};
            request.idClients = this.TmpClientsWG;
            //console.log(request.idClients);
            this.servicio.SendPUTWParamObs('groups/join/' + this.selectedRowIndex, request, true).then((rta: ResponseM2) => {
              if(rta.success)
              {
                Swal.fire("Grupo Actualizado", rta.message, "success");
                  this.GetGroups();
                  this.clearArray();
              }
            });
          }
          catch{
            Swal.fire("Error al guardar", "Ha ocurrido un error inesperado!", "error");
          }
        }
      });
    }
  }
  //#endregion
}
