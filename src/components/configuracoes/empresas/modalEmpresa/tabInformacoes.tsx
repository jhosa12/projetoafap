import { EmpresaProps } from "@/types/empresa"
import { FileInput, Label, Textarea, TextInput } from "flowbite-react"
import { useForm } from "react-hook-form"




export const TabInformacoes = () => {
    const {register,control,setValue,watch,handleSubmit}= useForm<EmpresaProps>()
    return (
    <form className="grid grid-cols-4 gap-2">
        <div className="col-span-4 inline-flex gap-2">
                  <Label
                    htmlFor="dropzone-file"
                    className="flex relative w-1/3 cursor-pointer p-2  flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 "
                  >
                        <svg
                        className="absolute  z-20 mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                   {!watch('local_pagamento') && <div className="flex flex-col items-center justify-center pt-6">
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG(MAX. 500x350px)</p>
                    </div>}
                    <FileInput  onChange={()=>{}} id="dropzone-file" className="hidden" />
                  </Label>

                  <Textarea rows={4}  {...register('local_pagamento')} placeholder="Cabeçalho de contrato/relatorios"/>
        </div>
        <div className="col-span-2">
            <Label className="text-xs" value="Razão Social" />
            <TextInput sizing={'sm'} {...register('razao_social')} type="text" placeholder="Razão Social" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="Fantasia" />
            <TextInput sizing={'sm'} {...register('fantasia')} type="text" placeholder="Fantasia" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="CNPJ" />
            <TextInput sizing={'sm'} {...register('cnpj')} type="text" placeholder="CNPJ" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="Insc. Estadual" />
            <TextInput sizing={'sm'} {...register('ins_estadual')} type="text" placeholder="Insc. Estadual" required/>
        </div>
        <div className="col-span-2">
            <Label className="text-xs" value="Endereço (Rua, N, Bairro, Cidade, UF, CEP)" />
            <TextInput sizing={'sm'} {...register('endereco')} type="text" placeholder="Insc. Estadual" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="Cidade/UF" />
            <TextInput sizing={'sm'} {...register('cidade_uf')} type="text" placeholder="Insc. Estadual" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="Telefone" />
            <TextInput sizing={'sm'} {...register('fone')} type="text" placeholder="Telefone" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="Celular" />
            <TextInput sizing={'sm'} {...register('celular')} type="text" placeholder="Celular" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="Celular2" />
            <TextInput sizing={'sm'} {...register('celular2')} type="text" placeholder="Celular" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="Site" />
            <TextInput sizing={'sm'} {...register('site')} type="text" placeholder="Site" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="Email" />
            <TextInput sizing={'sm'} {...register('email')} type="text" placeholder="Email" required/>
        </div>
        <div className="">
            <Label className="text-xs" value="Email Comercial" />
            <TextInput sizing={'sm'} {...register('email_come')} type="text" placeholder="Email" required/>
        </div>
        <div className="col-span-2">
            <Label className="text-xs" value="Instruções para o carnê" />
            <TextInput sizing={'sm'} {...register('instrucoes_carne')} type="text" placeholder="Instruções Carnê" required/>
        </div>
    </form>
    )
}