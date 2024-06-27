import React, { useContext, useEffect, useState } from 'react';
import SorteioButton from '../../components/sorteador';
import { AuthContext } from '@/contexts/AuthContext';
import {useSpring,animated}from 'react-spring'
import { toast } from 'react-toastify';
import { api } from '@/services/apiClient';
import Confetti from 'react-confetti';
import {useWindowSize} from 'react-use';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import fotoFundo from "../../../public/fundoSorteio2.png";
import Image from 'next/image';


interface DadosProps{
  id_contrato:number,
  associado:{nome:string,endereco:string,bairro:string},
  mensalidade:Array<{vencimento:Date}>
}




export default function Sorteios(){
  const {usuario,signOut} = useContext(AuthContext)
  const [sorteado, setSorteado] = useState<number|undefined>(0);
  const [dadosSorteio,setSorteio]=useState<Array<DadosProps>>([]);
  const [arrayContratos,setArrayContratos]= useState<Array<number|undefined>>()
  const { width, height } = useWindowSize();
  const [ativarConfete,setConfetes]=useState(false)
  const [ganhador,setGanhador] =useState<Partial<DadosProps>>({})
  const [loading,setLoading]=useState(false)

  const handleBuscarCliente= ()=>{
 
    if(sorteado!==0){
      setConfetes(true)
     
    }else{
      setGanhador({associado:{nome:'',endereco:'',bairro:''}})
     setConfetes(false);}

    const vencedor = dadosSorteio.find(item=>item.id_contrato===sorteado)
    vencedor &&  setGanhador(vencedor)
 
    
  }
  const sortearNumero = () => {
    if(arrayContratos){
      const numeroSorteado = arrayContratos[Math.floor(Math.random() * arrayContratos.length)];
      setSorteado(numeroSorteado);
     
    }
   
  };
  const props =useSpring({val:sorteado,from:{val:0},config:{duration:2000},onRest:handleBuscarCliente})


  useEffect(()=>{
      try {
        dadosContratos()
        
      } catch (error) {
        
      }
      async function dadosContratos() {
        setLoading(true)
        const response = await api.get('/sorteio')
        const dadosArray:Array<DadosProps> = response.data
        const contratosAtivos = dadosArray.map(item=>{
          const count = item.mensalidade.reduce((acumulador,atual)=>{
            if(new Date(atual.vencimento)<new Date()){
              return acumulador+1
            }
            return acumulador
          },0)
          if(count<=1) return item.id_contrato
        })
        const deferidos = contratosAtivos.filter(item=>item!=null)
       setArrayContratos(deferidos)
      setSorteio(response.data)
       setLoading(false)
    
        
      }
  },[])
  
  return (
    <>
  { /*
 { ativarConfete &&  <Confetti
    width={width}
    height={height}
    recycle={true}
    numberOfPieces={300}
    run={ativarConfete}
    />
}
   

     <div className='p-2'>
      <h1 className="text-2xl font-bold mb-4 text-white">Sorteio de Números</h1>
      <div className='flex gap-2'>
    {!loading ? <button
        onClick={sortearNumero}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        SORTEAR
      </button>: <button
        //onClick={sortearNumero}
        className="inline-flex  justify-center items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled
      >
       <AiOutlineLoading3Quarters size={18} className="animate-spin"/> CARREGANDO DADOS....
      </button>}
      <button
        onClick={()=>{setSorteado(0)}}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        ZERAR
      </button>
    
    </div>
     
    </div>
    <div className='flex w-full items-center justify-center'>
    
   <div  className='inline-flex w-60 h-60 bg-white rounded-s-lg justify-center items-center text-xl text-white '>
    <animated.h1
  
    className='text-8xl lining-nums proportional-nums font-bold text-yellow-600 '
    
    >
      {props.val.to((val)=>Math.floor(val))}
      
    </animated.h1>

    </div>
    <div className='flex flex-col gap-2 text-black  p-4 rounded-e-lg bg-slate-100 h-60'> 
     <span className='font-semibold text-xl'>NOME: {ganhador.associado?.nome}</span>
    <span className=''>ENDEREÇO: {ganhador.associado?.endereco}</span>
    <span className=''>BAIRRO: {ganhador.associado?.bairro}</span>
    </div>
  
  

    </div>*/}
    <div className='relative w-full  max-h-[100vh] overflow-hidden flex items-center justify-center'>
    { ativarConfete &&  <Confetti
    width={width}
    height={height}
    recycle={true}
    numberOfPieces={300}
    run={ativarConfete}
    />
}
      <img alt='' src= '/fundoSorteio2.png' className='flex w-full object-contain h-full'></img>
      <animated.h1
  
  className='absolute top-56 text-8xl lining-nums proportional-nums font-bold text-yellow-500 '
  
  >
    {props.val.to((val)=>Math.floor(val))}
    
  </animated.h1>
{ganhador.associado?.nome && <div className='absolute top-72'>
<div className='flex flex-col gap-2 text-white  p-4 rounded-e-lg '> 
     <span className='font-semibold text-2xl'>{ganhador.associado?.nome}</span>
    <span className='text-center'>Endereço: {ganhador.associado?.endereco}</span>
    <span className='text-center'>Bairro: {ganhador.associado?.bairro}</span>
    </div>
</div>}


  <div className='absolute top-[600px]'>
    <div className='flex gap-2'>
    {!loading ? <button
        onClick={sortearNumero}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        SORTEAR
      </button>: <button
        //onClick={sortearNumero}
        className="inline-flex  justify-center items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled
      >
       <AiOutlineLoading3Quarters size={18} className="animate-spin"/> CARREGANDO DADOS....
      </button>}
      <button
        onClick={()=>{setSorteado(0)}}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        ZERAR
      </button>
      </div>
    </div>

    </div>

    
    </>
   
  )
}


