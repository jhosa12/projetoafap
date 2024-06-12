
import { MultiStep } from "../../multiStep";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { FormEvent, useEffect, useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { MdSaveAlt } from "react-icons/md";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import {ModalDadosFuncionario} from "../usuarios/modalDadosFuncionario";
import{ ModalNovoUsuario} from "../usuarios/modalNovoUsuario";
import {ModalPermissoes} from "../usuarios/modalPermissoes";

interface PermissoesProps {
  nome:string,
  val:boolean,
  tela:string
}
interface UsuarioProps{
  nome:string,
  usuario:string,
  password:string,
  id:number,
  cargo:string,
  file:File
}
interface ModalProps {

  setarModalEditar: () => void

}

interface FuncionarioProps{
  
  nomeCompleto:string,
  cpf:string,
  rg:string,
  nascimento:Date |null,
  cep:string,
  endereco:string,
  numero:string,
  bairro:string,
  cidade:string,
  uf:string,
  telefone:string,
  email:string,
  dataAdmissao:Date | null,
  CNH_categoria:string,
  titulo_eleitor:string,
  zona:number,
  secao:number,
  PIS_PASEP:string,
  escolaridade:string,
  nome_conjuge:string,
  n_dep:number,
  n_dep14:number,
  caso_emergencia:string,
  salario:number,
  contrato_exp:number,
  prorrogacao:number,
  situacao:string,
 
}

export  function MenuMultiStep({ setarModalEditar }: ModalProps) {
  const { usuario, data, closeModa, carregarDados } = useContext(AuthContext)
  const [dadosUser,setDadosUser] = useState<Partial<UsuarioProps>>({})
  const [dadosFuncionario,setDadosFuncionario]=useState<Partial<FuncionarioProps>>({})
  const [dadosPermissoes,setDadosPermissoes] = useState<Array<PermissoesProps>>([  { nome: "ALTERAR DADOS TITULAR", val: false,tela:'admContDados' }, { nome: "ALTERAR CARÊNCIA", val: false,tela:'admContDados' }, { nome: "ALTERAR ADESÃO", val: false,tela:'admContDados'}, { nome: "ALTERAR VENCIMENTO", val: false,tela:'admContDados' }, { nome: "ALTERAR CATEGORIA", val: false,tela:'admContDados' }, { nome: "ALTERAR CONSULTOR", val: false,tela:'admContDados' }, { nome: "ALTERAR COBRADOR", val: false,tela:'admContDados' }, { nome: "INATIVAR PLANO", val: false,tela:'admContDados'},{ nome: "ADICIONAR MENSALIDADE", val: false,tela:'admContMensal' }, { nome: "REALIZAR ACORDO", val: false,tela:'admContMensal' }, { nome: 'EXCLUIR MENSALIDADE', val: false,tela:'admContMensal' },{nome:"ADICIONAR DEPENDENTE", val:false,tela:'admContDep'},{nome:"EXCLUIR DEPENDENTE", val:false,tela:'admContDep'},{nome:"EXIBIR EXCLUIDOS", val:false,tela:'admContDep'}])

  const setarDadosPermissoes = (permissoes:Array<PermissoesProps>)=>{
    setDadosPermissoes(permissoes)

  }

  const setarDadosUsuario = (fields:Partial<UsuarioProps>)=>{
    setDadosUser((prev:Partial<UsuarioProps>)=>{
        if(prev){
            return {...prev,...fields}
        }
        else{
            return {...fields}
        }

    })
    
}

const setarDadosFuncionario = (fields:Partial<FuncionarioProps>)=>{
  setDadosFuncionario((prev:Partial<FuncionarioProps>)=>{
      if(prev){
          return {...prev,...fields}
      }
      else{
          return {...fields}
      }

  })
  
}

  const { steps, currentStepIndex, step, next, back } = MultiStep([
    <ModalNovoUsuario setarDadosUsuario={setarDadosUsuario} dadosUser={dadosUser}  />,
    <ModalDadosFuncionario setarDadosFuncionario={setarDadosFuncionario} dadosFuncionario={dadosFuncionario} />,
    <ModalPermissoes setarDadosPermissoes={setarDadosPermissoes} dadosPermissoes={dadosPermissoes}/>
  ])


  function onSubmit(e: FormEvent) {
    e.preventDefault()
    next()
  }

  async function handleNovoCadastro() {
    console.log(dadosUser.file)
    const data = new FormData();
    data.append('nome',dadosUser.nome??'');
    data.append('usuario',dadosUser.usuario??'');
    data.append('password',dadosUser.password??'');
    data.append( 'cargo',dadosUser.cargo??'');
    data.append('nomeCompleto',dadosFuncionario?.nomeCompleto??'');
    data.append( 'cpf',dadosFuncionario.cpf??'');
    data.append( 'rg',dadosFuncionario.rg??'');
    data.append('nascimento',dadosFuncionario.nascimento?.toLocaleDateString()??'');
    data.append('cep',dadosFuncionario.cep??'');
    data.append( 'endereco',dadosFuncionario.endereco??'');
    data.append('numero',dadosFuncionario.numero??'');
    data.append( 'bairro',dadosFuncionario.bairro??'');
    data.append('cidade',dadosFuncionario.cidade??'');
    data.append('uf',dadosFuncionario.uf??'');
    data.append('telefone',dadosFuncionario.telefone??'');
    data.append('email',dadosFuncionario.email??'');
    data.append('dataAdmissao',dadosFuncionario.dataAdmissao?.toLocaleDateString()??'');
    data.append('CNH_categoria',dadosFuncionario.CNH_categoria??'');
    data.append('titulo_eleitor',dadosFuncionario.titulo_eleitor??'');
    data.append('zona',dadosFuncionario.zona?.toString()??'');
    data.append( 'secao',dadosFuncionario.secao?.toString()??'');
    data.append('PIS_PASEP',dadosFuncionario.PIS_PASEP??'');
    data.append('escolaridade',dadosFuncionario.escolaridade??'');
    data.append('nome_conjuge',dadosFuncionario.nome_conjuge??'');
    data.append('n_dep',dadosFuncionario.n_dep?.toString()??'');
    data.append('n_dep14',dadosFuncionario.n_dep14?.toString()??'');
    data.append('caso_emergencia',dadosFuncionario.caso_emergencia??'');
    data.append('salario',dadosFuncionario.salario?.toString()??'');
    data.append('contrato_exp',dadosFuncionario.contrato_exp?.toString()??'');
    data.append('prorrogacao',dadosFuncionario.prorrogacao?.toString()??'');
    data.append('situacao',dadosFuncionario.situacao??'');
    data.append('permissoes',JSON.stringify(dadosPermissoes)??'');

    if(dadosUser.file){
      data.append( 'file',dadosUser.file);
    }
   

    try {
      await toast.promise(
        api.post('/user',data),
        {error:'ERRO AO REALIZAR CADASTRO',
          pending:'CADASTRANDO NOVO FUNCIONÁRIO',
          success:'FUNCIONÁRIO CADASTRADO COM SUCESSO'
        }
      )
      
    } catch (error) {
      console.log(error)
      
    }

    
  }

  return (

    <div tabIndex={-1} aria-hidden="true" className="bg-opacity-5 bg-white overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full">
      <div className="pl-2 pr-2 flex flex-col items-center justify-center w-full h-full ">
        <div className="relative  border  rounded-lg shadow bg-gray-800 border-gray-600 p-2">
          <form onSubmit={onSubmit}>
            <div className="absolute font-bold text-white top-2 right-2">
              {currentStepIndex + 1} / {steps.length}
              <button onClick={() => setarModalEditar()} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                <IoIosClose size={30} />
              </button>
            </div>
            {step}
            <div className="flex mt-4 gap-4 justify-end">
              {currentStepIndex !== 0 && (<button type="button" onClick={back}><FaCircleArrowLeft color='blue' style={{ color: '#CA9629' }} size={30} /></button>)}
              <button type="submit">
                {steps.length - 1 === currentStepIndex ? (<button onClick={() => handleNovoCadastro()} className="flex flex-row bg-blue-600 rounded-lg p-2 gap-2 text-white" type="button" ><MdSaveAlt size={22} /> SALVAR</button>) : (<FaCircleArrowRight size={30} style={{ color: '#CA9629' }} />)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>


  )
}
