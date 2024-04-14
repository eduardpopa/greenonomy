import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first, map } from 'rxjs';
import { Alumn } from './alumni.models';

interface Response<T> {
  ok: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class AlumniService {
  constructor(private httpClient: HttpClient) {}
  public list(): Observable<Alumn[]> {
    const url = 'http://localhost:8080/api/alumni';
    return this.httpClient
      .get<Response<Alumn[]>>(url)
      .pipe(map((response) => response.data));
  }
  public get(id: string): Observable<Alumn> {
    const url = `/api/alumni/${id}`;
    return this.httpClient
      .get<Response<Alumn>>(url)
      .pipe(map((response) => response.data));
  }
  public add(alumni: Alumn): Observable<Alumn> {
    const url = '/api/alumni';
    return this.httpClient
      .put<Response<Alumn>>(url, alumni)
      .pipe(map((response) => response.data));
  }
  public update(alumni: Alumn): Observable<Alumn> {
    const url = '/api/alumni';
    return this.httpClient
      .post<Response<Alumn>>(url, alumni)
      .pipe(map((response) => response.data));
  }
  public delete(id: string): Observable<string> {
    const url = `/api/alumni/${id}`;
    return this.httpClient
      .delete<Response<string>>(url)
      .pipe(map((response) => response.data));
  }
}
