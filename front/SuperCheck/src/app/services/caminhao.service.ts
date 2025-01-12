import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api.token';

export interface Caminhao {
  id: string;
  placa: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaminhaoService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/caminhoes`;
  }

  getList(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(this.baseUrl);
  }
}
