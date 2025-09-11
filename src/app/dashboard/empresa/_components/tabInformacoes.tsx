import { EmpresaProps } from "@/types/empresa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChangeEvent, useRef } from "react"
import { FormEmpresaProps } from "./modalEmpresa"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface FormTabInformacoesProps extends FormEmpresaProps { empresa: Partial<EmpresaProps> }
export const TabInformacoes = ({ empresa, control, register, setValue, watch }: FormTabInformacoesProps) => {

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files) {
            return;
        }
        const file = e.target.files[0]
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            return;
        }
        setValue('logo', file)
        setValue('logoUrl', URL.createObjectURL(file))
    }

    const inputRef = useRef<HTMLInputElement>(null);

    const handlePick = () => {
        inputRef.current?.click();
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Identidade da Empresa</CardTitle>
                    <CardDescription>Logo e cabeçalho utilizado em documentos e relatórios.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 flex flex-col items-center gap-3">
                            {/* Avatar preview da logo */}
                            <Avatar className="h-28 w-28">
                                {watch('logoUrl') && <AvatarImage src={watch('logoUrl') as string} alt="Logo" />}
                                <AvatarFallback className="text-xs">
                                    {empresa?.nome?.slice(0, 2)?.toUpperCase() || "LG"}
                                </AvatarFallback>
                            </Avatar>
                            {/* Botão para escolher arquivo */}
                            <Button type="button" onClick={handlePick}>Upload Logo</Button>
                            <input type="file" ref={inputRef} onChange={handleImage} style={{ display: 'none' }} />
                            <p className="text-[11px] text-muted-foreground">SVG, PNG, JPG • máx. 500x350px</p>
                        </div>
                        <div className="col-span-3">
                            <Label className="text-xs" htmlFor="local_pagamento">Cabeçalho (contratos e relatórios)</Label>
                            <Textarea rows={6} {...register('local_pagamento')} placeholder="Cabeçalho de contrato/relatórios" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Dados Cadastrais</CardTitle>
                    <CardDescription>Informações legais e de identificação.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-2">
                            <Label className="text-xs" htmlFor="razao_social">Razão Social</Label>
                            <Input id="razao_social" {...register('razao_social')} type="text" placeholder="Razão Social" required />
                        </div>
                        <div>
                            <Label className="text-xs" htmlFor="fantasia">Fantasia</Label>
                            <Input id="fantasia" {...register('fantasia')} type="text" placeholder="Fantasia" required />
                        </div>
                        <div>
                            <Label className="text-xs" htmlFor="cnpj">CNPJ</Label>
                            <Input id="cnpj" {...register('cnpj')} type="text" placeholder="CNPJ" required />
                        </div>
                        <div>
                            <Label className="text-xs" htmlFor="ins_estadual">Insc. Estadual</Label>
                            <Input id="ins_estadual" {...register('ins_estadual')} type="text" placeholder="Insc. Estadual" required />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Endereço</CardTitle>
                    <CardDescription>Localização completa para documentos e contato.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3">
                            <Label className="text-xs" htmlFor="endereco">Endereço (Rua, N, Bairro, Cidade, UF, CEP)</Label>
                            <Input id="endereco" {...register('endereco')} type="text" placeholder="Endereço" required />
                        </div>
                        <div>
                            <Label className="text-xs" htmlFor="cidade_uf">Cidade/UF</Label>
                            <Input id="cidade_uf" {...register('cidade_uf')} type="text" placeholder="Cidade/UF" required />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contatos</CardTitle>
                    <CardDescription>Telefones, site e endereços de e-mail.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <Label className="text-xs" htmlFor="fone">Telefone</Label>
                            <Input id="fone" {...register('fone')} type="text" placeholder="Telefone" required />
                        </div>
                        <div>
                            <Label className="text-xs" htmlFor="celular">Celular</Label>
                            <Input id="celular" {...register('celular')} type="text" placeholder="Celular" required />
                        </div>
                        <div>
                            <Label className="text-xs" htmlFor="celular2">Celular 2</Label>
                            <Input id="celular2" {...register('celular2')} type="text" placeholder="Celular" required />
                        </div>
                        <div>
                            <Label className="text-xs" htmlFor="site">Site</Label>
                            <Input id="site" {...register('site')} type="text" placeholder="Site" required />
                        </div>
                        <div>
                            <Label className="text-xs" htmlFor="email">Email</Label>
                            <Input id="email" {...register('email')} type="text" placeholder="Email" required />
                        </div>
                        <div>
                            <Label className="text-xs" htmlFor="email_come">Email Comercial</Label>
                            <Input id="email_come" {...register('email_come')} type="text" placeholder="Email Comercial" required />
                        </div>
                        <div className="col-span-2">
                            <Label className="text-xs" htmlFor="instrucoes_carne">Instruções para o carnê</Label>
                            <Input id="instrucoes_carne" {...register('instrucoes_carne')} type="text" placeholder="Instruções Carnê" required />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}