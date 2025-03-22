import { PlanoContasProps } from "@/pages/dashboard/financeiro";

type Conta = {
    id: string;
    descricao: string;
  };
  
  
  export type NodoConta = {
    id: string;
    descricao: string;
    subcontas?: NodoConta[];
  };
  
  export function construirHierarquia(contas: PlanoContasProps[]): NodoConta[] {
    const mapa = new Map<string, NodoConta>();
  
    contas.forEach(({ conta:id, descricao }) => {
      mapa.set(id, { id, descricao, subcontas: [] });
    });
  
    const raiz: NodoConta[] = [];
  
    contas.forEach(({ conta:id }) => {
      const partes = id.split(".");
      partes.pop(); // Remove a última parte para encontrar o pai
      const idPai = partes.length ? partes.join(".") : null;
  
      if (idPai && mapa.has(idPai)) {
        mapa.get(idPai)!.subcontas!.push(mapa.get(id)!);
      } else {
        raiz.push(mapa.get(id)!);
      }
    });
  
    return raiz;
  }
  
  // Exemplo de uso:

  
 // console.log(JSON.stringify(construirHierarquia(contas), null, 2));
  