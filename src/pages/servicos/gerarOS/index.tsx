
import { api } from "@/services/apiClient";
import { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { HiOutlineSave } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { IoIosSave } from "react-icons/io";
import InputMask from 'react-input-mask'
import { ModalBusca } from "@/components/modal";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Item } from "@/components/dadosTitular";


interface ArrayProps {
    id_produto: number,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}

interface ListaProdutos {

    id_produto: number,
    descricao: string,
    unidade: string,
    valor_custo: number,
    valor_venda: number,
    quantidade: number,
    margem_lucro: number,
    valor_aluguel: number,
    est_inicial: number,
    est_entradas: number,
    est_saidas: number,
    est_saldo: number,
    situacao: string,
    data_inc: Date,
    grupo: string,
    tipo: string,
    taxa_conval: number
}


interface MensalidadeProps {
    id_acordo: number,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    close: boolean,
    status: string,
    usuario: string,
    id_mensalidade: number,
    valor_total: number,
    motivo_bonus: string,
    data_pgto: Date,
    referencia: string,
    index: number
}


interface ConvProps {
    editar: boolean
    id_conv: number | null,
    id_contrato: number | null,
    id_associado: number | null,
    id_dependente: number | null,
    id_contrato_st: string,
    tipo_entrada: string,
    nome: string,
    cpf_cnpj: string,
    data: Date,
    status: string,
    forma_pag: string,
    logradouro: string,
    numero: number | null,
    complemento: string,
    bairro: string,
    cep: string,
    cidade: string,
    uf: string,
    subtotal: number | null,
    descontos: number | null,
    total: number | null,
    logradouro_r: string,
    numero_r: number | null,
    complemento_r: string,
    bairro_r: string,
    cep_r: string,
    cidade_r: string,
    uf_r: string,
    data_inc: Date,
    hora_inc: Date,
    usuario: string,
    obs: string,
    convalescenca_prod: Partial<{
        id_conv: number,
        id_produto: number,
        descricao: string,
        unidade: string,
        grupo: string,
        data: Date,
        data_dev: Date,
        quantidade: number,
        valor: number,
        descontos: number,
        total: number,
        hora: Date,
        cortesia: string,
        retornavel: string,
        status: string
    }>,
    contrato: {
        situacao: string,
        carencia: string,
        associado: {
            nome: string
        }

    }

}

interface ContratoProps {
    id_contrato: number,
    plano: string,
    id_plano: number,
    valor_mensalidade: number,
    dt_adesao: Date,
    dt_carencia: Date,
    situacao: string,
    anotacoes: string,
    consultor: string,
    cobrador: string,
    data_vencimento: Date,
    n_parcelas: number,
    origem: string,
    supervisor: string,
    convalescencia: Array<ConvProps>,
    categoria_inativo: string,
    motivo_inativo: string,
    dt_cancelamento: true,
}
interface AcordoProps {
    total_acordo: number,
    data_inicio: Date,
    data_fim: Date,
    realizado_por: string,
    dt_pgto: Date,
    mensalidade: Array<Partial<MensalidadeProps>>,
    status: string,
    descricao: string,
    metodo: string
    closeAcordo: boolean,
    id_acordo: number,
    visibilidade: boolean
}

interface DependentesProps {
    nome: string,
    data_nasc: Date,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    close: boolean,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string,
    convalescenca: {
        convalescenca_prod: Partial<{
            id_conv: number,
            id_produto: number,
            descricao: string,
            unidade: string,
            grupo: string,
            data: Date,
            data_dev: Date,
            quantidade: number,
            valor: number,
            descontos: number,
            total: number,
            hora: Date,
            cortesia: string,
            retornavel: string,
            status: string
        }>,
    }
}

interface AssociadoProps {
    nome: string,
    data_nasc: Date,
    sexo: string,
    celular1: string, celular2: string, telefone: string,
    id_associado: number,
    endereco: string,
    bairro: string,
    numero: number,
    cidade: string,
    cep: string,
    cpf: string, rg: string
    email: string,
    profissao: string,
    guia_rua: string,
    uf: string,
    mensalidade: Array<MensalidadeProps>,
    contrato: ContratoProps,
    dependentes: Array<DependentesProps>
    acordo: Array<AcordoProps>

}
interface CidadesProps {
    id_cidade: number,
    estado: number,
    uf: string,
    cidade: string
}
interface PlanosProps {
    id_plano: number,
    descricao: string,
    valor: number
}

