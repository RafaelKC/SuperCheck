import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api.token';
import { FilteredAndPagedGetListInput } from '../interfaces/filtered-and-paged-get-list-input';
import { PagedResultDto } from '../interfaces/paged-result-dto';

export interface TemplateItem {
  id?: string;
  templateId: string;
  nome: string;
  order: number;
  observacao?: string;
}

export interface BatchUpdateTemplateItemInput {
  items: TemplateItem[];
}

@Injectable({
  providedIn: 'root'
})
export class TemplateItemService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}

  public getList(templateId: string, input: FilteredAndPagedGetListInput): Observable<PagedResultDto<TemplateItem>> {
    return this.http.get<PagedResultDto<TemplateItem>>(`${this.apiUrl}/checklists/templates/${templateId}/items`, {
      params: { ...input }
    });
  }

  public batchUpdate(templateId: string, input: BatchUpdateTemplateItemInput): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/checklists/templates/${templateId}/items`, input);
  }
}
