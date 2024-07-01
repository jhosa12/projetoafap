import { useEffect, useState } from "react"
import { CadastroPremio } from "./cadastroPremio"
import { api } from "@/services/apiClient"
import { toast } from "react-toastify"
import { ConsultarGanhadores } from "./consultar"

interface PremiosProps{
    id_produto:string,
    descricao: string,
    unidade: string,

    valor_custo: number,
    quantidade: number,
    situacao: string,
    grupo: string,
    tipo: string,
    openModal:boolean
}
interface GanhadoresProps{
    id_contrato:number,
    titular:string,
    endereco:string,
    bairro:string,
    numero:number,
    premio:string,
    data_sorteio:Date,
    status:string
}
export default function ConfigSort(){
    const [menuIndex, setMenuIndex] = useState(1)
    const [arrayPremios,setArrayPremios]=useState<Array<Partial<PremiosProps>>>([])
    const [dataSorteio,setDataSorteio] = useState<Date>(new Date())
    const [arrayGanhadores,setGanhadores] = useState<Array<Partial<GanhadoresProps>>>([])



    const setarDataSorteio = (data:Date)=>{
        setDataSorteio(data)
    }

    useEffect(()=>{
        listarPremios()
        listarGanhadores()
    },[])

    async function listarPremios() {
        const response = await toast.promise(
             api.get('/sorteio/listarPremios'),
            {error:'Erro ao Requisitar Dados',
                pending:'Listando dados.....',
                success:'Dados Carregados'
            }
        )
        setArrayPremios(response.data)
    }

    async function listarGanhadores() {
        try {
            const response = await api.post('/sorteio/listarGanhadores',
                {
                    data_sorteio:dataSorteio
                }
            ) 
            setGanhadores(response.data)
        } catch (error) {
            console.log('erro na requisição')
        }
        
    }

return(
    <div className="flex flex-col  px-4 w-full ">
<ul className="flex flex-wrap mb-1 text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 "  >
  <li className="me-2">
    <button type="button" onClick={() => setMenuIndex(1)} className={`inline-block p-2 border-blue-600 rounded-t-lg hover:border-b-[1px]  hover:text-gray-300  `}>Cadastrar Prêmios</button>
  </li>
  <li className="me-2">
    <button type="button" onClick={() => setMenuIndex(2)} className={`inline-block p-2 border-blue-600  hover:border-b-[1px]  rounded-t-lg   hover:text-gray-300  `}>Consultar Ganhadores</button>
  </li>
  <li className="me-2">
    <button type="button" onClick={() => setMenuIndex(3)} className={`inline-block p-2  rounded-t-lg border-blue-600  hover:border-b-[1px]  hover:text-gray-300  `}>Contas a Pagar/Receber</button>
  </li>
  <li className="me-2">
    <button type="button" onClick={() => setMenuIndex(4)} className={`inline-block p-2  rounded-t-lg border-blue-600  hover:border-b-[1px]  hover:text-gray-300  `}>Relatório Vendas</button>
  </li>

</ul>

{menuIndex===1 && (<CadastroPremio listarPremios={listarPremios} arrayPremios={arrayPremios}/>)}
{menuIndex===2 && (<ConsultarGanhadores listarGanhadores={listarGanhadores} setarDataSorteio={setarDataSorteio} dataSorteio={dataSorteio} arrayGanhadores={arrayGanhadores}/>)}
</div>

)

}

