
import { InadimplenciaProps } from '@/components/cobranca/indimplencia/indimplencia';
import { Table } from 'flowbite-react';
import React from 'react';




interface DadosProps {
    dados:InadimplenciaProps[]|[],
    usuario?:string
}






class RelatorioInadimplencia extends React.Component<DadosProps> {

  render() {
    const { dados,usuario } = this.props;

 


    return (
      <div className='flex flex-col w-full p-2  items-center  '>
        <span className="text-xs ml-auto">{usuario}-{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        <h2 className="  font-semibold text-sm">RELATÓRIO DE INADIMPLENTES</h2>
        {/*<h3 className="text-xs font-medium">{new Date(dataInicial).toLocaleDateString()} a {new Date(dataFinal).toLocaleDateString()}</h3>*/}
       
        <Table  hoverable theme={{root:{shadow:'none'}, body: { cell: { base: "px-4 py-0" } } }} 
          >
                  <Table.Head theme={{cell:{base:"px-4 py-1 "}}}>
                   
                      <Table.HeadCell>
                        TITULAR
                      </Table.HeadCell>
                      <Table.HeadCell>
                        ENDEREÇO
                      </Table.HeadCell>
                      <Table.HeadCell>
                        GUIA DE RUA
                      </Table.HeadCell>
                      <Table.HeadCell>
                        TELEFONES
                      </Table.HeadCell>
                      <Table.HeadCell>
                        COBRANÇA
                      </Table.HeadCell>
                      <Table.HeadCell >
                        ULT. PAG
                      </Table.HeadCell>
                      <Table.HeadCell >
                        NPARC
                      </Table.HeadCell>
                      <Table.HeadCell >
                        VALOR
                      </Table.HeadCell>
                 
                   
                  </Table.Head>
                  <Table.Body style={{fontSize:'11px'}} className="divide-y  text-black  ">
                    {dados?.map((item, index) => (
                      <Table.Row key={index} >
                        <Table.Cell scope="row" >
                          {item.associado.nome}
                        </Table.Cell>
                        <Table.Cell data-tooltip-id="tooltip-hora" data-tooltip-place="bottom" >
                          {item.associado.endereco}{item.associado.numero ? "-Nº" + item.associado.numero : ''}
                        </Table.Cell>
                        <Table.Cell >
                          {item.associado.guia_rua}
      
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap" >
                          {item.associado.celular1}
                        </Table.Cell>
                        <Table.Cell >
                         cobrança
                        </Table.Cell>
                        <Table.Cell >
                          {item.lastPaidPayment && new Date(item.lastPaidPayment).toLocaleDateString('pt-BR',{timeZone:'UTC'})}
                        </Table.Cell>
                        <Table.Cell >
                          {item.overdueCount}
                        </Table.Cell>
                        <Table.Cell >
                          {Number(item.totalOverdueAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Table.Cell>
                      </Table.Row>
      
                    ))}
      
      </Table.Body>
                
      
                  </Table>
     
     


       
      </div>
    );
  }
}

export default RelatorioInadimplencia;
