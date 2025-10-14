import { toast } from "sonner"
import { DadosSorteiosProps } from "../../_types/sorteios"


interface SortearNumeroProps {
  premios: any[]
  setLoading: (value: boolean) => void
  dadosSorteio: any[]
  ganhadores: any[]
  setSorteado: (value: number) => void
  setGanhador: (value: Partial<DadosSorteiosProps>) => void
  premioAtual: any

}


export function useSortearNumero({
  premios,
  setLoading,
  dadosSorteio,
  ganhadores,
  setSorteado,
  setGanhador,
  premioAtual
}: SortearNumeroProps) {

  const sortearNumero = () => {


    if (premios[premios?.length - 1].status === 'S') {
      toast.info('Sorteio Encerrado!')
      return
    }
    setLoading(true)
    if (dadosSorteio && dadosSorteio.length > 0) {

      let contrato = 0;
      let vencedor: Partial<DadosSorteiosProps> = {}
      do {
        const sorteio = dadosSorteio[Math.floor(Math.random() * dadosSorteio.length)]
        contrato = sorteio.id_contrato
        vencedor = sorteio

      } while (ganhadores.some(item => item.id_contrato_global === vencedor.id_contrato_global) || premioAtual?.id_empresa !== vencedor.id_empresa)
      setSorteado(contrato);
      setGanhador(vencedor)
    }

  };
  return { sortearNumero }
}