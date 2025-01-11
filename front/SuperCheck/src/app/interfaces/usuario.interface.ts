import { FilteredAndPagedGetListInput } from "./filtered-and-paged-get-list-input";

export enum UsuarioRole {
  Motorista = 0,
  Executor = 1,
  Supervisor = 2
}

export interface Usuario {
  id: string;
  nome: string;
  role: UsuarioRole;
}

export interface GetUsuarioListInput extends FilteredAndPagedGetListInput {
  roles?: UsuarioRole[];
}
