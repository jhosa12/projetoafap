import { useContext, useEffect, useState } from "react"

import { IoIosClose } from "react-icons/io";
import { TbAlertTriangle } from "react-icons/tb";
import { AuthContext } from "@/contexts/AuthContext";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { Button, FloatingLabel, Label, Modal, Select, Tabs, TextInput } from "flowbite-react";
import { HiUserCircle } from "react-icons/hi2";
import { MdMedicalServices } from "react-icons/md";
import { TabTitular } from "./tabTitular";
import { TabContrato } from "./tabContrato";
import { ModalInativar } from "./modalInativar";


export function ModalEditarDados({ openEdit,setModalEdit }: { openEdit: boolean,setModalEdit:(open:boolean)=>void }) {
  const { usuario, closeModa, data, dadosassociado,setarDadosAssociado,permissoes} = useContext(AuthContext)
  const [modalInativar,setmodalInat]= useState<boolean>(false)

  const [motivoFinanceiro, setMotivoFinanceiro] = useState(false)
  const [motivoNaoLocalizado, setNaoLocalizado] = useState(false)
  const [motivoDesagrado, setMotivoDesagrado] = useState(false)


  async function inativarAtivarContrato(st: string) {

    if (st === 'INATIVO' && !motivoDesagrado && !motivoFinanceiro && !motivoNaoLocalizado) {
      toast.warning('Selecione a categoria do motivo')

      return;
    }
    if (st === 'INATIVO' && !data.contrato?.motivo_inativo) {
      toast.warning('Descreva o motivo da Inattivação')
      return;
    }

    const response = await toast.promise(
      api.put('/contrato/inativar',
        {
          id_contrato: dadosassociado?.contrato?.id_contrato,
          motivo_inativo: st === 'INATIVO' ? data.contrato?.motivo_inativo : undefined,
          categoria_inativo: st === 'INATIVO' ? data.contrato?.categoria_inativo : undefined,
          dt_cancelamento: st === 'INATIVO' ? new Date() : undefined,
          situacao: st
        }
      ),
      {
        error: 'Erro ao Inativar/Ativar Contrato',
        pending: 'Realizando Alteração....',
        success: 'Alteração realizada com sucesso'

      }
    )
   // await carregarDados()
   
    setarDadosAssociado({...dadosassociado,contrato:{...dadosassociado?.contrato,...response.data}})

  }










  /*
  useEffect(() => {
    closeModa({
      closeEditarAssociado: true,
      name: dadosassociado?.nome,
      nasc: new Date(dadosassociado?.data_nasc ?? ''),
      bairro: dadosassociado?.bairro,
      celular1: dadosassociado?.celular1,
      celular2: dadosassociado?.celular2,
      telefone: dadosassociado?.telefone,
      cidade: dadosassociado?.cidade,
      cep: dadosassociado?.cep,
      cpf: dadosassociado?.cpf,
      endereco: dadosassociado?.endereco,
      email: dadosassociado?.email,
      id_associado: dadosassociado?.id_associado,
      contrato: {
        id_contrato: dadosassociado?.contrato?.id_contrato,
        cobrador: dadosassociado?.contrato?.cobrador,
        consultor: dadosassociado?.contrato?.consultor,
        data_vencimento: dadosassociado?.contrato?.data_vencimento,
        dt_adesao: dadosassociado?.contrato?.dt_adesao,
        dt_carencia: dadosassociado?.contrato?.dt_carencia,
        id_plano: dadosassociado?.contrato?.id_plano,
        origem: dadosassociado?.contrato?.origem,
        plano: dadosassociado?.contrato?.plano,
        situacao: dadosassociado?.contrato?.situacao,
        supervisor: dadosassociado?.contrato?.supervisor,
        valor_mensalidade: dadosassociado?.contrato?.valor_mensalidade
      },

      numero: dadosassociado?.numero,
      profissao: dadosassociado?.profissao,
      rg: dadosassociado?.rg,
      referencia: dadosassociado?.guia_rua,
      uf: dadosassociado?.uf
    })
  }, [])
*/


  return (


    

       <Modal dismissible size={'4xl'} show={openEdit} onClose={()=>setModalEdit(false)}  popup>
        <Modal.Header/>
        
        <Modal.Body>
          
           
        <Tabs  theme={{tablist:{tabitem:{base:"flex  items-center justify-center rounded-t-lg p-2 text-sm font-medium first:ml-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{fullWidth:{active:{off:'bg-gray-50',on:'bg-gray-100 text-black'}}}}}}} aria-label="Full width tabs" variant="fullWidth">
        <Tabs.Item active title="Dados Titular" >
          <TabTitular/>
          
        </Tabs.Item>
        <Tabs.Item title="Dados Contrato" >
       <TabContrato/> 
       
        </Tabs.Item>
    
      
      
      </Tabs>
  
              
          <div className="inline-flex w-full justify-end p-2 gap-4">
        
          {dadosassociado?.contrato?.situacao==='ATIVO'?<Button disabled={!permissoes.includes('ADM1.1.3')}  onClick={()=>setmodalInat(true)} color={'failure'} >Inativar</Button>:  <Button disabled={!permissoes.includes('ADM1.1.3')} onClick={()=>inativarAtivarContrato('ATIVO')} color={'success'} >Ativar</Button>}
            <Button disabled={!permissoes.includes('ADM1.1.1')} >Salvar</Button>

          </div>
          </Modal.Body>


          <ModalInativar inativarAtivarContrato={inativarAtivarContrato} motivoDesagrado={motivoDesagrado} motivoFinanceiro={motivoFinanceiro} motivoNaoLocalizado={motivoNaoLocalizado} openModal={modalInativar} setModal={setmodalInat} setMotivoDesagrado={setMotivoDesagrado} setMotivoFinanceiro={setMotivoFinanceiro}  setNaoLocalizado={setNaoLocalizado} />
          </Modal>

  )
}