import { SubmitHandler } from 'react-hook-form';
import { api } from "@/lib/axios/apiClient"
import { AuthContext } from "@/store/AuthContext"
import { VeiculoProps } from "@/types/veiculo"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"

export const useActionsVeiculos = () => {
  const [arrayVeiculos, setArrayVeiculos] = useState<VeiculoProps[]>([])
  const { usuario, signOut } = useContext(AuthContext)

  async function listarVeiculos() {

    try {

      const { data } = await api.post<VeiculoProps[]>("/veiculos")

      setArrayVeiculos(data)

    } catch (error) {

      toast.error("Erro ao carregar veículos.")

    }

  }

  useEffect(() => {
    if (!usuario) return signOut()
    listarVeiculos()
  }, [usuario])

  async function adicionarVeiculo(data: VeiculoProps) {

    const payload = {
      id_veiculo: data.id_veiculo,
      placa: data.placa,
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano,
      cor: data.cor,
      chassi: data.chassi,
      status: data.status
    }

    try {
      const response = await api.post('/veiculo/novo', payload)
      return response.data
    } catch (error) {
      throw error
    }

  }

  async function editarVeiculo(data: VeiculoProps) {

    const payload = {
      id_veiculo: data.id_veiculo,
      placa: data.placa,
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano,
      cor: data.cor,
      chassi: data.chassi,
      status: data.status
    }

    console.log("")
    try {

      const response = await api.put('/veiculo/editar', payload)
      return response.data

    } catch (error: any) {
      if (error.response?.status === 400) {
        throw error.response.data;
      }
      throw error;

    }
  }

  async function excluirVeiculo(veiculo: VeiculoProps) {

    toast.promise(
      api.delete('/veiculo/deletar',
        {
          data: { id_veiculo: veiculo.id_veiculo }
        }
      ),
      {
        loading: "Excluindo registro...",
        success: () => {

          listarVeiculos();

          return "Registro excluído com sucesso!";
        },
        error: "Erro ao excluir registro.",
      }
    )
  }

  const onSave: SubmitHandler<VeiculoProps> = async (data: VeiculoProps) => {

    try {

      if (data.id_veiculo) {

        await editarVeiculo(data)
        toast.success("Veículo editado com sucesso!")
        await listarVeiculos()

      } else {

        await adicionarVeiculo(data)
        toast.success("Veículo adicionado com sucesso!")
        await listarVeiculos()

      }
      return true

    } catch (error) {

      throw error
    }
  }


  return {

    listarVeiculos,
    adicionarVeiculo,
    editarVeiculo,
    excluirVeiculo,
    onSave,
    arrayVeiculos

  }
}