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

  export interface DO{
    cod_lugar_ingreso_: string,
    numero_do: string,
    numero_pedido: string,
    empleado_digitador: string,
    nit_importador: string,
    dv_importador: string,
    apellidos_y_nombres_o_razon_: string,
    documento_de_transporte: string,
    fecha_documento_: string,
    nombre_exportador: string,
    subpartida_arancelaria: string,
    no_aceptacion_: string,
    fecha_declaracion_: string,
    numero_levante: string,
    fecha_levante: string,
    no_factura: string,
    fecha_factura: string,
    valor_fob_usd: number,
    manifiesto_de_carga: string,
    no_bultos: string,
    fecha_de_llegada: string,
    peso_bruto_kgs: number,
    peso_neto_kgs: number,
    ciudad_exportador: string,
    cod_pais_exportador: string,
    direccion_exportador: string,
    email_exportador: string,
    cod_pais_procedencia: string,
    cod_modo_transporte: string,
    codigo_de_bandera: string,
    cod_destino_mercancia: string,
    empresa_transportadora: string,
    tasa_de_cambio: number,
    codigo_complementario: string,
    codigo_suplementario: string,
    cod_modalidad: string,
    no_cuotas_o_meses: number,
    cod_pais_origen: string,
    cod_acuerdo: string,
    forma_de_pago_de_la_: string,
    tipo_de_importacion: string,
    cod_pais_compra: string,
    codigo_embalaje: string,
    subpartidas: number,
    programa_no: string,
    cod_interno_del_producto: string,
    cod_unidad_fisica: string,
    cantidad: number,
    valor_fletes_usd: number,
    valor_seguros_usd: number,
    valor_otros_gastos_usd: number,
    sumatoria_fletes_seguros_y_: number,
    ajuste_valor_usd: number,
    valor_aduana_usd: number,
    cod_reg_o_licencia: string,
    numero_reg_o_licencia: string,
    cod_oficina: string,
    anio_expedicion: number,
    arancel_porcentaje: number,
    arancel_base: number,
    arancel_liquidado: number,
    arancel_pagar_con_esta_: number,
    arancel_liquidado_usd: number,
    iva_porcentaje: number,
    iva_base: number,
    iva_liquidado: number,
    iva_pagar_con_esta_: number,
    iva_liquidado_usd: number,
    recibo_oficial_pago_: string,
    fecha_pago_anterior: string,
    pago_total: number,
    numero_autoadhesivo: string,
    fecha_autoadhesivo: string
  }

  export interface DO1 {
    cod_lugar_ingreso_: string,
    numero_do: string,
    numero_pedido: string,
    empleado_digitador: string,
    nit_importador: string,
    dv_importador: string,
    apellidos_y_nombres_o_razon_: string,
    documento_de_transporte: string,
    fecha_documento_: string,
    nombre_exportador: string,
    subpartida_arancelaria: string
  }
