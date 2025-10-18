'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
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
  const [ativarConfete, setConfetes] = useState(false);
  const { empresas } = useContext(AuthContext);

  const {
    salvarGanhador,
    ganhador,
    setGanhador,
    listarPremios,
    listarGanhadores,
    premios,
    premioAtual,
    setPremioAtual,
    ganhadores,
    dadosSorteio,
    dadosContratos,
    loading,
    setLoading
  } = useActionsSorteios();

  const { zerarSorteio } = useZerarSorteio({
    setConfetes,
    premios,
    setPremioAtual,
    setSorteado
  });

  const { exibir } = useHandleExibir({
    setConfetes,
    setGanhador
  });

  useEffect(() => {
    ganhador.id_contrato_global && salvarGanhador();
  }, [ganhador.id_contrato_global]);

  const { sortearNumero } = useSortearNumero({
    premios,
    setLoading,
    dadosSorteio,
    ganhadores,
    setSorteado,
    setGanhador,
    premioAtual
  });

  const props = useSpring({
    val: sorteado,
    from: { val: 0 },
    config: { duration: sorteado <= 20 ? 1000 : 2000 },
    onRest: () => {
      exibir(sorteado);
    }
  });

  useEffect(() => {
    try {
      dadosContratos();
      listarPremios();
      listarGanhadores({});
    } catch (error) {
      console.log(error);
    }
    dadosContratos();
  }, []);

  return (
    <>
      {ativarConfete && (
        <Confetti
          width={width}
          height={height}
          recycle={true}
          numberOfPieces={300}
          run={ativarConfete}
        />
      )}

      <div
        className="flex flex-col items-center justify-center min-h-screen w-full px-2 py-2 overflow-auto"
        style={{
          background: "linear-gradient(120deg, #e0f2fe 0%, #fff 100%)"
        }}
      >
        {/* Título */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 drop-shadow-lg text-center w-full">
          Sorteio de Prêmios
        </h1>

        {/* Número sorteado */}
        <div className="mb-8 flex justify-center w-full">
          <animated.div
            className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white shadow-xl rounded-full border-4 border-yellow-400"
            style={{
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.10)',
              background: 'radial-gradient(circle, #fff 70%, #e0f2fe 100%)'
            }}
          >
            <animated.span className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-yellow-500 drop-shadow-lg font-sans">
              {props.val.to(val => Math.floor(val))}
            </animated.span>
          </animated.div>
        </div>

        {/* Cards de prêmio e ganhador */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl justify-center items-stretch mb-4">
          {/* Prêmio */}
          <div className="flex flex-row items-center bg-white rounded-2xl shadow-lg border-2 border-gray-300 p-6 gap-4 flex-1 min-h-[120px]">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white border-2 border-gray-200">
              {premioAtual?.conveniados?.filename ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/file/${premioAtual?.conveniados.filename}`}
                  className="w-14 h-14 rounded-xl object-cover border"
                  alt="Imagem do prêmio"
                />
              ) : (
                <span className="text-4xl">🎁</span>
              )}
            </div>
            <div className="flex flex-col justify-center gap-2">
              <span className="font-semibold text-base text-gray-700">
                Conveniado: <span className="text-gray-900">{premioAtual?.conveniado || "--"}</span>
              </span>
              <span className="font-bold text-xl text-yellow-700">
                Prêmio: <span className="text-gray-900">{premioAtual?.descricao || "--"}</span>
              </span>
              <span className="text-gray-600 text-sm">
                Empresa destino: <span className="font-semibold">{empresas.find(item => item.id === premioAtual?.id_empresa)?.nome || "--"}</span>
              </span>
            </div>
          </div>

          {/* Ganhador */}
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border-2 border-gray-300 p-6 flex-1 min-h-[120px]">
            {ativarConfete ? (
              <>
                <span className="font-bold text-xl text-green-700 mb-2">{ganhador.associado?.nome}</span>
                <span className="text-gray-700 text-base">{ganhador.associado?.endereco} - {ganhador.associado?.bairro}</span>
                <span className="text-gray-700 text-sm">{ganhador.associado?.cidade}</span>
              </>
            ) : (
              <span className="text-gray-400 text-lg">Aguardando sorteio...</span>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col md:flex-row gap-4 mb-2 w-full max-w-3xl justify-center">
          <Button
            disabled={ativarConfete || loading || !premioAtual?.id_premio}
            onClick={sortearNumero}
            className="border-2 bg-blue-800 hover:bg-blue-700 hover:text-white text-white font-bold py-4 px-8 rounded-xl text-lg shadow-md w-full md:w-auto"
            variant='outline'
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-5" /> CARREGANDO...
              </span>
            ) : (
              <>SORTEAR</>
            )}
          </Button>
          <Button
            onClick={zerarSorteio}
            className="border-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-md w-full md:w-auto"
          >
            ZERAR
          </Button>
        </div>
      </div>
    </>
  );
}


