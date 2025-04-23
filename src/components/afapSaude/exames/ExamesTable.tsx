import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { ExameRealizadoProps } from "@/types/afapSaude";
  
  interface ExamesTableProps {
    exames: ExameRealizadoProps[];
    selectedExame: ExameRealizadoProps | null;
    onSelectExame: (exame: ExameRealizadoProps) => void;
  }
  
  export function ExamesTable({
    exames,
    selectedExame,
    onSelectExame,
  }: ExamesTableProps) {
    return (
      <div className="border-b-[1px]">
        <Table>
          <TableHeader className="text-black">
            <TableRow className="uppercase text-xs text-black">
              <TableHead>Nome</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead>Data Orçamento</TableHead>
              <TableHead>Data Pag.</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exames.map((item) => (
              <TableRow
                key={item.id_exame}
                className={`cursor-pointer text-black text-xs hover:bg-muted/50 ${
                  selectedExame?.id_exame === item.id_exame ? "bg-gray-300" : ""
                }`}
                onClick={() => onSelectExame(item)}
              >
                <TableCell className="font-medium text-black">{item.nome}</TableCell>
                <TableCell>{item.celular}</TableCell>
                <TableCell>
                  {item.data_orcamento &&
                    new Date(item.data_orcamento).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                </TableCell>
                <TableCell>
                  {item.data_realizado &&
                    new Date(item.data_realizado).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                </TableCell>
                <TableCell>{item.tipoDesc}</TableCell>
                <TableCell>
                  {Number(
                    item.exames.reduce((total, exame) => total + exame.valorFinal, 0)
                  ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "ORÇAMENTO" ? "warning" : "success"}
                    className="whitespace-nowrap"
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  