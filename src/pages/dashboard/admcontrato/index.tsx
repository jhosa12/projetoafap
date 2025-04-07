
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import { ModalBusca } from '../../../components/modals/modalBusca'
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../store/AuthContext"
import 'react-tooltip/dist/react-tooltip.css';
import CarteirasDep from "../../../components/tabs/admContrato/carteiras/carteirasDep";
import { HistoricoMensalidade } from "@/components/tabs/admContrato/historicoMensalidade/historicoMensalidade";
import { Modal, Spinner } from "flowbite-react";
import {  HiOutlineIdentification, HiUserCircle } from "react-icons/hi2";
import { DadosAssociado } from "@/components/tabs/admContrato/dadosAssociado/screen";
import { Dependentes } from "@/components/tabs/admContrato/dependentes/dependentes";
import ModalCadastro from "@/components/modals/admContrato/cadastro/modalCadastro";
import { VerificarSituacao } from "@/utils/admContrato/verificarSituacao";
import { Button } from "@/components/ui/button"
import { AssociadoProps } from "@/types/associado";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select"
import { useMediaQuery } from "usehooks-ts" // ou qualquer hook de media query
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "@/components/ui/tabs"
import { User, Users, Wallet } from "lucide-react";
import { UsuarioProps } from "@/pages/settings/usuario";
import { UserProps } from "@/types/user";



