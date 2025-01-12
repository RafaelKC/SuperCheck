import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api.token';
import { PagedResultDto } from '../interfaces/paged-result-dto';

export interface Motorista {
  id: string;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/usuarios/motoristas`;
  }

  getList(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(this.baseUrl);
  }
}
