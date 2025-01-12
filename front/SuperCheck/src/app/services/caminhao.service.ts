import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {API_URL} from '../tokens/api.token';
import {FilteredAndPagedGetListInput} from '../interfaces/filtered-and-paged-get-list-input';
import {PagedResultDto} from '../interfaces/paged-result-dto';

export interface Caminhao {
  id: string;
  placa: string;
  descricao: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaminhaoService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private baseUrl = `${this.apiUrl}/caminhoes`;

  public getList(input: FilteredAndPagedGetListInput): Observable<PagedResultDto<Caminhao>> {
    return this.http.get<PagedResultDto<Caminhao>>(this.baseUrl, {params: {...input}});
  }

  public getById(id: string): Observable<Caminhao> {
    return this.http.get<Caminhao>(`${this.baseUrl}/${id}`);
  }

  public create(caminhao: Caminhao): Observable<Caminhao> {
    return this.http.post<Caminhao>(this.baseUrl, caminhao);
  }

  public update(id: string, caminhao: Caminhao): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, caminhao);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
