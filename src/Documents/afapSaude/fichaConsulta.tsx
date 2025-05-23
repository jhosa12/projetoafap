'use client'

import logo from "../../../public/afapsaudelogo.jpg"
import React, { forwardRef } from "react";
import { roboto_Mono } from "@/fonts/fonts";
import { ExamesData } from "@/types/afapSaude";
import { calcularIdade } from "@/utils/calcIdade";
import Image from "next/image";
interface DadosProps {
  nome: string;
  cpf: string;
  endereco: string;
  data: Date;
  bairro: string;
  cidade: string;
  especialidade: string;
  identidade: string;
  celular: string;
  nascimento: Date | undefined;
  responsavel: string;
  parentesco: string | undefined;
  especialista: string | undefined;
  id_consulta: number | null;
  procedimentos: Array<ExamesData> | undefined;
}

const FichaConsulta = forwardRef<HTMLDivElement, DadosProps>((
{nome, 
    cpf,
    data,
    endereco,
    bairro,
    identidade,
    cidade,
   celular,
   nascimento,
   parentesco,
    responsavel,
    especialista,
    especialidade,
    id_consulta,
    procedimentos}:DadosProps,ref
)=>{


  if(!logo){
    return null
  }


    return (
      <div ref={ref} className={` ${roboto_Mono.className} flex flex-col w-full gap-3 `}>
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Image
            width={70}
            height={70}
            src={logo}
            alt="lg"
            fetchPriority="high"
          />
          <h1 style={{ fontWeight: "bold", fontSize: "20px" }}>
            PRONTUÁRIO MÉDICO N° {id_consulta}
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            fontSize: "12px",
            gap: "5px",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "gray",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            DADOS DO PACIENTE
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              fontSize: "12px",
              gap: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Paciente: {nome} </span>
              <span>
                Nasc.:{" "}
                {nascimento && new Date(nascimento).toLocaleDateString("pt-BR")}
              </span>
              <span>Idade: {nascimento && calcularIdade(nascimento)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>CPF: {cpf} </span>
              <span>Identidade: {identidade}</span>
              <span>Celular: {celular}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Endereço: {endereco} </span>
              <span>Bairro: {bairro}</span>
              <span>Cidade: {cidade}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Responsável: {responsavel} </span>
              <span>Parentesco: {parentesco}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            fontSize: "12px",
            gap: "5px",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "gray",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            DADOS DA CONSULTA
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              fontSize: "12px",
              gap: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>
                Data da Consulta:{" "}
                {data.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
              </span>
              <span>Horário da Consulta:</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Profissional: {especialista} </span>
              <span>Especialidade:{especialidade}</span>
            </div>
            <div>
              <span>Procedimentos:</span>
              <ul className="inline-flex">
                {procedimentos?.map((item, index) => (
                  <li key={index}>
                    {item.nome}
                    {procedimentos.length - 1 !== index ? "," : "."}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            fontSize: "12px",
            gap: "5px",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "gray",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            QUEIXA PRINCIPAL
          </h2>
          <span
            style={{
              fontSize: "12px",
              whiteSpace: "nowrap",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Descrição da Queixa Principal:
          </span>
          <span
            style={{
              fontSize: "12px",
              whiteSpace: "nowrap",
              borderBottom: "1px solid gray",
              width: "100%",
              marginTop: "20px",
            }}
          ></span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            fontSize: "12px",
            gap: "5px",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "gray",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            HISTÓRIA DA DOENÇA ATUAL
          </h2>
          <span
            style={{
              fontSize: "12px",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Início dos Sintomas:
          </span>
          <span
            style={{
              fontSize: "12px",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Sintomas Relacionados:
          </span>
          <span
            style={{
              fontSize: "12px",
              whiteSpace: "nowrap",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Duração e Intensidade dos Sintomas:
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            fontSize: "12px",
            gap: "5px",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "gray",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            HISTÓRIA MÉDICA PREGRESSA
          </h2>
          <span
            style={{
              fontSize: "12px",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Doenças Crônicas:{" "}
          </span>
          <span
            style={{
              fontSize: "12px",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Cirurgias Anteriores:
          </span>
          <span
            style={{
              fontSize: "12px",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Alergias Conhecidas:
          </span>
          <span
            style={{
              fontSize: "12px",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Uso de Medicamentos Contínuos:
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            fontSize: "12px",
            gap: "5px",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "gray",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            EXAME FÍSICO
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              fontSize: "12px",
              gap: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Peso:__________ </span>
              <span>Altura:__________</span>
              <span>IMC:__________</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Pressão Arterial:__________</span>
              <span>Frequência Cardíaca:__________</span>
              <span>Temperatura Corporal:__________</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            fontSize: "12px",
            gap: "5px",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "gray",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            EXAMES COMPLEMENTARES SOLICITADOS
          </h2>
          <span
            style={{
              fontSize: "12px",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            1.
          </span>
          <span
            style={{
              fontSize: "12px",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            2.
          </span>
          <span
            style={{
              fontSize: "12px",
              whiteSpace: "nowrap",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            3.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            fontSize: "12px",
            gap: "5px",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "gray",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            PLANO TERAPÊUTICO
          </h2>
          <span
            style={{
              fontSize: "12px",
              whiteSpace: "nowrap",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Medicamentos Prescritos:
          </span>
          <span
            style={{
              fontSize: "12px",
              whiteSpace: "nowrap",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Orientações ao Paciente:
          </span>
          <span
            style={{
              fontSize: "12px",
              whiteSpace: "nowrap",
              borderBottom: "1px solid gray",
              width: "100%",
            }}
          >
            Encaminhamentos Necessários:
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "50px",
            fontSize: "12px",
          }}
        >
          <div className="flex flex-col w-1/2 p-2 justify-center items-center ">
            <span className="flex w-full border-b-[1px]  border-black"></span>

            <span className="pt-2  text-center italic">
              Assinatura do Paciente
            </span>
          </div>

          <div className="flex flex-col w-1/2 p-2 justify-center items-center ">
            <span className="flex w-full border-b-[1px]  border-black"></span>

            <span className="pt-2  text-center italic">
              Assinatura e Carimbo do Profissional de Saúde
            </span>
          </div>
        </div>
      </div>
    );
  }
)

export default FichaConsulta;
