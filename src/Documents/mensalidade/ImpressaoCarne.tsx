
import BarCode from 'react-barcode';

// DocumentTemplate.js

import React from 'react';


interface MensalidadeProps {
    id_contrato: number,
    associado: string,
    n_doc: string,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    close: boolean,
    status: string,
    id_mensalidade: number,
   // valor_total: number,
    referencia: string,
}
interface DadosAssociado{
    nome:string,
    endereco:string,
    plano:string
    bairro:string,
    numero:number,
    cidade:string
    uf:string,
    id_contrato:number
}
interface DadosProps {
    dadosAssociado:DadosAssociado
    arrayMensalidade: Array<Partial<MensalidadeProps>>
}


class ImpressaoCarne extends React.Component<DadosProps> {

    render() {
        const { dadosAssociado, arrayMensalidade } = this.props;
      
          return (
            <ul className="flex flex-col w-full justify-center items-center gap-4 ">
                {arrayMensalidade?.map((item, index) => (

               
                        <li style={{
                            display: 'flex',
                            backgroundImage: "url('/carneAtualizado.png')",
                            pageBreakInside: 'avoid',
                            height: '250px',
                            width: '100%',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }} className="inline-flex  w-full text-black text-xs  ">

                            {//  <Image src={carne} className=" object-cover  h-[250px]" alt="modeloCarne"  />
                            }
                            <div className="flex flex-col space-y-4 pl-8   " style={{ width: '28%' }}>
                                <h1 className="mt-2 " style={{ fontSize: '13px' }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>
                                <div className="inline-flex pl-8 w-full ">
                                    <span>{item.parcela_n}</span>
                                    <span className="flex w-full justify-end">{item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                                </div>


                                <span className="flex pl-5 w-full justify-end">{Number(item.valor_principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>


                                <span className="flex w-full justify-end">{Number(item.valor_principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>



                                <span className="flex w-full justify-end">{new Date().toLocaleDateString('pt-BR')}</span>



                                <div className="flex flex-col  justify-start w-full ">
                                    <span style={{fontSize:'9px'}}>{dadosAssociado.nome}</span>
                                    <span style={{fontSize:'9px'}}>{dadosAssociado.endereco}- {dadosAssociado.numero}</span>
                                    <span style={{fontSize:'9px'}}>{dadosAssociado.bairro}-{dadosAssociado.cidade}/{dadosAssociado.uf}</span>


                                </div>

                                <div className="inline-flex  w-full ">

                                    <span className="flex w-full justify-center ">{dadosAssociado.id_contrato}</span>
                                </div>

                            </div>








                            <div className="flex flex-col  space-y-3 pl-8  " style={{ width: '70%' }}>
                                <h1 className="mt-2  " style={{ fontSize: '13px', fontWeight: 'bold' }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>

                                <div className="inline-flex  pt-1 w-full ">
                                    <span className="pl-2 whitespace-nowrap">RUA ADAUTO CASTELO - 393 CENTRO CEDRO/CE</span>
                                    <span className=" pl-[110px] ">{item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                                    <span className=" flex w-full justify-end pl-10">{item.parcela_n}</span>
                                </div>
                                <div className="inline-flex  w-full pt-1 ">
                                    <span className="pl-2 whitespace-nowrap">16.784.573/0001-93 - ASSISTÊNCIA FAMILIAR PARAÍSO</span>
                                    <span className=" flex w-full justify-end pl-10">{Number(item.valor_principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                                <div className="inline-flex   w-full ">
                                    <span className="pl-2 ">{new Date().toLocaleDateString('pt-BR')}</span>
                                    <span className="pl-20  ">{item.id_contrato}</span>
                                    <span className=" pl-[110px] whitespace-nowrap ">{dadosAssociado.plano}</span>
                                    <span className=" flex w-full justify-end pl-10">R$ 0,00</span>

                                </div>
                                <div className="flex flex-col w-full">
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '1' }}>PIX: 16.784.573/0001-93</span>
                                    <span style={{ fontSize: '9px', lineHeight: '1' }}>TITULAR FREITAS NETO COMERCIO E SERVIÇO- LTDA-ME</span>
                                    <span style={{ fontSize: '9px', lineHeight: '1', fontStyle: 'italic' }}>MANTENHA SEU PLANO DE EM DIA</span>
                                </div>


                                <div className="inline-flex pt-2 w-full justify-between"  >
                                    <div className=" flex flex-col">
                                        <span className="whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '1' }}>{dadosAssociado.nome}</span>
                                        <span style={{ fontSize: '9px', lineHeight: '1' }}>{dadosAssociado.endereco}-{dadosAssociado.numero}</span>
                                        <span style={{ fontSize: '9px', lineHeight: '1' }}>{dadosAssociado.bairro}-{dadosAssociado.cidade}/{dadosAssociado.uf}</span>
                                    </div>

                                   
                                        {item.n_doc && <BarCode
                                            width={3}
                                            height={25}
                                            fontSize={5}
                                            textMargin={0}
                                            margin={0}
                                            marginBottom={0}
                                            value={item.n_doc} />}
                                    

                                </div>




                            </div>











                        </li>
                 
                ))}
                

            </ul>
      
        );
    }
}

export default ImpressaoCarne;
