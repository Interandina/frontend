import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesComponent } from 'src/app/Services';
import { ModelEditar } from 'src/app/modelos/Interfaces';
import { ModaldinamicComponent } from '../modaldinamic/modaldinamic.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-docanexos',
  templateUrl: './docanexos.component.html',
  styleUrls: ['./docanexos.component.css']
})
export class DocanexosComponent implements OnInit{
  dataSource = new MatTableDataSource();
  dataColumns: any[];
  displayedColumns: string[];
  modelEditar: ModelEditar;
  callbackEditar: Function;
  GuardarTipoEmp = false;
  pestanaSeleccionada: string = 'pestana1';
  titledoc = "Documentos Generales";

  constructor(private servicio: ServicesComponent, private dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.modelEditar = {
      Title: 'Editar Tipo de Empresa',
      Componente: 'tipoempresa',
      EditarRow : true,
      WidthDg: '80%',
      HeightDg: '90%',
      EventoBotonEditar: false,
      EditarRowOut: false
    };
    this.callbackEditar = this.GetTiposEmp;
    this.GetTiposEmp();
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
        titleag: 'Agregar Tipo de Empresa',
        componenteag:'tipoempresa',
        widthdiag: '80%',
        heightdiag: '90%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.GetTiposEmp();
    });
  }

  VerFormTipoEmpresa(){
    this.GuardarTipoEmp = true;
  }

  GetTiposEmp():void{
    this.servicio.SendGetWOutPObsHeaderAut('settingsdocsatt/').then((rta: any) => {
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
            //console.log(rta.data);
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
  
  seleccionarPestana(pestana: string) {
    this.pestanaSeleccionada = pestana;
  }

}
