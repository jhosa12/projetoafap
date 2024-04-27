import Grafico from "@/components/graficos/primeirografico";
import { useEffect, useState } from "react";
import { GiExpense } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";
import { BiTransferAlt } from "react-icons/bi";
import { FaBalanceScale } from "react-icons/fa";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";



interface LancamentosProps{
			conta: string,
			descricao: string,
			historico:  string ,
			tipo: string,
			valor: number,
			datalanc: Date,
			
}

interface PlanoContasProps{
 
   conta:string,
   id_grupo: number,
   descricao:string,
   tipo:string,
   saldo: number,
   perm_lanc:string,
   data: Date,
   hora: Date,
   usuario:string,
   contaf:string

}








export default function LoginFinaceiro(){
    const [dropEmpresa,setDropEmpresa] =useState(false)
    const [listaLancamentos,setLancamentos] =useState<Array<LancamentosProps>>([])
    const[nomesPlanos,setNomePlanos] = useState<Array<PlanoContasProps>>([])
    const [despesas,setDespesas] = useState<number>(0)
    const [receitas,setReceitas] = useState<number>(0)
    const [remessa,setRemessa] = useState<number>(0)
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});


    const toogleAberto = (index:number)=>{
      setAbertos((prev)=>({
        ...prev,
        [index]:!prev[index]
      }))

    }
    
    


  useEffect(()=>{
    try {
      listarDados()
    
     
      
    } catch (error) {
      toast.error('Erro ao requitar dados!')
      
    }

  },[])


  async function listarDados() {
  const response =  await api.get('/financeiro/lancamentos');
  setLancamentos(response.data.lancamentos);

  setNomePlanos(response.data.planosdeContas)
  
  }

  useEffect(()=>{
    const calcDespesas = listaLancamentos.reduce((acumulador,atual)=>{
      
      if(atual.tipo==='DESPESA'){
        return Number(acumulador)+Number(atual.valor)
      }
      else{return acumulador} },0 )

setDespesas(calcDespesas)

const calcReceitas = listaLancamentos.reduce((acumulador,atual)=>{
  if(atual.tipo==='RECEITA'){
    return Number(acumulador)+Number(atual.valor)
  }else{
    return acumulador
  }
 

},0)

setReceitas(calcReceitas)




  },[listaLancamentos])





    return(
        <>
<div className="flex">
    {/*<div className="flex flex-col text-white p-6 pt-4 rounded-sm bg-[#2b2e3b] h-full">
        <h1>Filtros</h1>
        
<button  onClick={()=>setDropEmpresa(!dropEmpresa)} className=" text-white whitespace-nowrap  font-medium rounded-lg text-sm px-5 py-2.5 mb-1 text-center inline-flex items-center bg-[#343747] hover:bg-blue-700 focus:ring-blue-800" type="button">Selecione a Empresa<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
</svg>
</button>



{dropEmpresa && <div  className="z-10  w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
    <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCheckboxButton">
      <li>
        <div className="flex items-center">
          <input id="checkbox-item-1" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
          <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">AFAP CEDRO</label>
        </div>
      </li>
      <li>
        <div className="flex items-center">
            <input  id="checkbox-item-2" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
            <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">AFAP LAVRAS</label>
          </div>
      </li>
      <li>
        <div className="flex items-center">
          <input  type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
          <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">VIVA MAIS</label>
        </div>
      </li>
    </ul>
</div>}

<DatePicker dateFormat={"dd/MM/yyyy"} placeholderText="Data Inicio"  onChange={()=>{}} locale={"pt"} required className="block mb-2 mt-1 uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>  
<DatePicker dateFormat={"dd/MM/yyyy"} placeholderText="Data Fim"  onChange={()=>{}} locale={"pt"} required className="block mb-2 uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>  
     
<button  onClick={()=>setDropEmpresa(!dropEmpresa)} className=" text-white whitespace-nowrap  font-medium rounded-lg text-sm px-5 py-2.5 mb-1 text-center inline-flex items-center bg-[#343747] hover:bg-blue-700 focus:ring-blue-800" type="button">Plano de Contas<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
</svg>
</button>
   
    </div>*/}
<div className="flex flex-col p-2 w-full ">
     <div className="flex flex-row w-full text-sm justify-between p-2">
            <div className=" inline-flex text-white p-3 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">

                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense  size={32}/></div>
                <h2 className="flex flex-col" >DESPESAS <span>R$ {despesas}</span></h2>
            </div>
            <div className=" inline-flex text-white p-3 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">
<div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiReceiveMoney size={32}/></div>
<h2 className="flex flex-col" >RECEITAS <span>R$ {receitas}</span></h2>
</div>
<div className=" inline-flex text-white p-3 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">

<div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><BiTransferAlt  size={32}/></div>
<h2 className="flex flex-col" >REMESSA + RECEITA <span>R$ {remessa}</span></h2>
</div>
<div className=" inline-flex text-white p-3 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">

<div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaBalanceScale  size={32}/></div>
<h2 className={`flex flex-col`} >SALDO <span className={`font-semibold  ${(receitas-despesas)<0?"text-red-600":"text-white"}`}>R$ {receitas-despesas}</span></h2>
</div>

</div>
{/*<div className="flex flex-col p-2 ml-2  overflow-y-auto max-h-[520px] text-white bg-[#2b2e3b] rounded-lg w-fit">
{listaLancamentos.length>0 && <Grafico lancamentos={listaLancamentos}/>}
    </div>*/}
    <div className="flex flex-col p-2 ml-2 w-full overflow-y-auto max-h-[400px] text-white bg-[#2b2e3b] rounded-lg ">
      <ul className="flex flex-col w-full p-2 gap-2 text-sm">
        {
          nomesPlanos.map((nome,index)=>{
            const soma = listaLancamentos.reduce((total,item)=>{
              if(item.conta===nome.conta){
                return total+Number(item.valor)
              }
              else{
                return total
              }
            },0)
        
            return(
              <li onClick={()=>toogleAberto(index)} className=" flex flex-col w-full p-2 pl-4 rounded-lg bg-slate-700 uppercase cursor-pointer"><div className="inline-flex w-full items-center"><span className="flex w-full">{nome.descricao}</span> 
              <span className="flex w-full gap-8 justify-end items-center">R$ {soma} <IoIosArrowDown/></span> 
               </div> 
             {abertos[index]&& <ul className="flex flex-col w-full gap-2  ml-6 ">
              {listaLancamentos.map((item,idx)=>{
                return(
                 item.conta===nome.conta && <li className="flex text-xs gap-2"><span>{item.historico}</span> Valor: R$ {item.valor}</li>
                )
              })}
              </ul>}
              </li>
            )
          })
        }
      </ul>
</div>
        

     </div>
</div>
      

        </>
       
    )
}