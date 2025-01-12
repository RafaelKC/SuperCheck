import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api.token';
import { Checklist, CreateUpdateChecklist, GetChecklistListInput } from '../interfaces/checklist.interface';
import { PagedResultDto } from '../interfaces/paged-result-dto';
import { ChecklistStatus } from '../interfaces/checklist-status.enum';
import { ItemStatus } from '../interfaces/item-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/checklists`;
  }

  getList(input: GetChecklistListInput): Observable<PagedResultDto<Checklist>> {
    const params: { [key: string]: string | number | boolean | (string | number | boolean)[] } = {
      filter: input.filter || '',
      pageSize: input.pageSize,
      skipCount: input.skipCount
    };

    if (input.data) {
      params['data'] = input.data.toISOString();
    }
    if (input.categoriasIds?.length) {
      params['categoriasIds'] = input.categoriasIds;
    }
    if (input.caminhoesIds?.length) {
      params['caminhoesIds'] = input.caminhoesIds;
    }
    if (input.motoristasIds?.length) {
      params['motoristasIds'] = input.motoristasIds;
    }
    if (input.statuses?.length) {
      params['statuses'] = input.statuses;
    }

    return this.http.get<PagedResultDto<Checklist>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Checklist> {
    return this.http.get<Checklist>(`${this.baseUrl}/${id}`);
  }

  create(checklist: CreateUpdateChecklist): Observable<Checklist> {
    return this.http.post<Checklist>(this.baseUrl, checklist);
  }

  update(id: string, checklist: CreateUpdateChecklist): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, checklist);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  iniciarExecucao(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/iniciar`, {});
  }

  finalizar(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/finalizar`, {});
  }

  aprovar(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/aprovar`, {});
  }

  reprovar(id: string, observacao: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/reprovar`, JSON.stringify(observacao), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  cancelar(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/cancelar`, {});
  }

  reabrir(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/reabrir`, {});
  }

  canEdit(checklist: Checklist): boolean {
    return checklist.status === ChecklistStatus.Aberta || 
           checklist.status === ChecklistStatus.EmProgresso;
  }

  canEditItems(checklist: Checklist): boolean {
    return checklist.status === ChecklistStatus.Aberta;
  }

  canEditStatus(checklist: Checklist, userId: string): boolean {
    return checklist.status === ChecklistStatus.EmProgresso && 
           checklist.executorId === userId;
  }

  canIniciar(checklist: Checklist): boolean {
    return checklist.status === ChecklistStatus.Aberta;
  }

  canFinalizar(checklist: Checklist, userId: string): boolean {
    return checklist.status === ChecklistStatus.EmProgresso && 
           checklist.executorId === userId &&
           checklist.items.every(i => i.status !== ItemStatus.NaoAvaliada);
  }

  canAprovar(checklist: Checklist): boolean {
    return checklist.status === ChecklistStatus.Completa;
  }

  canReprovar(checklist: Checklist): boolean {
    return checklist.status === ChecklistStatus.Completa;
  }

  canCancelar(checklist: Checklist): boolean {
    return true;
  }

  canReabrir(checklist: Checklist): boolean {
    return checklist.status === ChecklistStatus.Cancelada ||
           checklist.status === ChecklistStatus.NaoAprovada;
  }
}
