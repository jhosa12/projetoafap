import { ConsultoresProps } from "./consultores";

export type SignInProps = {
    user: string,
    password: string,
}

export type UserProps = {
    //id: string,
    nome: string,
    cargo: string,
    dir: string,
    image: string,
}

export type UsuarioProps = {
  
    id: number;
    nome: string;
    usuario: string;
    password: string;
    senhaAtual: string;
    image: string;
    id_user: string;
    cargo: string;
    file: File | undefined;
    avatarUrl: string;
    editar: boolean;
    repSenha: string;
    permissoes: Array<string>;
    consultor: Array<ConsultoresProps>;
    situacao: string;
  
  }