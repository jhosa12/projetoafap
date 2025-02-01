

export interface ConsultoresProps {
    id_consultor: number;
    nome: string;
    funcao: string;
    check:boolean;
    cpf: string,
    rg: string,
    data_nascimento: Date | null,
    cep: string,
    endereco: string,
    numero: string,
    bairro: string,
    cidade: string,
    uf: string,
    telefone: string,
    email: string,
    dt_admissao: Date | null,
    cnh_categoria: string,
    titulo_eleitor: string,
    zona: number,
    secao: number,
    pis_pasep: string,
    grau_instrucao: string,
    nome_conjuge: string,
    n_dependentes: number,
    menores_14: number,
    caso_emergencia: string,
    salario: number,
    contrato_exp: number,
    prorrogacao_cont: number,
    situacao: string,
    
}