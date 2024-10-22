import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import {useSpring,animated, a}from 'react-spring'
import { toast } from 'react-toastify';
import { api } from '@/services/apiClient';
import Confetti from 'react-confetti';
import {useWindowSize} from 'react-use';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import fotoFundo from "../../../public/fundoSorteio2.png";
import Image from 'next/image';
import { Button } from 'flowbite-react';
import { PremioProps } from './configuracoes';


interface DadosProps{
  id_empresa:string,
  id_contrato_global:number,
  id_contrato:number,
  associado:{nome:string,endereco:string,bairro:string,numero:number|null,cidade:string},
 
}

interface GanhadoresProps{
   
    id_contrato:number,
    id_contrato_global:number
   id_empresa:string,
}








export default function Sorteios(){

  const [sorteado, setSorteado] = useState<number>(0);
  const [dadosSorteio,setSorteio]=useState<Array<DadosProps>>([]);
  const [ganhadores,setGanhadores]=useState<Array<GanhadoresProps>>([]);
  const { width, height } = useWindowSize();
  const [ativarConfete,setConfetes]=useState(false)
  const [ganhador,setGanhador] =useState<Partial<DadosProps>>({})
  const [loading,setLoading]=useState(false)

  const [premios,setPremios]=useState<Array<PremioProps>>([])
  const [premioAtual,setPremioAtual]=useState<PremioProps>()


  const lavras = [
    {id_contrato:772,associado:{nome:'ANTONIA MARTINS DA SILVA (TÂNIA)',endereco:'RUA FERROVIÁRIA',bairro:'BOA VISTA',numero:107},mensalidade:[{vencimento:null}]},
    {id_contrato:1462,associado:{nome:'MARIA DO ROSÁRIO LUCENA DA SILVA',endereco:'RUA MARIA ZILDA',bairro:'VILA BANCÁRIA',numero:233},mensalidade:[{vencimento:null}]},
    {id_contrato:1463,associado:{nome:'ANTONIA MARQUES MARCELINO)',endereco:'SITIO COCOS',bairro:'GRANJEIRO',numero:182},mensalidade:[{vencimento:null}]},
    {id_contrato:1464,associado:{nome:'MARIA DASDORES LANDIM PINHEIRO',endereco:'SITIO PITOMBEIRA',bairro:'ARROJADO',numero:null},mensalidade:[{vencimento:null}]},
    {id_contrato:1465,associado:{nome:'SILVANA BISPO DA CONCEIÇÃO',endereco:'SITIO PITOMBEIRA',bairro:'ARROJADO',numero:null},mensalidade:[{vencimento:null}]},
    {id_contrato:1466,associado:{nome:'JOSE NILTON SOARES DOS SANTOS',endereco:'SITIO BRADÃO',bairro:'AMANIUTUBA',numero:null},mensalidade:[{vencimento:null}]},
    {id_contrato:1468,associado:{nome:'MARILIA ALVES DE OLIVEIRA',endereco:'SITIO VOLTA',bairro:'QUITAIUS',numero:null},mensalidade:[{vencimento:null}]}
]


const ZerarSorteio = ()=>{
  setConfetes(false)
  const premioSort = premios?.find(item=>item.status!=='S')
 premioSort ? setPremioAtual(premioSort):setPremioAtual(undefined)
 setSorteado(0)

}


async function listarPremios() {
  const response = await toast.promise(
       api.get('/sorteio/listarPremios'),
      {error:'Erro ao Requisitar Dados',
          pending:'Listando dados.....',
          success:'Dados Carregados'
      }
  )
  setPremios(response.data)
}

  async function salvarGanhador() {
      if(!ganhador.id_contrato_global){
        toast.error('Sorteio não selecionado!')
        return
      }
    try {
    const response = await api.post('/sorteio/salvarGanhador',{
          id_empresa:ganhador.id_empresa,
          id_contrato_global:ganhador.id_contrato_global,
          id_contrato:ganhador.id_contrato,
          bairro:ganhador.associado?.bairro,
          endereco:ganhador.associado?.endereco,
          numero:ganhador.associado?.numero,
          titular:ganhador.associado?.nome,
          premio:premioAtual,
          status:'PENDENTE',
          data_sorteio:new Date()
        })
       

       setPremios(response.data.premios)
       setGanhadores(response.data.ganhadores)
      
    } catch (error) {
      console.log(error)
      toast.error('Erro ao salvar ganhador!')
      
    }
setLoading(false)

    
  }

  async function listarGanhadores() {

    try {
        const response = await api.post('/sorteio/listarGanhadores',
            {
              data_sorteio:undefined
            }
        ) 
        setGanhadores(response.data)
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
   
    
}

  useEffect(()=>{
   ganhador.id_contrato_global && salvarGanhador()
  },[ganhador.id_contrato_global])

  const handleExibir= ()=>{
 
    if(sorteado!==0){
      setConfetes(true)
    }else{
      setGanhador({associado:{nome:'',endereco:'',bairro:'',numero:null,cidade:''}})
     setConfetes(false);
     return;
    }


 
    
  }
  const sortearNumero = () => {
    if(premios[premios.length-1].status==='S'){
      toast.info('Sorteio Encerrado!')
      return
    }
    setLoading(true)
    if(dadosSorteio && dadosSorteio.length > 0) {

      let contrato = 0;
      let vencedor:Partial<DadosProps> = {}
      do {
        const sorteio = dadosSorteio[Math.floor(Math.random() * dadosSorteio.length)]
         contrato= sorteio.id_contrato
         vencedor = sorteio
       
      }while (ganhadores.some(item=>item.id_contrato_global===vencedor.id_contrato_global ) || premioAtual?.id_empresa!==vencedor.id_empresa)
      setSorteado(contrato);
      setGanhador(vencedor)
    }
   
  };
  const props =useSpring({val:sorteado,from:{val:0},config:{duration:sorteado<=20?1000:2000},onRest:handleExibir})


  useEffect(()=>{
      try {
        dadosContratos()
        listarPremios()
        listarGanhadores()
        
      } catch (error) {
        console.log(error)  
      }
      async function dadosContratos() {
        
        const response = await api.get('/sorteio')
     
      setSorteio(response.data)
     
      }
  },[])
  
  return (
    <>
 
 { ativarConfete &&  <Confetti
    width={width}
    height={height}
    recycle={true}
    numberOfPieces={300}
    run={ativarConfete}
    />
}
   

     <div className='p-2 bg-white text-black h-[calc(100vh-60px)] rounded-b-lg'>
      <div className='flex flex-col gap-3
       w-full h-full items-center justify-center'>

   <div  className='inline-flex w-60 h-40  bg-white  justify-center items-center text-xl  '>
    <animated.h1
  
    className='text-8xl lining-nums  proportional-nums font-bold text-yellow-500 '
    
    >
      {props.val.to((val)=>Math.floor(val))}
      
    </animated.h1>

    </div>
    <div className='flex flex-row w-full   border-slate-300 justify-center items-center'>

    <div className='flex flex-row gap-2  text-black  '>
      <img src={`${process.env.NEXT_PUBLIC_API_URL}/file/${premioAtual?.conveniados.filename}`} className='w-40 h-40 rounded-lg' />
      <div className='flex flex-col gap-2 justify-center'>
      <span className='font-semibold text-3xl'>{premioAtual?.conveniado}</span>
      <span className='font-semibold text-2xl'>{premioAtual?.descricao}</span>
      </div>
    </div>

    { ativarConfete &&   <div className='flex flex-col gap-2  text-black justify-center items-center p-4 rounded-lg h-60'> 
     <span className='font-semibold text-3xl'> {ganhador.associado?.nome}</span>
    <span className='text-xl'>{ganhador.associado?.endereco} - {ganhador.associado?.bairro}</span>
    <span className='text-xl'>{ganhador.associado?.cidade}</span>

    
    </div>}

    </div>

 
    <div className='flex gap-2'>
     <Button 
        isProcessing={loading}
        disabled={ativarConfete||loading} 
        onClick={sortearNumero}
        className="bg-blue-600 hover:bg-blue-700  font-bold py-2 px-4 rounded"
      >
        SORTEAR
      </Button>
      <Button
        onClick={ZerarSorteio}
        className="bg-green-600 hover:bg-green-700  font-bold py-2 px-4 rounded"
      >
        ZERAR
      </Button>
    
    </div>

    </div>
    
     
    </div>
  
{   /* <div className='relative w-full  h-full overflow-hidden flex items-center justify-center'>
    { ativarConfete &&  <Confetti
    width={width}
    height={height}
    recycle={true}
    numberOfPieces={300}
    run={ativarConfete}
    />
}
      <img alt='' src= '/fundoSorteio2.png' className='flex w-full object-contain h-[100vh]'></img>
      <animated.h1
  
  className='absolute top-56 text-8xl lining-nums proportional-nums font-bold text-yellow-500 '
  
  >
    {props.val.to((val)=>Math.floor(val))}
    
  </animated.h1>
{ganhador.associado?.nome && <div className='absolute top-72'>
<div className='flex flex-col gap-2   p-4 rounded-e-lg '> 
     <span className='font-semibold text-2xl'>{ganhador.associado?.nome}</span>
    <span className='text-center'>Endereço: {ganhador.associado?.endereco}</span>
    <span className='text-center'>Bairro: {ganhador.associado?.bairro}</span>
    </div>
</div>}


  <div className='absolute top-[600px]'>
    <div className='flex gap-2'>
    {!loading ? <button
        onClick={sortearNumero}
        className="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded"
      >
        SORTEAR
      </button>: <button
        //onClick={sortearNumero}
        className="inline-flex  justify-center items-center gap-1 bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded"
        disabled
      >
       <AiOutlineLoading3Quarters size={18} className="animate-spin"/> CARREGANDO DADOS....
      </button>}
      <button
        onClick={()=>{setSorteado(0)}}
        className="bg-green-500 hover:bg-green-700  font-bold py-2 px-4 rounded"
      >
        ZERAR
      </button>
      </div>
    </div>

    </div>*/}

    
    </>
   
  )
}


