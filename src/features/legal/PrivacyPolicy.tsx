import styles from './PrivacyPolicy.module.css';

const LAST_UPDATED = '13 de junho de 2026';
const CONTROLLER = 'CLEH TECH';
const PRIVACY_EMAIL = 'privacidade@clehtech.com';

export default function PrivacyPolicy() {
  return (
    <main className={styles.page}>
      <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Política de Privacidade</h1>
          <p className={styles.updated}>Última atualização: {LAST_UPDATED}</p>
        </header>

        <section className={styles.section}>
          <p>
            Esta Política de Privacidade descreve como o HabitFlow, produto da{' '}
            {CONTROLLER}, coleta, usa, armazena e protege os seus dados pessoais,
            em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de
            Dados Pessoais — LGPD). Ao criar uma conta e usar o aplicativo, você
            declara estar ciente das práticas aqui descritas.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>1. Quem é o controlador dos dados</h2>
          <p>
            O controlador, responsável pelas decisões sobre o tratamento dos seus
            dados pessoais, é a {CONTROLLER}. Para qualquer questão relativa a
            privacidade e proteção de dados, ou para exercer os seus direitos,
            entre em contato pelo e-mail{' '}
            <a className={styles.link} href={`mailto:${PRIVACY_EMAIL}`}>
              {PRIVACY_EMAIL}
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>2. Quais dados coletamos</h2>
          <p>Tratamos as seguintes categorias de dados pessoais:</p>
          <ul className={styles.list}>
            <li>
              <strong>Dados de conta:</strong> endereço de e-mail e senha. A senha
              é gerenciada e armazenada de forma criptografada pelo nosso provedor
              de autenticação (Supabase Auth); nós não temos acesso à senha em
              texto puro.
            </li>
            <li>
              <strong>Dados de perfil:</strong> nome, foto de perfil (avatar),
              fuso horário e preferências de uso, como tema, meta diária de
              hábitos, dias de descanso e horário preferido de lembrete.
            </li>
            <li>
              <strong>Dados de uso do produto:</strong> os hábitos, categorias,
              metas e registros de progresso que você cria, incluindo datas,
              status de conclusão, valores e anotações.
            </li>
            <li>
              <strong>Dados de sono:</strong> caso utilize o acompanhamento de
              sono, registramos horários de dormir e acordar, duração, qualidade e
              eventuais anotações que você inserir.
            </li>
            <li>
              <strong>Interações com o assistente de IA:</strong> as mensagens que
              você envia ao assistente e os insights gerados a partir delas.
              Também registramos a contagem de uso (número de mensagens e de
              tokens) para aplicar os limites de uso do serviço.
            </li>
            <li>
              <strong>Dados técnicos:</strong> informações geradas automaticamente
              durante o uso, como endereço IP e registros de acesso, tratadas para
              segurança e funcionamento do serviço.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>3. Para que usamos os seus dados</h2>
          <ul className={styles.list}>
            <li>Criar e manter a sua conta e autenticar o seu acesso.</li>
            <li>
              Fornecer as funcionalidades do app: registrar hábitos, exibir
              progresso e estatísticas, acompanhar sono e operar o assistente de
              IA.
            </li>
            <li>Enviar e-mails transacionais (confirmação de conta, redefinição de senha).</li>
            <li>Enviar notificações e lembretes que você tenha configurado.</li>
            <li>Aplicar limites de uso do assistente de IA.</li>
            <li>Garantir a segurança, prevenir fraudes e corrigir falhas.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>4. Bases legais</h2>
          <p>
            O tratamento dos seus dados se fundamenta nas seguintes bases legais
            da LGPD (art. 7º): a <strong>execução do contrato</strong> de prestação
            do serviço, para tudo que é necessário ao funcionamento do app; o seu{' '}
            <strong>consentimento</strong>, para tratamentos opcionais como cookies
            não essenciais e comunicações; e o <strong>legítimo interesse</strong>,
            para segurança e melhoria do serviço, sempre respeitando os seus
            direitos e liberdades.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>5. Compartilhamento e operadores</h2>
          <p>
            Não vendemos os seus dados pessoais. Compartilhamos dados apenas com
            prestadores de serviço (operadores) que viabilizam o funcionamento do
            HabitFlow, na medida do necessário:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Supabase:</strong> autenticação, banco de dados e
              infraestrutura de backend.
            </li>
            <li>
              <strong>Anthropic:</strong> processamento das interações com o
              assistente de IA.
            </li>
            <li>
              <strong>Resend:</strong> envio de e-mails transacionais.
            </li>
            <li>
              <strong>Vercel:</strong> hospedagem do aplicativo.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>6. Transferência internacional de dados</h2>
          <p>
            Alguns dos operadores acima processam dados em servidores localizados
            fora do Brasil, inclusive nos Estados Unidos. Nesses casos, a
            transferência internacional é realizada nos termos do art. 33 da LGPD,
            adotando-se salvaguardas adequadas para proteger os seus dados. Ao usar
            o serviço, você está ciente dessa transferência.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>7. Retenção e exclusão</h2>
          <p>
            Mantemos os seus dados enquanto a sua conta estiver ativa ou pelo
            tempo necessário para as finalidades descritas. Você pode excluir a sua
            conta a qualquer momento pelo próprio app; ao fazê-lo, os seus dados
            pessoais associados são eliminados, ressalvadas as hipóteses de guarda
            obrigatória previstas em lei.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>8. Os seus direitos</h2>
          <p>
            Nos termos do art. 18 da LGPD, você pode, a qualquer momento,
            solicitar: confirmação da existência de tratamento; acesso aos seus
            dados; correção de dados incompletos ou desatualizados; anonimização,
            bloqueio ou eliminação de dados desnecessários; portabilidade;
            informação sobre com quem compartilhamos os seus dados; e a revogação
            do consentimento. Para exercer qualquer um desses direitos, escreva
            para{' '}
            <a className={styles.link} href={`mailto:${PRIVACY_EMAIL}`}>
              {PRIVACY_EMAIL}
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>9. Cookies</h2>
          <p>
            Utilizamos cookies e tecnologias semelhantes essenciais ao
            funcionamento do app, como os necessários para manter a sua sessão
            autenticada. Cookies não essenciais, quando houver, só são utilizados
            mediante o seu consentimento, coletado por meio do banner exibido no
            primeiro acesso.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>10. Idade mínima</h2>
          <p>
            O HabitFlow destina-se a pessoas com 16 anos ou mais. Não coletamos
            intencionalmente dados de menores de 16 anos. Caso identifiquemos uma
            conta criada por alguém abaixo dessa idade, ela poderá ser removida.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>11. Segurança</h2>
          <p>
            Adotamos medidas técnicas e administrativas para proteger os seus dados
            contra acessos não autorizados e situações de destruição, perda ou
            alteração. As senhas são armazenadas de forma criptografada e o acesso
            aos dados é controlado por políticas de segurança em nível de linha
            (RLS) no banco de dados.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>12. Alterações nesta política</h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças no serviço ou
            na legislação. Quando isso ocorrer, atualizaremos a data no topo desta
            página e, em mudanças relevantes, comunicaremos você pelos canais
            apropriados.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>13. Contato</h2>
          <p>
            Dúvidas ou solicitações sobre esta política e sobre o tratamento dos
            seus dados podem ser enviadas para{' '}
            <a className={styles.link} href={`mailto:${PRIVACY_EMAIL}`}>
              {PRIVACY_EMAIL}
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
