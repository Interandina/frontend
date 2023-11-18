import { Component, OnInit } from '@angular/core';
import { ServicesComponent } from '../../Services';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModaldinamicComponent } from '../modaldinamic/modaldinamic.component';
import { ModelEditar } from 'src/app/modelos/Interfaces';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})

export class UsersComponent implements OnInit {
  dataSource = new MatTableDataSource();
  dataColumns: any[];
  displayedColumns: string[];
  modelEditar: ModelEditar;
  callbackEditar: Function;
  GuardarUsuario=false;
  types_user_id:any[]=[];
  MostrarSpinner = false;


  constructor(private servicio: ServicesComponent, private dialog: MatDialog) {  }
  
  ngOnInit(): void {
/*    this.modelEditar = {
      Title: 'Editar Usuario',
      Componente: 'user',
      EditarRow : true,
      WidthDg: '70%',
      HeightDg: '70%',
      EventoBotonEditar: false,
      EditarRowOut: false
    };*/

    this.modelEditar = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: false,
      RowReject: false
    };

    this.callbackEditar = this.GetUser;
    this.GetUser();
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
        titleag: 'Agregar Usuario',
        componenteag:'user',
        widthdiag: '70%',
        heightdiag: '70%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.GetUser();
    });
  }

  openAlertDialogData(data: any) {
    const dialogRef = this.dialog.open(ModaldinamicComponent,{
      panelClass: 'my-dialog',
      disableClose: true,
      data:{
        buttonText: {
          cancel: 'Cerrar',
          confirm:'Guardar'
        },
        titleag: 'Agregar Usuario',
        componenteag:'user',
        dataedit: data,
        widthdiag: '70%',
        heightdiag: '70%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.GetUser();
    });
  }


  VerFormusuario(){
    this.GuardarUsuario = true;
  }

  GetUser():void{
    this.servicio.SendGetWOutPObsHeaderAut('users/').then((rta: any) => {
      try
      {
        if(rta == undefined)
        {
          Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
        }
        else
        {
          //Es exitoso
          if(rta.success)
          {
            //console.log(rta.data);
            rta.data.forEach((i: any) => {
              i.acciones = [{icon: "border_color", title:"Clic para editar esta fila", indice: 1},{icon: "forward_to_inbox", title:"Clic para enviar de nuevo correo de recuperación de contraseña", indice: 2}]
            });
            rta.columns.push({name: "acciones", title: "Acciones", display: true});
            this.dataSource = new MatTableDataSource(rta.data);
            this.dataColumns = rta.columns;
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

  EditarRowUsuario(row: any){
    switch(row.indice)
    {
      case 1: this.openAlertDialogData({ id: row.row.id });
      break;
      case 2: this.SendEmailUser(row.row);
      break;
    }
  }

  LoadUsuario(id:number){
    //this.EsEdicion = true;
    //this.FormClient.controls['email'].disable();
    //this.FormClient.controls['document'].disable();
    //this.titlebGoE = "Editar"
    this.servicio.SendGetWOutPObsHeaderAut('clients/' + id).then((rta: any) => {
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
//            this.FormClient.setValue(rta.data);
  //          this.ReloadGridDocs(rta.data.files);
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

  SendEmailUser(row:any){
    Swal.fire({
      title: "Enviar Correo de Recuperación de Contraseña",
      text: "¿Está seguro que desea enviar un correo de recuperación de contraseña al usuario?",
      showCancelButton: true,
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Enviar',
      confirmButtonColor: '#2780e3',
    }).then((result) => {
      if (result.isConfirmed) {
        try
        {
          this.MostrarSpinner = true;
          this.servicio.SendPOSTObsWHeader('users/notificationUser/' + row.id).then((rta: any) => {
            this.MostrarSpinner = false;
            if(rta == undefined)
              Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
            else
              Swal.fire(rta.success ? "Correo Enviado" : "Advertencia", (rta.success ? rta.message + ".<br>El usuario " + row.nameenterprise +" ha sido notificado.": ""), rta.success ? "success": "warning");
          });
        }
        catch(exception){
          this.MostrarSpinner = false;
          Swal.fire("Error", exception.toString(), "error");
          console.log('Ha ocurrido un error inesperado. Motivo:', exception);           
          throw exception;
        }
      }
    });
  }
}
