import { api } from "@/services/apiClient"
import { getURL } from "next/dist/shared/lib/utils"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import fototeste from '../../../../public/fototeste.jpeg'
import { FaLockOpen } from "react-icons/fa";
import { BiSolidLockOpenAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { MenuMultiStep } from "../multiStep/multStep"




interface PermissoesProps {
  nome: string,
  val: boolean,
  tela: string
}
interface UsuarioProps {
  nome: string,
  usuario: string,
  password: string,
  image: string,
  id: number|null,
  cargo: string,
  file: File |null,
  avatarUrl: string,
  editar:boolean,
  repSenha: string,
  permissoes:Array<PermissoesProps>,
  consultor:Array<Partial<FuncionarioProps>>
}


interface FuncionarioProps {
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


export function Usuario() {
  const [userDados, setUserDados] = useState<Array<UsuarioProps>>()
  const [modalAdicionar, setModalAdicionar] = useState<boolean>(false)
  const [dadosUser, setDadosUser] = useState<Partial<UsuarioProps>>({})
  const [dadosFuncionario, setDadosFuncionario] = useState<Partial<FuncionarioProps>>({})
  const [dadosPermissoes, setDadosPermissoes] = useState<Array<PermissoesProps>>([{ nome: "ALTERAR DADOS TITULAR", val: false, tela: 'admContDados' }, { nome: "ALTERAR CARÊNCIA", val: false, tela: 'admContDados' }, { nome: "ALTERAR ADESÃO", val: false, tela: 'admContDados' }, { nome: "ALTERAR VENCIMENTO", val: false, tela: 'admContDados' }, { nome: "ALTERAR CATEGORIA", val: false, tela: 'admContDados' }, { nome: "ALTERAR CONSULTOR", val: false, tela: 'admContDados' }, { nome: "ALTERAR COBRADOR", val: false, tela: 'admContDados' }, { nome: "INATIVAR PLANO", val: false, tela: 'admContDados' }, { nome: "ADICIONAR MENSALIDADE", val: false, tela: 'admContMensal' }, { nome: "REALIZAR ACORDO", val: false, tela: 'admContMensal' }, { nome: 'EXCLUIR MENSALIDADE', val: false, tela: 'admContMensal' }, { nome: "ADICIONAR DEPENDENTE", val: false, tela: 'admContDep' }, { nome: "EXCLUIR DEPENDENTE", val: false, tela: 'admContDep' }, { nome: "EXIBIR EXCLUIDOS", val: false, tela: 'admContDep' }])





  const setarModalAdicionar = () => {
    setModalAdicionar(!modalAdicionar)
  }

  const setarDadosPermissoes = (permissoes: Array<PermissoesProps>) => {
    setDadosPermissoes(permissoes)
  }

  const setarDadosUsuario = (fields: Partial<UsuarioProps>) => {
    setDadosUser((prev: Partial<UsuarioProps>) => {
      if (prev) {
        return { ...prev, ...fields }
      }
      else {
        return { ...fields }
      }

    })

  }

  const setarDadosFuncionario = (fields: Partial<FuncionarioProps>) => {
    setDadosFuncionario((prev: Partial<FuncionarioProps>) => {
      if (prev) {
        return { ...prev, ...fields }
      }
      else {
        return { ...fields }
      }

    })

  }

  useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    try {
      const response = await api.get("/getUser")
      console.log(response.data)
      setUserDados(response.data)


    } catch (error) {
      toast.error('ERRO NA REQUISIÇÃO')

    }
  }


  return (
    <div className="ms-2 me-2">
      <div className="flex w-full justify-end">
        <button onClick={() => {setarDadosUsuario({
cargo:'',
consultor:[],
editar:false,
id:null,
nome:'',
permissoes:[],
password:'',
usuario:'',
image:'',
repSenha:'',
file:null,
avatarUrl:''
        }),
        setModalAdicionar(!modalAdicionar)}} className="inline-flex justify-items-center gap-1 p-1 bg-green-500 rounded-lg mb-1 font-semibold text-sm"><IoIosAddCircle size={20} />ADD</button>
      </div>
      <div className="flex flex-col  px-4 w-full overflow-y-auto max-h-[calc(100vh-210px)] text-white bg-[#2b2e3b] rounded-lg ">

        <ul className="flex flex-col w-full p-2 gap-1 text-sm">
          <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
            <div className="inline-flex w-full items-center">
              <span className="flex w-40 me-2 justify-center font-semibold">#</span>
              <span className="flex w-full text-start font-semibold">NOME</span>
              <span className="flex w-full text-start whitespace-nowrap ">CARGO</span>
              <span className="flex w-full text-start whitespace-nowrap">E-MAIL</span>
              <span className="flex w-full text-start whitespace-nowrap ">TELEFONE</span>
              <span className="flex w-full justify-center whitespace-nowrap ">PERMISSÕES</span>
              <span className="flex w-full justify-end  "></span>

            </div>
          </li>
          {
            userDados?.map((item, index) => {


              return (
                <li className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-700" : "bg-slate-600"} uppercase cursor-pointer`}>
                  <div className="inline-flex w-full items-center">
                    <span className="flex w-40 me-2 text-start font-semibold">
                      {item.image && <img className="w-[26px] h-[26px] rounded-full" src={`data:image/jpeg;base64,${item.image}`} alt="Rounded avatar"></img>}</span>
                    <span className="flex w-full text-start font-semibold">{item?.nome}</span>
                    <span className="flex w-full text-start font-semibold">{item.cargo}</span>
                    <span className="flex w-full text-start font-semibold">{''}</span>
                    <span className="flex w-full text-start ">{''}</span>
                    <div className="flex w-full justify-center text-orange-400 ">
                      <button className="hover:bg-gray-500 p-1 rounded-lg " >
                        <BiSolidLockOpenAlt size={17} />
                      </button>

                    </div>
                    <div className="flex w-full justify-end gap-2 ">
                      <button onClick={() => {setarDadosUsuario({
                        ...item,password:'',repSenha:'',editar:true,avatarUrl:''
                      }) 
                      setarDadosFuncionario({...item.consultor[0]})
                      ,setModalAdicionar(true)}} className="hover:bg-gray-500 p-1 text-blue-500 rounded-lg ">
                        <MdEdit size={17} />
                      </button>
                      <button className="hover:bg-gray-500 p-1 rounded-lg text-red-500 ">
                        <MdDelete size={17} />
                      </button>
                    </div>


                  </div>

                </li>
              )
            })
          }
        </ul>
        {modalAdicionar && <MenuMultiStep setarModalAdicionar={setarModalAdicionar} getUsers={getUsers} dadosFuncionario={dadosFuncionario} dadosPermissoes={dadosPermissoes} dadosUser={dadosUser} setarDadosFuncionario={setarDadosFuncionario} setarDadosPermissoes={setarDadosPermissoes} setarDadosUsuario={setarDadosUsuario} />}
      </div>


    </div>
  )
}

