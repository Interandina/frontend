import { Component, Inject, Injectable, NgModule, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, firstValueFrom } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

/**
 * TypeScript o Component of services to invoque controller
 */
@Injectable({
  providedIn: "root"
})

export class ServicesComponent {
  
  httpOptionsPlain = {};
  httpOptionsPlainAut = {};
  httpOptionsFileAut = {};
  corsHeaders = {};


  constructor(private http: HttpClient) {}
  LoadHeaders()
  {
    this.httpOptionsPlain = {
      headers: new HttpHeaders({
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json'
      })
    };
  
    this.httpOptionsPlainAut = {
      headers: new HttpHeaders({
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
        'Authorization': sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined ? JSON.parse(sessionStorage.getItem('cccccc')!).token : null
      })
    };

    this.httpOptionsFileAut = {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined ? JSON.parse(sessionStorage.getItem('cccccc')!).token : null
      })
    };
  
    this.corsHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      //'Accept-Encoding': 'gzip, deflate, br',
      'Accept': '*/*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Allow': 'GET, POST, PUT, DELETE, OPTIONS'
    });
  }
  /**
   * Sends the get w out parameter obs.
   * @param {string} route The route of the request.
   * @returns object Observable<any>
   */
  //public SendGetWOutParamObs(route: string): Observable<any> {
    // return this.http.get<Observable<any>>(environment.URLApi + route).pipe(map((data: any) => {
    //   console.log("en el servicio" + data);
    //   return data;
    // }));
  public async SendGetWOutParamObs(route: string): Promise<any> {
    return await firstValueFrom(this.http.get((environment.URLApi + route))).then((data: any) => {
      return data;
    }).catch((err: HttpErrorResponse) => {
      if(!this.CloseSesion(err))
      {
        console.error('An error occurred:', err.error);
        return err.error;
      }
    });
  }

  /**
 * Sends the post parameter obs without parameters with headers
 * @param {string} route The route.
 * @param {tokenR} Indicate if send headers.
 * @returns object Promise<any>
 */
  public async SendGetWOutPObsHeaderAut(route: string): Promise<any> {
    return await firstValueFrom(this.http.get((environment.URLApi + route), {headers: new HttpHeaders().set('Authorization', JSON.parse(sessionStorage.getItem('cccccc')!).token)})).then((data: any) => {
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  };

  public SendGetWHAut(route: string):any {
    return  this.http.get<any>((environment.URLApi + route), this.httpOptionsPlainAut).subscribe((data) => {
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  }

  public SendGet(route: string): any {
    return  this.http.get<any>((environment.URLApi + route)).subscribe((data) => {
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  }

// public SendGet(route: string): Promise<any> {
//   return firstValueFrom(this.http.get<any>((environment.URLApi + route))).then((rta:any) => {
//     console.log(rta);
//     return rta;
//   }, (error) => { 
//     console.log('Se ha generado un error en la petición');
//     console.error(error);
//     return throwError(error); 
//   });
// }
 
  /**
   * Sends the post parameter obs.
   * @param {string} route The route.
   * @param {any} body The body are parameters.
   * @returns object Promise<any>
   */
  public async SendGETWParamObs(route: string, data: any): Promise<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json; charset=utf-8',
      'Content-Type': 'application/json',
      'Authorization': sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined ? JSON.parse(sessionStorage.getItem('cccccc')!).token : null
    });
    
    return await firstValueFrom(this.http.get((environment.URLApi + route), {headers: headers, params: new HttpParams().set('data', data)})).then((data: any) => {
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  }

  /**
 * Sends the post parameter obs.
 * @param {string} route The route.
 * @param {any} body The body are parameters.
 * @returns object Promise<any>
 */
  public async SendPOSTWParamObs(route: string, body: any, tokenR: boolean = false): Promise<any> {
    // console.log(route);
    return await firstValueFrom(this.http.post((environment.URLApi+ route), body, (tokenR ? this.httpOptionsPlainAut : this.httpOptionsPlain))).then((data) => { 
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.log(error);
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  }


  /**
 * Sends the post parameter obs.
 * @param {string} route The route.
 * @param {any} body The body are parameters.
 * @returns object Promise<any>
 */
  public async SendPOSTWParamObsShow(route: string, body: any, tokenR: boolean = false): Promise<Blob> {
    // console.log(route);
    return await firstValueFrom(this.http.post<Blob>((environment.URLApi+ route), body, (tokenR ? this.httpOptionsFileAut : this.httpOptionsFileAut))).then((data: Blob) => { 
      console.log(data)
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.log(error);
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  }  

    /**
 * Sends the post parameter obs.
 * @param {string} route The route.
 * @param {any} body The body are parameters.
 * @returns object Promise<any>
 */
    public async DownloadPOSTWFile(route: string, body: any, tokenR: boolean = false): Promise<any> {
      // console.log(route);
      const url = (environment.URLApi+ route);
      const httpOptionsFileAut:any = {
        headers: new HttpHeaders({
          'Accept': 'application/json; charset=utf-8',
          'Authorization': sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined ? JSON.parse(sessionStorage.getItem('cccccc')!).token : null
        }),
        responseType: 'blob'
        };
        return await firstValueFrom(this.http.post((environment.URLApi + route), body, httpOptionsFileAut  )).then((data) => { 
          console.log(data)
          return data;
        },
        (error:HttpErrorResponse) => {
          if(!this.CloseSesion(error))
          {
            console.log('Error httpError' + error.error.message);
            console.error('An error occurred:', error.error.message);
            return error.error;
          }
        });
    }

    public async ShowPOSTWFile(route: string, body: any, tokenR: boolean = false): Promise<any> {
      // console.log(route);
      const url = (environment.URLApi+ route);
      const httpOptionsFileAut:any = {
        headers: new HttpHeaders({
          'Accept': 'application/json; charset=utf-8',
          'Authorization': sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined ? JSON.parse(sessionStorage.getItem('cccccc')!).token : null
        }),
        responseType: 'arraybuffer'
        };
        return await firstValueFrom(this.http.post((environment.URLApi + route), body, httpOptionsFileAut  )).then((data) => { 
          //console.log(data)
          return data;
        },
        (error:HttpErrorResponse) => {
          console.log(error)
          if(!this.CloseSesion(error))
          {
            console.log('Error httpError' + error.error.message);
            console.error('An error occurred:', error.error.message);
            return error.error;
          }
        });
    }

  public async SendPOSTWParamFiles(route: string, body: any): Promise<any> {
    const httpOptionsFileAut = {
      headers: new HttpHeaders({
        'Accept': 'application/json; charset=utf-8',
        'enctype': 'multipart/form-data',
        'Authorization': sessionStorage != null && sessionStorage.getItem('cccccc') != null && sessionStorage.getItem('cccccc') != undefined ? JSON.parse(sessionStorage.getItem('cccccc')!).token : null
      })
    };

    return await firstValueFrom(this.http.post((environment.URLApi + route), body, httpOptionsFileAut  )).then((data) => { 
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.log('Error httpError' + error.error.message);
        console.error('An error occurred:', error.error.message);
        return error.error;
      }
    });
  }

  /**
 * Sends the put parameter obs.
 * @param {string} route The route.
 * @param {any} body The body are parameters.
 * @returns object Promise<any>
 */
  public async SendPOSTWOUTParamObsToken(route: string, body: any, token:string): Promise<any> {
    return await firstValueFrom(this.http.post((environment.URLApi+ route), body, {headers:new HttpHeaders({
      'Accept': 'application/json; charset=utf-8',
      'Content-Type': 'application/json',
      'Authorization': token
    })})).then((data) => { 
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  }


  /**
 * Sends the put parameter obs.
 * @param {string} route The route.
 * @param {any} body The body are parameters.
 * @returns object Promise<any>
 */
  public async SendPUTWParamObs(route: string, body: any, tokenR: boolean = false): Promise<any> {
    return await firstValueFrom(this.http.put((environment.URLApi+ route), body, (tokenR ? this.httpOptionsPlainAut : this.httpOptionsPlain))).then((data) => { 
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  }

  /**
 * Sends the put parameter obs.
 * @param {string} route The route.
 * @param {any} body The body are parameters.
 * @returns object Promise<any>
 */
  public async SendPUTWParamObsRP(route: string, body: any, token:string): Promise<any> {
    return await firstValueFrom(this.http.put((environment.URLApi+ route), body, {headers:new HttpHeaders({
      'Accept': 'application/json; charset=utf-8',
      'Content-Type': 'application/json',
      'Authorization': token
    })})).then((data) => { 
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  }

  /**
 * Sends the post parameter obs with parameters
 * @param {string} route The route.
 * @param {any} body The body are parameters.
 * @returns object Promise<any>
 */
  public async SendPOSTObs(route: string): Promise<any> {
    return await firstValueFrom(this.http.post(environment.URLApi + route, null)).then((data: any) => {
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });

    //return this.http.post(this.BaseUrl + route, null).map((data: any) => {
    //  return data;
    //});
  }

   /**
 * Sends the post parameter obs with parameters
 * @param {string} route The route.
 * @param {any} body The body are parameters.
 * @returns object Promise<any>
 */
   public async SendPOSTObsWHeader(route: string): Promise<any> {
    return await firstValueFrom(this.http.post((environment.URLApi + route), {}, this.httpOptionsPlainAut)).then((data: any) => {
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        return error.error;
      }
    });
  }

  private handleError(error: HttpErrorResponse) {
    alert("entro al error");
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

    /*.catch((err: HttpErrorResponse) => {
      // simple logging, but you can do a lot more, see below
      console.error('Se ha presentado un error:', err.error);
    });
  }*/
  // public async SendPOSTWParamObs(route: string, body: any): Promise<any> {
  //   return  this.http.post((environment.URLApi+ route), body, this.httpOptionsPlain).pipe(catchError(this.handleError));
  //   /*.catch((err: HttpErrorResponse) => {
  //     // simple logging, but you can do a lot more, see below
  //     console.error('Se ha presentado un error:', err.error);
  //   });
  // }

  /*public async SendPOSTWParamObs(route: string, body: any): Promise<any> {
    let result;
    this.http.post((environment.URLApi+ route), body, this.httpOptionsPlain).subscribe((data:any) => {
          result = data;
          console.log("This should be the response???: ", data);
        },
        err => {
          console.log("err: ", err);
        });
      return result;
  }*/

  // handleError(error: HttpErrorResponse) {
  //   return throwError(error);
  // }

  /**
   * Sends the delete method.
   * @param {string} route The route is a parameter of request delete.
   * @returns object Promise<any>
   */
  public async SendDelete(route: string): Promise<any> {
    return firstValueFrom(this.http.delete((environment.URLApi + route))).then((data: any) => {
      return data;
    },
    (error:HttpErrorResponse) => {
      if(!this.CloseSesion(error))
      {
        console.error('An error occurred:', error.error);
        return error.error;
      }
    });
  }

  private CloseSesion(error:HttpErrorResponse):boolean
  {
    console.log('Error: ' + error.message);
    console.error(error);
    if(error.error.message.includes("El token ha expirado") || error.error.message.includes("Se requiere un token") || error.error.message.includes("Token inválido"))
      {
        setTimeout(() =>{ 
          sessionStorage.clear();
          window.location.href = '/';
        });
      }
      return false;
  }
}
