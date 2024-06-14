
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
  senhaAtual:string,
  image:string,
  password:string,
  id:number|null,
  cargo:string,
  file:File|undefined,
  avatarUrl:string
  repSenha:string,
  editar:boolean
}
interface ModalProps {

  setarModalAdicionar: () => void,
  setarDadosPermissoes:(fields:Array<PermissoesProps>)=>void,
  setarDadosUsuario:(fields:Partial<UsuarioProps>)=>void,
  setarDadosFuncionario:(fields:Partial<FuncionarioProps>)=>void,
  getUsers:()=>Promise<void>,
  dadosUser:Partial<UsuarioProps>,
  dadosFuncionario:Partial<FuncionarioProps>,
  dadosPermissoes:Array<PermissoesProps>


}

interface FuncionarioProps{
  id_consultor:number|null,
  nome: string,
  cpf: string,
  rg: string,
  data_nascimento: Date | null,
  cep: string,
  endereco: string,
  numero: string,
  bairro: string,
  cidade: string,
  uf: string,
  telefone: string,
  email: string,
  dt_admissao: Date | null,
  cnh_categoria: string,
  titulo_eleitor: string,
  zona: number,
  secao: number,
  pis_pasep: string,
  grau_instrucao: string,
  nome_conjuge: string,
  n_dependentes: number,
  menores_14: number,
  caso_emergencia: string,
  salario: number,
  contrato_exp: number,
  prorrogacao_cont: number,
  situacao: string,
 
}

