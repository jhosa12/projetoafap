import { useContext, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { Button, Modal,  Tabs } from "flowbite-react";
import { TabTitular } from "./tabTitular";
import { TabContrato } from "./tabContrato";
import { ModalInativar } from "./modalInativar";
import { useForm, UseFormRegister, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { AssociadoProps } from "@/types/associado";

interface ModalProps {
  openEdit: boolean
  setModalEdit: (open: boolean) => void
  dataForm:Partial<AssociadoProps>
}

export interface UseFormAssociadoProps{
  register:UseFormRegister<AssociadoProps>
  watch:UseFormWatch<AssociadoProps>
  trigger:UseFormTrigger<AssociadoProps>
  setValue:UseFormSetValue<AssociadoProps>
}

export function ModalEditarDados({ openEdit,setModalEdit,dataForm }: ModalProps) {
  const { usuario,setarDadosAssociado,permissoes} = useContext(AuthContext)
  const [modalInativar,setmodalInat]= useState<boolean>(false)
  const {register,handleSubmit,watch,setValue,trigger} = useForm<AssociadoProps>({
    defaultValues:dataForm
  })

  const [motivoFinanceiro, setMotivoFinanceiro] = useState(false)
  const [motivoNaoLocalizado, setNaoLocalizado] = useState(false)
  const [motivoDesagrado, setMotivoDesagrado] = useState(false)


  async function inativarAtivarContrato(st: string) {

    if (st === 'INATIVO' && !motivoDesagrado && !motivoFinanceiro && !motivoNaoLocalizado) {
      toast.warning('Selecione a categoria do motivo')

      return;
    }
    if (st === 'INATIVO' && !dataForm ?.contrato?.motivo_inativo) {
      toast.warning('Descreva o motivo da Inattivação')
      return;
    }

    const response = await toast.promise(
      api.put('/contrato/inativar',
        {
          id_contrato: dataForm.contrato?.id_contrato,
          motivo_inativo: st === 'INATIVO' ? dataForm.contrato?.motivo_inativo : undefined,
          categoria_inativo: st === 'INATIVO' ? dataForm.contrato?.categoria_inativo : undefined,
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
   
    setarDadosAssociado({...dataForm,contrato:{...dataForm?.contrato,...response.data}})

  }



  const handleAtualizarDados = async()=>{
    try {
        const response = await toast.promise(
            api.put('/atualizarAssociado',{
              nome:watch('nome'),
              cep:watch('cep'),
              endereco:watch('endereco'),
              bairro:watch('bairro'),
              numero:watch('numero'),
              cidade:watch('cidade'),
              uf:watch('uf'),
              guia_rua: watch('guia_rua'),
              email:watch('email'),
              data_nasc:watch('data_nasc'),
              data_cadastro:new Date(),
              celular1:watch('celular1'),
              celular2:watch('celular2'),
              telefone:watch('telefone'),
              cad_dh: new Date(),
              edi_usu:usuario?.nome,
              edi_dh: new Date(),
              profissao:watch('profissao'),
              sexo:watch('sexo'),
              contrato:{
                id_contrato:Number(watch('contrato.id_contrato')),
                id_plano: Number(watch('contrato.id_plano')),
                plano: watch('contrato.plano'),
                consultor: watch('contrato.consultor'),
                situacao: watch('contrato.situacao'),
                valor_mensalidade: Number(watch('contrato.valor_mensalidade')),
                dt_adesao: watch('contrato.dt_adesao'),
                cobrador: watch('contrato.cobrador'),
                data_vencimento:watch('contrato.data_vencimento'),
                origem: watch('contrato.origem'),
                dt_carencia: watch('contrato.dt_carencia'),
              },
              id_global:Number(watch('id_global'))
            }),
            {
              error: 'Erro ao Atualizar Dados',
              pending: 'Realizando Alteração....',
              success: 'Alteração realizada com sucesso'
            }
        )
    } catch (error) {
      
    }
  }




  return (


    

       <Modal dismissible size={'4xl'} show onClose={()=>setModalEdit(false)}  popup>
        <Modal.Header/>
        
        <Modal.Body>
          
           
        <Tabs  theme={{tablist:{tabitem:{base:"flex  items-center justify-center rounded-t-lg p-2 text-sm font-medium first:ml-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{fullWidth:{active:{off:'bg-gray-50',on:'bg-gray-100 text-black'}}}}}}} aria-label="Full width tabs" variant="fullWidth">
        <Tabs.Item active title="Dados Titular" >

          <TabTitular register={register} setValue={setValue} watch={watch} trigger={trigger}/>
          
        </Tabs.Item>
        <Tabs.Item title="Dados Contrato" >

       <TabContrato register={register} setValue={setValue} watch={watch} trigger={trigger}/> 
       
        </Tabs.Item>
    
      
      
      </Tabs>
  
              
          <div className="inline-flex w-full justify-end p-2 gap-4">
        
          {dataForm?.contrato?.situacao==='ATIVO'?<Button disabled={!permissoes.includes('ADM1.1.3')}  onClick={()=>setmodalInat(true)} color={'failure'} >Inativar</Button>:  <Button disabled={!permissoes.includes('ADM1.1.3')} onClick={()=>inativarAtivarContrato('ATIVO')} color={'success'} >Ativar</Button>}
            <Button onClick={()=>handleAtualizarDados()} disabled={!permissoes.includes('ADM1.1.1')} >Salvar</Button>

          </div>
          </Modal.Body>


          <ModalInativar inativarAtivarContrato={inativarAtivarContrato} motivoDesagrado={motivoDesagrado} motivoFinanceiro={motivoFinanceiro} motivoNaoLocalizado={motivoNaoLocalizado} openModal={modalInativar} setModal={setmodalInat} setMotivoDesagrado={setMotivoDesagrado} setMotivoFinanceiro={setMotivoFinanceiro}  setNaoLocalizado={setNaoLocalizado} />
          </Modal>

  )
}