import { FilteredAndPagedGetListInput } from "./filtered-and-paged-get-list-input";
import { PagedResultDto } from "./paged-result-dto";

export interface ChecklistTemplate {
    id: string;
    nome: string;
    categoriaId: string;
}

export interface GetChecklistTemplateListInput extends FilteredAndPagedGetListInput {
}

export interface ChecklistTemplatePagedResult extends PagedResultDto<ChecklistTemplate> {
}
