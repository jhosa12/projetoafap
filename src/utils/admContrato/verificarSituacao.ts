import { ConvProps } from "@/types/associado";
import { MensalidadeProps } from "@/types/financeiro";
import { toast } from "react-toastify";





export const VerificarSituacao = (situacao: string='', mensalidades:Array<MensalidadeProps>=[],convalescencia:Array<ConvProps>=[])=> {
    if (situacao === 'INATIVO') {
        toast.error('CONTRATO INATIVO');
    }
    let x = 0;

    Array.isArray(mensalidades) &&  mensalidades?.map((item, index) => {
        new Date() >= new Date(item.vencimento) && item.status === 'A' || item.status === 'E' ? (x = x + 1) : '';
    });
    if (x > 1) {
        toast.warn(`Possui ${x} mensalidades Vencidas`);
    }

    if (convalescencia?.find(item => item.status === 'ABERTO')) {

        toast.info('Possui Material Convalescente!')
    }
}