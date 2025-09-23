import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: string }) {
  const variants = {
    ATIVA: "warning",
    CONCLUIDA: "success",
    pendente: "destructive",
    em_andamento: "default",
    concluida_visita: "outline",
    cancelada: "destructive",
  } as const

  return <Badge  variant={variants[status as keyof typeof variants] || "secondary"}>{status.replace("_", " ")}</Badge>
}