interface DadosCadastro {
    empresa: string,
    name: string,
    nasc: string,
    sexo: string,
    cep: string,
    endereco: string,
    numero: number,
    bairro: string,
    referencia: string,
    cidade: string,
    uf: string,
    email: string,
    rg: string,
    cpf: string,
    closeModalPlano: boolean,
    closeModalCadastro: boolean
    arraydep: Array<Partial<DependentesProps>>,
    dependente: Partial<DependentesProps>,
    naturalidade: string,
    celular1: string,
    celular2: string,
    telefone: string,
    contrato: Partial<ContratoProps>,
    origem: string,
    profissao: string,
    planos: Array<Partial<PlanosProps>>
    cidades: Array<Partial<CidadesProps>>
    id_associado: number,
    mensalidade: Partial<MensalidadeProps>
    mensalidadeAnt: Partial<MensalidadeProps>
    mensalidadeProx: Partial<MensalidadeProps>,
    closeEditarAssociado: boolean,
    acordo: Partial<AcordoProps>
}


export default function GerarOS() {

    const { usuario, setarServico, servico, signOut } = useContext(AuthContext)
    const [plano, setPlano] = useState(false)
    const [falecido, setFalecido] = useState(true);
    const [declarante, setDeclarante] = useState(false);
    const [dadosObito, setObito] = useState(false);
    const [produtos, setProdutos] = useState(false);
    const [velorio, setVelorio] = useState(false);
    const [checagem, setChecagem] = useState(false);
    const [listaProduto, setListaProdutos] = useState<Partial<ArrayProps>>({ descricao_item: "" })
    const [selectProdutos, setselectProdutos] = useState<Array<ListaProdutos>>([])
    const [total, setTotal] = useState<number>()
    const [titular, setTitular] = useState(false)
    const [dependente, setDependente] = useState(false)
    const [modalDependente, setModalDependente] = useState(false)
    const [componenteMounted, setMounted] = useState(false)
    const [particular, setParticular] = useState(false)
    const [dadosassociado, setDadosAssociado] = useState<AssociadoProps>()
    const [data, setData] = useState<Partial<DadosCadastro>>({ empresa: 'AFAP CEDRO' })


    function closeModa(fields: Partial<DadosCadastro>) {
        setData((prev: Partial<DadosCadastro>) => {
            if (prev) {
                return { ...prev, ...fields };
            } else {
                return { ...fields };
            }
        });
    }




    function setarProdutos(fields: Partial<ArrayProps>) {
        setListaProdutos((prev: Partial<ArrayProps>) => {
            if (prev) {
                return { ...prev, ...fields }
            }
            else {
                return { ...fields }
            }

        })

    }

    useEffect(() => {

        if (titular) {
            setarServico({
                nome_falecido: dadosassociado?.nome,
                data_nascimento: dadosassociado?.data_nasc,
                end_rua: dadosassociado?.endereco,
                end_bairro: dadosassociado?.bairro,
                end_numero: String(dadosassociado?.numero),
                end_cidade: dadosassociado?.cidade
            })

        }

    }, [titular])

    function setarFalecidoDependente({ nome, data_nasc }: { nome: string, data_nasc: Date }) {
        setarServico({
            nome_falecido: nome,
            data_nascimento: data_nasc,
        });
        setModalDependente(false);

    }

    useEffect(() => {
        componenteMounted && carregarDados();
        setParticular(false);
        setMounted(true)
    }, [data.id_associado])


    async function carregarDados() {
        try {
            const response = await api.post('/associado', {
                id_associado: Number(data.id_associado),
                empresa: data.empresa

            })

            setDadosAssociado(response.data);
            console.log(response.data)

        } catch (error) {
            toast.error('Erro na requisição')
        }
    }


    useEffect(() => {
        setListaProdutos({ acrescimo: null, desconto: null, descricao_item: "", quantidade: 1, valor_total: null, valor_unit: null })
        const Total = servico.obito_itens?.reduce((total, item) => total = total + Number(item.valor_total), 0)
        setTotal(Total)

    }, [servico.obito_itens])

    useEffect(() => {
        const user = !!usuario
        if (!user) {
            signOut()
            return;
        }
        //   hr_velorio:new Date().toLocaleTimeString('pt-BR',{timeZone:'America/Fortaleza'})
        try {
            listarProdutos()
            if (!servico.id_obitos) {
                carregarCheckList()
            }
        } catch (err) {
            toast.error('Erro ao Listar CheckList')
        }
    }, [usuario])

    async function listarProdutos() {
        const response = await api.get("/obitos/listarProdutos")

        setselectProdutos(response.data)
    }

    async function cadastrarObito() {
        const [hours, minutes] = (servico.hr_velorio ?? '').split(':');
        const newDate = new Date();
        newDate.setHours(parseInt(hours));
        newDate.setMinutes(parseInt(minutes));
        if (!servico.nome_falecido || !servico.rd_nome) {
            toast.info("Preencha todos os campos obrigatórios");
            return;
        }
        const response = await toast.promise(
            api.post("/obitos/adicionarObito", {
                ...servico, hr_velorio: newDate, obito_itens: servico.obito_itens, tipo_atendimento: particular ? 'PARTICULAR' : 'ASSOCIADO',
                status: servico.listacheckida?.find(item => item.status === false) || servico.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'
            }),
            {
                error: 'Erro ao Realizar Cadastro',
                pending: 'Cadastrando óbito',
                success: 'Cadastrado com sucesso!'
            }
        )
    }




    async function editarObito() {
        await toast.promise(
            api.put('/obitos/editarObito', {
                id_obitos: servico.id_obitos,
                id_contrato: servico.id_contrato,
                id_contrato_st: servico.id_contrato_st,
                id_titular: servico.id_titular,
                plano: servico.plano,
                atendente: servico.atendente,
                tipo_atendimento: servico.tipo_atendimento,
                situacao_contrato: servico.situacao_contrato,
                dec_obito_num: servico.dec_obito_num,
                falecido: servico.falecido,
                nome_falecido: servico.nome_falecido,
                data_nascimento: servico.data_nascimento,
                religiao: servico.religiao,
                naturalidade: servico.naturalidade,
                uf_naturalidade: servico.uf_naturalidade,
                profissao: servico.profissao,
                nacionalidade: servico.nacionalidade,
                nome_pai: servico.nome_pai,
                nome_mae: servico.nome_mae,
                pai_vivo: servico.pai_vivo,
                mae_vivo: servico.mae_vivo,
                endereco_pais: servico.endereco_pais,
                endereco_mae: servico.endereco_mae,
                profissao_pai: servico.profissao_pai,
                profissao_mae: servico.profissao_mae,
                estadocivil_pai: servico.estadocivil_pai,
                estadocivil_mae: servico.estadocivil_mae,
                estado_civil: servico.estado_civil,
                caracterista_corporal: servico.caracterista_corporal,
                sexo: servico.sexo,
                rg: servico.rg,
                cpf: servico.cpf,
                conjuge: servico.conjuge,
                t_eleitor_perg: servico.t_eleitor_perg,
                t_eleitor: servico.t_eleitor,
                zona_seccao: servico.zona_seccao,
                secao: servico.secao,
                cidade_eleitor: servico.cidade_eleitor,
                cemiterio: servico.cemiterio,
                endereco_cemiterio: servico.endereco_cemiterio,
                end_rua: servico.end_rua,
                end_numero: servico.end_numero,
                end_bairro: servico.end_bairro,
                end_cidade: servico.end_cidade,
                end_uf: servico.end_uf,
                end_telefone: servico.end_telefone,
                end_celular: servico.end_celular,
                end_data_falecimento: servico.end_data_falecimento,
                end_local_falecimento: servico.end_local_falecimento,
                end_hora_falecimento: servico.end_hora_falecimento,
                end_hora_informaram: servico.end_hora_informaram,
                end_decl_obito: servico.end_decl_obito,
                dc_laudo_med: servico.dc_laudo_med,
                dc_nome_medico: servico.dc_nome_medico,
                dc_crm: servico.dc_crm,
                rd_nome: servico.rd_nome,
                rd_endereco: servico.rd_endereco,
                rd_numero: servico.rd_numero,
                rd_complemento: servico.rd_complemento,
                rd_bairro: servico.rd_bairro,
                rd_cidade: servico.rd_cidade,
                rd_uf: servico.rd_uf,
                rd_telefone: servico.rd_telefone,
                rd_celular: servico.rd_celular,
                rd_parentesco: servico.rd_parentesco,
                rd_rg: servico.rd_rg,
                rd_profissao: servico.rd_profissao,
                custo: servico.custo,
                vl_avista: servico.vl_avista,
                vl_aprazo: servico.vl_aprazo,
                vl_comissao: servico.vl_comissao,
                vl_total: servico.vl_total,
                saldo: servico.saldo,
                cpf_cnpj: servico.cpf_cnpj,
                vl_servicos: servico.vl_servicos,
                vl_recebimentos: servico.vl_recebimentos,
                vl_saldo: servico.vl_saldo,
                vl_produtos: servico.vl_produtos,
                dt_sepultamento: servico.dt_sepultamento,
                hr_sepultamento: servico.hr_sepultamento,
                jazigo: servico.jazigo,
                local_velorio: servico.local_velorio,
                dt_velorio: servico.dt_velorio,
                hr_velorio: servico.hr_velorio,
                numero_velorio: servico.numero_velorio,
                bairro_velorio: servico.bairro_velorio,
                complemento: servico.complemento,
                cidade_velorio: servico.cidade_velorio,
                uf_velorio: servico.uf_velorio,
                dt_retorno: servico.dt_retorno,
                hr_retorno: servico.hr_retorno,
                copeira: servico.copeira,
                enfermeira: servico.enfermeira,
                veiculo_retirada: servico.veiculo_retirada,
                veiculo_cortejo: servico.veiculo_cortejo,
                ct_nome: servico.ct_nome,
                ct_livro: servico.ct_livro,
                ct_folha: servico.ct_folha,
                ct_termo: servico.ct_termo,
                ct_comarca: servico.ct_comarca,
                ct_dtreg: servico.ct_dtreg,
                ct_end: servico.ct_end,
                ct_bairro: servico.ct_bairro,
                ct_munic: servico.ct_munic,
                ct_tel: servico.ct_tel,
                ct_compet: servico.ct_compet,
                deixa_bens: servico.deixa_bens,
                deixa_testamento: servico.deixa_testamento,
                nb_aposentado: servico.nb_aposentado,
                certidao_casado: servico.certidao_casado,
                listacheckida: servico.listacheckida,
                listacheckvolta: servico.listacheckvolta,
                status: servico.listacheckida?.find(item => item.status === false) || servico.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'

            }),
            {
                error: 'Erro ao atualizar os dados',
                pending: 'Atualizando dados',
                success: 'Dados atualizados com sucesso'
            }
        )

    }





    async function carregarCheckList() {
        const response = await api.get("/obitos/listarCheckList")
        setarServico({ ...servico, listacheckida: response.data })
        setarServico({ ...servico, listacheckvolta: response.data })



    }


    function deletarProduto(index: number) {
        if (servico.obito_itens) {
            const novoArray = [...servico.obito_itens];
            novoArray.splice(index, 1);
            setarServico({ ...servico, obito_itens: novoArray })
        }

    }

    function alterCheckListIda(index: number) {
        if (servico.listacheckida) {
            const novoArra = [...servico.listacheckida];
            novoArra[index].status = !novoArra[index].status;
            setarServico({ ...servico, listacheckida: novoArra })
        }

    }


    function alterCheckListVolta(index: number) {
        if (servico.listacheckvolta) {
            const novoArray = [...servico.listacheckvolta];
            novoArray[index].status = !novoArray[index].status
            setarServico({ ...servico, listacheckvolta: novoArray })
        }

    }




    useEffect(() => {
        if (listaProduto.valor_unit && listaProduto.quantidade) {
            setarProdutos({ valor_total: listaProduto.valor_unit * listaProduto.quantidade })
        }
        if (listaProduto.valor_unit && listaProduto.quantidade) {
            setarProdutos({ valor_total: listaProduto.valor_unit * listaProduto.quantidade + (listaProduto.acrescimo ?? 0) - (listaProduto.desconto ?? 0) })
        }
    }, [listaProduto.quantidade, listaProduto.valor_unit, listaProduto.acrescimo, listaProduto.desconto])

    async function lancarCaixa() {
        const descricoes = servico?.obito_itens?.map(item => `${item.descricao_item} QUANT.: ${item.quantidade}  VALOR: R$${item.valor_total}`);
        const descricaoCompleta = descricoes?.join(' / ')
        try {
            await toast.promise(
                api.post("/obitos/lancarCaixa", {
                    conta: "1.03.006",
                    data: new Date(),
                    datalanc: new Date(),
                    conta_n: "1.03.006",
                    descricao: "ENTRADAS DE OUTRAS AGENCIAS AFAP",
                    historico: `REFERENTE A COMPRA DE: ${descricaoCompleta}`,
                    tipo: 'RECEITA',
                    usuario: usuario?.nome,
                    valor: total,
                    ccustos_id: 2
                }),
                {
                    error: 'Erro ao Confirmar Pagamento',
                    pending: 'Realizando Recebimento em Caixa',
                    success: 'Recebido com sucesso'
                }
            )


        } catch (error) {
            console.log(error)

        }

    }
    return (
        <>
            {data.closeModalPlano && <ModalBusca data={data} carregarDados={carregarDados} closeModa={closeModa} />}

            {modalDependente && dependente && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">

                    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-10 bg-gray-50 ">

                        <div className="fixed flex flex-col p-4 max-h-96  rounded-lg shadow bg-gray-700">
                            <div className="inline-flex border-b-[1px] text-white">
                                <h1>SELECIONE O DEPENDENTE</h1>
                                <button type="button" onClick={() => setModalDependente(false)} className="text-gray-400 bg-transparent rounded-lg text-sm h-4 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                    <IoIosClose size={30} />
                                </button>
                            </div>
                            <ul className="flex flex-col pt-2 overflow-y-auto text-gray-300 gap-2 ">
                                {dadosassociado?.dependentes.map((item, index) => {
                                    return (
                                        item.excluido !== true && <li onClick={() => setarFalecidoDependente({ nome: item.nome, data_nasc: item.data_nasc })} className="flex cursor-pointer hover:bg-gray-700 bg-gray-600 p-1 pl-2 pr-2 rounded-lg ">
                                            {item.nome}
                                        </li>
                                    )

                                })}
                            </ul>

                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col w-full pl-10 pr-10 pt-4">

                <div className="flex flex-row p-2 border-b-[1px] border-gray-600">
                    <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Gerar Ordem de Serviço</h1>

                    <div className="flex flex-row gap-8">
                        <div className="flex items-center ">
                            <input type="checkbox" checked={particular} onChange={() => setParticular(!particular)} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                            <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">PARTICULAR</label>
                        </div>
                        <button onClick={() => closeModa({ closeModalPlano: true })} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                            <IoMdSearch size={20} />
                            Buscar
                        </button>
                    </div>
                </div>
                <div className="flex-col w-full border mt-2 rounded-lg shadow  border-gray-700">

                    <ul className="flex flex-wrap w-full text-sm font-medium text-center  border-b   rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800" role="tablist">

                        {!particular && <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(false), setChecagem(false), setPlano(true) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Plano</button>
                        </li>}
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(true), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(false), setChecagem(false), setPlano(false) }} className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Falecido</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(true), setObito(false), setProdutos(false), setVelorio(false), setChecagem(false), setPlano(false) }} className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Declarante</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(true), setProdutos(false), setVelorio(false), setChecagem(false), setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dados do Óbito</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(true), setVelorio(false), setChecagem(false), setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Produtos e Serviços</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(true), setChecagem(false), setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Velório</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(false), setChecagem(true), setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">CheckLists</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(false), setChecagem(false), setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Documentação</button>
                        </li>
                        <li className="ml-auto flex items-center mr-2">
                            {servico.id_obitos ? <button type="button" onClick={() => editarObito()} className="inline-flex p-2 text-white font-semibold rounded-lg bg-yellow-500 gap-1">Gravar Alterações<HiOutlineSave size={22} /></button> : <button type="button" onClick={() => cadastrarObito()} className="inline-flex p-2 text-white font-semibold rounded-lg bg-green-600 gap-1">Salvar<HiOutlineSave size={22} /></button>}
                        </li>

                    </ul>


                    {plano && !particular && <div className="flex text-white flex-col w-full rounded-lg p-4">

                        {dadosassociado?.id_associado && (<><h1 className="text-lg">{dadosassociado?.contrato.id_contrato} - {dadosassociado?.nome} - CATEGORIA: {dadosassociado?.contrato.plano}</h1>
                            <h3 className="text-sm">SITUAÇÃO: {dadosassociado?.contrato.situacao}</h3>
                            <div>
                                <span className="text-xs">OBSERVAÇÕES:</span>
                                <ul className="pl-4 text-xs list-disc">
                                    <li>Contrato Possui Convalescencia</li>
                                    <li>Contrato Possui 2 mensalidades vencidas</li>
                                    <li>Contrato em Carência</li>
                                </ul>
                            </div>
                            <div className=" mt-2 p-2 bg-gray-600 rounded-lg inline-block max-w-max">
                                <h2>BENEFÍCIOS DO PLANO</h2>
                                <ul className="list-decimal p-2 pl-4 text-sm">
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                    <li>ASSISTÊNCIA DE VELÓRIO</li>
                                </ul>
                            </div>
                        </>
                        )


                        }


                    </div>}

                    {falecido && <>
                        {!particular && <div className="inline-flex gap-8 pl-4 pt-1">
                            <div className="flex items-center ">
                                <input type="checkbox" checked={titular} onClick={() => { setTitular(!titular), setDependente(false) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">TITULAR</label>
                            </div>
                            <div className="flex items-center ">
                                <input type="checkbox" onClick={() => { setDependente(!dependente), setTitular(false), setModalDependente(true) }} checked={dependente} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">DEPENDENTE</label>
                            </div>
                        </div>}
                        <div className="rounded-lg p-6 grid grid-flow-row-dense max-h-[calc(100vh-200px)] grid-cols-4 gap-5">
                            <div className="flex flex-col col-span-1">
                                <label className="block  text-xs font-medium  text-white">Nome do Falecido</label>
                                <input value={servico.nome_falecido} onChange={e => setarServico({ nome_falecido: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Data Nascimento</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.data_nascimento} onChange={e => e && setarServico({ data_nascimento: e })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</DatePicker>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Religião</label>
                                <select value={servico.religiao} onChange={e => setarServico({ religiao: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs bg-[#0f172a] border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                                    <option value="CATÓLICA">CATÓLICA</option>
                                    <option value="EVANGÉLICA">EVANGÉLICA</option>
                                </select>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Sexo</label>
                                <input value={servico.sexo} onChange={e => setarServico({ sexo: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">RG</label>
                                <input value={servico.rg} onChange={e => setarServico({ rg: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">CPF</label>
                                <input value={servico.cpf} onChange={e => setarServico({ cpf: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Estado Civil</label>
                                <select value={servico.estado_civil} onChange={e => setarServico({ estado_civil: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                                    <option value="SOLTEIRO(A)">SOLTEIRO(A)</option>
                                    <option value="CASADO(A)">CASADO(A)</option>
                                </select>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Certidão de Casamento</label>
                                <input value={servico.certidao_casado} onChange={e => setarServico({ certidao_casado: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Conjuge</label>
                                <input value={servico.conjuge} onChange={e => setarServico({ conjuge: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Naturalidade</label>
                                <input value={servico.naturalidade} onChange={e => setarServico({ naturalidade: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Profissão</label>
                                <input value={servico.profissao} onChange={e => setarServico({ profissao: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Nacionalidade</label>
                                <input value={servico.nacionalidade} onChange={e => setarServico({ nacionalidade: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Tipo de Inumado</label>
                                <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Cemitério</label>
                                <input value={servico.cemiterio} onChange={e => setarServico({ cemiterio: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Endereço do Cemitério</label>
                                <input value={servico.endereco_cemiterio} onChange={e => setarServico({ endereco_cemiterio: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">

                            </div>

                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Endereço</label>
                                <input value={servico.end_rua} onChange={e => setarServico({ end_rua: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Número</label>
                                <input value={servico.end_numero} onChange={e => setarServico({ end_numero: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Bairro</label>
                                <input value={servico.end_bairro} onChange={e => setarServico({ end_bairro: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-row gap-x-4 col-span-1 ">
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-white">Cidade</label>
                                    <input value={servico.end_cidade} onChange={e => setarServico({ end_cidade: e.target.value })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-white">UF</label>
                                    <input value={servico.end_uf} onChange={e => setarServico({ end_uf: e.target.value })} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>

                            </div>

                        </div></>}



                    {declarante && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-5">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  text-white">Nome do Declarante</label>
                            <input value={servico.rd_nome} onChange={e => setarServico({ rd_nome: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">CPF/CNPJ</label>
                            <input value={servico.cpf_cnpj} onChange={e => setarServico({ cpf_cnpj: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">RG</label>
                            <input value={servico.rd_rg} onChange={e => setarServico({ rd_rg: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Endereço</label>
                            <input value={servico.rd_endereco} onChange={e => setarServico({ rd_endereco: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Numero</label>
                            <input value={servico.rd_numero} onChange={e => setarServico({ rd_numero: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Bairro</label>
                            <input value={servico.rd_bairro} onChange={e => setarServico({ rd_bairro: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Complemento</label>
                            <input value={servico.rd_complemento} onChange={e => setarServico({ rd_complemento: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Cidade</label>
                                <input value={servico.rd_cidade} onChange={e => setarServico({ rd_cidade: e.target.value })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">UF</label>
                                <input value={servico.rd_uf} onChange={e => setarServico({ rd_uf: e.target.value })} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>

                        </div>
                    </div>}



                    {dadosObito && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-5">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  text-white">Data do Falecimento</label>
                            <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.end_data_falecimento} onChange={e => e && setarServico({ end_data_falecimento: e })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></DatePicker>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Local do Falecimento</label>
                            <input value={servico.end_local_falecimento} onChange={e => setarServico({ end_local_falecimento: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Hora do falecimento</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Hora da Solicitação</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-3 ">
                            <label className="block  text-xs font-medium  text-white">Laudo Médico (Causa Morte)</label>
                            <input value={servico.dc_laudo_med} onChange={e => setarServico({ dc_laudo_med: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Número da D.O.</label>
                            <input value={servico.dec_obito_num} onChange={e => setarServico({ dec_obito_num: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Nome do Médico</label>
                            <input value={servico.dc_nome_medico} onChange={e => setarServico({ dc_nome_medico: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">CRM</label>
                            <input value={servico.dc_crm} onChange={e => setarServico({ dc_crm: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>


                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Data Sepultamento</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.dt_sepultamento} onChange={e => e && setarServico({ dt_sepultamento: e })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></DatePicker>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Hora Sepultamento</label>
                                <input className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Tipo</label>
                            <input value={servico.jazigo} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>


                        <div className="flex flex-col col-span-3 ">
                            <label className="block  text-xs font-medium  p-1 text-white">Observações</label>
                            <textarea value={servico.caracterista_corporal} onChange={e => setarServico({ caracterista_corporal: e.target.value })} rows={3} className="whitespace-nowrap uppercase rounded-lg  py-1 px-2 w-full text-xs  bg-transparent border-2   text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></textarea>
                        </div>
                    </div>}

                    {produtos && <div className="flex flex-col w-full rounded-lg p-6   gap-5">
                        <div className="flex flex-row text-white gap-6 w-full">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
                                <select defaultValue={listaProduto.descricao_item ? listaProduto.descricao_item : ''} onChange={e => {
                                    const item = selectProdutos.find((item) => item.id_produto === Number(e.target.value))
                                    setarProdutos({ descricao_item: item?.descricao, valor_unit: item?.valor_venda, id_produto: item?.id_produto })

                                }} className="block w-full pb-1 pt-1 pr-2 pl-2 appearance-none text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value={''}></option>
                                    {selectProdutos.map((item, index) => {
                                        return (
                                            <option key={item.id_produto} value={item.id_produto}>{item.descricao}</option>
                                        )

                                    })}

                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium  text-white">Valor Unit.</label>
                                <input disabled value={Number(listaProduto.valor_unit)} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium  text-white">Quantidade</label>
                                <input value={Number(listaProduto.quantidade)} onChange={(e) => {
                                    setarProdutos({ quantidade: Number(e.target.value) }),
                                        setarProdutos({ valor_total: listaProduto.valor_unit && listaProduto.quantidade && listaProduto.valor_unit * listaProduto.quantidade })

                                }} autoComplete='off' type="number" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium  text-white">Desconto</label>
                                <input value={Number(listaProduto.desconto)} onChange={(e) => setarProdutos({ desconto: Number(e.target.value) })} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium  text-white">Acrescimo</label>
                                <input value={Number(listaProduto.acrescimo)} onChange={(e) => setarProdutos({ acrescimo: Number(e.target.value) })} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium  text-white">Total</label>
                                <input disabled value={Number(listaProduto.valor_total)} autoComplete='off' type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>
                            <div className="flex items-end">
                                <button onClick={() => {
                                    const novoArray = servico.obito_itens ? [...servico.obito_itens] : [];
                                    novoArray.push(listaProduto)
                                    setarServico({ obito_itens: novoArray })
                                }
                                }
                                    className="flex bg-blue-600 p-1 pl-2 pr-2 rounded-lg ">Adicionar</button>
                            </div>

                        </div>
                        <div className="flex">
                            <table
                                className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                                <thead className="sticky top-0 text-sm  uppercase bg-gray-700 text-gray-400">
                                    <tr>
                                        <th scope="col" className=" px-2 py-1">
                                            Descrição Item
                                        </th>

                                        <th scope="col" className="px-4 py-1">
                                            Valor Unit.
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            Quant.
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            Desconto
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            Acrescimo
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            Valor Total
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            <span >AÇÕES</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servico.obito_itens?.map((item, index) => {


                                        return (<tr key={index} className={`border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
                                            <td className="px-2 py-1">
                                                {item.descricao_item}
                                            </td>
                                            <td className="px-4 py-1">
                                                R${item.valor_unit}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.quantidade}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.desconto && `R$${item.desconto}`}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item.acrescimo && `R$${item.acrescimo}`}
                                            </td>
                                            <td className="px-4 py-1">
                                                R${item.valor_total}
                                            </td>
                                            <td className="px-4 py-1 flex justify-center text-center ">
                                                <button onClick={() => deletarProduto(index)} className=" flex justify-center items-center rounded-lg  px-1 py-1 text-white hover:bg-red-600"><MdClose /></button>
                                            </td>

                                        </tr>)
                                    })}

                                </tbody>

                                <tfoot >
                                    <tr className={`border-b bg-gray-800 border-gray-700  hover:bg-gray-600`}>
                                        <td className="px-4 py-1 text-start font-semibold" colSpan={5}>Total Geral</td>
                                        <td className="px-4 py-1 text-green-500 text-start font-semibold" colSpan={2} >R${total}</td>
                                    </tr>
                                </tfoot>

                            </table>

                        </div>
                        <div className="flex justify-end w-full">
                            {total !== undefined && total > 0 && <button onClick={() => lancarCaixa()} className="flex bg-gray-600 rounded-lg p-2 text-white">Confirmar Pagamento</button>}
                        </div>

                    </div>

                    }


                    {velorio && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-5  h-full">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  text-white">Endereço do Velório</label>
                            <input value={servico.local_velorio} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Número</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Bairro</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-2 ">
                            <label className="block  text-xs font-medium  text-white">Ponto de Referência</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Cidade</label>
                                <input className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">UF</label>
                                <input className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>

                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Data de Saída</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.dt_velorio} onChange={e => e && setarServico({ dt_velorio: e })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</DatePicker>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Hora de Saída</label>

                                <InputMask
                                    mask={"99:99"}
                                    value={servico.hr_velorio}
                                    onChange={e => {
                                        setarServico({ hr_velorio: e.target.value })
                                    }}
                                    className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                />

                            </div>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Data de Retorno</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.dt_retorno} onChange={e => e && setarServico({ dt_retorno: e })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></DatePicker>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Hora de Retorno</label>
                                <input className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Copeira</label>
                            <input value={servico.copeira} onChange={e => setarServico({ copeira: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Enfermeira</label>
                            <input value={servico.enfermeira} onChange={e => setarServico({ enfermeira: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Veiculo Retirada</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Veiculo Cortejo</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>

                    </div>


                    }

                    {checagem && <div className="flex flex-row w-full justify-around rounded-lg p-2   gap-6">    <div className="flex flex-col overflow-y-auto w-1/3 text-white p-2 gap-2 rounded-md bg-gray-600 mt-1 mb-1 max-h-[calc(100vh-250px)] ">
                        <h1 className="border-b-[1px] border-gray-500">Checklist Saída</h1>
                        <ul className="flex flex-col gap-2">
                            {servico.listacheckida?.map((it, index) => {
                                return (
                                    <li className="flex items-center ">
                                        <input checked={it.status} onChange={() => alterCheckListIda(index)} type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                        <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">{it.descricao}</label>
                                    </li>
                                )
                            })}
                        </ul>

                    </div>

                        <div className="flex flex-col overflow-y-auto w-1/3 text-white p-2 gap-2 rounded-md bg-gray-600 mt-1 mb-1 max-h-[calc(100vh-250px)] ">
                            <h1 className="border-b-[1px] border-gray-500">Checklist Retorno</h1>
                            <ul className="flex flex-col gap-2">
                                {servico?.listacheckvolta?.map((item, i) => {
                                    return (
                                        <li className="flex items-center ">
                                            <input checked={item.status} onChange={() => alterCheckListVolta(i)} type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                            <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">{item.descricao}</label>
                                        </li>
                                    )
                                })}
                            </ul>

                        </div>


                    </div>
                    }



                </div>



            </div>
        </>
    )
}