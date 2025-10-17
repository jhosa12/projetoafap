import { EmpresaProps } from "@/types/empresa";
import React, { forwardRef, CSSProperties } from "react";

interface Props {
  infoEmpresa: EmpresaProps | null;
  titular: string;
  contrato: number;
}

const styles: Record<string, CSSProperties> = {
  container: {
    width: "210mm",
    minHeight: "297mm",
    padding: "20mm",
    backgroundColor: "#ffffff",
    fontFamily: "'Arial', 'Helvetica', sans-serif",
    color: "#333333",
    lineHeight: 1.6,
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    paddingBottom: "20px",
    borderBottom: "2px solid #e0e0e0",
    marginBottom: "40px",
  },
  logo: {
    width: "120px",
    height: "120px",
    objectFit: "contain",
    marginRight: "25px",
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: "8px",
    lineHeight: 1.3,
  },
  companyDetails: {
    fontSize: "11px",
    color: "#555555",
    lineHeight: 1.5,
  },
  detailLine: {
    marginBottom: "4px",
  },
  body: {
    fontSize: "13px",
    color: "#333333",
    textAlign: "justify",
  },
  greeting: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "30px",
    color: "#1a1a1a",
  },
  paragraph: {
    marginBottom: "20px",
    textIndent: "30px",
  },
  highlight: {
    fontWeight: "600",
    color: "#1a1a1a",
  },
  contractInfo: {
    backgroundColor: "#f5f5f5",
    padding: "15px 20px",
    borderRadius: "6px",
    marginTop: "30px",
    marginBottom: "30px",
    borderLeft: "3px solid #999999",
  },
  contractText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  contractNumber: {
    color: "#333333",
    fontSize: "16px",
    fontWeight: "700",
  },
  alert: {
    backgroundColor: "#f9f9f9",
    padding: "15px 20px",
    borderRadius: "6px",
    borderLeft: "3px solid #cccccc",
    marginTop: "20px",
  },
  alertText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#555555",
    margin: 0,
  },
  footer: {
    marginTop: "50px",
    paddingTop: "20px",
    borderTop: "1px solid #e0e0e0",
    textAlign: "center",
    fontSize: "11px",
    color: "#777777",
  },
};

export const CartaNovoAssociado = forwardRef<HTMLDivElement, Props>(
  ({ contrato, infoEmpresa, titular }, ref) => {
    return (
      <div ref={ref} style={styles.container}>
        {/* Cabeçalho com Logo e Informações da Empresa */}
        <header style={styles.header}>
          {infoEmpresa?.logoUrl && (
            <img
              src={infoEmpresa.logoUrl}
              alt={`Logo ${infoEmpresa.fantasia}`}
              style={styles.logo}
            />
          )}
          <div style={styles.companyInfo}>
            <h1 style={styles.companyName}>{infoEmpresa?.fantasia}</h1>
            <div style={styles.companyDetails}>
              <div style={styles.detailLine}>
                <strong>Endereço:</strong> {infoEmpresa?.endereco}
              </div>
              <div style={styles.detailLine}>
                <strong>CNPJ:</strong> {infoEmpresa?.cnpj}
              </div>
              <div style={styles.detailLine}>
                <strong>Contato:</strong> {infoEmpresa?.fone}
                {infoEmpresa?.celular && ` | ${infoEmpresa.celular}`}
              </div>
            </div>
          </div>
        </header>

        {/* Corpo da Carta */}
        <main style={styles.body}>
          <div style={styles.greeting}>
            Prezado(a) Sr(a). {titular},
          </div>

          <p style={styles.paragraph}>
            Seja bem-vindo(a) à{" "}
            <span style={styles.highlight}>{infoEmpresa?.fantasia}</span>!
            É com imenso prazer que recebemos você como nosso(a) novo(a)
            associado(a).
          </p>

          <p style={styles.paragraph}>
            Temos o compromisso de oferecer um atendimento de excelência e
            garantir que você tenha acesso a todos os benefícios do seu plano
            com qualidade e eficiência.
          </p>

          <p style={styles.paragraph}>
            Estamos enviando sua carteira de associado juntamente com os
            materiais necessários para que você possa usufruir plenamente dos
            benefícios contratados. Nela constam todas as informações
            importantes sobre seu plano, além dos boletos para pagamento das
            mensalidades.
          </p>

          {/* Informação do Contrato em Destaque */}
          <div style={styles.contractInfo}>
            <p style={styles.contractText}>
              Número do seu contrato:{" "}
              <span style={styles.contractNumber}>#{contrato}</span>
            </p>
          </div>

          {/* Alerta Importante */}
          <div style={styles.alert}>
            <p style={styles.alertText}>
              ⚠️ IMPORTANTE: A apresentação da carteira de associado é
              obrigatória para qualquer tipo de atendimento.
            </p>
          </div>

          <p style={{ ...styles.paragraph, marginTop: "30px" }}>
            Estamos à disposição para esclarecer quaisquer dúvidas e auxiliá-lo
            no que for necessário. Conte conosco!
          </p>

          <p style={{ ...styles.paragraph, marginTop: "30px" }}>
            Atenciosamente,
          </p>

          <p style={{ ...styles.paragraph, fontWeight: "600" }}>
            Equipe {infoEmpresa?.fantasia}
          </p>
        </main>

        {/* Rodapé */}
        <footer style={styles.footer}>
          <p>
            Este documento foi gerado automaticamente e não requer assinatura.
          </p>
        </footer>
      </div>
    );
  }
);

CartaNovoAssociado.displayName = "CartaNovoAssociado";