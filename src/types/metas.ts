import { SetoresProps } from "./setores";


export interface MetasProps {

  id_meta: number,
  id_conta: string,
  id_grupo: number,
  descricao: string,
  valor: number,
  date: Date,
  grupo: SetoresProps

}
