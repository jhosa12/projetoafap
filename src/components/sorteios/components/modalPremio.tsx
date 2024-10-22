
import { FormEvent } from "react";
import { IoIosClose } from "react-icons/io";
import React from 'react';
import { PremioProps } from "@/pages/sorteio/configuracoes";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { EmpresaProps } from "@/types/empresa";
import { ConveniadosProps } from "@/pages/conveniados";


interface CadastroProps {
    
    setarDadosPremios: (fields: Partial<PremioProps>) => void
    dadosPremio: Partial<PremioProps>
    listarPremios: () => Promise<void>
    setPremios: (fields: Array<Partial<PremioProps>>) => void
    arrayPremios: Array<Partial<PremioProps>>
    setModal: (modal: boolean) => void
    empresas: Array<EmpresaProps>
    conveniados:Array<ConveniadosProps>
}

export default function ModalPremio({ dadosPremio,setModal,empresas,conveniados,setPremios,arrayPremios }: CadastroProps) {
    const { register, setValue, handleSubmit, watch } = useForm<PremioProps>()


    const handleNovoPremio: SubmitHandler<PremioProps> = async (data) => {
        try {
            const response = await toast.promise(
                api.post('/sorteio/cadastroPremio', {
                    ordem: data.ordem,
                    id_empresa: data.id_empresa,
                   id_conveniados:data.id_conveniados,
                   conveniado:conveniados.find(item=>item.id_conveniados==Number(data.id_conveniados))?.conveniado,
                    descricao: data.descricao,
                    data: new Date(),
                    

                }),
                {
                    error: 'ERRO AO CADASTRAR PRÊMIO',
                    pending: 'REALIZANDO CADASTRO',
                    success: 'CADASTRADO COM SUCESSO!'
                }

            )
            const premio: PremioProps = response.data
          
            setPremios([...arrayPremios, premio])
            
           
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <Modal show={true} size="md" onClose={() => setModal(false)}>
            <Modal.Header>
                Administrar Prêmio
            </Modal.Header>
            <Modal.Body>

                <form className=" grid grid-cols-2 gap-4" onSubmit={handleSubmit(handleNovoPremio)}>
                <div className="col-span-2">
        <div className="mb-1 block ">
          <Label value="Descricão do Prêmio" />
        </div>
        <TextInput sizing={''} {...register('descricao')} required />
      </div>
      <div>
        <div className="mb-1 block">
          <Label value="Empresa" />
        </div>
        <Select {...register('id_empresa')} required >
          <option value=""></option>  
          {empresas?.map((item) => (
            <option value={item.id} key={item.id}>{item.nome}</option>
          ))}
        
        </Select>
      </div>
      <div>
        <div className="mb-1 block">
          <Label value="Conveniado" />
        </div>
        <Select {...register('id_conveniados')} required >
          <option value="">{}</option>  
          {conveniados?.map((item) => (
            <option value={item.id_conveniados} key={item.id_conveniados}>{item.conveniado}</option>
          ))}
        </Select>
      </div>

      <Button type="submit">{dadosPremio.id_premio ? 'Alterar' : 'Cadastrar'}</Button>

                </form>
            </Modal.Body>

        </Modal>
    )
}