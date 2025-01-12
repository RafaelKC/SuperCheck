import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api.token';
import { GetUsuarioListInput, Usuario } from '../interfaces/usuario.interface';
import { CreateMotoristaInput, CreateUsuarioInput } from '../interfaces/usuario-create.interface';
import { PagedResultDto } from '../interfaces/paged-result-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}

  public getList(input: GetUsuarioListInput): Observable<PagedResultDto<Usuario>> {
    let params = new HttpParams()
      .set('skipCount', input.skipCount?.toString())
      .set('pageSize', input.pageSize?.toString());

    if (input.filter) {
      params = params.set('filter', input.filter);
    }

    if (input.roles && input.roles.length > 0) {
      input.roles.forEach(role => {
        params = params.append('roles', role.toString());
      });
    }

    return this.http.get<PagedResultDto<Usuario>>(`${this.apiUrl}/usuarios`, { params });
  }

  public createUsuario(input: CreateUsuarioInput): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, input);
  }

  public createMotorista(input: CreateMotoristaInput): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios/motorista`, input);
  }
}
