import Image from "next/image";
import logo from "../../../public/logoafap.png"
import carteiraDep from "../../../public/CarteiraDep2019.jpg"
// DocumentTemplate.js

import React from 'react';
interface DadosProps{
    nome:string, 
    logradouro:string,
    bairro:string,
    cidade:string,
    uf:string,
   
    contrato:number,
    
}


class DocumentTemplate extends React.Component<DadosProps> {
   
  render() {
    const {  nome, 
        
        logradouro,
        bairro,
        cidade,
       
       
        contrato,
        } = this.props;

        const options:Intl.DateTimeFormatOptions = {
            weekday: 'long', // Dia da semana por extenso
            year: 'numeric', // Ano completo
            month: 'long', // Mês por extenso
            day: 'numeric' // Dia do mês
          };
          const dataAtual=new Date();
          const dt = dataAtual.toLocaleDateString('pt-BR', options)

    return (
      <div className='flex flex-col w-full px-2 '>
       
      <div className="inline-flex w-full justify-center  gap-3">
    
          <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>
     

    

      <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>

      </div>
      <div className="inline-flex w-full justify-center  gap-3">
      <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>

      </div>
      <div className="inline-flex w-full justify-center  gap-3">
      <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>

      </div>
      <div className="inline-flex w-full justify-center  gap-3">
      <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>

      </div>
      <div className="inline-flex w-full justify-center  gap-3">
      <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">{nome}</span>
        <span className="absolute z-20  top-[131px]  left-2">{contrato}</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>

      </div>
     
     
     
     
        
      </div>
    );
  }
}

export default DocumentTemplate;
