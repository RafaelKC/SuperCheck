import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api.token';
import { ChecklistTemplate, ChecklistTemplatePagedResult, CreateUpdateChecklistTemplate, GetChecklistTemplateListInput } from '../interfaces/checklist-template.interface';

@Injectable({
  providedIn: 'root'
})
export class ChecklistTemplateService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private baseUrl = `${this.apiUrl}/checklists/templates`;

  public getList(input: GetChecklistTemplateListInput): Observable<ChecklistTemplatePagedResult> {
    return this.http.get<ChecklistTemplatePagedResult>(this.baseUrl, { params: { ...input } });
  }

  public getById(id: string): Observable<ChecklistTemplate> {
    return this.http.get<ChecklistTemplate>(`${this.baseUrl}/${id}`);
  }

  public create(template: CreateUpdateChecklistTemplate): Observable<ChecklistTemplate> {
    console.log(template)
    return this.http.post<ChecklistTemplate>(this.baseUrl, template);
  }

  public update(id: string, template: CreateUpdateChecklistTemplate): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, template);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
