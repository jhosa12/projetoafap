'use client';

import { Suspense, useContext, useEffect, useState } from "react";
import Head from "next/head";
import { AuthContext } from "@/store/AuthContext";
import { Tabs } from "flowbite-react";
import { FaCalendarCheck } from "react-icons/fa";
import { Cobranca } from "@/components/tabs/cobranca/cobranca/cobranca";
import { Inadimplencia } from "@/components/tabs/cobranca/indimplencia/indimplencia";
import { FaCalendarDays } from "react-icons/fa6";
import { api } from "@/lib/axios/apiClient";

export default function CobrancaScreen() {
  const [arrayBairros, setArrayBairros] = useState<
    Partial<{
      bairro: string;
      check: boolean;
      id_empresa: string;
      cidade: string;
    }>[]
  >([]);

  const { selectEmp } = useContext(AuthContext);
  const [tab, setTab] = useState<number>(0);
  useEffect(() => {
    const getBairros = async () => {
      const res = await api.post("/bairros", { id_empresa: selectEmp });
      setArrayBairros(res.data);
    };
    getBairros();
  }, [selectEmp]);

  const cidades = [...new Set(arrayBairros?.map((item) => item.cidade))];

  return (
    <>
      <Head>
        <title>Cobrança</title>
      </Head>

      <div className="flex flex-col w-full text-white">
        <Tabs
          theme={{
            base: "bg-white rounded-b-lg",
            tabpanel: "bg-white rounded-b-lg h-[calc(100vh-104px)] px-2",
            tablist: {
              tabitem: {
                base: "flex items-center text-xs justify-center rounded-t-lg px-4 py-3  font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 ",
                variant: {
                  underline: {
                    active: {
                      on: "active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
                      off: "border-b-2 border-transparent text-black hover:border-gray-700 hover:text-gray-600 ",
                    },
                  },
                },
              },
            },
          }}
          variant="underline"
          onActiveTabChange={(e) => setTab(e)}
        >
          <Tabs.Item
            active={tab === 0}
            title="COBRANÇA"
            icon={() => <FaCalendarCheck className="mr-2 h-4 w-4" />}
          >
            {tab === 0 && (
              <Cobranca arrayBairros={arrayBairros} cidades={cidades ?? []} />
            )}
          </Tabs.Item>
          <Tabs.Item
            active={tab === 1}
            title="INADIMPLENCIA"
            icon={() => <FaCalendarDays className="mr-2 h-4 w-4" />}
          >
            {tab === 1 && (
              <Suspense fallback={<div>Carregando...</div>}>
                <Inadimplencia
                  cidades={cidades ?? []}
                  arrayBairros={arrayBairros}
                />
              </Suspense>
            )}
          </Tabs.Item>
        </Tabs>
      </div>
    </>
  );
}
