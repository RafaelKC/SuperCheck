import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api.token';
import { Categoria, CreateCategoriaDTO, UpdateCategoriaDTO } from '../interfaces/categoria.interface';
import { PagedResultDto } from '../interfaces/paged-result-dto';
import { FilteredAndPagedGetListInput } from '../interfaces/filtered-and-paged-get-list-input';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private endpoint = `${this.apiUrl}/categorias`;

  public getList(input: FilteredAndPagedGetListInput): Observable<PagedResultDto<Categoria>> {
    const params = {
      filter: input.filter || '',
      pageSize: input.pageSize.toString(),
      skipCount: input.skipCount.toString()
    };

    return this.http.get<PagedResultDto<Categoria>>(this.endpoint, { params });
  }

  public getById(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.endpoint}/${id}`);
  }

  public create(input: CreateCategoriaDTO): Observable<Categoria> {
    return this.http.post<Categoria>(this.endpoint, input);
  }

  public update(id: string, input: UpdateCategoriaDTO): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}`, input);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
