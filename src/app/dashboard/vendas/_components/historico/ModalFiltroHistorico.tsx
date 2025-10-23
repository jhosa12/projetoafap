import { Control, Controller, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { ReqLeadsProps } from "./ScreenHistorico";
import { MultiSelects } from "@/components/ui/multiSelect";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";


interface DataProps {
    show: boolean;
    onClose: () => void;
    loading: boolean;
    handleOnSubmit: SubmitHandler<ReqLeadsProps>;
    register: UseFormRegister<ReqLeadsProps>;
    control: Control<ReqLeadsProps, any>;
    handleSubmit: UseFormHandleSubmit<ReqLeadsProps>;
    consultores: Array<{ label: string; value: string }> | [];
  }


  const status = [
    { label: "LEAD", value: "LEAD" },
    { label: "PROSPECCAO", value: "PROSPECCAO" },
    { label: "PRE VENDA", value: "PRE VENDA" },
    { label: "VENDA", value: "VENDA" },
    { label: "INDEFERIDO", value: "INDEFERIDO" },
  ];
  
  export const ModalFiltroHistorico = ({
    onClose,
    show,
    handleOnSubmit,
    register,
    control,
    handleSubmit,
    loading,
    consultores,
  }: DataProps) => {
    return (
      <Dialog open={show} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
  
          <form
            onSubmit={handleSubmit(handleOnSubmit)}
            className="flex flex-col gap-2 mt-1"
          >
            <Controller
              control={control}
              name="consultores"
              render={({ field }) => (
                <MultiSelects
                  options={consultores}
                  onChange={field.onChange}
                  selected={field.value??[]}
                  placeholder="CONSULTORES"
                />
              )}
            />
  
            <div>
              <Label className="text-xs" >Nome</Label>
              <Input
                {...register("nome")}
                className="uppercase"
                placeholder="NOME"
              />
            </div>
  
            <div>
              <Label className="text-xs" >Categoria</Label>
  
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                <MultiSelects
                  options={status}
                  onChange={field.onChange}
                  selected={field.value??[]}
                  placeholder="STATUS"
                />
                )}
              />
            </div>
            <div className="inline-flex w-full justify-between gap-2">
              <div>
                <Label className="text-xs" >Data inicio</Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePickerInput
                      value={value ? new Date(value) : undefined}
                      onChange={onChange}
                      className="h-9"
                    />
                  )}
                />
              </div>
  
              <div>
                <Label className="text-xs" >Data fim</Label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePickerInput
                      value={value ? new Date(value) : undefined}
                      onChange={onChange}
                      className="h-9"
                    />
                  )}
                />
              </div>
            </div>
            <Button className="mt-2" type="submit">
              {loading ? <Spinner  /> : "Aplicar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };