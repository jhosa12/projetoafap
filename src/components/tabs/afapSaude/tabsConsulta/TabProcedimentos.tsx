



import { HiTrash } from "react-icons/hi";
import { TabsConsultaProps } from "./TabsConsulta";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  Table } from "flowbite-react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ExamesData, MedicoProps } from "@/types/afapSaude";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";



interface TabProcedimentoProps extends TabsConsultaProps{
    medicos:Array<MedicoProps>
}


export default function TabProcedimentos({ watch, setValue,control,medicos }: TabProcedimentoProps) {
 



      const handleAdicionarProcedimento = () => {
        const medico = medicos?.find(item => item.id_med === Number(watch('id_med')));
        const exame = medico?.exames?.find(item => item.id_exame === Number(watch('id_selected')));
    
    
        const tipo = watch('tipoDesc')
        if (!medico) {
          toast('Selecione um especialista')
        }
    
        if (!tipo) {
          toast.info('Selecione um tipo de desconto')
          return
        }
    
        //console.log(exame)
        if (!exame) {
          toast.info('Selecione um exame')
          return;
        }
    
    
    
        // Obter a lista atual de exames, garantindo que seja um array
        const procedimentosAtuais = watch('procedimentos') || [];
    
        // Verificar se o exame já existe na lista para evitar duplicados
        const exameJaExiste = procedimentosAtuais.some((item: ExamesData) => item.id_exame === exame.id_exame);
    
        if (exameJaExiste) {
          toast.info('Exame ja existe na lista');
          return;
        }
    
    
        const vl_particular = Number(exame.porcPart)
    
        const desconto = tipo === 'PARTICULAR' ? 0 : tipo === 'FUNERARIA' ?
          (vl_particular - Number(exame.porcFun)) : (vl_particular - Number(exame.porcPlan));
    
    
        setValue('procedimentos', [...procedimentosAtuais, {
          data: new Date(),
          id_exame: exame.id_exame,
          nome: exame.nome,
          desconto: desconto,
          valorExame: vl_particular,
          valorFinal: vl_particular - desconto,
          obs: exame.obs,
    
        }]);
        console.log("Exame adicionado:", exame);
      };



      const handleDelProcdimentoTable = (id_exame: number) => {
        setValue('procedimentos', watch('procedimentos').filter(item => item.id_exame !== id_exame))
      }
 

  return (
    <div className="w-full space-y-2">
    <div className="inline-flex gap-4 mb-1 mt-2 w-full">

    <div className="w-1/4">

      <Label className="text-xs">Desconto</Label>
      <Controller
        control={control}
        name="tipoDesc"
        render={({ field: { onChange, value } }) => (
          <Select disabled={watch('procedimentos')?.length > 0} value={value} onValueChange={e => onChange(e)}  >
            <SelectTrigger className="">
              <SelectValue placeholder="Desconto" />
              <SelectContent>
                <SelectGroup>
                  <SelectItem className="text-xs" value={'PARTICULAR'}>PARTICULAR</SelectItem>
                  <SelectItem className="text-xs" value={'FUNERARIA'}>FUNERÁRIA</SelectItem>
                  <SelectItem className="text-xs" value={'PLANO'}>PLANO</SelectItem>
                </SelectGroup>
              </SelectContent>
            </SelectTrigger>
          </Select>
        )}
      />

  
    </div>
    <div className="w-1/2">

      <Label htmlFor="procedimentos" className="text-xs" >Procedimentos</Label>
      <Controller
      control={control}
      name="id_selected"
      render={({ field: { onChange, value } }) => (
        <Select value={String(value)} onValueChange={e => onChange(e)}  >
        <SelectTrigger className="">
          <SelectValue placeholder="Procedimentos" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              
              {medicos?.find(item => item.id_med === Number(watch('id_med')))?.exames.map((item, index) => (
                <SelectItem className="text-xs" value={String(item.id_exame)} key={item.id_exame}>{item.nome}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
          </Select>
      )}
      />

    
    </div>
    <Button onClick={handleAdicionarProcedimento} type="button"  className="mt-auto">Adicionar</Button>

  </div>
  <div className="overflow-x-auto ">
    <Table theme={{ root: { shadow: 'none' }, body: { cell: { base: "px-3 text-black py-1  font-medium" } }, head: { cell: { base: "px-3 text-black py-0  bg-gray-200" } } }}  >
      <Table.Head>
        <Table.HeadCell>Procedimento</Table.HeadCell>
        <Table.HeadCell>Valor Procedimento</Table.HeadCell>
        <Table.HeadCell>Desconto</Table.HeadCell>
        <Table.HeadCell>Valor Final</Table.HeadCell>
        <Table.HeadCell>
          <span className="sr-only">Edit</span>
        </Table.HeadCell>

      </Table.Head>
      <Table.Body className="divide-y">
        {Array.isArray(watch('procedimentos')) && watch('procedimentos')?.map((item, index) => (
          <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {item.nome}
            </Table.Cell>
            <Table.Cell>{Number(item.valorExame ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
            <Table.Cell>{Number(item.desconto ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
            <Table.Cell>{Number(item.valorFinal ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
            <Table.Cell>

              <button type="button" onClick={() => handleDelProcdimentoTable(item.id_exame)} className="font-medium text-gray-500 hover:text-red-600 ">
                <HiTrash size={16} />
              </button>
            </Table.Cell>

          </Table.Row>


        ))}

        <Table.Row >
          <Table.Cell className="whitespace-nowrap  font-semibold ">
            Total
          </Table.Cell>

          <Table.Cell>{ }</Table.Cell>
          <Table.Cell>{ }</Table.Cell>
          <Table.Cell className="font-semibold">{Number(watch('procedimentos')?.reduce((acumulador, atual) => {
            acumulador += Number(atual.valorFinal)
            return acumulador
          }, 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
        </Table.Row>


      </Table.Body>

    </Table>
  </div>

    </div>  









  );
}