export  function MenuMultiStep({ setarModalAdicionar,getUsers,setarDadosFuncionario,setarDadosPermissoes,setarDadosUsuario,dadosFuncionario,dadosPermissoes,dadosUser }: ModalProps) {

 

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
    if(dadosUser.password!==dadosUser.repSenha){
      toast.error('Senhas não coincidem !')
      return
    }
    
    
    const data = new FormData();
    data.append('nome',dadosUser.nome??'');
    data.append('usuario',dadosUser.usuario??'');
    data.append('password',dadosUser.password??'');
    data.append( 'cargo',dadosUser.cargo??'');
    data.append('nomeCompleto',dadosFuncionario?.nome??'');
    data.append( 'cpf',dadosFuncionario.cpf??'');
    data.append( 'rg',dadosFuncionario.rg??'');
    data.append('nascimento',dadosFuncionario.data_nascimento?.toString()??'');
    data.append('cep',dadosFuncionario.cep??'');
    data.append( 'endereco',dadosFuncionario.endereco??'');
    data.append('numero',dadosFuncionario.numero??'');
    data.append( 'bairro',dadosFuncionario.bairro??'');
    data.append('cidade',dadosFuncionario.cidade??'');
    data.append('uf',dadosFuncionario.uf??'');
    data.append('telefone',dadosFuncionario.telefone??'');
    data.append('email',dadosFuncionario.email??'');
    data.append('dataAdmissao',dadosFuncionario.dt_admissao?.toString()??'');
    data.append('CNH_categoria',dadosFuncionario.cnh_categoria??'');
    data.append('titulo_eleitor',dadosFuncionario.titulo_eleitor??'');
    data.append('zona',dadosFuncionario.zona?.toString()??'');
    data.append( 'secao',dadosFuncionario.secao?.toString()??'');
    data.append('PIS_PASEP',dadosFuncionario.pis_pasep??'');
    data.append('escolaridade',dadosFuncionario.grau_instrucao??'');
    data.append('nome_conjuge',dadosFuncionario.nome_conjuge??'');
    data.append('n_dep',dadosFuncionario.n_dependentes?.toString()??'');
    data.append('n_dep14',dadosFuncionario.menores_14?.toString()??'');
    data.append('caso_emergencia',dadosFuncionario.caso_emergencia??'');
    data.append('salario',dadosFuncionario.salario?.toString()??'');
    data.append('contrato_exp',dadosFuncionario.contrato_exp?.toString()??'');
    data.append('prorrogacao',dadosFuncionario.prorrogacao_cont?.toString()??'');
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
   await getUsers()
    
  }


  async function handleEditarCadastro() {
    if(dadosUser.password && (dadosUser.password!==dadosUser.repSenha)){
     toast.error('Senhas não coincidem !')
     return
  }

   if(dadosUser.senhaAtual && (!dadosUser.password||!dadosUser.repSenha)){
     toast.info('Insira a nova senha')
     return ;
   }
    
    const data = new FormData();
    data.append('id',dadosUser.id?.toString()??'');
    data.append('id_consultor',dadosFuncionario.id_consultor?.toString()??'');
    data.append('nome',dadosUser.nome??'');
    data.append('usuario',dadosUser.usuario??'');
    data.append('password',dadosUser.password??'');
   data.append('senhaAtual',dadosUser.senhaAtual??'');
    data.append( 'cargo',dadosUser.cargo??'');
    data.append('nomeCompleto',dadosFuncionario?.nome??'');
    data.append( 'cpf',dadosFuncionario.cpf??'');
    data.append( 'rg',dadosFuncionario.rg??'');
    data.append('nascimento',dadosFuncionario.data_nascimento?.toString()??'');
    data.append('cep',dadosFuncionario.cep??'');
    data.append( 'endereco',dadosFuncionario.endereco??'');
    data.append('numero',dadosFuncionario.numero??'');
    data.append( 'bairro',dadosFuncionario.bairro??'');
    data.append('cidade',dadosFuncionario.cidade??'');
    data.append('uf',dadosFuncionario.uf??'');
    data.append('telefone',dadosFuncionario.telefone??'');
    data.append('email',dadosFuncionario.email??'');
    data.append('dataAdmissao',dadosFuncionario.dt_admissao?.toString()??'');
    data.append('CNH_categoria',dadosFuncionario.cnh_categoria??'');
    data.append('titulo_eleitor',dadosFuncionario.titulo_eleitor??'');
    data.append('zona',dadosFuncionario.zona?.toString()??'');
    data.append( 'secao',dadosFuncionario.secao?.toString()??'');
    data.append('PIS_PASEP',dadosFuncionario.pis_pasep??'');
    data.append('escolaridade',dadosFuncionario.grau_instrucao??'');
    data.append('nome_conjuge',dadosFuncionario.nome_conjuge??'');
    data.append('n_dep',dadosFuncionario.n_dependentes?.toString()??'');
    data.append('n_dep14',dadosFuncionario.menores_14?.toString()??'');
    data.append('caso_emergencia',dadosFuncionario.caso_emergencia??'');
    data.append('salario',dadosFuncionario.salario?.toString()??'');
    data.append('contrato_exp',dadosFuncionario.contrato_exp?.toString()??'');
    data.append('prorrogacao',dadosFuncionario.prorrogacao_cont?.toString()??'');
    data.append('situacao',dadosFuncionario.situacao??'');
    data.append('permissoes',JSON.stringify(dadosPermissoes)??'');

    if(dadosUser.file){
      data.append( 'file',dadosUser.file);
    }
   

    try {
      await toast.promise(
        api.put('/user/editar',data),
        {error:'ERRO AO REALIZAR ALTERAÇÃO',
          pending:'ALTERANDO DADOS',
          success:'DADOS ALTERADOS COM SUCESSO'
        }
      )
      
    } catch (error) {
      console.log(error)
      
    }
    
 await getUsers()
    
  }

  return (

    <div tabIndex={-1} aria-hidden="true" className="bg-opacity-5 bg-white overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full">
      <div className="pl-2 pr-2 flex flex-col items-center justify-center w-full h-full ">
        <div className="relative  border  rounded-lg shadow bg-gray-800 border-gray-600 p-2">
          <form onSubmit={onSubmit}>
            <div className="absolute font-bold text-white top-2 right-2">
              {currentStepIndex + 1} / {steps.length}
              <button onClick={() => setarModalAdicionar()} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                <IoIosClose size={30} />
              </button>
            </div>
            {step}
            <div className="flex mt-4 gap-4 justify-end">
              {currentStepIndex !== 0 && (<button type="button" onClick={back}><FaCircleArrowLeft color='blue' style={{ color: '#CA9629' }} size={30} /></button>)}
            {steps.length - 1 === currentStepIndex? !dadosUser.editar?<button onClick={() => handleNovoCadastro()} className="flex flex-row bg-blue-600 rounded-lg p-2 gap-2 text-white" type="button" ><MdSaveAlt size={22} /> SALVAR</button>:<button onClick={() => handleEditarCadastro()} className="flex flex-row bg-yellow-600 rounded-lg p-2 gap-2 text-white" type="button" ><MdSaveAlt size={22} />SALVAR ALTERAÇÕES</button>  :<button type="submit">
                {  (<FaCircleArrowRight size={30} style={{ color: '#CA9629' }} />)}
              </button>}
            </div>
          </form>
        </div>
      </div>
    </div>


  )
}

