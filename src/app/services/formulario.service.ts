import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  private apiUrl = 'https://servicios.cali.gov.co:9090/PortalApp/rest/api/Pregunta/getOpcionPregunta';

  constructor(private http: HttpClient) {}

  obtenerOpcionesPregunta(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'X-Auth': 'f6de84f4-2ffd-4ac0-8da8-a6281ff4ec11',
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, payload, { headers });
  }
}
