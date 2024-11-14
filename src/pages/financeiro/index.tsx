import { useContext, useEffect, useState, useCallback } from "react";
import { Button, Checkbox, Dropdown, Label, Tabs } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { IoIosArrowDown, IoMdSettings } from "react-icons/io";
import { AuthContext } from "@/contexts/AuthContext";
import {Caixa} from "@/components/financeiro/caixa/caixa";
import Conferencia from "../../components/financeiro/conferencia/conferencia";
import { PlanodeContas } from "@/components/financeiro/planodeContas/planodeContas";
import { ContasPagarReceber } from "@/components/financeiro/contasPagarReceber/contasPagarReceber";
import GraficoMensalidade from "@/components/graficos/graficoMensalidades";
import { GraficoScreen } from "@/components/financeiro/grafico/screen";
import { FaCalendarAlt } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { HiClipboardList } from "react-icons/hi";
import { BiSolidInjection } from "react-icons/bi";


interface DataProps {
  y: number;
  x: string;
  dt: Date;
  z: number;
  c: number;
  cancelamentos: number;
}


export interface CaixaProps{
  forma_pagamento:string
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

  



 

 



  return (

    <div className="flex flex-col  w-full text-white">

    <Tabs theme={{base: 'bg-white rounded-b-lg',tabpanel:'bg-white rounded-b-lg h-[calc(100vh-104px)]',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-4 py-3 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
      on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
      off:"border-b-2 border-transparent text-black hover:border-gray-700 hover:text-gray-600 "
    }}}}}}}  variant="underline">

<Tabs.Item  active title="Caixa" icon={FaCalendarAlt}>

<Caixa empresas={empresas}   setCcustos={setCcustos}  arrayCcustos={ccustos}/>
   
    </Tabs.Item>

   
    <Tabs.Item title="Plano de Contas" icon={MdAccessTimeFilled}>
    <PlanodeContas empresas={empresas} setListaContas={setListaPlanoContas} listaContas={listaPlanoContas} />;
    </Tabs.Item>

    <Tabs.Item title="Contas a Pagar e Receber" icon={HiClipboardList}>
    <ContasPagarReceber planodeContas={listaPlanoContas}  />
    </Tabs.Item>
    <Tabs.Item title="Grafico" icon={BiSolidInjection}>
    <GraficoScreen empresas={empresas}  />
    </Tabs.Item>
    <Tabs.Item  icon={IoMdSettings}  title="Configurar">
    <Conferencia />
    </Tabs.Item>
  </Tabs>

    </div>

  );
}
