



import Image from "next/image";
import logo from "../../../public/afapsaude.png"


import React from 'react';
interface DadosProps{
    nome:string, 
    cpf:string,
    rg:string,
    endereco:string,
    bairro:string,
    cidade:string,
    celular:string,
    nascimento:Date|undefined
    responsavel:string,
    parentesco:string
 
}


class FichaConsulta extends React.Component<DadosProps> {
   
  render() {
    const {nome, 
        cpf,
        rg,
        endereco,
        bairro,
        cidade,
       celular,
       nascimento,
       parentesco,
        responsavel
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
      <div className='flex flex-col w-full gap-3'>
      <div style={{display:'flex',width:'100%',alignItems:'center',justifyContent:'center',gap:'20px'}} >

     
          <Image width={70} height={70} src={logo} alt="logo" />
          <h1 style={{fontWeight:'bold',fontSize:'20px'}}>PRONTUÁRIO MÉDICO N°</h1>
        
         </div>

         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>

         <h2 style={{fontWeight:'bold',fontSize:'12px',borderBottom:'2px solid gray',width:'100%',textAlign:'center'}}>Dados do Paciente</h2>
         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
          <div style={{display:'flex',justifyContent:'space-between',width:'100%'}} >
            <span >Paciente: {nome} </span>
            <span>Nascimento: {nascimento && new Date(nascimento).toLocaleDateString('pt-BR')}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',width:'100%'}} >
            <span >CPF: {cpf} </span>
            <span>Identidade: {rg}</span>
            <span>Celular: {celular}</span>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',width:'100%'}} >
            <span >Endereço: {endereco} </span>
            <span>Bairro: {bairro}</span>
            <span>Cidade: {cidade}</span>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',width:'100%'}} >
            <span >Responsável: {responsavel} </span>
            <span>Parentesco: {parentesco}</span>
          </div>

          </div>
         </div>


<div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
         <h2 style={{fontWeight:'bold',fontSize:'12px',borderBottom:'2px solid gray',width:'100%',textAlign:'center'}}>Dados da Consulta</h2>
         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
          <div style={{display:'flex',justifyContent:'space-between',width:'100%'}} >
            <span >Data da Consulta: {new Date().toLocaleDateString('pt-BR',{timeZone:'America/Fortaleza'})}</span>
            <span>Horário da Consulta:</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',width:'100%'}} >
            <span >Nome do Profissional de Saude: </span>
            <span>Especialidade:</span>
          </div>
         </div>

         </div>


         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
         <h2 style={{fontWeight:'bold',fontSize:'12px',borderBottom:'2px solid gray',width:'100%',textAlign:'center'}}>Queixa Principal</h2>
         <span style={{fontSize:'14px',whiteSpace:'nowrap', borderBottom:'1px solid gray',width:'100%'}}>Descrição da Queixa Principal:</span>
         <span style={{fontSize:'14px',whiteSpace:'nowrap', borderBottom:'1px solid gray',width:'100%',marginTop:'20px'}}></span>
         </div>
        


        
         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
         <h2 style={{fontWeight:'bold',fontSize:'12px',borderBottom:'2px solid gray',width:'100%',textAlign:'center'}}>História da Doença Atual</h2>
         <span style={{fontSize:'14px', borderBottom:'1px solid gray',width:'100%'}}>Início dos Sintomas:</span>
         <span style={{fontSize:'14px', borderBottom:'1px solid gray',width:'100%'}}>Sintomas Relacionados:</span>
         <span style={{fontSize:'14px',whiteSpace:'nowrap', borderBottom:'1px solid gray',width:'100%'}}>Duração e Intensidade dos Sintomas:</span>
         </div>
       


         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
         <h2 style={{fontWeight:'bold',fontSize:'12px',borderBottom:'2px solid gray',width:'100%',textAlign:'center'}}>História Médica Pregressa</h2>
         <span style={{fontSize:'14px', borderBottom:'1px solid gray',width:'100%'}}>Doenças Crônicas: </span>
         <span style={{fontSize:'14px', borderBottom:'1px solid gray',width:'100%'}}>Cirurgias Anteriores:</span>
         <span style={{fontSize:'14px', borderBottom:'1px solid gray',width:'100%'}}>Alergias Conhecidas:</span>
         <span style={{fontSize:'14px', borderBottom:'1px solid gray',width:'100%'}}>Uso de Medicamentos Contínuos:</span>

         </div>
        

         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
          
         <h2 style={{fontWeight:'bold',fontSize:'12px',borderBottom:'2px solid gray',width:'100%',textAlign:'center'}}>Exame Físico</h2>
         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
          <div style={{display:'flex',justifyContent:'space-between',width:'100%'}} >
            <span >Peso:__________ </span>
            <span>Altura:__________</span>
            <span>IMC:__________</span>
        
          </div>
          <div style={{display:'flex',justifyContent:'space-between',width:'100%'}} >
          <span>Pressão Arterial:__________</span>
            <span>Frequência Cardíaca:__________</span>
            <span>Temperatura Corporal:__________</span>
          </div>

         
         </div>

         </div>



         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
         <h2 style={{fontWeight:'bold',fontSize:'12px',borderBottom:'2px solid gray',width:'100%',textAlign:'center'}}>Exames Complementares Solicitados</h2>
         <span style={{fontSize:'14px', borderBottom:'1px solid gray',width:'100%'}}>1.</span>
         <span style={{fontSize:'14px', borderBottom:'1px solid gray',width:'100%'}}>2.</span>
         <span style={{fontSize:'14px',whiteSpace:'nowrap', borderBottom:'1px solid gray',width:'100%'}}>3.</span>
         </div>


         
         <div style={{display:'flex',flexDirection:'column',width:'100%',fontSize:'14px',gap:'5px'}}>
         <h2 style={{fontWeight:'bold',fontSize:'12px',borderBottom:'2px solid gray',width:'100%',textAlign:'center'}}>Plano Terapêutico</h2>
         <span style={{fontSize:'14px',whiteSpace:'nowrap', borderBottom:'1px solid gray',width:'100%'}}>Medicamentos Prescritos:</span>
         <span style={{fontSize:'14px',whiteSpace:'nowrap', borderBottom:'1px solid gray',width:'100%'}}>Orientações ao Paciente:</span>
         <span style={{fontSize:'14px',whiteSpace:'nowrap', borderBottom:'1px solid gray',width:'100%'}}>Encaminhamentos Necessários:</span>
         </div>


         <div style={{display:'flex',justifyContent:'space-between',width:'100%',marginTop:'50px'}} >
         <div className="flex flex-col w-1/2 p-2 justify-center items-center " >
                        <span className="flex w-full border-b-[1px]  border-black"></span>

                        <span className="pt-2  text-center italic">Assinatura do Paciente</span>
                      
                    </div>

                    <div className="flex flex-col w-1/2 p-2 justify-center items-center " >
                        <span className="flex w-full border-b-[1px]  border-black"></span>

                        <span className="pt-2  text-center italic">Assinatura e Carimbo do Profissional de Saúde</span>
                        
                    </div>
          </div>


        
      </div>
    );
  }
}

export default FichaConsulta;
