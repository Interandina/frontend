import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesComponent } from 'src/app/Services';
import { ModelEditar, ModelGridClients, PassModelBotonGrid } from 'src/app/modelos/Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hv-client-list',
  templateUrl: './hv-client-list.component.html',
  styleUrls: ['./hv-client-list.component.css']
})
export class HvClientListComponent implements OnInit{
  public MostrapnlHV = true;
  dataSource = new MatTableDataSource<ModelGridClients>();
  //dataSource: new MatTableDataSource();
  dataColumns: any[];
  displayedColumns: string[];
  dataGrid: ModelGridClients[];
  modelEditar: ModelEditar;
  callbackEditar: Function;
  //callbackBoton: Function;
  //Grilla Historico
  dataSourceC = new MatTableDataSource();
  dataColumnsC: any[];
  displayedColumnsC: string[];
  modelEditarC: ModelEditar;
  rowGridDetails: any = null;

  constructor(private servicio: ServicesComponent, private cdRef: ChangeDetectorRef){}
    
  ngOnInit(): void {
    this.modelEditar = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: true,
      EditarRowOut: false
    };
  
    this.modelEditarC = {
      Title: '',
      Componente: '',
      EditarRow : false,
      WidthDg: '',
      HeightDg: '',
      EventoBotonEditar: false,
      EditarRowOut: false
    };

    //this.callbackBoton = this.LoadHV;
    this.GetInfoIni();
  }

  GetInfoIni():void{
    this.servicio.SendGetWOutPObsHeaderAut('hv/').then((rta: any) => {
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
            this.dataSource = null;
            this.dataSourceC = null;
            this.dataGrid = rta.data.pending;
            this.dataGrid.forEach(i=>{
              i.acciones = ["border_color", "clic para editar esta fila"]
            });
            this.dataColumnsC =  rta.columns;
            this.displayedColumnsC =  rta.columns.map((col:any)=>col.name);
            rta.columns.push({name: "acciones", title: "Acción", display: true});
            const dcc: any =[];
            rta.columns.forEach((item:any) => {
              dcc.push(Object.assign({}, item));
            });
            dcc.filter((c: any) => c.name == "reviewAt")[0].display = false;
            this.dataColumns = dcc;
            this.displayedColumns = rta.columns.map((col:any)=>col.name);
            this.dataSource = new MatTableDataSource(this.dataGrid);
            //Grilla historico
            this.dataSourceC = new MatTableDataSource(rta.data.completed);
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

    //#region Eventos Grillas
    OcultarGrid(objetoEnviado: PassModelBotonGrid){
      //console.log(objetoEnviado);
      //this.LoadHV(objetoEnviado.row);
      this.MostrapnlHV = objetoEnviado.verPadre;
      this.rowGridDetails = objetoEnviado.row;
    }
    //#endregion
}
