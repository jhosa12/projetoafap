import { GruposProps } from "./grupos";

export interface MetasProps {

  id_meta: number,
  id_conta: string,
  id_grupo: number,
  descricao: string,
  valor: number,
  date: Date,
  grupo: GruposProps

}
