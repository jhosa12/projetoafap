import Image from "next/image";
import logo from "../../../public/logoafap.png"
import assinatura from "../../../public/assinatura.jpg"


// DocumentTemplate.js

import React, { useContext, Component } from 'react';
interface DadosProps {
  nome: string,
  cpf: string,
  rg: string,
  endereco: string,
  numero: string,
  bairro: string,
  complemento: string,
  cidade: string,
  estado: string,
  adesao: Date,
  telefone: string,
  contrato: number,
  dependentes: Array<{
    nome: string,
    data_nasc: Date,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string

  }>
}



class DocumentTemplate extends Component<DadosProps> {

  render() {
    const {
      nome,
      cpf,
      rg,
      endereco,
      numero,
      bairro,
      complemento,
      cidade,
      estado,
      adesao,
      telefone,
      contrato,
      dependentes
    } = this.props;



    return (
      <div className='flex flex-col w-full p-2 px-6  text-black'>

        <div className="flex justify-center items-center
         mt-4">
          <Image className="flex w-44 h-20 mr-7 " src={logo} alt="" />
        </div>
        <div className="flex flex-col w-full">
          <h2 style={{ fontSize: '36px' }} className=' mt-4  uppercase text-center font-bold'>Assistência Familiar Paraíso</h2>
          <p className='text-center'>CNPJ: 16.784.573/0001-93 INSC. EST.:</p>
          <p className='text-center'>RUA ADALTO CASTELO, 393, CENTRO</p>
          <p className='text-center'>TELEFONES: (88) 997113362 (88)992791293</p>
        </div><br />
        <span style={{ fontSize: '18px' }} className="font-semibold ">Contrato: {contrato}</span>
        <div className="inline-flex justify-between gap-5">
          <span>Contratante: {nome}</span>
          <span>Data Adesão: {new Date(adesao).toLocaleDateString()}</span>
        </div>


        <div className="inline-flex justify-between gap-5">
          <span>Endereço: {endereco}</span>
          <span>Bairro: {bairro}</span>
        </div>

        <div className="inline-flex justify-between gap-5">
          <span>Cidade: {cidade}</span>
          <span>Est.: {estado}</span>
          <span>Compl.: {complemento}</span>
        </div>
        <div className="inline-flex justify-between gap-5">
          <span>RG: {rg}</span>
          <span>CPF: {cpf}</span>
          <span>Telefone: {telefone}</span>
        </div>

        <h1 className='text-xl text-center font-semibold mt-2'>RELAÇÃO DE DEPENDENTES</h1>





        <div className="flex  justify-center items-center w-full">
          <table className="block  text-left rtl:text-center border-[1px] border-black border-solid">
            <thead className="top-0 uppercase border-b-[1px] border-black border-solid">
              <tr>
                <th scope="col" className="px-10 py-1 ">
                  NOME
                </th>
                <th scope="col" className="px-10 py-1">
                  PARENTESCO
                </th>
                <th scope="col" className="px-10 py-1">
                  NASC.
                </th>
              </tr>
            </thead>
            <tbody>
              {dependentes?.map((item, index) => (
                <tr key={index} className={` border-t border-black`}>
                  <td className="px-10 py-1 border-r border-black">
                    {item.nome}
                  </td>
                  <td className="px-10 py-1 border-r border-black">
                    {item.grau_parentesco}
                  </td>
                  <td className="px-10 py-1">
                    {item.data_nasc && new Date(item.data_nasc).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>



        </div>















        <div className='uppercase mx-5 p-2 text-justify'>
          ATENDIMENTO FUNERÁRIO <br />
          I. Remoção do corpo no local do Óbito ao do velório<br />
          II. Assepsia, preparação e vestimenta do corpo<br />
          III. Ornamentação da urna mortuária<br />
          IV. Orientação sobre o registro do óbito<br />
          V. Facilitar e auxiliar na realização da cerimônia<br />
          VI. Quilometragem 300 Km<br />
          VII. Kit café.<br />
          VIII. Nota de falecimento no rádio e volante<br />
          IX. Veiculo fúnebre adequado.<br />
          X. Assistência de velório qualificada<br />
          XI. Cadeiras para velório<br />
          XII. Gela água<br />
          XIII. Abertura de cova   <br />
          XIV. 50 lembracinhas<br />
          XV. Urna básica com visor<br /><br />

          <h1 className='text-center font-semibold '>CONTRATO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS ASSISTENCIAL FAMILIAR & FUNERÁRIO</h1>
        </div>
        <div className='uppercase mx-5 p-2 text-justify' style={{ textAlign: 'justify' }}>
          Pelo presente instrumento particular as partes doravante denominas isoladamente.
          Parte e conjunto. Partes, de um lado na qualidade de CONTRATADA e doravante assim
          denominada pelo nome fantasia ASSISTÊNCIA FAMILIAR PARAÍSO (AFAP), razão social FREITAS
          NETO SERVIÇOS FUNERÁRIOS LTDA ME, pessoa jurídica de direito privado, inscrita no CNPJ
          sob o n° 16.784.573/0001-93, com o estabelecimento à Rua Adauto Castelo, nº 393, Centro,
          Cedro, Estado do Ceará, CEP 63.400,000 neste ato representa por si ou por seu Sócio administrador
          Pessoa Física Manoel de Freitas Neto, e em conformidade com seus atos constituídos,
          seu administrador e/ou procurador (a) (s) (ES) signatário(s); E, de outro lado, na qualidade
          de CONTRATANTE e doravante assim denominada conforme informações presentes no Anexo I
          do presente instrumento e suas modificações. As partes vêm. Entre si, celebrar o presente
          CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ASSISTÊNCIA FUNERÁRIA, doravante denominado “CONTRATO”,
          que se regerão pelos termos, cláusulas e condições a seguir alinhadas;<br /><br />
          <span className=" font-semibold">CLÁUSULA PRIMEIRA – OBJETO</span><br />
          <span className=" font-semibold">1.1</span> 	O presente contrato e regulamentado e firmado em conformidade com a lei 13.261, de 22 de março de 2016, tem por objeto a PRESTAÇÃO DE SERVIÇOS DE ASSISTÊNCIA FUNERÁRIA. <br />
          <span className=" font-semibold">CLÁUSULA SEGUNDA – DA VIGÊNCIA DO CONTRATO E SUA RENOVAÇÃO </span><br />
          <span className=" font-semibold">2.1</span> 	O presente contrato é firmado pelo prazo determinado de 48 (quarenta e oito) meses, contados de sua assinatura, prazo a ser sucessiva e automaticamente renovado, por igual período, desde que não haja manifestação da vontade das partes para a sua rescisão em até 30 (trinta) dias antes do seu vencimento de forma escrita e ou presencial na Sede da empresa com as partes em comum acordo quando serão apresentadas a outra parte os motivos da não continuidade deste instrumento.<br />
          <span className=" font-semibold">2.2</span> 	Pelo presente instrumento, o contrato possui período de 48 (quarenta e oito) meses, caso seja rescindido antes do prazo estipulado no ponto anterior, a parte contratante deverá apresentar os motivos pelos quais irá rescindir o contrato, bem como arcar com os valores pendentes e multa correspondente a quebra contratual. <br /><br />
          <span className=" font-semibold">CLAÚSULA TERCEIRA – DA PRESTAÇÃO DOS SERVIÇOS</span><br />
          <span className=" font-semibold">3.1</span>	Os serviços contratados serão prestados diretamente pela CONTRATADA, podendo ainda, a seu exclusivo critério técnico e no melhor das hipóteses, ser prestado por sua rede de empresas credenciadas visando a excelência ao atendimento dos contratantes em conformidade com o CDC.<br />
          <span className=" font-semibold">3.2</span> 	Havendo necessidade de os serviços ora contratados serem prestados em local onde a CONTRATADA 	não atua, far-se-á necessária prévia autorização por escrito da CONTRATADA. Neste caso, a CONTRATADA liquidará a título de ajuda de custo pelo serviço executado o valor equivalente a 12 (doze) parcelas referentes à mensalidade do plano, a contar da data da autorização. Sendo necessário para isso, a apresentação da cópia e original da certidão de óbito, RG e CPF do falecido(a) e RG e CPF do(a) titular no prazo de até 30(trinta) dias logo após a ocorrência do óbito e dos serviços.<br />
          <span className=" font-semibold">3.3</span> 	A fruição do benefício exposto na parte anterior, ou seja, no ponto 3.2., só será aplicável e utilizável pela parte contratante 01 (um) ano após a assinatura do contrato, período este que será compreendido como carência, conforme tabela do Anexo II do presente instrumento.<br />
          <span className=" font-semibold">3.4</span> 	A CONTRATADA não fará repasses referente a ajuda de custo em espécie (moeda circulante) ou outro meio de pagamento ao CONTRATANTE no que tange o item 3.2, a dedução será única e exclusivamente nas parcelas do plano (12 parcelas).<br />
          <span className=" font-semibold">3.5</span>	Qualquer serviço contratado sem prévia autorização da CONTRATADA será de total responsabilidade do (a) CONTRATANTE efetuar o pagamento a empresa que prestou os serviços.<br /><br />
          <span className=" font-semibold">CLAÚSULA QUARTA – DO SERVIÇO DE TANATOPRAXIA</span><br />
          <span className=" font-semibold">4.1</span> Terá direito ao serviço de Tanatopraxia o titular e seus respectivos dependentes que aderirem ao plano que contenha esse serviço, conforme Anexo I do presente instrumento.<br />
          <span className=" font-semibold">4.2</span> O serviço de Tanatopraxia será prestado pela AFAP, ou por empresa autorizada pela mesma.<br />
          <span className=" font-semibold">4.3</span> Para ser prestado esse serviço, o titular do plano ou solicitante assinarão prévia autorização para que a Funerária Paraíso ou as suas respectivas parceiras realize esse serviço.<br />
          <span className=" font-semibold">4.4</span> O associado que não tenha aderido ao plano que já inclui o serviço de Tanatopraxia, não terá direito à este serviço (nem o titular e nenhum de seus dependentes), tendo desse modo, que pagar o valor (serviço particular) conforme tabela da Funerária Paraíso.<br />
          <span className=" font-semibold">4.5</span> O cliente que nas suas informações cadastrais do anexo I, não tiver o serviço de Tanatopraxia incluso, poderá aderir desde que ache conveniente, passando por uma carência de 90 dias para a utilização do serviço de Tanatopraxia após adesão do novo plano que contenha este serviço.<br /><br />
          <span className=" font-semibold">CLAÚSULA QUINTA – DOS SERVIÇOS CONTRATADOS </span><br />
          <span className=" font-semibold">5.1</span> 	A prestação dos serviços de assistência funerária adquiridos pela CONTRATANTE encontra-se descritos e especificados no Anexo I do presente contrato.<br />
          <span className=" font-semibold">5.2</span>	Estão inclusos no plano de assistência funerária ora contratado, todas as taxas, emolumentos e tributos incidentes nos serviços nos bens e nos materiais consumidos por força do presente contrato, como ISS, PIS, COFINS; ICMS SEFAZ-CE, CSLL, IRPF JURIDICO E DEMAIS, INSS PATRONAL E DEMAIS.<br />
          <span className=" font-semibold">5.3</span>	Na prestação do serviço aos contratantes, que requeiram utilização da seguinte mercadoria fiscal 01 (uma) URNA de medida inferior ao tamanho padrão, não será permitido à parte CONTRATANTE requerer restituição da diferença de crédito de Valores Monetários entre os serviços. <br />
          <span className=" font-semibold">5.4</span>	No caso do ponto anterior, 5.3., o CONTRATANTE que requerer utilização de urna em medida inferior ao tamanho padrão, através do presente instrumento, concorda que não haverá compensação e que o valor disponível/contratado será tido como quite como se tivesse utilizado o crédito contratado para uma URNA em tamanho padrão.<br />
          <span className=" font-semibold">CLAÚSULA SEXTA- VALOR GLOBAL DO CONTRATO, DA REMUNERAÇÃO MENSAL, DA QUANTIDADE DE PARCELAS E LOCAL DE PAGAMENTOS. </span><br />
          <span className=" font-semibold">6.1</span>	O valor global do presente contrato está descrito no Anexo I, a ser pago em 48 parcelas conforme plano contratado e valor indicado no Anexo I.<br />
          <span className=" font-semibold">6.2</span>	O pagamento das parcelas do presente contrato deverá ser efetuado nos seguintes locais: escritório da empresa (matriz e filiais) conforme origem do plano, aos consultores disponíveis para receber no endereço indicado pela CONTRATADA conforme solicitação do cliente. <br />
          <span className=" font-semibold">6.3</span> 	A CONTRATADA não se responsabiliza pela execução dos serviços contratados, caso o CONTRATANTE 	se encontre na condição de inadimplente, conforme o item 8.2 da cláusula oitava.<br /><br />
          <span className=" font-semibold">CLAÚSULA SÉTIMA – DOS BENEFICIÁRIOS</span><br />
          <span className=" font-semibold">7.1</span> 	São beneficiários (as) do presente CONTRATO além do (a) Contratante / Titular as pessoas qualificadas no Anexo I no momento da apreciação e assinatura deste instrumento – <span className=" font-semibold underline underline-offset-0" >SENDO VEDADO O ATENDIMENTO DE QUALQUER PESSOA QUE NÃO ESTEJA COBERTA NESTE SERVIÇO NO ATO DA CELEBRAÇÃO DESTE CONTRATO.</span><br />
          <span className=" font-semibold">7.2</span>	É direito da CONTRATADA, solicitar os documentos que comprovem ou atestem as condições do beneficiário.<br />
          <span className=" font-semibold">7.3</span>	É facultado à CONTRATADA rescindir todos os CONTRATOS que configurem fraude empreendida pelo CONTRATANTE.<br /><br />
          <span className=" font-semibold">CLAÚSULA OITAVA - DA SUBSTITUIÇÃO, INCLUSÃO E EXCLUSÃO DE BENEFICIÁRIOS.</span><br />
          <span className=" font-semibold">8.1</span>  	São permitidas a substituição, inclusão e exclusão de beneficiários e exclusivos critérios do (a) CONTRATANTE, sendo limitado cadastral, devendo ser observado o prazo de carência previsto na cláusula décima segunda.<br />
          a) A substituição e/ou inclusão de beneficiários está limitada a quantidade constante no Anexo I do contratante, podendo a exclusivo critério de a CONTRATADA ser incluídos dependentes/ beneficiários além da quantidade contratada, neste caso será cobrada uma taxa por excedente no valor correspondente a 10% (dez por cento) do valor do vigente plano, valor este que será acrescido no valor da mensalidade, e no cálculo do valor global.<br />
          b) No caso de falecimento de um dos beneficiários, será permitida a substituição no prazo de 48 (quarenta e oito meses) após a assinatura do contrato.<br />
          c) Nos casos dos planos “B”5 e “B”6 atingindo o limite de dependentes no plano não poderá, adicionar dependentes.<br />
          <span className=" font-semibold">8.2</span>	A partir da comunicação da decisão do (a) CONTRATANTE pela substituição e/ou exclusão de beneficiários (s), a CONTRATADA passa a não ter a obrigação de prestar os serviços funerários ao(s) beneficiários substituídos/excluídos.<br />
          <span className=" font-semibold">8.3</span>	O direito de substituição, inclusão e exclusão dos beneficiários (em vida) só será permitido a cada 180 dias.<br /><br />
          <span className=" font-semibold">CLAÚSULA NONA – DA RESCISÃO E SUSPENSÃO DO CONTRATO</span><br />
          <span className=" font-semibold">9.1</span>	O presente CONTRATO pode ser rescindido por qualquer uma das partes em razão do descumprimento de qualquer das obrigações ou condições nele pactuadas, bem como pela superveniência de norma legal ou fato administrativo que torne formal uma materialmente inexequível ou, ainda, por ato unilateral devidamente motivado, mediante comunicação prévia da parte que a ele der causa, na forma prevista neste CONTRATO;<br />
          <span className=" font-semibold">9.2</span> 	O (a) CONTRATANTE, que atrasar 3 (três) mensalidades consecutivas, terá todos os seus direitos suspensos.
          <span className=" font-semibold">9.3</span>	As partes poderão rescindir, ou suspender, unilateralmente e motivadamente, este CONTRATO, a qualquer tempo, mediante envio ou notificação escrita à outra parte com antecedência mínima de 30 (trinta) dias.<br />
          a) Caso a iniciativa de rescindir seja do (a) CONTRATANTE, o (a) mesmo (a) deverá pagar a título de cláusula penal, o valor correspondente a 100% (cem por cento) da(s) parcela(s) vencida(s) não liquidada(s) no caso de não ter utilizado os serviços funerários objeto do presente contrato. No caso de ter havido um falecimento o titular pagará o valor equivalente a 100% (cem por cento) das parcelas á vencer deste contrato.<br />
          <span className=" font-semibold">9.4</span>  Suspendem- se todos os direitos conferidos neste contrato, em caso de calamidade pública epidemias, pandemias, catástrofe, revolução, guerra civil ou qualquer motivo de força maior ou caso fortuito. <br />
          <span className=" font-semibold">9.5</span>	Em nenhuma hipótese ou situação haverá restituição de valores, inclusive, em caso de cancelamento deste contrato, haja vista que tais valores foram utilizados para custear as despesas da CONTRATADA para manter a disposição do (a) CONTRATANTE todos os serviços contratados.<br /><br />
          <span className=" font-semibold">CLAÚSULA DÉCIMA- FORMA DE ACIONAMENTO</span><br />
          <span className=" font-semibold">10.1</span>   A CONTRATADA disponibiliza as seguintes formas para que o (a) CONTRATANTE acione os serviços funerários;<br />
          a) Comparecer ao escritório da Matriz situada à Rua Adauto Castelo nº 393, Bairro Centro, Cedro Ceará, ou em havendo mudança de Endereço da Sede comparecimento no novo endereço funcional.<br />
          b) Ligar para um dos telefones da central de atendimento para contato disponibilizados nos carnês e carteirinhas: (88) 99711-3362 Tim (88)99795-4053 (88) 993754084 e (88) 99279-1294.<br />
          c) É obrigação do (a) CONTRATANTE / TITULAR, extensiva também a todos àqueles listados e declinados no Anexo I como BENEFICIÁRIOS, comunicar à CONTRATADA, através de vias e meios regulares, sempre próprios e habituais a essa circunstância, o falecimento (óbito) da pessoa que se encontre indicada como BENEFICIÁRIO dos serviços de funerais e afins. <br />
          d) É obrigatório ao solicitante do serviço funerário a CONTRATADA, ter em mãos os seus documentos e do falecido para a confirmação e identificação de ambos.<br />
          e) Não configurará o não cumprimento contratual por parte da CONTRATADA, quando não houver a devida comunicação acerca do falecimento (óbito) de qualquer BENEFICIÁRIO deste contrato, incluindo- se a do (a) CONTRATANTE TITULAR, uma vez que não é de responsabilidade da CONTRATADA, procedimento de investigação, busca verificação e constatação de óbitos.<br />
          <span className=" font-semibold">CLAÚSULA DÉCIMA PRIMEIRA- ARÉA DE ABRANGÊNCIA  </span><br />
          <span className=" font-semibold">11.1</span>A cobertura em prestação de serviços funerários, ora contratados, restringe-se ao limite ofertado pelo plano contratado descrito no Anexo I, considerado para este a soma de ida e volta da matriz ou filial da CONTRATADA.<br />
          <span className=" font-semibold">CLAÚSULA DÉCIMA SEGUNDA - CARÊNCIA, RESTRIÇÕES E LIMITES.</span><br />
          <span className=" font-semibold">12.1</span>   Para a utilização dos serviços funerários, objeto do presente CONTRATO, o (a) CONTRATANTE, deverá observar uma carência de 90 (noventa) dias a partir da assinatura do presente instrumento particular;<br />
          <span className=" font-semibold">12.2</span> Ocorrendo falecimento do titular e/ou de seus dependentes durante o período de carência a CONTRATADA responsabilizar-se-á única e exclusivamente por 50% (cinquenta por cento) dos custos referentes aos serviços funerários, ficando os outros 50% (cinquenta por cento) a cargo do titular; Em caso de o CONTRATANTE ter seu contrato em outra empresa funerária, o mesmo decidindo aderir ao nosso contrato, não passará por carência, desde que comprove através de documentos que estava altamente em dias com a outra empresa que mantinha contrato.<br />
          <span className=" font-semibold">12.3</span>	  Em caso de não utilização do número máximo de beneficiários estabelecidos na cláusula oitava, poderá o titular incluir novos dependentes até o limite do plano contratado, ficando estes que foram incluídos posteriormente sujeitos à carência de 90 (noventa) dias a contar com a data de inclusão dos mesmos. <br />
          <span className=" font-semibold">CLAÚSULA DÉCIMA TERCEIRA - DO REAJUSTE DO CONTRATO</span><br />
          <span className=" font-semibold">13.1</span>  O valor da REMUNERAÇÃO MENSAL será atualizado a cada 12 (doze) meses, de acordo com a aplicação acumulada do percentual de variação do INPC (Índice Nacional de Preços ao Consumidor) que se verificar no período, e na falta deste, por qualquer outro divulgado pelo Governo Federal, que reflita a variação de preços, no período de reajuste.<br />
          <span className=" font-semibold">CLAÚSULA DÉCIMA QUARTA - DO FALECIMENTO DO CONTRATANTE/TITULAR</span><br />
          <span className=" font-semibold">14.1</span>  No caso de falecimento do CONTRATANTE, este poderá ser substituído por seus sucessores, desde que obedecida à ordem preferencial da sucessão, transferindo- se àqueles todos os direitos e obrigações oriundas do presente CONTRATO, ressaltando-se, assim, que esta avença não obriga somente a parte CONTRATANTE, mais também seus sucessores a qualquer título.<br />
          <span className=" font-semibold">CLAÚSULA DÉCIMA QUINTA – DISPOSIÇÕES DIVERSAS</span><br />
          <span className=" font-semibold">15.1</span> São vedadas as partes a cessão ou transferência de quaisquer obrigações e/ou direitos, decorrentes deste CONTRATO, sem a expressa anuência da outra parte.
          <span className=" font-semibold">15.2</span> Cada disposição deste CONTRATO será considerada como sendo um acordo entre as partes de forma que, se quaisquer das disposições aqui contidas forem judicialmente consideradas inválidas, legais ou inexequíveis, a validade, legalidade e exequibilidade das disposições restantes não serão de forma alguma afetadas ou prejudicadas.<br />
          <span className=" font-semibold">15.3</span>	  O presente instrumento é firmado com caráter irretratável e irrevogável entre as partes, obrigando-as desde a sua assinatura bem como a seus sucessores, a qualquer título, não podendo ser alterado ou modificado, salvo mediante documento ou termo aditivo, escrito e devidamente assinado pelas partes e por 2 (duas) testemunhas.<br />
          <span className=" font-semibold">15.4</span> As partes declaram, para efeitos legal e processual, que o presente contrato tem eficácia de título executivo extrajudicial, nos termos do art. 784, III, do Código de Processo Civil, obrigando as partes, bem como seus herdeiros e/ou sucessores.<br />
          <span className=" font-semibold">CLAÚSULA DÉCIMA SEXTA – NOTIFICAÇÕES </span><br />
          <span className=" font-semibold">16.1</span>	  Todas as solicitações e notificações entre as partes deverão ser encaminhadas, em língua portuguesa, pessoalmente com protocolo de recebimento, via cartório, ou através de carta com aviso de recebimento, nos seguintes endereços constantes no preâmbulo deste CONTRATO.<br />
          <span className=" font-semibold">16.2</span>  Qualquer alteração nos dados das partes referidas neste CONTRATO deverá ser prontamente informada, sob pena de a solicitação ou notificação encaminhada para as partes, cujo dados não tenham sido atualizados, ser considerada recebida válida.<br />
          <span className=" font-semibold">CLAÚSULA DÉCIMA SÉTIMA – DO FORO </span><br />
          <span className=" font-semibold">17.1</span>  Fica eleito a Foro da Comarca de Cedro, Estado do Ceará, para dirimir quaisquer dúvidas ou litígios referentes à interpretação ou execução deste CONTRATO, com renúncia expressa das partes quanto a qualquer outro, por mais privilegiado que seja ou que se torne.<br />
          E por estarem assim, justas e contratadas assinam o presente CONTRATO e seus anexos em 02(duas) vias de igual teor, rubricadas para todos os fins de direito, e na presença de duas testemunhas abaixo.<br />



        </div><br /><br />

       
      
          <div className="inline-flex   w-full gap-6 ">


            <div className="flex flex-col  w-1/2  justify-center items-center "style={{paddingTop:85,position:'relative'}}>
            <div  style={{position:'absolute', top:5}}>
            <Image className=" object-cover" width={300} alt="imagemAss" src={assinatura} />
            </div>
           
           
          
            <span className="absolute top-[20px] flex w-full border-b-[1px]  border-black " ></span>
            <span  style={{position:'absolute',top:85}}>CONTRATADA(O)</span>
           

            </div>
            <div className="flex flex-col w-1/2 justify-center items-center" style={{paddingTop:85,position:'relative'}}>
              <span className=" absolute top-[20px]  flex  w-full border-b-[1px] border-black "></span>
              <span  style={{position:'absolute',top:85}} >CONTRATANTE</span>
            </div>


          </div>

       
        <br /><br /><br /><br />
        <div className="inline-flex w-full gap-6 pt-8">
          <div className="flex flex-col w-1/2 justify-center items-center">
            <span className="flex w-full border-b-[1px] border-black "></span>
            <span>TESTEMUNHA</span>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-center">
            <span className="flex w-full border-b-[1px] border-black "></span>
            <span>TESTEMUNHA</span>
          </div>

        </div>


      </div>
    );
  }
}

export default DocumentTemplate;
