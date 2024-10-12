

import {  Timeline } from "flowbite-react";
import {  HiOutlineCheck } from "react-icons/hi2";
import {  HiX } from "react-icons/hi";
import { ChildrenProps } from "./admContrato/cadastro/modalCadastro";



export function ResumoCadastro({watch}:ChildrenProps){
 

 
    return(
       <div className="flex w-full">
        <Timeline className="gap-8" horizontal>
          
        <Timeline.Item>
          <Timeline.Point  theme={{marker:{icon:{wrapper:`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${watch('id_empresa')?"bg-cyan-200":"bg-red-300"}  ring-8 ring-white`,
          base:`${watch('id_empresa')?"text-cyan-600":"text-red-600 h-3 w-3"}`
        },
          
          }}}    icon={watch('id_empresa')?HiOutlineCheck:HiX}  />
          <Timeline.Content>
            <Timeline.Time>Empresa</Timeline.Time>
            <Timeline.Title className="whitespace-nowrap">{watch('empresa')}</Timeline.Title>
            <Timeline.Body>
             
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>

        <Timeline.Item>
          <Timeline.Point icon={HiOutlineCheck} />
          <Timeline.Content>
            <Timeline.Time>Dados Titular</Timeline.Time>
            <Timeline.Title className="whitespace-nowrap">{watch('name')}</Timeline.Title>
            <Timeline.Body>
             Endereço:{watch('endereco')}
            </Timeline.Body>
          
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point icon={HiOutlineCheck} />
          <Timeline.Content>
            <Timeline.Time className="whitespace-nowrap">Dados Plano</Timeline.Time>
            <Timeline.Title className="whitespace-nowrap">{watch('contrato.plano')}</Timeline.Title>
            <Timeline.Body className="whitespace-nowrap">
             {Number(watch('contrato.valor_mensalidade')).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point icon={HiOutlineCheck} />
          <Timeline.Content>
            <Timeline.Time>Dependentes</Timeline.Time>
            <Timeline.Title className="whitespace-nowrap">{watch('arraydep')?.length}</Timeline.Title>
            <Timeline.Body>
             
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>




        

        <Timeline.Item>
          <Timeline.Point theme={{marker:{icon:{wrapper:`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${watch('contrato.id_contrato')?"bg-cyan-200":"bg-red-300"}  ring-8 ring-white`,
          base:`${watch('contrato.id_contrato')?"text-cyan-600":"text-red-600 h-3 w-3"}`
        },
          
          }}} 
           icon={watch('contrato.id_contrato')?HiOutlineCheck:HiX} />
          <Timeline.Content>
            <Timeline.Time>Dados Contrato</Timeline.Time>
            <Timeline.Title>{watch('contrato.id_contrato')}</Timeline.Title>
            <Timeline.Body className="text-yellow-300">
             {!watch('contrato.id_contrato')?"Salve os dados para gerar contrato":
             <div></div>
             }
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
      
      </Timeline>
      </div>
    )
}