'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useSpring, animated, a } from 'react-spring'
import { api } from '@/lib/axios/apiClient';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/store/AuthContext';
import { useActionsSorteios } from './_hooks/useActionsSorteios';
import { useHandleExibir } from './_hooks/sorteios/useHandleExibir';
import { useZerarSorteio } from './_hooks/sorteios/useZerarSorteio';
import { useSortearNumero } from './_hooks/sorteios/useSortearNumero';
import { Spinner } from "@/components/ui/spinner";






export default function Sorteios() {

  const [sorteado, setSorteado] = useState<number>(0);
  const { width, height } = useWindowSize();
  const [ativarConfete, setConfetes] = useState(false)

  const { empresas } = useContext(AuthContext);

  const {
    salvarGanhador,
    ganhador,
    setGanhador,
    listarPremios,
    listarGanhadores,
    setSorteio,
    premios,
    premioAtual,
    setPremioAtual,
    ganhadores,
    dadosSorteio,
    loading,
    setLoading

  } = useActionsSorteios()




  const { zerarSorteio } = useZerarSorteio({
    setConfetes,
    premios,
    setPremioAtual,
    setSorteado
  })

  const { exibir } = useHandleExibir({
    setConfetes,
    setGanhador
  })


  useEffect(() => {
    ganhador.id_contrato_global && salvarGanhador()
  }, [ganhador.id_contrato_global])


  const { sortearNumero } = useSortearNumero({
    premios,
    setLoading,
    dadosSorteio,
    ganhadores,
    setSorteado,
    setGanhador,
    premioAtual
  })

  const props = useSpring({
    val: sorteado,
    from: { val: 0 },
    config: { duration: sorteado <= 20 ? 1000 : 2000 },
    onRest: () => {
      exibir(sorteado)
    }
  })


  useEffect(() => {

    try {
      dadosContratos()
      listarPremios()
      listarGanhadores({})

    } catch (error) {
      console.log(error)
    }
    async function dadosContratos() {

      const response = await api.get('/sorteio')

      setSorteio(response.data)

    }
  }, [])




  return (
    <>

      {ativarConfete && <Confetti
        width={width}
        height={height}
        recycle={true}
        numberOfPieces={300}
        run={ativarConfete}
      />
      }


      <div className='flex flex-col gap-3
       w-full items-center justify-center p-2 bg-white text-black h-[calc(100vh-60px)] rounded-b-lg'>


        <div className='inline-flex w-60 h-40  bg-white  justify-center items-center text-xl  '>
          <animated.h1

            className='text-8xl lining-nums  proportional-nums font-bold text-yellow-500 '

          >
            {props.val.to((val) => Math.floor(val))}

          </animated.h1>

        </div>
        <div className='flex flex-row w-full   justify-center items-center'>

          {premioAtual?.descricao && <div className='flex flex-row gap-2 bg-gray-50 text-black rounded-s-lg border-[1px] border-gray-400 p-3'>
            {premioAtual?.conveniados.filename && <img src={`${process.env.NEXT_PUBLIC_API_URL}/file/${premioAtual?.conveniados.filename}`} className='w-40 h-40 rounded-lg' />}
            <div className='flex flex-col gap-2 justify-center'>
              <span className='font-semibold text-3xl'>CONVENIADO: {premioAtual?.conveniado}</span>
              <span className='font-semibold text-2xl'>PRÊMIO: {premioAtual?.descricao}</span>
              <span className='font-semibold text-2xl'>EMPRESA DESTINO: {empresas.find(item => item.id === premioAtual?.id_empresa)?.nome}</span>
            </div>
          </div>}

          {ativarConfete && <div className='flex flex-col bg-gray-50 gap-2 h-full text-black justify-center items-center p-3 rounded-e-lg border-[1px] border-gray-400 '>
            <span className='font-semibold text-3xl'> {ganhador.associado?.nome}</span>
            <span className='text-xl'>{ganhador.associado?.endereco} - {ganhador.associado?.bairro}</span>
            <span className='text-xl'>{ganhador.associado?.cidade}</span>


          </div>}

        </div>


        <div className='flex gap-2'>
          <Button
            disabled={ativarConfete || loading || !premioAtual?.id_premio}
            onClick={sortearNumero}
            className="bg-blue-600 hover:bg-blue-700 font-bold py-6 px-8 rounded"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-6" /> CARREGANDO...
              </span>
            ) : (
              "SORTEAR"
            )}
          </Button>
          <Button
            onClick={zerarSorteio}
            className="bg-green-600 hover:bg-green-700  font-bold py-6 px-8 rounded"
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


