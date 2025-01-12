import { ItemStatus } from './item-status.enum';
import { ChecklistStatus } from './checklist-status.enum';

export interface Checklist {
    id: string;
    categoriaId?: string;
    templateId?: string;
    caminhaoId: string;
    motoristaId: string;
    executorId?: string;
    supervisorId?: string;
    data: Date;
    observacao?: string;
    observacaoReprovacao?: string;
    status: ChecklistStatus;
    items: ChecklistItem[];
    categoria?: any;
    executor?: any;
    motorista?: any;
    caminhao?: any;
    supervisor?: any;
}

export interface ChecklistItem {
    id?: string;
    checklistId: string;
    nome: string;
    order: number;
    observacao?: string;
    status: ItemStatus;
}

export interface CreateUpdateChecklist {
    categoriaId?: string;
    templateId?: string;
    caminhaoId: string;
    motoristaId: string;
    data: Date;
    observacao?: string;
}

export interface GetChecklistListInput {
    filter?: string;
    pageSize: number;
    skipCount: number;
    data?: Date;
    categoriasIds?: string[];
    caminhoesIds?: string[];
    motoristasIds?: string[];
    statuses?: ChecklistStatus[];
}

export interface BatchUpdateChecklistItemInput {
    items: CreateUpdateChecklistItem[];
}

export interface CreateUpdateChecklistItem {
    id?: string;
    nome: string;
    order: number;
    observacao?: string;
}

export interface AvaliarChecklistItemInput {
    status: ItemStatus;
}
