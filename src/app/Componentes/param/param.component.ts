import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesComponent } from 'src/app/Services';
import { ModelEditar } from 'src/app/modelos/Interfaces';
import { ModaldinamicComponent } from '../modaldinamic/modaldinamic.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  styleUrls: ['./param.component.css']
})
export class ParamComponent {
  dataSource = new MatTableDataSource();
  dataColumns: any[];
  displayedColumns: string[];
  modelEditar: ModelEditar;
  callbackEditar: Function;
  GuardarParam = false;
  types_user_id:any[]=[];


  constructor(private servicio: ServicesComponent, private dialog: MatDialog, private fb: FormBuilder) {
  }
  
  ngOnInit(): void {
    this.modelEditar = {
      Title: 'Editar Parámetro',
      Componente: 'param',
      EditarRow : true,
      WidthDg: '60%',
      HeightDg: '65%',
      EventoBotonEditar: false,
      EditarRowOut: false
    };
    this.callbackEditar = this.GetParams;
    this.GetParams();
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
        titleag: 'Agregar Parámetro',
        componenteag:'param',
        widthdiag: '60%',
        heightdiag: '65%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.GetParams();
    });
  }

  VerFormusuario(){
    this.GuardarParam = true;
  }

  GetParams():void{
    this.servicio.SendGetWOutPObsHeaderAut('parameters/').then((rta: any) => {
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
}
