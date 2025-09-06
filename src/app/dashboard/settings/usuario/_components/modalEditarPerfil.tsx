"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect} from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { ConsultoresProps } from "@/types/consultores";

import { useAuth } from "@/store/AuthContext";
import useActionsPerfil from "@/app/dashboard/settings/hooks/useActionsPerfil";

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface ModalEditarPerfilProps {
  isOpen: boolean;
  onClose: () => void;
  perfil: ConsultoresProps | null;
  onDataReload: () => Promise<void>;
}

const perfilFormSchema = z.object({
  nome: z.string().min(2, { message: "O nome deve ter no mínimo 2 caracteres." }),
  funcao: z.string().min(1, { message: "Por favor, selecione um cargo." }),
});


export function ModalEditarPerfil({ isOpen, onClose, perfil, onDataReload }: ModalEditarPerfilProps) {


  const { consultores, getDadosFixos, loading: loadingContext } = useAuth();
  const funcoesUnicas = [...new Set(consultores?.map(c => c.funcao) ?? [])];

  const form = useForm<z.infer<typeof perfilFormSchema>>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: { nome: "", funcao: "" },
  });

  const { editarPerfil } = useActionsPerfil({
    close: onClose,
    carregarDados: onDataReload,
  });

  useEffect(() => {
    if (isOpen) {
      getDadosFixos();
    }
  }, [isOpen, getDadosFixos]);

  useEffect(() => {
    if (perfil) {
      form.reset({
        nome: perfil.nome || "",
        funcao: perfil.funcao || "",
      });
    }
  }, [perfil, form]);

  const onSubmit = async (values: z.infer<typeof perfilFormSchema>) => {
    if (!perfil) return;
    const updatedPerfil: ConsultoresProps = { ...perfil, ...values };
    await editarPerfil(updatedPerfil);
  };

  const { isSubmitting } = form.formState;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>Editar Perfil</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="funcao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo (Função)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingContext ? "A carregar cargos..." : "Selecione um cargo"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {funcoesUnicas.map((funcao) => (
                        <SelectItem key={funcao} value={funcao}>
                          {funcao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog.Root>
  );
}


