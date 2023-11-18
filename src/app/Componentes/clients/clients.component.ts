import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesComponent } from 'src/app/Services';
import { ModelEditar } from 'src/app/modelos/Interfaces';
import { ModaldinamicComponent } from '../modaldinamic/modaldinamic.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  // dataSource = new MatTableDataSource();
  // dataColumns: any[];
  // displayedColumns: string[];
  // modelEditar: ModelEditar;
  // callbackEditar: Function;
  // GuardarCliente = false;

  constructor(private servicio: ServicesComponent, private dialog: MatDialog) {  }
  
  // ngOnInit(): void {
  //   this.modelEditar = {
  //     Title: 'Editar Cliente',
  //     Componente: 'client',
  //     EditarRow : true,
  //     WidthDg: '70%',
  //     HeightDg: '80%',
  //     EventoBotonEditar: false,
  //     EditarRowOut: false
  //   };
  //   this.callbackEditar = this.GetClientes;
  //   this.GetClientes();
  // }

  // openAlertDialog() {
  //   const dialogRef = this.dialog.open(ModaldinamicComponent,{
  //     panelClass: 'my-dialog',
  //     disableClose: true,
  //     data:{
  //       buttonText: {
  //         cancel: 'Cerrar',
  //         confirm:'Guardar'
  //       },
  //       titleag: 'Agregar Cliente',
  //       componenteag:'client',
  //       widthdiag: '70%',
  //       heightdiag: '80%',
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.GetClientes();
  //   });
  // }

  // VerFormusuario(){
  //   this.GuardarCliente = true;
  // }

  // GetClientes():void{
  //   this.servicio.SendGetWOutPObsHeaderAut('clients/').then((rta: any) => {
  //     try
  //     {
  //       if(rta == undefined)
  //       {
  //         Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
  //       }
  //       else
  //       {
  //         if(rta.success)
  //         {
  //           //console.log(rta.data);
  //           this.dataSource = new MatTableDataSource(rta.data);
  //           this.dataColumns = rta.columns;
  //           this.displayedColumns = rta.columns.map((col:any)=>col.name);

  //         }
  //         else
  //           Swal.fire("Error", rta.message, "error");
  //       }
  //     }
  //     catch(e){
  //       console.log('Ha ocurrido un error inesperado. Motivo:', e);           
  //       throw e;
  //     }
  //   });
  // }
}
