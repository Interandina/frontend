import { SafeHtml } from "@angular/platform-browser";

export interface Login {
    email: string,
    password: string
  }

  export interface ResponseM {
    coderror: string;
    messageerror: string;
    procesado:boolean;
    data: any;
  }

  export interface ResponseM2 {
    error: string;
    message: string;
    success:boolean;
    data: any;
    fields: any;
  }

  export interface ModelEditar {
    Title: string;
    Componente: string;
    EditarRow: boolean;
    WidthDg: string;
    HeightDg: string;
    EventoBotonEditar: boolean;
    EditarRowOut: boolean,
    RowReject?: boolean,
    NameStep?: string
  }

  export interface UserModel{
    id:number;
    email:string;
    type_document: string;
    document:string;
    first_name: string;
    last_name:string;
    typeuserId: string;
    inactive: boolean;
    comission: number;
  }

  export interface ClientModel{
    id:number;
    document:string;
    nameenterprise: string;
    accountable: string;
    email:string;
    inactive: boolean;
    taxId:number;
    groupId:number;
  }

  export interface ParamModelReq{
    id?: number;
    name?: string;
    description?: string;
    value?: string;
    inactive?: any;
  }

  export interface ParamModelRes{
    id: number;
    name: string;
    description: string;
    value: string;
    inactive: boolean;
  }

  export interface DocAnexosModel{
    id: number;
    tag: string;
    description: string;
    inactive: boolean;
  }

  export interface DocAnexosDetailsModel{
    id?: number,
    name: string;
    msjhelp?: string;
    expireat?: number;
    inactive: boolean;
    operationtype: string,
    assignto: string,
    tocompany: string,
    fileid: number
  }

  export interface DocAnexosSaveModel{
    tag: string;
    description: string;
    inactive: boolean;
    details: DocAnexosDetailsModel[];
  }

  export interface GruposModel{
    id: number;
    tag: string;
    description: string;
    taxId: string;
  }

  export interface ModelGridGroup{
    description:string,
    descriptionTax: string,
    id: number,
    lengthClients: number,
    tag: string,
    acciones: string
    //acciones: string
  }

  export interface ModelGridClients{
    id:number,
    document: string,
    company: string,
    createdAt: Date,
    //acciones: SafeHtml
    acciones: string[]
    //acciones: HTMLButtonElement
  }

  export interface ModelInfoHV{
    document:string
  }
  
  export interface PassModelBotonGrid{
    row:any;
    verPadre: boolean
  }

  export interface PassModelBotonesGrid{
    row:any;
    verPadre: boolean,
    indice: number
  }

  export interface ItemAutocomplete{
    id:string;
    name: string
  }

  export interface filesApp{
    docattachmentid:number,
    expireat: number,
    msjhelp: string,
    name: string,    
    type: string,
    documentdate: Date,
    nameEnc: string
  }

  export interface fileHV{
    position: number;
    archivo: File;
    expireat: number;
    documentdate: Date;
    name: string,
    type:string
  }

  export interface hv_info_attachments{
    hvId: number;
    docattachmentid: number;
    docoperationtype: string;
    documentname: string;
    expireat: number;
    documentdate: Date
  }

  export interface arrayME{
    nombreME: string,
    lineaorigen: number;
    nit: string
  }

  export interface arrayCAuto{
    linea: number,
    nombremodelo: string,
    orden: number,
    valor: string
  }

  export interface AprobarPDFsHV{
    id: string,
    isapprobed: boolean,
    nameDoc: string
  }

  export interface ObjetosFiltrosComponent{
    titulo: string;
    elementos: ElementosFromFiltComponent[]
  }

  export interface ElementosFromFiltComponent{
    nameElementModel: string;
    tipo: string;
    etiqueta: string;
    requerido: boolean;
    value?: modelSelectsFilter;
  }

  export interface modelSelectsFilter{
    data: any;
    valorsl: string;
    descsl: string;
  }
  export interface RespuestaFiltros{
    datec?: string[];
    dater?: string[];
    company?: string;
    document?: string;
    email?: string;
    contact?: string;
    group?: number;
    ispending?: any;
    isaccept?: any;
    isdone?: any;
  }

  export interface activities{
    id: string,
    activity: string
  }
