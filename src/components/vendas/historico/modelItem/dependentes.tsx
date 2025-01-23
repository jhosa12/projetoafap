import { Table } from "flowbite-react";
import { UseFormLeadProps } from "./modalItem";
import { useEffect } from "react";






export function TabDependentes({control,register,setValue,trigger,watch}:UseFormLeadProps) {




    return(
        <div>
            <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-6 py-1 text-black text-xs uppercase"}}}}>
                <Table.Head>
                    <Table.HeadCell>Nome</Table.HeadCell>
                    <Table.HeadCell>Parentesco</Table.HeadCell>
                    <Table.HeadCell>Data de Nascimento</Table.HeadCell>
                    <Table.HeadCell>celular</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                   {watch('dependentes')?.map((item,index)=>(
                    <Table.Row key={index}>
                        <Table.Cell>{item?.nome}</Table.Cell>
                        <Table.Cell>{item?.grau_parentesco}</Table.Cell>
                        <Table.Cell>{item?.data_nasc && new Date(item?.data_nasc).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>
                        <Table.Cell>{item?.celular
                            }</Table.Cell>
                    </Table.Row>
                   ))}
                </Table.Body>
            </Table>
        </div>
    )
}