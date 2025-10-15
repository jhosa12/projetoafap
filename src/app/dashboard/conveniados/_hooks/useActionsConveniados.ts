import { useState } from "react"
import { ConveniadosProps } from "../page"
import { toast } from "sonner"
import { api } from "@/lib/axios/apiClient"

export const useActionsConveniados = () => {

  const [conveniados, setConveniados] = useState<ConveniadosProps[]>([])

  async function listarConveniados() {
    try {

      const response = await api.get("/conveniados/listar")

      setConveniados(response.data)

    } catch (error) {

      throw error

    }
  }
  return {

    listarConveniados,

    conveniados,
    setConveniados

  }
}