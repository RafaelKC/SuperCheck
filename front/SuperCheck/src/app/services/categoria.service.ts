 import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../tokens/api.token';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Categoria, CreateCategoriaDTO, UpdateCategoriaDTO } from '../interfaces/categoria.interface';
import { FilteredAndPagedGetListInput } from '../interfaces/filtered-and-paged-get-list-input';
import { PagedResultDto } from '../interfaces/paged-result-dto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private baseUrl = `${this.apiUrl}/categorias`;

  private categoriasSubject = new BehaviorSubject<Categoria[]>([]);
  public categorias$ = this.categoriasSubject.asObservable();

  constructor() {
    this.loadCategorias();
  }

  private loadCategorias() {
    this.getList({ pageSize: 100, skipCount: 0, filter: '' }).subscribe({
      next: (result) => {
        this.categoriasSubject.next(result.items);
      }
    });
  }

  public getList(input: FilteredAndPagedGetListInput): Observable<PagedResultDto<Categoria>> {
    return this.http.get<PagedResultDto<Categoria>>(this.baseUrl, { params: { ...input } })
      .pipe(
        tap(result => {
          if (input.pageSize === 100) {
            this.categoriasSubject.next(result.items);
          }
        })
      );
  }

  public getById(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/${id}`);
  }

  public create(categoria: CreateCategoriaDTO): Observable<Categoria> {
    return this.http.post<Categoria>(this.baseUrl, categoria)
      .pipe(
        tap(() => this.loadCategorias())
      );
  }

  public update(id: string, categoria: UpdateCategoriaDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, categoria)
      .pipe(
        tap(() => this.loadCategorias())
      );
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => this.loadCategorias())
      );
  }

  public getDescricaoById(id: string): Observable<string> {
    return this.categorias$.pipe(
      map(categorias => {
        const categoria = categorias.find(c => c.id === id);
        return categoria?.descricao || 'N/A';
      })
    );
  }
}
