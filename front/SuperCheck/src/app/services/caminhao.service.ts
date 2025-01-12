import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api.token';
import { FilteredAndPagedGetListInput } from '../interfaces/filtered-and-paged-get-list-input';
import { PagedResultDto } from '../interfaces/paged-result-dto';
import { Caminhao } from '../interfaces/caminhao.interface';

@Injectable({
  providedIn: 'root'
})
export class CaminhaoService {
  private readonly baseUrl = `${inject(API_URL)}/caminhoes`;

  constructor(private http: HttpClient) {}

  getList(input: FilteredAndPagedGetListInput): Observable<PagedResultDto<Caminhao>> {
    const params = {
      filter: input.filter || '',
      pageSize: input.pageSize?.toString(),
      skipCount: input.skipCount?.toString()
    };

    return this.http.get<PagedResultDto<Caminhao>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Caminhao> {
    return this.http.get<Caminhao>(`${this.baseUrl}/${id}`);
  }

  create(caminhao: Caminhao): Observable<Caminhao> {
    return this.http.post<Caminhao>(this.baseUrl, caminhao);
  }

  update(id: string, caminhao: Caminhao): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, caminhao);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
