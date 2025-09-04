import { ConvProps } from "@/app/dashboard/admcontrato/_types/associado";
import { MensalidadeProps } from "@/types/financeiro";
import { toast } from "sonner";






export const VerificarSituacao = ({ situacao, mensalidades, convalescencia, carencia }: { situacao: string, mensalidades: Array<MensalidadeProps> | [], convalescencia: Array<ConvProps> | [], carencia: Date | null }) => {
    if (situacao === 'INATIVO') {
        toast.error('CONTRATO INATIVO');
    }
    let x = 0;

    Array.isArray(mensalidades) && mensalidades?.map((item, index) => {
        if (new Date(item.vencimento) <= new Date()
            && ['A', 'R'].includes(item.status)) {
            x++;
        }
    });
    if (x >= 1) {
        toast.warning(`Possui ${x} mensalidades Vencidas`);
    }

    if (convalescencia?.find(item => item.status === 'ABERTO')) {

        toast.info('Possui Material Convalescente!')
    }
    if (carencia && new Date() < new Date(carencia)) {
        toast.info('Contrato em Carência!')
    }
}