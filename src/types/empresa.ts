import { PlanosProps } from "./planos"

export interface EmpresaProps{
    id:string,
    nome:string,
    cnpj:string,
    razao_social:string,
    fantasia:string,
    ins_estadual:string,
    endereco:string,
    fone:string,
    celular:string,
    celular2:string,
    email:string,
    email_come:string,
    site:string,
    dias_carencia:number,
    carne_modelo:string,
    cidade_uf:string,
    validade_carteira:number,
    local_pagamento:string,
    arte_car_dep:string,
    instrucoes_carne:string
    logo:File|null
    logoUrl:string,
    cont_clausuras:string
    bancos:Array<{banco:string,agencia:string,conta:string}>
    planos:Array<PlanosProps>
    bairros:Array<{cidade:string,bairro:string}>
    cidades:Array<{cidade:string}>
}