import React, { useContext, useEffect, useState } from 'react';
import SorteioButton from '../../components/sorteador';
import { AuthContext } from '@/contexts/AuthContext';
import {useSpring,animated}from 'react-spring'
import { toast } from 'react-toastify';
import { api } from '@/services/apiClient';
import Confetti from 'react-confetti';
import {useWindowSize} from 'react-use';



interface DadosProps{
  id_contrato:number,
  associado:{nome:string,endereco:string,bairro:string},
  mensalidade:Array<{vencimento:Date}>
}




export default function Sorteios(){
  const {usuario,signOut} = useContext(AuthContext)
  const [sorteado, setSorteado] = useState<number>(0);
  const [dadosSorteio,setSorteio]=useState<Array<DadosProps>>([]);
  const [arrayContratos,setArrayContratos]= useState<Array<number>>()
  const { width, height } = useWindowSize();
  const [ativarConfete,setConfetes]=useState(false)
  const [ganhador,setGanhador] =useState<Partial<DadosProps>>({})

  const handleBuscarCliente= ()=>{
    toast.info('ANIMAÇÃO PAROU!')
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
        const response = await api.get('/sorteio')
        const dadosArray:Array<DadosProps> = response.data
        const contratos = dadosArray.map(item=>{return item.id_contrato})
       setArrayContratos(contratos)
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
   

     <div className='p-2'>
      <h1 className="text-2xl font-bold mb-4 text-white">Sorteio de Números</h1>
      <div className='flex gap-2'>
      <button
        onClick={sortearNumero}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        SORTEAR
      </button>
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
  
  

    </div>

    
    </>
   
  )
}


