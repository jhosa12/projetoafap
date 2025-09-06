
import { MultiStep } from "../../../../utils/multiStep";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { FormEvent} from 'react'
import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { ModalDadosFuncionario } from "../usuario/_components/modalDadosFuncionario";
import { ModalPermissoes } from "../usuario/_components/modalPermissoes";

interface PermissoesProps {
  nome: string,
  val: boolean,
  tela: string
}
interface UsuarioProps {
  nome: string,
  usuario: string,
  senhaAtual: string,
  image: string,
  password: string,
  id: number | null,
  cargo: string,
  file: File | undefined,
  avatarUrl: string
  repSenha: string,
  editar: boolean
}
interface ModalProps {

  setarModalAdicionar: () => void,
  setarDadosPermissoes: (fields: Array<PermissoesProps>) => void,
  setarDadosUsuario: (fields: Partial<UsuarioProps>) => void,
  setarDadosFuncionario: (fields: Partial<FuncionarioProps>) => void,
  getUsers: () => Promise<void>,
  dadosUser: Partial<UsuarioProps>,
  dadosFuncionario: Partial<FuncionarioProps>,
  dadosPermissoes: Array<PermissoesProps>


}

interface FuncionarioProps {
  id_consultor: number | null,
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

export function MenuMultiStep({ setarModalAdicionar, getUsers, setarDadosFuncionario, setarDadosPermissoes, setarDadosUsuario, dadosFuncionario, dadosPermissoes, dadosUser }: ModalProps) {



  const { steps, currentStepIndex, step, next, back } = MultiStep([
    //<ModalNovoUsuario setarDadosUsuario={setarDadosUsuario} dadosUser={dadosUser}  />,
    <ModalDadosFuncionario setarDadosFuncionario={setarDadosFuncionario} dadosFuncionario={dadosFuncionario} />,
    <ModalPermissoes setarDadosPermissoes={setarDadosPermissoes} dadosPermissoes={dadosPermissoes} />
  ])


  function onSubmit(e: FormEvent) {
    e.preventDefault()

    next()
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
              {steps.length - 1 === currentStepIndex ? !dadosUser.editar ? <button onClick={() => { }} className="flex flex-row bg-blue-600 rounded-lg p-2 gap-2 text-white" type="button" ><MdSaveAlt size={22} /> SALVAR</button> : <button onClick={() => { }} className="flex flex-row bg-yellow-600 rounded-lg p-2 gap-2 text-white" type="button" ><MdSaveAlt size={22} />SALVAR ALTERAÇÕES</button> : <button type="submit">
                {(<FaCircleArrowRight size={30} style={{ color: '#CA9629' }} />)}
              </button>}
            </div>
          </form>
        </div>
      </div>
    </div>


  )
}

