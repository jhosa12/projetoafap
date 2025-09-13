import Image from "next/image";
import logo from "../../../public/novaLogo.png"



// DocumentTemplate.js

import React, { Component, forwardRef } from 'react';
interface DadosProps {
  winners: Array<Partial<{
    id_contrato:number,
    titular:string,
    endereco:string,
    bairro:string,
    numero:number,
    premio:string,
    data_sorteio:Date,
    status:string
  }>>
}



const DocumentTemplate =forwardRef<HTMLDivElement,DadosProps>(({
winners
},ref)=>{

  return (
    <div ref={ref} className='flex flex-col w-full p-2 px-6  text-black'>

      <div className="flex justify-center items-center
       mt-4">
        <Image className="flex w-44 h-20 mr-7 " src={logo} alt="" />
      </div>
    
    


    

    

      <h1 className='text-xl text-center font-semibold mt-2'>RELAÇÃO DE GANHADORES - {winners[0]?.data_sorteio && new Date(winners[0]?.data_sorteio).toLocaleDateString('pt-BR',{timeZone:"UTC"})}</h1>
      <div className="flex  justify-center items-center w-full">
       



      </div>

      <div className="flex  justify-center items-center w-full">
<table className="w-full text-[12px]  text-left rtl:text-center  border-black border-solid">
  <thead className="top-0 uppercase border-b-[1px] border-black border-solid">
      <tr>
      <th scope="col" className="px-2 py-1">
             PRÊMIO
          </th>
        
          <th scope="col" className="px-2 py-1">
             TITULAR
          </th>
          <th scope="col" className="px-2 py-1">
              ENDEREÇO
          </th>
          <th scope="col" className="px-2 py-1">
             BAIRRO
          </th>
          <th scope="col" className="px-1 py-1">
             ASSINATURA
          </th>
       
      </tr>
  </thead>
  <tbody className="divide-y  divide-black">
      {winners?.map((item, index) => (
          <tr key={index} >
             <td className="px-2 py-1 whitespace-nowrap text-[12px] border-black">
                  {item.premio}
              </td>
           
              <td className="px-2 py-1 whitespace-nowrap text-[12px]">
                 {item.id_contrato}-{item.titular}
              </td>
              <td className="px-2 py-1  text-[12px]">
                  {item.endereco}
              </td>
              <td className="px-2 py-1 text-[12px]">
                  {item.bairro}
              </td>

              <td className="px-1 py-1 w-2/3 whitespace-nowrap ">
                  {}
              </td>
             
          </tr>
      ))}
  </tbody>
</table>



                          </div>

    </div>
  );
})

   
 
export default DocumentTemplate;
