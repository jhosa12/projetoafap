import { ajustarData } from "@/utils/ajusteData";
import { CobrancaStats, RotaFilterProps, RouteProps } from "../types/types";
import { api } from "@/lib/axios/apiClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert } from "flowbite-react";



interface RouterActionsProps{

}

const initialFilters: RotaFilterProps = {
  consultor: "",
  bairro: "",
  dateRange: {
    from: new Date(),
    to: new Date(),
  },
  status: "",
};

export const useRouterActions = ({

}:RouterActionsProps)=>{
const [routes, setRoutes] = useState<RouteProps[]>([]);


    useEffect(()=>{

        getRotas(initialFilters)




    },[])


     const getRotas = async (data: RotaFilterProps) => {
  
        const {dataIni,dataFim} = ajustarData(data.dateRange?.from,data.dateRange?.to)
        try {
          const response = await api.post("/cobranca/rotas",
            {
              startDate:dataIni,
              endDate:dataFim
            }
          );
          setRoutes(response.data);
        } catch (error) {
          console.log(error)
        }
      };


      
      const statsCobranca:CobrancaStats = {
          totalClientes:routes.reduce((total, route) => total + (route.cobranca?.length || 0), 0),
          totalMensalidades:0,
          valorTotal:0,
          clientesVisitados:routes.reduce((total, route) => {
            return total+route.cobranca?.filter(c => c.check_in && c.check_out).length || 0
          }, 0),
          mensalidadesPagas:routes.reduce((total,route)=>total+(route.pagamentos?.length||0),0),
          valorRecebido:routes.reduce((total,route)=>total+(route.pagamentos?.reduce((sum,pag)=>sum+pag.valor_forma||0,0))||0,0)
      }



      
  const sincPagamentos = async (id_rota:number) => {

    try {
      const response = await api.post("/cobranca/sincPag", {
       id_rota
      })
    } catch (error) {

      toast.error('Erro em pagamentos, verifique os dados')
      
    }
  }


  const sincAgendamentos = async(id_rota:number)=>{


    try {
        
     await api.post('/cobranca/sincAgend',{
        id_rota
      })
    } catch (error) {
      toast.error('Erro em Agendamentos, Verifique os dados')
    }

       
      
  }


  const handleSincData = (id_rota:number ) =>{
      toast.promise(
        Promise.all([
          sincPagamentos(id_rota),
          sincAgendamentos(id_rota)
        ]),
        {
          loading: 'Sincronizando dados...',
          success: 'Dados sincronizados com sucesso!',
          error: 'Erro ao sincronizar dados.'
        }
      )

  }
    




    return {
      getRotas,
      handleSincData,
      initialFilters
    }

}