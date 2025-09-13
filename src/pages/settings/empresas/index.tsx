
import { api } from "@/lib/axios/apiClient";
import { EmpresaProps } from "@/types/empresa";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs } from "flowbite-react"
import {SubmitHandler, useForm } from "react-hook-form"
import { AuthContext } from "@/store/AuthContext";
import { TabInformacoes } from "@/components/tabs/configuracoes/empresas/modalEmpresa/tabInformacoes";
import { TabContratoEmpresa } from "@/components/tabs/configuracoes/empresas/modalEmpresa/tabContrato";
import { toast } from "sonner";





export default function Empresas() {
    const {infoEmpresa} = useContext(AuthContext)
   // const [empresas,setEmpresas] = useState<Array<EmpresaProps>>([])
   // const [empresa,setEmpresa] = useState<EmpresaProps>({} as EmpresaProps)
   // const [open,onClose]=useState(false)
    const {register,watch,control,setValue,handleSubmit,reset} = useForm<EmpresaProps>({
       
    })

    useEffect(()=>{

        if(infoEmpresa)
         reset(infoEmpresa)
    },[infoEmpresa])


    const handleEditarEmpresa:SubmitHandler<EmpresaProps> = async(data)=>{
      
        const formData = new FormData();
        formData.append('id',data.id);
        formData.append('razao_social',data.razao_social??'');
        formData.append('nome',data.nome??'');
        formData.append('cnpj',data.cnpj??'');
        formData.append('celular',data.celular??'');
        formData.append('email',data.email??'');
        formData.append('endereco',data.endereco??'');
        formData.append('celular2',data.celular2??'');
        formData.append('site',data.site??'');
        formData.append('fantasia',data.fantasia??'');
        formData.append('fone',data.fone??'');
        formData.append('local_pagamento',data.local_pagamento??'');
        formData.append('cidade_uf',data.cidade_uf??'');
        formData.append('dias_carencia',String(data.dias_carencia)??'');
        formData.append('email_come',data.email_come??'');
        formData.append('ins_estadual',data.ins_estadual??'');
        formData.append('validade_carteira',String(data.validade_carteira)??'');
        formData.append('instrucoes_carne',data.instrucoes_carne??'');
        formData.append('cont_clausuras',data.cont_clausuras??'');

        if(data.logo){
            formData.append('file',data.logo);
        }

   

          toast.promise(
                api.post('/empresa/editarEmpresa',formData),
                {
                   loading:'Editando Empresa',
                    success:'Empresa Editada com sucesso',
                    error:'Erro ao Editar Empresa'
                }
            )
      
   

    }

/*const handleListarEmp = useCallback(async()=>{
    try {
        const response = await api.get("/empresas/listarDados")
     
        setEmpresas(response.data)
    } catch (error) {
        toast.error('erro na requisição')
    }
},[empresas]
)*/
/*useEffect(()=>{
    handleListarEmp()
},[])

const handleOpenEmpresa = useCallback((item:EmpresaProps)=>{
    setEmpresa(item)
    onClose(true)
},[])*/



    return (
        <div className={ `flex flex-col mt-2 px-4 w-full overflow-y-auto max-h-[calc(100vh-85px)]`}>

  {/*{   open && <ModalEmpresa empresa={empresa} open={open} onClose={onClose} />}
            <Button onClick={()=>{setEmpresa({} as EmpresaProps);onClose(true)}} type="button" className="mr-auto"  variant={'outline'} size="sm" ><IoIosAddCircle size={20}  />NOVA EMPRESA</Button>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto mt-2" >
                <Table theme={{root:{shadow:'none'}, body: { cell: { base: " px-6 py-2  text-xs text-black font-semibold" } } }} hoverable={true}>
                    <Table.Head theme={{cell: { base: " px-6 py-2  text-xs text-black font-semibold" }}}>
                        <Table.HeadCell>
                            Nome
                        </Table.HeadCell>
                        <Table.HeadCell>
                           Razão social
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Cidade
                        </Table.HeadCell>
                        <Table.HeadCell>
                            CNPJ
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Status
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Ações
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {empresas.map((item,index)=>(
                            <Table.Row key={item.id} className="text-black">
                            <Table.Cell className="whitespace-nowrap font-medium ">
                               {item.nome}
                            </Table.Cell>
                            <Table.Cell>
                                {item.razao_social}
                            </Table.Cell>
                            <Table.Cell>
                                {item.cidade_uf}
                            </Table.Cell>
                            <Table.Cell>
                                {item.cnpj}
                            </Table.Cell>
                            <Table.Cell >
                                {}
                            </Table.Cell>
                            <Table.Cell className="flex gap-4">
                           <button onClick={()=>handleOpenEmpresa(item)} className="text-gray-500 hover:text-yellow-500"><HiMiniCog6Tooth size={15} /></button> 
                           
                            </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                </Table>
            </div>
*/}    <form onSubmit={handleSubmit(handleEditarEmpresa)}>
            <Tabs  theme={{tablist:{tabitem:{base:"flex z-0 items-center justify-center rounded-t-lg p-2 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 ",variant:{fullWidth:{active:{off:'bg-gray-50',on:'bg-gray-300 text-black'}}}}}}} aria-label="Full width tabs" variant="fullWidth">
                                        <Tabs.Item active title="Informações da Empresa" >
                                            <TabInformacoes watch={watch} control={control} register={register} setValue={setValue} empresa={infoEmpresa??{}}/>
                                        </Tabs.Item>
                                      
                                        <Tabs.Item title="Configurações" >
                                   
                                        </Tabs.Item>
            
                                        <Tabs.Item   title="Imagens" >
                                        
                                        </Tabs.Item>


                                        <Tabs.Item   title="Contrato" >
                                        <TabContratoEmpresa control={control} register={register} setValue={setValue} watch={watch} />
                                        </Tabs.Item>
            
                            
                                      </Tabs> 

                                    <div className="flex w-full justify-end gap-4">
                                    <Button variant={'outline'} type="submit" >Salvar</Button>
                                  
                                    </div>
                                    
            </form>
        </div>
    )
}