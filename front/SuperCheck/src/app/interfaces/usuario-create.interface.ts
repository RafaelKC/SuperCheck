import { UsuarioRole } from './usuario.interface';

export interface UsuarioCredential {
  login: string;
  password: string;
}

export interface CreateUsuarioInput {
  nome: string;
  role: UsuarioRole;
  credential: UsuarioCredential;
}

export interface CreateMotoristaInput {
  nome: string;
}
