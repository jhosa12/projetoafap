'use client'
import { api } from "@/lib/axios/apiClient";
import { EmpresaProps } from "@/types/empresa";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SubmitHandler, useForm } from "react-hook-form"
import { AuthContext } from "@/store/AuthContext";
import { TabInformacoes } from "@/app/dashboard/empresa/_components/tabInformacoes";
import { TabContratoEmpresa } from "@/app/dashboard/empresa/_components/tabContrato";
import { toast } from "sonner";
import { Save } from "lucide-react";



export default function Empresas() {
    const { infoEmpresa } = useContext(AuthContext)
    // const [empresas,setEmpresas] = useState<Array<EmpresaProps>>([])
    // const [empresa,setEmpresa] = useState<EmpresaProps>({} as EmpresaProps)
    // const [open,onClose]=useState(false)
    const { register, watch, control, setValue, handleSubmit, reset } = useForm<EmpresaProps>({

    })

    useEffect(() => {

        if (infoEmpresa)
            reset(infoEmpresa)
    }, [infoEmpresa])


    const handleEditarEmpresa: SubmitHandler<EmpresaProps> = async (data) => {

        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('razao_social', data.razao_social ?? '');
        formData.append('nome', data.nome ?? '');
        formData.append('cnpj', data.cnpj ?? '');
        formData.append('celular', data.celular ?? '');
        formData.append('email', data.email ?? '');
        formData.append('endereco', data.endereco ?? '');
        formData.append('celular2', data.celular2 ?? '');
        formData.append('site', data.site ?? '');
        formData.append('fantasia', data.fantasia ?? '');
        formData.append('fone', data.fone ?? '');
        formData.append('local_pagamento', data.local_pagamento ?? '');
        formData.append('cidade_uf', data.cidade_uf ?? '');
        formData.append('dias_carencia', String(data.dias_carencia) ?? '');
        formData.append('email_come', data.email_come ?? '');
        formData.append('ins_estadual', data.ins_estadual ?? '');
        formData.append('validade_carteira', String(data.validade_carteira) ?? '');
        formData.append('instrucoes_carne', data.instrucoes_carne ?? '');
        formData.append('cont_clausuras', data.cont_clausuras ?? '');

        if (data.logo) {
            formData.append('file', data.logo);
        }



        toast.promise(
            api.post('/empresa/editarEmpresa', formData),
            {
                loading: 'Editando Empresa',
                success: 'Empresa Editada com sucesso',
                error: 'Erro ao Editar Empresa'
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
        <div className={`flex flex-col mt-2 px-4 w-full overflow-y-auto max-h-[calc(100vh-85px)]`}>
    <form onSubmit={handleSubmit(handleEditarEmpresa)}>
                <Tabs defaultValue="info">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="info">Informações da Empresa</TabsTrigger>
                        <TabsTrigger value="config">Configurações</TabsTrigger>
                        <TabsTrigger value="imagens">Imagens</TabsTrigger>
                        <TabsTrigger value="contrato">Contrato</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                        <TabInformacoes watch={watch} control={control} register={register} setValue={setValue} empresa={infoEmpresa ?? {}} />
                    </TabsContent>
                    <TabsContent value="config">
                    </TabsContent>
                    <TabsContent value="imagens">
                    </TabsContent>
                    <TabsContent value="contrato">
                        <TabContratoEmpresa control={control} register={register} setValue={setValue} watch={watch} />
                    </TabsContent>
                </Tabs>

                <div className="flex w-full justify-end mt-2">
                    <Button variant={'default'} type="submit" >
                        <Save/>
                        Salvar</Button>

                </div>
            </form>
        </div>
    )
}