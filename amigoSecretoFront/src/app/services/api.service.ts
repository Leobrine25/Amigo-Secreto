import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createGroup(group: { name_group: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/grupos`, group);
  }

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/grupos`);
  }

  getGroupById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/grupos/${id}`);
  }

  deleteGroup(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/grupos/${id}`);
  }

  addParticipantToGroup(groupId: number, userName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/grupos/${groupId}/participantes`, { userName });
  }

  removeParticipantToGroup(groupId: number, userId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/grupos/${groupId}/participantes`, { body: { userId: userId } });
  }

  generateDraw(groupId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/grupos/${groupId}/sorteio`, {});
  }
}
