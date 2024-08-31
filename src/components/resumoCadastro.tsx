import { useContext, useEffect } from "react";
import { FormWrapper } from "./organizador";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { Button, Timeline } from "flowbite-react";
import { HiCalendar, HiCheck, HiCheckCircle, HiOutlineCheck } from "react-icons/hi2";
import { HiArrowNarrowRight, HiX } from "react-icons/hi";



export function ResumoCadastro(){
    const {data}= useContext(AuthContext)
 
    return(
       <div className="flex w-full">
        <Timeline className="gap-8" horizontal>
        <Timeline.Item>
          <Timeline.Point icon={HiOutlineCheck} />
          <Timeline.Content>
            <Timeline.Time>Dados Titular</Timeline.Time>
            <Timeline.Title className="whitespace-nowrap">{data.name}</Timeline.Title>
            <Timeline.Body>
             Endereço:{data.endereco}
            </Timeline.Body>
          
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point icon={HiOutlineCheck} />
          <Timeline.Content>
            <Timeline.Time>Dados Plano</Timeline.Time>
            <Timeline.Title className="whitespace-nowrap">Gold Prime 6{data.contrato?.plano}</Timeline.Title>
            <Timeline.Body className="whitespace-nowrap">
              Valor: R$ 78,00
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point icon={HiOutlineCheck} />
          <Timeline.Content>
            <Timeline.Time>Dependentes</Timeline.Time>
            <Timeline.Title className="whitespace-nowrap">{data.arraydep?.length}</Timeline.Title>
            <Timeline.Body>
             
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>

        <Timeline.Item>
          <Timeline.Point theme={{marker:{icon:{wrapper:`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${data.contrato?.id_contrato?"bg-cyan-200":"bg-red-300"}  ring-8 ring-white`,
          base:`${data.contrato?.id_contrato?"text-cyan-600":"text-red-600 h-3 w-3"}`
        },
          
          }}} 
           icon={data.contrato?.id_contrato?HiOutlineCheck:HiX} />
          <Timeline.Content>
            <Timeline.Time>Dados Contrato</Timeline.Time>
            <Timeline.Title>{data.contrato?.id_contrato}</Timeline.Title>
            <Timeline.Body className="text-yellow-300">
             {!data.contrato?.id_contrato?"Salve os dados para gerar contrato":
             <div></div>
             }
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
      
      </Timeline>
      </div>
    )
}