import { BuildingIcon, CreditCardIcon, DollarSignIcon } from "lucide-react"

export const FORMAS_PAGAMENTO = [
  { value: "DINHEIRO", label: "Dinheiro", icon: DollarSignIcon },
  { value: "PIX", label: "PIX", icon: CreditCardIcon },
  { value: "CARTAO", label: "Cartão", icon: CreditCardIcon },
  { value: "DEPOSITO", label: "Depósito", icon: BuildingIcon },
  { value: "TRANSFERENCIA", label: "Transferência", icon: BuildingIcon },
  { value: "BOLETO", label: "Boleto", icon: BuildingIcon },
]

export const BANCOS = ["BANCO DO BRASIL", "CORA", "PAGBANK", "CAIXA", "TON"]