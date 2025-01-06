import React, {  useContext, useEffect, useState } from 'react';
import {useSpring,animated, a}from 'react-spring'
import { toast } from 'react-toastify';
import { api } from '@/services/apiClient';
import Confetti from 'react-confetti';
import {useWindowSize} from 'react-use';
import Image from 'next/image';
import { Button } from 'flowbite-react';
import { PremioProps } from './configuracoes';
import logo from "../../../public/grupoAfap.jpg"
import { AuthContext } from '@/contexts/AuthContext';

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
  const {empresas} = useContext(AuthContext);





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
          cidade:ganhador.associado?.cidade,
          numero:ganhador.associado?.numero,
          titular:ganhador.associado?.nome,
          premio:premioAtual,
          status:'PENDENTE',
          data_sorteio:new Date()
        })
       
console.log(response.data)
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

  const handleExibir= async()=>{
   const audio = new Audio('/audio/som2.mp3');
 
    if(sorteado!==0){
  
  await audio.play();
      setConfetes(true)
   
    }else{
      setGanhador({associado:{nome:'',endereco:'',bairro:'',numero:null,cidade:''}})
     setConfetes(false);
     return;
    }
  }
  const sortearNumero = () => {


    if(premios[premios?.length-1].status==='S'){
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
   

      <div className='flex flex-col gap-3
       w-full items-center justify-center p-2 bg-white text-black h-[calc(100vh-60px)] rounded-b-lg'>

       
   <div  className='inline-flex w-60 h-40  bg-white  justify-center items-center text-xl  '>
    <animated.h1
  
    className='text-8xl lining-nums  proportional-nums font-bold text-yellow-500 '
    
    >
      {props.val.to((val)=>Math.floor(val))}
      
    </animated.h1>

    </div>
    <div className='flex flex-row w-full   justify-center items-center'>

  { premioAtual?.descricao && <div className='flex flex-row gap-2 bg-gray-50 text-black rounded-s-lg border-[1px] border-gray-400 p-3'>
    {premioAtual?.conveniados.filename &&  <img src={`${process.env.NEXT_PUBLIC_API_URL}/file/${premioAtual?.conveniados.filename}`} className='w-40 h-40 rounded-lg' />}
      <div className='flex flex-col gap-2 justify-center'>
      <span className='font-semibold text-3xl'>CONVENIADO: {premioAtual?.conveniado}</span>
      <span className='font-semibold text-2xl'>PRÊMIO: {premioAtual?.descricao}</span>
      <span className='font-semibold text-2xl'>EMPRESA DESTINO: {empresas.find(item=>item.id===premioAtual?.id_empresa)?.nome}</span>
      </div>
    </div>}

    { ativarConfete &&   <div className='flex flex-col bg-gray-50 gap-2 h-full text-black justify-center items-center p-3 rounded-e-lg border-[1px] border-gray-400 '> 
     <span className='font-semibold text-3xl'> {ganhador.associado?.nome}</span>
    <span className='text-xl'>{ganhador.associado?.endereco} - {ganhador.associado?.bairro}</span>
    <span className='text-xl'>{ganhador.associado?.cidade}</span>

    
    </div>}

    </div>

 
    <div className='flex gap-2'>
     <Button 
        isProcessing={loading}
        disabled={ativarConfete||loading||!premioAtual?.id_premio} 
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
  { /* <Image className='rounded-lg  '   src={logo} width={200} height={200} alt="logo" />*/}
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


