import { useState } from "react";
import { MultiSelects } from "@/components/ui/multiSelect";
import {
  Controller,
  useFormContext,
} from "react-hook-form";
import { InadimplenciaBairroProps } from "../../types/types";

interface DistrictSelectorProps {
  bairros: Array<InadimplenciaBairroProps>;
  cidades: Array<string>;
}

const DistrictSelector = ({ bairros, cidades }: DistrictSelectorProps) => {
  const { control, watch, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const bairrosFilter = bairros.filter((item) =>
    watch("parametros.cidade")?.includes(item.cidade)
  );

  // const addDistrict = (district: string) => {
  //   if (district && !selected.includes(district)) {
  //     onChange([...selected, district]);
  //   }
  // };

  // const removeDistrict = (district: string) => {
  //   onChange(selected.filter((d) => d !== district));
  // };

  // const handleInputSubmit = () => {
  //   if (inputValue.trim()) {
  //     addDistrict(inputValue.trim());
  //     setInputValue("");
  //   }
  // };

  const handleCidadeChange = (value: Array<string>) => {
    setValue("parametros.cidade", value);
    setValue("parametros.bairros", []);
  };

  return (
    <div className="space-y-3">
      {/* <Controller
      name="id_empresa"
      control={control}
      render={({ field }) => (
       <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {empresas?.map((empresa) => (
            <SelectItem key={empresa.id} value={empresa.id}>
              {empresa.nome}
            </SelectItem>
          ))}
        </SelectContent>
       </Select>
      )}
      /> */}

      <Controller
        control={control}
        name="parametros.cidade"
        render={({ field }) => (
          <MultiSelects
            maxDisplayItems={10}
            options={
              cidades.map((district) => ({
                value: district ?? "",
                label: `${district}`,
              })) ?? []
            }
            selected={field.value}
            onChange={handleCidadeChange}
            placeholder="Selecione a(s) cidade(s)"
            className="min-h-9"
          />
        )}
      />

      <Controller
        name="parametros.bairros"
        control={control}
        render={({ field }) => (
          <MultiSelects
            maxDisplayItems={10}
            options={
              bairrosFilter.map((district) => ({
                value: district.bairro ?? "",
                label: `${district.bairro} - ${district.totalContratos} contratos - R$ ${district.valorTotal}`,
              })) ?? []
            }
            selected={field.value}
            onChange={field.onChange}
            placeholder="Seleciona os bairros/distritos"
            className="min-h-9"
          />
        )}
      />

      {/* <div className="grid grid-cols-2 gap-1">
        {commonDistricts.map(district => (
          <Button
            key={district}
            onClick={() => addDistrict(district)}
            variant={selected.includes(district) ? "default" : "outline"}
            size="sm"
            className="text-xs h-8 justify-start"
            disabled={selected.includes(district)}
          >
            {district}
          </Button>
        ))}
      </div> */}

      {/* {selected.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700">Selecionados:</p>
          <div className="flex flex-wrap gap-1">
            {selected.map(district => (
              <Badge key={district} variant="secondary" className="text-xs">
                {district}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => removeDistrict(district)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DistrictSelector;
