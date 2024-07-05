import Image from "next/image";
import logo from "../../../public/logoafap.png"
import carteiraDep from "../../../public/CarteiraDep2019.jpg"
// DocumentTemplate.js

import React from 'react';
interface DadosProps {
  dependentes: Array<Partial<{
    nome: string,
    data_nasc: Date,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    close: boolean,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string,
  
  }>>
  contrato: number,
  plano:string,

}


class DocumentTemplate extends React.Component<DadosProps> {

  render() {
    const { dependentes,
      contrato,
      plano,
    } = this.props;

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // Dia da semana por extenso
      year: 'numeric', // Ano completo
      month: 'long', // Mês por extenso
      day: 'numeric' // Dia do mês
    };
    const dataAtual = new Date();
    const dt = dataAtual.toLocaleDateString('pt-BR', options)

    return (
      <div className='flex flex-col w-full px-2 '>

        <div className="grid  grid-flow-row-dense grid-cols-2 w-full justify-items-center gap-3">

      {dependentes.map((item,index)=>{
        return(
          <div key={index} className="flex col-span-1 relative w-[360px] text-sm text-black justify-center items-center ">
          <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
          <span className="absolute z-20  top-[102px]  left-2">{item.nome}</span>
          <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
          <span className="absolute z-20  top-[131px]  left-[115px]">{item.data_nasc && new Date(item.data_nasc).toLocaleDateString()}</span>
          <span className="absolute z-20  top-[131px]  left-[235px]">{item.grau_parentesco}</span>
          <span className="absolute z-20  top-[161px]  left-2">{plano}</span>
          <span className="absolute z-20  top-[191px]  left-2">{new Date(new Date().getFullYear()+1,new Date().getMonth(),new Date().getDate()).toLocaleDateString()}</span>
          <span className="absolute z-20  top-[191px]  left-[127px]">{item.data_adesao && new Date(item.data_adesao).toLocaleDateString()}</span>
          <span className="absolute z-20  top-[191px]  left-[244px]">{item.carencia && new Date(item.carencia).toLocaleDateString()}</span>
        </div>

        )
      })   }
        </div>
  
      </div>
    );
  }
}

export default DocumentTemplate;