export default function AdmContrato() {

    const { usuario,dadosassociado, carregarDados, permissoes, limparDados, loading, infoEmpresa,setarDadosAssociado } = useContext(AuthContext)
    const [indexTab, setIndex] = useState<number>(0)
    const [modal, setModal] = useState<{ [key: string]: boolean }>({
        busca: false,
        cadastro: false
    })



    const isMobile = useMediaQuery("(max-width: 768px)")
    const [tab, setTab] = useState("dados")
  
    const tabs = [
      { value: "dados", label: "Dados Associado" },
      { value: "historico", label: "Histórico" },
      { value: "acordos", label: "Acordos" },
      { value: "dependentes", label: "Dependentes" },
      { value: "carteiras", label: "Carteiras" },
      { value: "obitos", label: "Óbitos" },
    ]

    /*  useEffect(() => {
          async function listaCadastro() {
              const response = await api.get('/listarDadosCadastro')
              closeModa({ ...data, cidades: response.data.cidades, planos: response.data.planos })
          }
          listaCadastro()
      }, [])*/




   /* async function atualizarObs() {
        try {
            const response = await toast.promise(
                api.put('/atualizarObservacao', {
                    id_contrato: dadosassociado?.contrato?.id_contrato,
                    anotacoes: data.contrato?.anotacoes?.toUpperCase()
                }),
                {
                    error: 'Erro ao adicionar Observação',
                    pending: 'Adicionando Observação',
                    success: 'Observação inserida com sucesso'
                }

            )

            //  await carregarDados()

        } catch (err) {
            console.log(err)
        }


    }*/



    useEffect(() => {

      
           
      
        if (dadosassociado?.id_global){
            VerificarSituacao({
                situacao: dadosassociado?.contrato?.situacao ?? '',
                mensalidades: dadosassociado?.mensalidade ?? [],
                convalescencia: dadosassociado?.contrato?.convalescencia ?? [],
                carencia: dadosassociado?.contrato?.dt_carencia ?? null
            })
        }
       
        


    }, [dadosassociado?.id_global]);

    
    useEffect(() => {
        return () => {
            limparDados();
        };
    }, []); 



    return (
        
            <div className={`flex flex-col px-2 w-full justify-center`}>

            {loading && <Modal size={'sm'} popup show={loading}>
                <Modal.Body>
                    <div className=" flex flex-col pt-6 w-full justify-center items-center">
                        <Spinner size={'lg'} color={'warning'} />
                        <span>Localizando dados....</span>
                    </div>

                </Modal.Body>
            </Modal>
            }
                {modal.busca && (<ModalBusca visible={modal.busca} setVisible={() => setModal({ busca: false })} />)}
                {modal.cadastro && (<ModalCadastro onClose={() => setModal({ cadastro: false })} isOpen={modal.cadastro} />)}


              
                    <div className="flex  flex-row justify-start gap-2 items-center w-full mt-2 px-2 pb-1">
                        <Button disabled={!infoEmpresa} variant={'outline'} size={'sm'} onClick={() => setModal({ busca: true })} type="button" >
                            <IoMdSearch size={18} />
                            Buscar Cliente
                        </Button>
                        <Button disabled={!infoEmpresa}  variant={'outline'} size={'sm'} type="button" onClick={() => setModal({ cadastro: true })} >
                            <IoMdAdd size={18} />
                            Novo Associado
                        </Button>

                    </div>
                  
         
                    {isMobile ? (
  // Renderiza um dropdown ou accordion para dispositivos móveis
  <div className="relative">
    <Select onValueChange={(value) => setTab(value)} defaultValue="dados">
      <SelectTrigger>
        <SelectValue placeholder="Selecione uma opção" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dados">Dados Associado</SelectItem>
        <SelectItem value="mensalidade">Mensalidades</SelectItem>
        <SelectItem value="dependentes">Dependentes</SelectItem>
        <SelectItem value="carteiras">Carteiras</SelectItem>
      </SelectContent>
    </Select>
    {tab === "dados" && <DadosAssociado
    dadosassociado = { dadosassociado}
      infoEmpresa ={infoEmpresa}
       permissoes ={permissoes}
       setarDadosAssociado ={setarDadosAssociado}
        usuario = {usuario ?? {} as UserProps} />}
    {tab === "mensalidade" && <HistoricoMensalidade
     {...{carregarDados, dadosassociado, infoEmpresa,usuario: usuario ?? {} as UserProps, permissoes, setarDadosAssociado}} 
     />}
    {tab === "dependentes" && <Dependentes
     {...{dadosassociado, infoEmpresa, permissoes, setarDadosAssociado,usuario: usuario ?? {} as UserProps}} />}
    {tab === "carteiras" && <CarteirasDep 
      adesao={dadosassociado?.contrato?.dt_adesao ?? new Date()}
      bairro={dadosassociado?.bairro ?? ''}
      celular={dadosassociado?.celular1 ?? ''}
      cidade={dadosassociado?.cidade ?? ''}
      contrato={dadosassociado?.contrato?.id_contrato ?? 0}
      cpf={dadosassociado?.cpfcnpj ?? ''}
      endereco={dadosassociado?.endereco ?? ''}
      numero={dadosassociado?.numero ?? 0}
      plano={dadosassociado?.contrato?.plano ?? ''}
      rg={dadosassociado?.rg ?? ''}
      titular={dadosassociado?.nome ?? ''}
      dependentes={dadosassociado?.dependentes ?? []}
      infoEmpresa={infoEmpresa}
      uf={dadosassociado?.uf ?? ''}
    />}
  </div>
) : (
  // Renderiza as tabs para telas maiores
  <Tabs defaultValue="dados" className="overflow-x-auto whitespace-nowrap">
    <TabsList className="gap-2">
      <TabsTrigger value="dados">
        <User className="w-4 h-4 mr-2" />
        Dados
      </TabsTrigger>
      <TabsTrigger value="mensalidade">
        <Wallet className="w-4 h-4 mr-2" />
        Mensalidades
      </TabsTrigger>
      <TabsTrigger value="dependentes">
        <Users className="w-4 h-4 mr-2" />
        Dependentes
      </TabsTrigger>
      <TabsTrigger value="carteiras">
        <HiOutlineIdentification className="w-5 h-5 mr-2" />
        Carteiras
      </TabsTrigger>
    </TabsList>

    <TabsContent value="dados">
      <DadosAssociado
        dadosassociado={dadosassociado}
        infoEmpresa={infoEmpresa}
        permissoes={permissoes}
        setarDadosAssociado={setarDadosAssociado}
        usuario={usuario ?? ({} as UserProps)}
      />
    </TabsContent>
    <TabsContent value="mensalidade">
      <HistoricoMensalidade
        carregarDados={carregarDados}
        dadosassociado={dadosassociado ?? {}}
        infoEmpresa={infoEmpresa}
        usuario={usuario ?? ({} as UsuarioProps)}
        permissoes={permissoes}
        setarDadosAssociado={setarDadosAssociado}
      />
    </TabsContent>
    <TabsContent value="dependentes">
      <Dependentes
        dadosassociado={dadosassociado ?? ({} as AssociadoProps)}
        infoEmpresa={infoEmpresa}
        permissoes={permissoes}
        setarDadosAssociado={setarDadosAssociado}
        usuario={usuario ?? ({} as UserProps)}
      />
    </TabsContent>
    <TabsContent value="carteiras">
      <CarteirasDep
        adesao={dadosassociado?.contrato?.dt_adesao ?? new Date()}
        bairro={dadosassociado?.bairro ?? ''}
        celular={dadosassociado?.celular1 ?? ''}
        cidade={dadosassociado?.cidade ?? ''}
        contrato={dadosassociado?.contrato?.id_contrato ?? 0}
        cpf={dadosassociado?.cpfcnpj ?? ''}
        endereco={dadosassociado?.endereco ?? ''}
        numero={dadosassociado?.numero ?? 0}
        plano={dadosassociado?.contrato?.plano ?? ''}
        rg={dadosassociado?.rg ?? ''}
        titular={dadosassociado?.nome ?? ''}
        dependentes={dadosassociado?.dependentes ?? []}
        infoEmpresa={infoEmpresa}
        uf={dadosassociado?.uf ?? ''}
      />
    </TabsContent>
  </Tabs>
)}


      {/* Conteúdo das tabs */}

     
                  
                </div>
         
      
    )
}
