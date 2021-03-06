import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '@bod/shared/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '@bod/shared/environments';

@Injectable()
export class AirtableDataService {
  /**
   * TODO: assign API_URL to the URL of the airtable API
   */
  private API_URL;

  /**
   * TODO: enable the getAll method to get the celebrities from airtable
   */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/`);
  }

  constructor(private http: HttpClient) {}
}
