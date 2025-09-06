"use client";

// 1. Importações necessárias do zod, react-hook-form e shadcn/ui
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog"; // Importação direta do Radix UI para o Root do Dialog

import { ConsultoresProps } from "@/types/consultores";

// Hooks reais do seu projeto
import { useAuth } from "@/store/AuthContext";
import useActionsPerfil from "@/app/dashboard/usuarios/hooks/useActionsPerfil";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface ModalNovoPerfilProps {
  isOpen: boolean;
  onClose: () => void;
  perfil: ConsultoresProps | null;
  onDataReload: () => Promise<void>;
}

// 2. Definição do schema de validação com Zod
const perfilFormSchema = z.object({
  nome: z.string().min(2, { message: "O nome deve ter no mínimo 2 caracteres." }),
  funcao: z.string().min(3, { message: "O cargo deve ter no mínimo 3 caracteres." }),
});

export function ModalNovoPerfil({ isOpen, onClose, onDataReload }: ModalNovoPerfilProps) {

  const { consultores, getDadosFixos, loading: loadingContext } = useAuth();
  const funcoesUnicas = [...new Set(consultores?.map(c => c.funcao) ?? [])];

  // 3. Inicialização do formulário com react-hook-form e o resolver do Zod
  const form = useForm<z.infer<typeof perfilFormSchema>>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: {
      nome: "",
      funcao: "",
    },
  });

  // Hook para as ações de perfil (lógica de negócio) - AGORA USANDO O MOCK
  const { novoPerfil: criarNovoPerfil } = useActionsPerfil({
    close: onClose,
    carregarDados: onDataReload,
  });

  // 4. Função de envio que será chamada após a validação bem-sucedida
  const onSubmit = async (values: z.infer<typeof perfilFormSchema>) => {
    try {
      await criarNovoPerfil(values);
      form.reset();
    } catch (error) {
      console.error("Erro ao criar novo perfil:", error);
    }
  };

  // Efeito para resetar o formulário sempre que o modal for fechado
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const { isSubmitting } = form.formState;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Perfil</DialogTitle>
        </DialogHeader>

        {/* 5. Componente Form envolve todo o formulário */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">

            {/* Campo Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João da Silva" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Função (Cargo) */}
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
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog.Root>
  );
}

