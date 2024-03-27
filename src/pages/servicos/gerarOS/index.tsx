
import { api } from "@/services/apiClient";
import { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { HiOutlineSave } from "react-icons/hi";
import { IoIosSave } from "react-icons/io";
import InputMask from 'react-input-mask'
import { ModalBusca } from "@/components/modal";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useRouter } from "next/router";

interface ArrayProps {
    id_produto:number ,
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




export default function GerarOS() {

    const { usuario,data, closeModa,setarServico,servico } = useContext(AuthContext)
    const [plano, setPlano] = useState(true)
    const [falecido, setFalecido] = useState(false);
    const [declarante, setDeclarante] = useState(false);
    const [dadosObito, setObito] = useState(false);
    const [produtos, setProdutos] = useState(false);
    const [velorio, setVelorio] = useState(false);
    const [checagem, setChecagem] = useState(false);
    const [listaProduto, setListaProdutos] = useState<Partial<ArrayProps>>({ descricao_item: "" })
    const [selectProdutos, setselectProdutos] = useState<Array<ListaProdutos>>([])
    const [total, setTotal] = useState<number>()
    
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
        setListaProdutos({ acrescimo: null, desconto: null, descricao_item: "", quantidade: 1, valor_total: null, valor_unit: null })
        const Total = servico.obito_itens?.reduce((total, item) => total = total + Number(item.valor_total), 0)
        setTotal(Total)
        

    }, [servico.obito_itens])

    useEffect(() => {
  
   //   hr_velorio:new Date().toLocaleTimeString('pt-BR',{timeZone:'America/Fortaleza'})
        try {
            listarProdutos()
            if(!servico.id_obitos){
                carregarCheckList()
            }
           

        } catch (err) {
            toast.error('Erro ao Listar CheckList')
        }
    }, [])



    async function listarProdutos() {
        const response = await api.get("/obitos/listarProdutos")
       
        setselectProdutos(response.data)

    }

    async function cadastrarObito(){
        const [hours, minutes] =(servico.hr_velorio??'').split(':');
        const newDate = new Date();
        newDate.setHours(parseInt(hours));
        newDate.setMinutes(parseInt(minutes));
        if(!servico.nome_falecido||!servico.rd_nome){
            toast.info("Preencha todos os campos obrigatórios");
            return;
        }
        const response =await toast.promise(
            api.post("/obitos/adicionarObito",{
                    ...servico,hr_velorio:newDate, obito_itens:servico.obito_itens
            }),
            {
                error:'Erro ao Realizar Cadastro',
                pending:'Cadastrando óbito',
                success:'Cadastrado com sucesso!'
            }
        )
    }


    async function carregarCheckList() {
        const response = await api.get("/obitos/listarCheckList")
        setarServico({...servico,listacheckida:response.data})
        setarServico({...servico,listacheckvolta:response.data})
       
        
       
    }


    function deletarProduto(index: number) {
        if(servico.obito_itens){
            const novoArray = [...servico.obito_itens];
            novoArray.splice(index, 1);
            setarServico({...servico,obito_itens:novoArray})
        }
       
    }

    function alterCheckListIda(index: number) {
        if(servico.listacheckida){
            const novoArra = [...servico.listacheckida];
            novoArra[index].status = !novoArra[index].status;
            setarServico({...servico,listacheckida:novoArra})
        }
       
    }


    function alterCheckListVolta(index: number) {
        if(servico.listacheckvolta){
            const novoArray = [...servico.listacheckvolta];
            novoArray[index].status = !novoArray[index].status
            setarServico({...servico,listacheckvolta:novoArray})
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
    return (
        <>
            {data.closeModalPlano && <ModalBusca />}
            <div className="flex flex-col w-full pl-10 pr-10 pt-4">
              
                <div className="flex flex-row p-2 border-b-[1px] border-gray-600">
                    <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Gerar Ordem de Serviço</h1>
                   
                    <div className="flex flex-row gap-8">
                        <div className="flex items-center ">
                            <input type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
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

                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(false), setChecagem(false), setPlano(true) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Plano</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(true), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(false), setChecagem(false),setPlano(false) }} className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Falecido</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(true), setObito(false), setProdutos(false), setVelorio(false), setChecagem(false), setPlano(false) }} className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Declarante</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(true), setProdutos(false), setVelorio(false), setChecagem(false),setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dados do Óbito</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(true), setVelorio(false), setChecagem(false),setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Produtos e Serviços</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(true), setChecagem(false),setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Velório</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(false), setChecagem(true),setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">CheckLists</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setFalecido(false), setDeclarante(false), setObito(false), setProdutos(false), setVelorio(false), setChecagem(false),setPlano(false) }} className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Documentação</button>
                        </li>
                        <li className="ml-auto flex items-center mr-2">
                        <button  type="button" onClick={()=>cadastrarObito()}  className="inline-flex p-2 text-white font-semibold rounded-lg bg-green-600 gap-1">Salvar<HiOutlineSave size={22}/></button>
                        </li>
                        
                    </ul>


                    {plano && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-6">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  text-white">Nome do Declarante</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">CPF/CNPJ</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">RG</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Endereço</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Numero</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Bairro</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Complemento</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Cidade</label>
                                <input className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">UF</label>
                                <input className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>

                        </div>
                    </div>}

                    {falecido && <div className="rounded-lg p-6 grid grid-flow-row-dense max-h-[calc(100vh-200px)] grid-cols-4 gap-5">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  text-white">Nome do Falecido</label>
                            <input value={servico.nome_falecido} onChange={e=>setarServico({nome_falecido:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Data Nascimento</label>
                            <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.data_nascimento} onChange={e=>e && setarServico({data_nascimento:e})}  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</DatePicker>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Religião</label>
                            <select value={servico.religiao} onChange={e=>setarServico({religiao:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs bg-[#0f172a] border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                                <option value="CATÓLICA">CATÓLICA</option>
                                <option value="EVANGÉLICA">EVANGÉLICA</option>
                            </select>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Sexo</label>
                            <input value={servico.sexo} onChange={e=>setarServico({sexo:e.target.value})}    className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">RG</label>
                            <input value={servico.rg} onChange={e=>setarServico({rg:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">CPF</label>
                            <input value={servico.cpf} onChange={e=>setarServico({cpf:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Estado Civil</label>
                            <select value={servico.estado_civil} onChange={e=>setarServico({estado_civil:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                                <option value="SOLTEIRO(A)">SOLTEIRO(A)</option>
                                <option value="CASADO(A)">CASADO(A)</option>
                            </select>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Certidão de Casamento</label>
                            <input value={servico.certidao_casado} onChange={e=>setarServico({certidao_casado:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Conjuge</label>
                            <input value={servico.conjuge} onChange={e=>setarServico({conjuge:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Naturalidade</label>
                            <input value={servico.naturalidade} onChange={e=>setarServico({naturalidade:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Profissão</label>
                            <input value={servico.profissao} onChange={e=>setarServico({profissao:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Nacionalidade</label>
                            <input value={servico.nacionalidade} onChange={e=>setarServico({nacionalidade:e.target.value})}  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Tipo de Inumado</label>
                            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Cemitério</label>
                            <input value={servico.cemiterio} onChange={e=>setarServico({cemiterio:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Endereço do Cemitério</label>
                            <input value={servico.endereco_cemiterio} onChange={e=>setarServico({endereco_cemiterio:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">

                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Endereço</label>
                            <input value={servico.end_rua} onChange={e=>setarServico({end_rua:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Número</label>
                            <input value={servico.end_numero} onChange={e=>setarServico({end_numero:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Bairro</label>
                            <input value={servico.end_bairro} onChange={e=>setarServico({end_bairro:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Cidade</label>
                                <input value={servico.end_cidade} onChange={e=>setarServico({end_cidade:e.target.value})} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">UF</label>
                                <input value={servico.end_uf} onChange={e=>setarServico({end_uf:e.target.value})} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>

                        </div>

                    </div>}



                    {declarante && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-5">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  text-white">Nome do Declarante</label>
                            <input value={servico.rd_nome} onChange={e=>setarServico({rd_nome:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">CPF/CNPJ</label>
                            <input value={servico.cpf_cnpj} onChange={e=>setarServico({cpf_cnpj:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">RG</label>
                            <input value={servico.rd_rg} onChange={e=>setarServico({rd_rg:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Endereço</label>
                            <input value={servico.rd_endereco} onChange={e=>setarServico({rd_endereco:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Numero</label>
                            <input value={servico.rd_numero} onChange={e=>setarServico({rd_numero:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Bairro</label>
                            <input value={servico.rd_bairro} onChange={e=>setarServico({rd_bairro:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Complemento</label>
                            <input value={servico.rd_complemento} onChange={e=>setarServico({rd_complemento:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Cidade</label>
                                <input value={servico.rd_cidade} onChange={e=>setarServico({rd_cidade:e.target.value})} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">UF</label>
                                <input value={servico.rd_uf} onChange={e=>setarServico({rd_uf:e.target.value})} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>

                        </div>
                    </div>}



                    {dadosObito && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-5">
                        <div className="flex flex-col col-span-1">
                            <label className="block  text-xs font-medium  text-white">Data do Falecimento</label>
                            <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.end_data_falecimento} onChange={e=>e && setarServico({end_data_falecimento:e})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></DatePicker>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Local do Falecimento</label>
                            <input value={servico.end_local_falecimento} onChange={e=>setarServico({end_local_falecimento:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Hora do falecimento</label>
                            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Hora da Solicitação</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                        </div>

                        <div className="flex flex-col col-span-3 ">
                            <label className="block  text-xs font-medium  text-white">Laudo Médico (Causa Morte)</label>
                            <input value={servico.dc_laudo_med} onChange={e=>setarServico({dc_laudo_med:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Número da D.O.</label>
                            <input value={servico.dec_obito_num} onChange={e=>setarServico({dec_obito_num:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Nome do Médico</label>
                            <input value={servico.dc_nome_medico} onChange={e=>setarServico({dc_nome_medico:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">CRM</label>
                            <input value={servico.dc_crm} onChange={e=>setarServico({dc_crm:e.target.value})} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>


                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Data Sepultamento</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.dt_sepultamento} onChange={e=>e && setarServico({dt_sepultamento:e})} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></DatePicker>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Hora Sepultamento</label>
                                <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Tipo</label>
                            <input value={servico.jazigo} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>

                   
                        <div className="flex flex-col col-span-3 ">
                            <label className="block  text-xs font-medium  p-1 text-white">Observações</label>
                            <textarea value={servico.caracterista_corporal} onChange={e=>setarServico({caracterista_corporal:e.target.value})} rows={3} className="whitespace-nowrap uppercase rounded-lg  py-1 px-2 w-full text-xs  bg-transparent border-2   text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></textarea>
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
                                    const novoArray =servico.obito_itens ?[...servico.obito_itens]:[];
                                    novoArray.push(listaProduto)
                                    setarServico({obito_itens:novoArray})}
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
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={servico.dt_velorio} onChange={e=>e && setarServico({dt_velorio:e})} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</DatePicker>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Hora de Saída</label>
                               
            <InputMask
                mask={"99:99"} 
                value={servico.hr_velorio}
                onChange={e=>{
                   setarServico({hr_velorio:e.target.value}) 
                }}
                className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
      
   
                            </div>
                        </div>
                        <div className="flex flex-row gap-x-4 col-span-1 ">
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Data de Retorno</label>
                                <input className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>
                            <div className="flex flex-col">
                                <label className="block  text-xs font-medium  text-white">Hora de Retorno</label>
                                <input className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Copeira</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
                        </div>
                        <div className="flex flex-col col-span-1 ">
                            <label className="block  text-xs font-medium  text-white">Enfermeira</label>
                            <input className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" ></input>
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