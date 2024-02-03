import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { RespuestasFullCalendar } from '../modelos/Interfaces';
import { FullCalendarComponent } from '@fullcalendar/angular';
import Swal from 'sweetalert2';
import { ObtenerPrimerDiaMes, ObtenerUltimoDiaMes } from '../Componentes/functions/FnGenericas';
import { ServicesComponent } from 'src/app/Services';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css']
})

// AfterViewInit

export class FullCalendarComponentE implements OnInit{
  @Input() URLEventos: string;
  //@Input() Eventos = new EventEmitter<any[]>();
  //@Input() CalendarOptions: CalendarOptions;
  @Input() Editable: boolean;
  @Output() eventoFormPadre = new EventEmitter<RespuestasFullCalendar>();
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  CalendarOptions: CalendarOptions;
  
  ngOnInit(): void {
    this.CalendarOptions = {
      timeZone: 'America/Bogota',
      initialView: 'dayGridMonth',
      //plugins: [dayGridPlugin],
      plugins: [dayGridPlugin, timeGridPlugin],
      locales: [esLocale],
      defaultAllDay: true,
      editable: this.Editable, //Aquí toca según usuario,
      dayMaxEventRows: 4,
      headerToolbar: {
      //   left: 'prev,next,today',
      //   center: 'title',
        right: 'prev,next'
      //   right: 'dayGridMonth'
      },
      nowIndicator: true,
      lazyFetching: true,
      //events: this.ObtenerEventosCalendario(),
      customButtons:{
        next: { click: this.nextMonth.bind(this)},
        prev: { click: this.prevMonth.bind(this)}
      }
    };
    this.ObtenerEventosCalendario();
  }

  constructor(private servicio: ServicesComponent){
    //this.CalendarOptions.events = this.Eventos;
  }

  // ngAfterViewInit(): void {
  //   console.log(this.CalendarOptions.events);
  //   this.cdr.detectChanges();
  // }


  eventdblClick(event:any){
    let respuesta: RespuestasFullCalendar = {
      objeto: event,
      tipoevento: 'eventoactual'
    };
    this.eventoFormPadre.emit(respuesta);
  }

  nextMonth(){
    const calendarApi = this.fullcalendar.getApi();
    // console.log("next");
    // console.log(calendarApi.view.activeStart);
    // console.log(calendarApi.view.activeEnd);
    // console.log(calendarApi.view.currentEnd);
    // console.log("=========================");
    // let respuesta: RespuestasFullCalendar = {
    //   objeto: calendarApi.view.activeEnd,
    //   tipoevento: 'obtenereventosmes'
    // };
    this.ObtenerEventosCalendario(ObtenerPrimerDiaMes(calendarApi.view.activeEnd), ObtenerUltimoDiaMes(calendarApi.view.activeEnd));
    calendarApi.next();
    //this.eventoFormPadre.emit(respuesta);
  }

  prevMonth(){
    const calendarApi = this.fullcalendar.getApi();
    // console.log("prev");
    // console.log(calendarApi.view.activeStart);
    // console.log(calendarApi.view.activeEnd);
    // console.log(calendarApi.view.currentEnd);
    // console.log("=========================");
    // let respuesta: RespuestasFullCalendar = {
    //   objeto:  calendarApi.view.activeStart,
    //   tipoevento: 'obtenereventosmes'
    // };
    this.ObtenerEventosCalendario(ObtenerPrimerDiaMes(calendarApi.view.activeStart), ObtenerUltimoDiaMes(calendarApi.view.activeStart));
    calendarApi.prev();
    //this.eventoFormPadre.emit(respuesta);
  }

  ObtenerEventosCalendario(fechaInicial:Date = null, fechaFinal:Date = null){
    try
    {
      // console.log(fechaInicial);
      // console.log(fechaFinal);
      if(fechaInicial == null && fechaFinal == null)
      {
        this.servicio.SendGetWOutPObsHeaderAut(this.URLEventos).then((rta: any) => {
          if(rta.success)
          {
            //console.log(rta);
            //this.Eventos =  JSON.parse(JSON.stringify(rta)).data;
            this.CalendarOptions.events = rta.data;
          }
          else
            Swal.fire("Error al obtener los Eventos", "Ha ocurrido un error inesperado, motivo:<br/>" + rta.message, "warning");
        });
      }
      else
      {
        let body = {'datebegin': fechaInicial, 'dateend': fechaFinal};
        //console.log( JSON.stringify(body));
        this.servicio.SendGETWParamObs('imports/', JSON.stringify(body)).then((rta: any) => {
          if(rta.success)
          {
            // console.log("con param");
            // console.log(rta);
            //this.Eventos =  JSON.parse(JSON.stringify(rta)).data;
            this.CalendarOptions.events = rta.data;
          }
          else
            Swal.fire("Error al obtener los Eventos", "Ha ocurrido un error inesperado, motivo:<br/>" + rta.message, "warning");
        });
      }
    }
    catch(exception){
      Swal.fire("Error al obtener los Eventos", "Ha ocurrido un error inesperado, motivo:<br/>" + exception, "error");
    }
  }
}
