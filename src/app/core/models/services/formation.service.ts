// formation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../interfaces/formation';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:5000/api/Formation';  // URL de l'API backend

  constructor(private http: HttpClient) { }

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }

  updateFormation(id: number, formation: Formation): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, formation);
  }


  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
