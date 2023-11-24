import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import { DialogLoginComponent } from '../dialog-login/dialog-login.component';
import Swal from'sweetalert2';
import { ServicesComponent } from '../../Services';
import { Router } from '@angular/router';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  ShowMenu = false;
  Logueado = false;
  userlogueado: string = "";
  isExpanded = true;
  shouldRun = true;
  MenuNav:any;

  //#region array menu manual
  //Antes
  // fillerNav = [
  //   {name: "Inicio", route:"", icon:"home"},
  //   {name: "Quiénes Somos", route: "qsomos", icon:"spatial_audio_off"},
  //   {name: "Productos", route: "productos", icon:"production_quantity_limits"},
  //   {name: "Clientes", route: "clientes", icon:"supervisor_account"},
  //   {name: "Solicitar Demo", route: "demo", icon:"terminal"}
  // ];
  // fillerNav = [
  //     {icon:"home"},
  //     {icon:"settings", submenu:[{route:"qsomos", icon:"settings"}]},
  //     {icon:"note_add", submenu:[{route:"productos", icon:"note_add"}]},
  //     {icon:"keyboard_double_arrow_down", submenu:[{route:"clientes", icon:"note_add"}]},
  //     {icon:"keyboard_double_arrow_up", submenu:[{route:"demo", icon:"note_add"}]}
  //   ];
//   MenuNav = [
//     {
//        "iconm":"settings",
//        "routem":"",
//        "titlem":"Parámetros",
//        "submenu":[
//           {
//              "routes":"qsomos",
//              "icons":"group_add",
//              "titles":"Gestión Clientes"
//           },
//           {
//             "routes":"qsomos",
//             "icons":"settings",
//             "titles":"Gestión Tipos de Empresa"
//          }
//        ]
//     },
//     {
//        "iconm":"note_add",
//        "routem":"",
//        "titlem":"Hojas de Vida",
//        "submenu":[
//           {
//              "routes":"productos",
//              "icons":"note_add",
//              "titles":"Diligenciar HV"
//           },
//           {
//             "routes":"productos",
//             "icons":"note_add",
//             "titles":"Diligenciar HV"
//          },
//          {
//           "routes":"productos",
//           "icons":"note_add",
//           "titles":"Diligenciar HV"
//           }
//        ]
//     },
//     {
//        "iconm":"keyboard_double_arrow_down",
//        "routem":"",
//        "titlem":"Proceso de Importación",
//        "submenu":[
//           {
//              "routes":"clientes",
//              "icons":"note_add",
//              "titles":"Cargar DO"
//           },
//           {
//             "routes":"clientes",
//             "icons":"note_add",
//             "titles":"Cargar DO"
//           },
//           {
//           "routes":"clientes",
//           "icons":"note_add",
//           "titles":"Cargar DO"
//           },
//           {
//             "routes":"clientes",
//             "icons":"note_add",
//             "titles":"Cargar DO"
//           },
//           {
//             "routes":"clientes",
//             "icons":"note_add",
//             "titles":"Cargar DO"
//           }
//        ]
//     },
//     {
//        "iconm":"keyboard_double_arrow_up",
//        "routem":"",
//        "submenu":[
//           {
//              "routes":"demo",
//              "icons":"note_add",
//              "titles":"Simple DO"
//           }
//        ]
//     }
//  ];
//#endregion
  fillerContent = "";
  // config: MatDialogConfig = {
  //   disableClose: false,
  //   hasBackdrop: true,
  //   backdropClass: '',
  //   width: '400px',
  //   height: '',
  //   position: {
  //       top: '',
  //       bottom: '',
  //       left: '',
  //       right: ''
  //   }
  // };
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog, private servicio: ServicesComponent, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    if(sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined)
    {
      //console.log(sessionStorage.getItem('cccccc'));
      this.servicio.LoadHeaders();
      this.servicio.SendPOSTObsWHeader('users/permissions').then((rta: any) => {
        try
        {
          //console.log(rta);
          if(rta == undefined)
          {
            Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
          }
          else
          {
            if(rta.success)
            {
              this.MenuNav = rta.data;
              this.userlogueado = JSON.parse(sessionStorage.getItem('cccccc')!).email;
              this.Logueado = true;
              this.ShowMenu = true;
              //buscar si es un cliente para dejarlo en la hoja de vida
              if(!Object.keys(JSON.parse(sessionStorage.getItem('cccccc'))).includes("typeuserId"))
                this.router.navigate(['/hv_clients'], {skipLocationChange: true});
            }
            else
            {
              Swal.fire("Error", rta.message, "error");
            }
          }
        }
        catch(e){
          //Swal.fire("Error", "Ha ocurrido un error inesperado!", "error");
          console.log('Ha ocurrido un error inesperado. Motivo:', e);           
          throw e;
        }
      });
    }
    else
    {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(DialogLoginComponent, this.config);

  //   dialogRef.afterClosed().subscribe(data => {
  //     console.log(data);
  //     if(data)
  //     {
  //       this.userlogueado = data
  //       this.Logueado = true;
  //       sessionStorage.setItem('cccccc', this.userlogueado);
  //     }
  //   });
  // }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  openSideNav(e: any) {
    e.toggle();
  }

  hideSideNav(e:any){
    e.toggle();
  }

  Logout()
  {
    Swal.fire({
      title: "Salir de la aplicación",
      text: "¿Desea salir de la aplicación?",
      showCancelButton: true,
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Salir',
      confirmButtonColor: '#2780e3',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/';
        this.ShowMenu = true;
        this.userlogueado = "";
        this.Logueado = false;
        sessionStorage.clear();
      }
    });
  }

  changeColorItem() {
    // let  aTag = (document.getElementsByClassName('mat-list-subitem') as HTMLCollectionOf<HTMLElement>);
    // console.log(aTag);
    // aTag[1].style.color = 'green';
  }
}