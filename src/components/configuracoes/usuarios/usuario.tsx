import { api } from "@/services/apiClient"
import {  useEffect, useState } from "react"
import { toast } from "react-toastify"
import { BiSolidLockOpenAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { ModalNovoUsuario } from "./modalNovoUsuario";
import { Button } from "@/components/ui/button";
import { ConsultoresProps } from "@/types/consultores";







export interface UsuarioProps {
  nome: string,
  usuario: string,
  password: string,
  senhaAtual: string,
  image: string,
  id_user:string,
  cargo: string,
  file: File | undefined,
  avatarUrl: string,
  editar: boolean,
  repSenha: string,
  permissoes: Array<string>,
  consultor: Array<ConsultoresProps>
}




export function Usuario() {
  const [userDados, setUserDados] = useState<Array<UsuarioProps>>()
  const [modalAdicionar, setModalAdicionar] = useState<boolean>(false)
  const [dadosUser, setDadosUser] = useState<Partial<UsuarioProps>>({})
  const [dadosFuncionario, setDadosFuncionario] = useState<Partial<ConsultoresProps>>({})
  const [dadosPermissoes, setDadosPermissoes] = useState<Array<string>>([])


  
  async function handleNovoCadastro() {
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
   dadosUser.id_user && data.append('id',dadosUser.id_user?.toString());
   dadosFuncionario.id_consultor && data.append('id_consultor',dadosFuncionario.id_consultor?.toString());
  dadosUser.nome &&  data.append('nome',dadosUser.nome);
   dadosUser.usuario && data.append('usuario',dadosUser.usuario);
    dadosUser.password && data.append('password',dadosUser.password);
  dadosUser.senhaAtual && data.append('senhaAtual',dadosUser.senhaAtual);
   dadosUser.cargo && data.append( 'cargo',dadosUser.cargo);
  dadosFuncionario.nome &&  data.append('nomeCompleto',dadosFuncionario?.nome);
   dadosFuncionario.cpf && data.append( 'cpf',dadosFuncionario.cpf);
  dadosFuncionario.rg &&  data.append( 'rg',dadosFuncionario.rg);
   dadosFuncionario.data_nascimento && data.append('nascimento',dadosFuncionario.data_nascimento?.toString());
   dadosFuncionario.cep && data.append('cep',dadosFuncionario.cep);
   dadosFuncionario.endereco && data.append( 'endereco',dadosFuncionario.endereco);
   dadosFuncionario.numero && data.append('numero',dadosFuncionario.numero);
   dadosFuncionario.bairro && data.append( 'bairro',dadosFuncionario.bairro);
  dadosFuncionario.cidade &&  data.append('cidade',dadosFuncionario.cidade);
   dadosFuncionario.uf && data.append('uf',dadosFuncionario.uf);
   dadosFuncionario.telefone && data.append('telefone',dadosFuncionario.telefone);
   dadosFuncionario.email && data.append('email',dadosFuncionario.email);
  dadosFuncionario.dt_admissao &&  data.append('dataAdmissao',dadosFuncionario.dt_admissao?.toString());
   dadosFuncionario.cnh_categoria && data.append('CNH_categoria',dadosFuncionario.cnh_categoria);
   dadosFuncionario.titulo_eleitor && data.append('titulo_eleitor',dadosFuncionario.titulo_eleitor);
   dadosFuncionario.zona && data.append('zona',dadosFuncionario.zona?.toString());
   dadosFuncionario.secao && data.append( 'secao',dadosFuncionario.secao?.toString());
    dadosFuncionario.pis_pasep && data.append('PIS_PASEP',dadosFuncionario.pis_pasep);
   dadosFuncionario.grau_instrucao && data.append('escolaridade',dadosFuncionario.grau_instrucao);
   dadosFuncionario.nome_conjuge && data.append('nome_conjuge',dadosFuncionario.nome_conjuge);
   dadosFuncionario.n_dependentes && data.append('n_dep',dadosFuncionario.n_dependentes?.toString());
   dadosFuncionario.menores_14 && data.append('n_dep14',dadosFuncionario.menores_14?.toString());
   dadosFuncionario.caso_emergencia && data.append('caso_emergencia',dadosFuncionario.caso_emergencia);
   dadosFuncionario.salario && data.append('salario',dadosFuncionario.salario?.toString());
  dadosFuncionario.contrato_exp &&  data.append('contrato_exp',dadosFuncionario.contrato_exp?.toString());
   dadosFuncionario.prorrogacao_cont && data.append('prorrogacao',dadosFuncionario.prorrogacao_cont?.toString());
  dadosFuncionario.situacao &&  data.append('situacao',dadosFuncionario.situacao);
  data.append('permissoes',JSON.stringify(dadosUser.permissoes));

    if(dadosUser.file){
      data.append( 'file',dadosUser.file)
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



  const handlePermission =(permission:string)=>{
    if(dadosUser.permissoes && dadosUser.permissoes.includes(permission)){
      setDadosUser({...dadosUser,permissoes:dadosUser.permissoes.filter(item=>item!==permission)})
    }else{
      setDadosUser({...dadosUser,permissoes:[...(dadosUser.permissoes??[]),permission]})
       
    }

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

  const setarDadosFuncionario = (fields: Partial<ConsultoresProps>) => {
    setDadosFuncionario((prev: Partial<ConsultoresProps>) => {
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
    <div className="flex w-full flex-col px-2 bg-white rounded-lg text-black">
    
        <Button
        className="ml-auto"
         size={'sm'} 
        variant={'outline'}
         onClick={() => {
          setarDadosUsuario({
            cargo: '',
            consultor: [],
            editar: false,
            id_user: '',
            nome: '',
            permissoes: [],
            password: '',
            usuario: '',
            image: '',
            repSenha: '',
            file: undefined,
            avatarUrl: ''
          }),
          setModalAdicionar(!modalAdicionar)
        }} ><IoIosAddCircle size={20} />Adicionar</Button>
    
      <div className="flex flex-col  px-4 w-full overflow-y-auto h-[calc(100vh-175px)]  ">

        <ul className="flex flex-col w-full p-2 gap-1 text-sm">
          <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] font-bold ">
            <div className="inline-flex w-full items-center">
              <span className="flex w-40 me-2 justify-center ">#</span>
              <span className="flex w-full text-start whitespace-nowrap">NOME</span>
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
                <li key={index} className={`flex flex-col w-full p-2 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-300" : "bg-slate-200"} uppercase cursor-pointer`}>
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-40 me-2 text-start font-semibold">
                      {item.image && <img className="w-[26px] h-[26px] rounded-full" src={`${item.image}`} alt="Rounded avatar"></img>}</div>
                    <span className="flex w-full text-start font-semibold">{item?.nome}</span>
                    <span className="flex w-full text-start font-semibold">{item.cargo}</span>
                    <span className="flex w-full text-start font-semibold">{''}</span>
                    <span className="flex w-full text-start ">{''}</span>
                    <div className="flex w-full justify-center text-orange-400 ">
                      <button >
                        <BiSolidLockOpenAlt size={17} />
                      </button>

                    </div>
                    <div className="flex w-full justify-end gap-3 text-gray-500 ">
                      <button onClick={() => {
                        setarDadosUsuario({
                          ...item, password: '', repSenha: '', editar: true, avatarUrl: ''
                        }),
                        setarDadosFuncionario({ ...item.consultor[0] }),
                       // setarDadosPermissoes([...item.permissoes]??[]),
                        setModalAdicionar(true)
                      }}
                        className="hover:text-blue-500   rounded-lg ">
                        <MdEdit size={17} />
                      </button>
                      <button className="hover:text-red-500  rounded-lg  ">
                        <MdDelete size={17} />
                      </button>
                    </div>


                  </div>

                </li>
              )
            })
          }
        </ul>
        {/*modalAdicionar && <MenuMultiStep setarModalAdicionar={setarModalAdicionar} getUsers={getUsers} dadosFuncionario={dadosFuncionario} dadosPermissoes={dadosPermissoes} dadosUser={dadosUser} setarDadosFuncionario={setarDadosFuncionario} setarDadosPermissoes={setarDadosPermissoes} setarDadosUsuario={setarDadosUsuario} />*/}
       
      </div>

      <ModalNovoUsuario handleEditarCadastro={handleEditarCadastro}  handleNovoCadastro={handleNovoCadastro}  handlePermission={handlePermission}  dadosUser={dadosUser} setModal={setModalAdicionar} setarDadosUsuario={setarDadosUsuario} show={modalAdicionar} />
    </div>
  )
}

