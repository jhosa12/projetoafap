


import Image from "next/image";
import logo from "../../../public/logoafap.png"

// DocumentTemplate.js

import React from 'react';
interface DadosProps {
    nome: string,
    data_nasc: Date | null,
    endereco: string,
    numero: number | null,
    bairro: string,
    cidade: string,
    uf: string,
    contrato: number | null
    grau_parentesco: string,
    titular: string,
    cpf: string
}


class DeclaracaoExclusao extends React.Component<DadosProps> {

    render() {
        const { nome,
            data_nasc,
            contrato,
            grau_parentesco,
            cpf, titular,
            bairro,
            cidade,
            endereco,
            numero,
            uf
        } = this.props;




        return (
            <div className='relative flex flex-col h-screen w-full p-2 '>
                <div className="flex  w-full justify-center items-center mt-4">
                    <Image className="flex w-44 h-16  " src={logo} alt="" />
                </div>
                <h2 className='text-xl text-center font-semibold mt-2'>DECLARAÇÃO DE EXCLUSÃO DE DEPENDENTE</h2>
                <p className="px-2 pt-2" style={{ textAlign: 'justify' }} >Eu, {titular}, inscrito(a) no CPF sob o nº {cpf} e residente à {endereco}-{numero} - {bairro} - {cidade}/{uf}, na qualidade de titular do plano funerário com contrato sob o n° {contrato}, junto à empresa [Nome da Funerária], venho por meio desta solicitar a exclusão do(a) seguinte dependente do referido plano:</p>
                <ul className="list-disc px-2 mx-3 font-semibold">
                    <li className="p-2 mx-2 ">Nome Completo do Dependente: {nome}</li>
                    <li className="p-2 mx-2 ">Data de Nascimento: {data_nasc && new Date(data_nasc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</li>
                    <li className="p-2 mx-2 ">Grau de Parentesco: {grau_parentesco}</li>
                </ul>

                <p className="px-2 pt-2" style={{ textAlign: 'justify' }}> Declaro estar ciente de que, a partir desta solicitação, o(a) referido(a) dependente deixará de usufruir dos benefícios do plano funerário contratado, sendo esta decisão de minha total e livre vontade.</p>
                <p className="px-2 pt-2" style={{ textAlign: 'justify' }}> Além disso, estou ciente de que, para reinclusão do(a) dependente ou inclusão de outro(s) dependente(s), será necessário formalizar novo pedido, de acordo com as condições estabelecidas pela [Nome da Funerária].</p>
                <p className="px-2 pt-2" style={{ textAlign: 'justify' }}>Declaro, para os devidos fins, que as informações aqui prestadas são verdadeiras e que estou ciente das implicações desta solicitação.</p>

                <div className="flex flex-row w-full p-2" style={{ marginTop: '70px' }}>
                    <div className="flex flex-col w-1/2 p-2 justify-center items-center " >


                        <span className="flex w-full border-b-[1px]  border-black"></span>
                        <span className="pt-2  text-center italic">{titular}</span>
                        <span className="pt-2  text-center italic">{cpf}</span>
                    </div>




                    <div className="flex flex-col w-1/2 p-2 justify-center items-center " >
                        <span className="flex w-full border-b-[1px]  border-black"></span>

                        <span className="pt-2  text-center italic">Assinatura do Resposável da Empresa</span>
                        <span className="pt-2  text-center italic">{''}</span>
                    </div>

                </div>

                <span className=" absolute p-2 text-center w-full " style={{ bottom: 1,textAlign: 'center',textAlignLast: 'center' }}>Cedro - {new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long', // Dia da semana por extenso
                    year: 'numeric', // Ano completo
                    month: 'long', // Mês por extenso
                    day: 'numeric'
                })}</span>
            </div>
        );
    }
}

export default DeclaracaoExclusao;
