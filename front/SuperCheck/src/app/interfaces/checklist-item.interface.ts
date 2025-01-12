import { ItemStatus } from './item-status.enum';

export interface ChecklistItem {
  id: string;
  checklistId: string;
  nome: string;
  observacao?: string;
  status: ItemStatus;
  order: number;
}

export interface CreateUpdateChecklistItem {
  id?: string;
  checklistId: string;
  nome: string;
  observacao?: string;
  status: ItemStatus;
  order: number;
}

export interface BatchUpdateChecklistItemsRequest {
  items: CreateUpdateChecklistItem[];
}
