
import { useEffect, useState } from 'react';
import { api } from '@/services/apiClient';
import { GoGoal } from "react-icons/go";
import { GiStairsGoal, GiRotaryPhone } from "react-icons/gi";
import { FaFilter } from "react-icons/fa6";
import "react-datepicker/dist/react-datepicker.css";
import { Button, ButtonGroup, Dropdown, Modal } from 'flowbite-react';

import { ModalVendedor } from '@/components/vendas/modalVendedor';

import { ConsultorList } from '@/components/vendas/ConsultorList';

import { themeLight } from '../admContrato/acordos/screen';

import { IoPrint } from 'react-icons/io5';
import { FaPercentage } from 'react-icons/fa';
import { ModalFiltroMetas } from './modalFiltro';
import { ajustarData } from '@/utils/ajusteData';


// Definindo tipos para os dados que serão utilizados
export interface VendasProps {
    id_consultor: number|null;
    consultor: string;
    _sum: { valor_mensalidade: number };
    _count: { dt_adesao: number };
    situacao: string;
}

export interface MetasProps {
    id_meta: number;
    id_empresa: string
    id_grupo: number;
    id_conta: string;
    valor: number;
    descricao: string;
    date: Date;
    dateFimMeta: Date;
    descricao_grupo: string;
}

export interface SetorProps {
    id_grupo: number;
    descricao: string;
}

export interface ConsultoresProps {
    funcao: string;
    nome: string;
    id_consultor: number;
}

export interface ConsultorLeads {
    id_consultor: number;
    status: string,
    _count: {
        id_lead: number
    }
}

interface ResponseProps {
    grupos: VendasProps[];
    metas: MetasProps[];
    setores: SetorProps[];
    consultores: ConsultoresProps[];
    leads: Array<ConsultorLeads>;
    metaAtual:number,
    startFilter:Date,
    endFilter:Date
}

export function Acompanhamento({ empresa,setores }: { empresa: string,setores: SetorProps[] }) {

    const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [filtro, setFiltro] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVend, setModalVend] = useState<boolean>(false);
    const [vendedor, setVendedor] = useState<VendasProps>({ _count: { dt_adesao: 0 }, _sum: { valor_mensalidade: 0 }, consultor: '', situacao: '',id_consultor:null });
    const [reqData, setData] = useState<ResponseProps>({} as ResponseProps)

    //Função para atualizar os dados de metas


    //Função para buscar dados de vendas
    const dadosVendas = async () => {

        const {dataIni,dataFim} = ajustarData(startDate,endDate)
        try {
            setLoading(true);

            const response = await api.post<ResponseProps>('/vendas/filtro', {
                dataInicio: dataIni,
                dataFim: dataFim,
                id_empresa: empresa
            });


            
            setData(response.data)
         
            setFiltro(false);
            console.log(response.data)

        } catch (error) {
            //console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        dadosVendas();
    }, []);

    // Função para adicionar uma nova meta


    return (
        <>
            <div className="flex flex-col w-full p-2   h-[calc(100vh-56px)] bg-white">


                <div className="inline-flex w-full justify-between  py-2 px-6 rounded-lg text-black">
                    <InfoBlock icon={<GoGoal color='gray' size={30} />} title="META" value={reqData.metaAtual ? (reqData?.metaAtual * reqData?.consultores?.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '0,00'} />
                    <InfoBlock icon={<FaPercentage size={30} color='gray' />} title="PERCENTUAL" value={getPercentual(reqData?.grupos, reqData?.metaAtual, reqData?.consultores)} />
                    <InfoBlock icon={<GiStairsGoal color='gray' size={30} />} title="PRODUZIDO" value={getProduzido(reqData?.grupos)} />
                </div>


                <ButtonGroup className="ml-auto">
                    <Button theme={themeLight} onClick={() =>setFiltro(true)} type="button" color='light' size='xs'><FaFilter className='mr-1 h-4 w-4' />FILTRAR</Button>


                    <Dropdown label="" dismissOnClick={false} renderTrigger={() => <Button theme={{...themeLight, pill: { on: "rounded-r-lg" } }} pill color='light' size='xs'>  <IoPrint className='mr-1 h-4 w-4' /> IMPRIMIR</Button>}>
                        <Dropdown.Item>Relatorio por vendedor</Dropdown.Item>
                        <Dropdown.Item>Relatorio geral</Dropdown.Item>
                        <Dropdown.Item>Earnings</Dropdown.Item>
                        <Dropdown.Item>Sign out</Dropdown.Item>
                    </Dropdown>
                </ButtonGroup>

                <div className="flex w-full mt-1 gap-2">
                    <ConsultorList dados={reqData?.grupos} setModalVend={setModalVend} setVendedor={setVendedor} meta={reqData?.metaAtual ?? 0} />
                </div>
            </div>


            {modalVend && <ModalVendedor leads={reqData?.leads} show={modalVend} setModalVend={setModalVend} vendedor={vendedor} startDate={reqData.startFilter} endDate={reqData.endFilter} />}


            {filtro && <ModalFiltroMetas filtrar={dadosVendas} loading={loading} arraySetores={setores} show={filtro} setFiltro={setFiltro} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />}
        </>
    );
}


const InfoBlock = ({ icon, title, value }: { icon: JSX.Element, title: string, value: string }) => (
    <div className='inline-flex items-center gap-1 text-black'>
        {icon}
        <div className='flex flex-col'>
            <span className='leading-none text-xs'>{title}</span>
            <span className='leading-none'>{value}</span>
        </div>
    </div>
);

// Funções utilitárias para cálculos
const getPercentual = (dados: VendasProps[], meta?: number, consultores?: ConsultoresProps[]) => {
    const totalMeta = meta && consultores ? meta * consultores.length : 0;
    const totalProduzido = dados?.reduce((acc, curr) => acc + Number(curr._sum.valor_mensalidade), 0);
    const percentual = totalMeta ? (totalProduzido / totalMeta) * 100 : 0;
    return `${percentual.toFixed(2)}%`;
};

const getProduzido = (dados: VendasProps[]) => {
    const total = dados?.reduce((acc, curr) => acc + Number(curr._sum.valor_mensalidade), 0);
    return total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
