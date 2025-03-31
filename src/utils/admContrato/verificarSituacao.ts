import { ConvProps } from "@/types/associado";
import { MensalidadeProps } from "@/types/financeiro";
import { toast } from "react-toastify";





export const VerificarSituacao = ({situacao,mensalidades,convalescencia,carencia}:{situacao: string, mensalidades:Array<MensalidadeProps>|[],convalescencia:Array<ConvProps>|[],carencia:Date|null})=> {
    if (situacao === 'INATIVO') {
        toast.error('CONTRATO INATIVO');
    }
    let x = 0;

    Array.isArray(mensalidades) &&  mensalidades?.map((item, index) => {
        new Date() >= new Date(item.vencimento) && item.status === 'A' || item.status === 'R' ? (x = x + 1) : '';
    });
    if (x >= 1) {
        toast.warn(`Possui ${x} mensalidades Vencidas`);
    }

    if (convalescencia?.find(item => item.status === 'ABERTO')) {

        toast.info('Possui Material Convalescente!')
    }
    if(carencia && new Date() < new Date(carencia)){
        toast.info('Contrato em Carência!')
    }
}