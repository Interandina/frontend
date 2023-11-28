import { Component, OnInit } from '@angular/core';
import { ServicesComponent } from 'src/app/Services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-downloaddocs',
  templateUrl: './downloaddocs.component.html',
  styleUrls: ['./downloaddocs.component.css']
})
export class DownloaddocsComponent implements OnInit {
  token:string = "";
  constructor(private servicio: ServicesComponent){}
  ngOnInit(): void {
    this.token = new URLSearchParams(window.location.search).get('val');
    this.servicio.SendPOSTWParamObs('hv/downloadAttachments/', {"val": this.token}, true).then((rta: any) => {
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
