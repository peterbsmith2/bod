import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Celebrity } from '@bod/celebrities/domain';
import { CELEBRITIES } from './mock-celebrities';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GetCelebritiesService {
  private API_URL =
    'https://api.airtable.com/v0/appkd7lxi8RV4nNHU/celebrities?api_key=keyLErtb18ckdPhpm';

  getCelebs(): Observable<Celebrity[]> {
    return of(CELEBRITIES);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}`).pipe(tap(console.log));
  }

  constructor(private http: HttpClient) {}
}
