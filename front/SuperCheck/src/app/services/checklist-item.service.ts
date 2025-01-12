import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {API_URL} from '../tokens/api.token';
import {BatchUpdateChecklistItemsRequest, ChecklistItem} from '../interfaces/checklist-item.interface';
import {PagedResultDto} from '../interfaces/paged-result-dto';
import {FilteredAndPagedGetListInput} from '../interfaces/filtered-and-paged-get-list-input';
import {ItemStatus} from '../interfaces/item-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ChecklistItemService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/checklists`;
  }

  getList(checklistId: string, input: FilteredAndPagedGetListInput): Observable<PagedResultDto<ChecklistItem>> {
    const params: { [key: string]: string | number | boolean } = {
      filter: input.filter || '',
      pageSize: input.pageSize,
      skipCount: input.skipCount
    };

    return this.http.get<PagedResultDto<ChecklistItem>>(`${this.baseUrl}/${checklistId}/items`, { params });
  }

  batchUpdate(checklistId: string, request: BatchUpdateChecklistItemsRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${checklistId}/items`, request);
  }

  avaliarItem(itemId: string, checklistId: string, status: ItemStatus): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${checklistId}/items/${itemId}`, { status });
  }
}
