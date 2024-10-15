import { useContext, useEffect, useState, useCallback } from "react";
import { Button, Checkbox, Dropdown, Label } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";
import { AuthContext } from "@/contexts/AuthContext";
import {Caixa} from "@/components/financeiro/caixa/caixa";
import Conferencia from "../../components/financeiro/conferencia/conferencia";
import { PlanodeContas } from "@/components/financeiro/planodeContas/planodeContas";
import { ContasPagarReceber } from "@/components/financeiro/contasPagarReceber/contasPagarReceber";
import GraficoMensalidade from "@/components/graficos/graficoMensalidades";
import { GraficoScreen } from "@/components/financeiro/grafico/screen";


interface DataProps {
  y: number;
  x: string;
  dt: Date;
  z: number;
  c: number;
  cancelamentos: number;
}


export interface CaixaProps{
  
  lanc_id: number,
  num_seq: number,
  conta: string,
  ccustos_id: number,
  id_grupo: number,
  ccustos_desc: string,
  descricao: string,
  conta_n: number,
  data: Date,
  notafiscal: string,
  historico: string,
  tipo: string,
  valor: number,
  valorreal: number,
  valordolar: number,
  modo_inc: string,
  datalanc: Date,
  horalanc: Date,
  usuario: string,
  cod_mens: string,
  cod_conta: number,
  mensalidade:{
    banco_dest:string,
    data_pagto:Date,
    form_pagto:string
  }

}

export interface PlanoContasProps {
  conta: string;
  id_grupo: number;
  descricao: string;
  tipo: string;
  saldo: number;
  perm_lanc: string;
  data: Date;
  hora: Date;
  usuario: string;
  contaf: string;
  check: boolean;
}
export interface CcustosProps{
  id_ccustos:number,
  descricao:string,
  image:string,
  check:boolean
}

export interface GruposProps {
  id_grupo: number;
  descricao: string;
}

interface ContratosProps {
  dt_adesao: Date,
  dt_cancelamento: Date
  _count: {
    dt_adesao: number,
    dt_cancelamento: number
  }
}

interface ResponseProps {
  mensalidade: Array<MensalidadeProps>;
  contratosGeral: Array<ContratosProps>;
}



type MensalidadeProps = {
  data: Date;
  _sum: { valor: number };
  _count: { data: number };
};

export default function LoginFinaceiro() {
  const { empresas } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [menuIndex, setMenuIndex] = useState(1);
  const [listaPlanoContas, setListaPlanoContas] = useState<PlanoContasProps[]>([]);
 
  const [ccustos,setCcustos] = useState<Array<CcustosProps>>([])


  const reqPlanoConta = useCallback(async () => {
    try {
      const planoConta = await api.get('/financeiro/planoContas');
      setListaPlanoContas(planoConta.data);
    } catch (error) {
      toast.error('Erro ao carregar plano de contas.');
    }
  }, []);


  const handleReqCcustos = async () =>{
    try {

      const response = await api.get('/financeiro/caixa/listarCcustos')

      setCcustos(response.data)
      
    }catch(error){
      toast.error('Erro ao carregar plano de contas.');
    }
  }

  useEffect(() => {
    reqPlanoConta();
    handleReqCcustos()
  }, []);

  



  const renderMenuContent = () => {
    switch (menuIndex) {
      case 1:
       return <Caixa empresas={empresas}   setCcustos={setCcustos}  arrayCcustos={ccustos}/>
      case 2:
        return <PlanodeContas empresas={empresas} setListaContas={setListaPlanoContas} listaContas={listaPlanoContas} />;
      case 3:
        return <ContasPagarReceber planodeContas={listaPlanoContas}  />;
      case 4:
        return <GraficoScreen empresas={empresas}  />;
        case 5:
          return <Conferencia />;
      default:
        return null;
    }
  };

 



  return (
    <div className="px-2">
      <div className="flex flex-col  px-4 w-full ">
          <ul className="flex flex-wrap mb-1 text-sm font-medium text-center  border-b  rounded-t-lg  .border-gray-700 text-gray-100 "  >
          <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(1)} className={`inline-block p-2 border-blue-600 rounded-t-lg hover:border-b-[2px]  hover:text-gray-200  `}>Caixa</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(2)} className={`inline-block p-2 border-blue-600 rounded-t-lg hover:border-b-[1px]  hover:text-gray-300  `}>Plano de Contas</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(4)} className={`inline-block p-2 border-blue-600  hover:border-b-[1px]  rounded-t-lg   hover:text-gray-300  `}>Gráficos</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(3)} className={`inline-block p-2  rounded-t-lg border-blue-600  hover:border-b-[1px]  hover:text-gray-300  `}>Contas a Pagar/Receber</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(5)} className={`inline-block p-2  rounded-t-lg border-blue-600  hover:border-b-[1px]  hover:text-gray-300  `}>Conferência de Caixa</button>
            </li>

          </ul>
</div>
   

      <div className=" px-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          renderMenuContent()
        )}
      </div>
    </div>
  );
}
