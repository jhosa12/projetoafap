import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DocumentTemplate from "@/Documents/associado/carteiraAssociado/CarteiraAssociado";
import { DependentesProps } from "@/types/associado";
import { EmpresaProps } from "@/types/empresa";
import { pageStyle } from "@/utils/pageStyle";
import { Table } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { IoPrint } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";

interface DadosProps {
  dependentes: Array<DependentesProps>;
  contrato: number;
  plano: string;
  titular: string;
  adesao: Date;
  cpf: string;
  rg: string;
  endereco: string;
  numero: number | null;
  bairro: string;
  cidade: string;
  celular: string;
  uf: string;
  infoEmpresa: EmpresaProps | null;
}

const CarteirasDep = ({
  dependentes,
  contrato,
  plano,
  titular,
  endereco,
  numero,
  bairro,
  cidade,
  celular,
  uf,
  infoEmpresa,
  adesao,
  cpf,
  rg,
}: DadosProps) => {
  // Variáveis de estado
  const [arrayPrint, setArrayPrint] = useState<Array<Partial<DependentesProps>>>([]);
  const [todosDep, setTodosDep] = useState(false);
  const [cartTitular, setTitular] = useState(false);
  const [linhasSelecionadas, setLinhasSelecionadas] = useState<Array<Partial<DependentesProps>>>([]);

  // Funções
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pageStyle,
  });

  const handleToggleSelecionada = (item: DependentesProps) => {
    const isSelected = linhasSelecionadas.includes(item);
    if (isSelected) {
      setLinhasSelecionadas(linhasSelecionadas.filter((linha) => linha.id_dependente !== item.id_dependente));
    } else {
      setLinhasSelecionadas([...linhasSelecionadas, item]);
    }
  };

  const handleButtonPrintGeral = () => {
    if (todosDep) {
      setArrayPrint(dependentes);
    } else if (linhasSelecionadas.length > 0) {
      setArrayPrint(linhasSelecionadas);
    }
    handlePrint();
  };

  const handleArrayPrint = (id: number) => {
    const novoArray = dependentes.filter((item) => item.id_dependente === id);
    setArrayPrint(novoArray);
  };

  // Efeitos
  useEffect(() => {
    if (arrayPrint.length > 0) {
      handlePrint();
    }
  }, [arrayPrint]);

  // Referências
  const componentRef = useRef<DocumentTemplate>(null);

  return (
    <div className="flex flex-col max-h-[calc(100vh-200px)] w-full p-2">
      <div className="flex px-2 mb-2 w-full text-black font-semibold gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox checked={cartTitular} id="cart_titular" onClick={() => setTitular(!cartTitular)} />
          <label
            htmlFor="cart_titular"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Carteira titular
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox checked={todosDep} id="todos_dep" onClick={() => setTodosDep(!todosDep)} />
          <label
            htmlFor="todos_dep"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Todos dependentes
          </label>
        </div>
        <Button size={"sm"} onClick={handleButtonPrintGeral} variant={"outline"}>
          <IoPrint size={18} /> PRINT
        </Button>
      </div>

      <Table theme={{ root: { shadow: 'none' }, body: { cell: { base: "px-2 py-1 text-xs" } }, head: { cell: { base: "px-2 py-1" } } }}>
        <Table.Head>
          <Table.HeadCell>NOME</Table.HeadCell>
          <Table.HeadCell>ADESÃO</Table.HeadCell>
          <Table.HeadCell>CARÊNCIA</Table.HeadCell>
          <Table.HeadCell>NASC.</Table.HeadCell>
          <Table.HeadCell>PARENTESCO</Table.HeadCell>
          <Table.HeadCell>
            <span className="">Ações</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {dependentes
            ?.filter((item) => !item.excluido)
            .map((item, index) => (
              <Table.Row
                key={item.id_dependente}
                onClick={() => handleToggleSelecionada(item)}
                className={`text-black font-semibold cursor-pointer hover:bg-gray-200 border-b ${linhasSelecionadas.includes(item) ? "bg-gray-300" : ""} border-gray-300`}
              >
                <Table.Cell>{item.nome}</Table.Cell>
                <Table.Cell>{new Date(item.data_adesao).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{new Date(item.carencia).toLocaleDateString() ?? ''}</Table.Cell>
                <Table.Cell>{item?.data_nasc ? new Date(item.data_nasc).toLocaleDateString() : ''}</Table.Cell>
                <Table.Cell>{item.grau_parentesco}</Table.Cell>
                <Table.Cell>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleArrayPrint(item.id_dependente);
                    }}
                    className="object-contain z-40 text-blue-500"
                  >
                    <IoPrint size={18} />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <div className="hidden">
        <DocumentTemplate
          infoEmpresa={infoEmpresa}
          ref={componentRef}
          dependentes={arrayPrint}
          plano={plano}
          contrato={contrato}
          titular={titular}
          cpf={cpf}
          rg={rg}
          endereco={endereco}
          adesao={adesao}
          celular={celular}
          bairro={bairro}
          cidade={cidade}
          numero={numero}
          uf={uf}
          cartTitular={cartTitular}
          dependentesTitular={dependentes}
        />
      </div>
    </div>
  );
};

export default CarteirasDep;