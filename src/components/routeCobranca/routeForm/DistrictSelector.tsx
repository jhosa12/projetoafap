import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { MultiSelects } from "@/components/ui/multiSelect";
import { Control, Controller } from "react-hook-form";
import { RouteProps } from "@/types/cobranca";
import { EmpresaProps } from "@/types/empresa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DistrictSelectorProps {
  control:Control<RouteProps>
  bairros:Partial<{ bairro: string; check: boolean; id_empresa: string,cidade: string }>[]
  cidades:Array<string|undefined>
}



const DistrictSelector = ({ control,bairros,cidades }: DistrictSelectorProps) => {
  const [inputValue, setInputValue] = useState("");

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
      name="parametros.bairros"
      control={control}
      render={({ field }) => (
      <MultiSelects
        maxDisplayItems={10}
        options={bairros.map((district) => ({
          value: district.bairro??"",
          label: district.bairro??"",
        }))??[]}
       
        selected={field.value}
        onChange={field.onChange}
        placeholder="Seleciona os bairros/distritos"
        className="min-h-8"
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
