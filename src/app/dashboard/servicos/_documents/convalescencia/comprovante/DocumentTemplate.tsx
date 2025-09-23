import { ProdutosProps } from "@/app/dashboard/admcontrato/_types/produtos";
import Image from "next/image";

// DocumentTemplate.js

import React, { forwardRef } from 'react';
interface DadosProps {
  nome: string,
  material: ProdutosProps[],
  condicao?: string
}

const DocumentTemplateComprovante = forwardRef<HTMLDivElement, DadosProps>((props, ref) => {
  const { nome, material, condicao } = props;
   
    return (
      <div ref={ref} className='flex flex-col w-full p-2 border-[1px] '>
      <div className="flex  w-full justify-center items-center mt-4">
          <Image className="flex w-44 h-16  " src={"/logoafap.png"} alt="Logo da AFAP" width={160} height={64} />
      </div>
      <h2 className='text-xl text-center font-semibold mt-2'>COMPROVANTE</h2>
      <span className="px-2 pt-2" >Nome do Cliente:{nome}</span>
        <span className="px-2 pt-2" >Data de Devolução:{new Date().toLocaleDateString('pt-BR')}</span>
        

        <div className="my-4">
          <span className="px-2 font-semibold">Itens Devolvidos:</span>
          <ul className="list-disc pl-10 mt-2">
            {material?.map((produto) => (
              <li key={produto.id_produto} className="py-1">
                {produto.quantidade} - {produto.descricao}
              </li>
            ))}
          </ul>
        </div>
      <span className="p-2">Condição do(s) Item(s):{condicao}</span>
      <div className="flex flex-row w-full p-2">
        <div className="flex flex-col w-1/2 p-2 justify-center items-center " >


          <span className="flex w-full border-b-[1px]  border-black"></span>
          <span className="pt-2  text-center ">Assinatura do Recebedor</span>
        </div>




        <div className="flex flex-col w-1/2 p-2 justify-center items-center " >
          <span className="flex w-full border-b-[1px]  border-black"></span>

          <span className="pt-2  text-center ">Assinatura do Resposável pela Entrega</span>
        </div>

      </div>

      <p className=" mx-5 p-2 text-justify">Este comprovante confirma a devolução dos itens listados acima pelo cliente mencionado
        na data indicada. Os itens foram verificados quanto à sua condição e quantidade conforme
        mencionado acima.</p>
      <span className="p-2 text-center">Cedro - {new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', // Dia da semana por extenso
        year: 'numeric', // Ano completo
        month: 'long', // Mês por extenso
        day: 'numeric'
      })}</span>
    </div>
  );
})

DocumentTemplateComprovante.displayName = "DocumentTemplateComprovante";
export default DocumentTemplateComprovante;
