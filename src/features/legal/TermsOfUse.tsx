import styles from './PrivacyPolicy.module.css';

const LAST_UPDATED = '14 de junho de 2026';
const CONTROLLER = 'CLEH TECH';
const CONTACT_EMAIL = 'privacidade@clehtech.com';

export default function TermsOfUse() {
  return (
    <main className={styles.page}>
      <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Termos de Uso</h1>
          <p className={styles.updated}>Última atualização: {LAST_UPDATED}</p>
        </header>

        <section className={styles.section}>
          <p>
            Estes Termos de Uso regem o acesso e o uso do HabitFlow, aplicativo
            fornecido pela {CONTROLLER}. Ao criar uma conta e usar o serviço, você
            concorda com estes Termos. Se não concordar, não utilize o serviço.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>1. Descrição do serviço</h2>
          <p>
            O HabitFlow é um aplicativo de acompanhamento de hábitos, com recursos de
            estatísticas, acompanhamento de sono e um assistente baseado em
            inteligência artificial, destinado à organização pessoal do usuário.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>2. Cadastro e conta</h2>
          <p>
            Para usar o serviço é necessário criar uma conta com informações
            verdadeiras e atuais. Você é responsável por manter a confidencialidade da
            sua senha e por todas as atividades realizadas na sua conta. O serviço é
            destinado a pessoas com 16 anos ou mais.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>3. Uso aceitável</h2>
          <p>Ao usar o HabitFlow, você concorda em não:</p>
          <ul className={styles.list}>
            <li>utilizar o serviço para qualquer finalidade ilícita;</li>
            <li>acessar ou tentar acessar contas ou áreas de terceiros sem autorização;</li>
            <li>
              realizar engenharia reversa, copiar, revender ou explorar o serviço sem
              autorização;
            </li>
            <li>sobrecarregar, prejudicar ou interferir na infraestrutura do serviço;</li>
            <li>inserir conteúdo ilegal ou que viole direitos de terceiros.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>4. Conteúdo do usuário</h2>
          <p>
            Os hábitos, registros e demais dados que você insere no serviço pertencem a
            você. Você concede à {CONTROLLER} uma licença limitada e não exclusiva para
            armazenar e processar esse conteúdo com a única finalidade de operar e
            fornecer o serviço a você.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>5. Propriedade intelectual</h2>
          <p>
            O software, a marca HabitFlow, o design, os textos e o código-fonte são de
            titularidade da {CONTROLLER} e protegidos pela legislação aplicável. Estes
            Termos não transferem a você nenhum direito de propriedade sobre eles.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>6. Assistente de IA e acompanhamento de saúde</h2>
          <p>
            O assistente de inteligência artificial gera respostas de forma automatizada
            e pode conter erros ou imprecisões. O conteúdo do assistente, bem como os
            recursos de acompanhamento de hábitos e de sono, têm finalidade informativa e
            de organização pessoal. Eles <strong>não constituem aconselhamento médico,
            psicológico ou profissional</strong> e não substituem a orientação de
            profissionais qualificados. Decisões tomadas com base nesses recursos são de
            sua responsabilidade. Em questões de saúde, procure um profissional habilitado.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>7. Anúncios e conteúdo de terceiros</h2>
          <p>
            O serviço pode exibir anúncios ou conteúdo de terceiros. A {CONTROLLER} não
            se responsabiliza pelo conteúdo, produtos, serviços ou práticas de terceiros,
            e qualquer interação com eles ocorre por sua conta e risco.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>8. Planos e funcionalidades pagas</h2>
          <p>
            O serviço pode oferecer funcionalidades gratuitas e, futuramente, pagas.
            Caso planos pagos sejam disponibilizados, as condições específicas de preço,
            cobrança e cancelamento serão apresentadas a você no momento da contratação.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>9. Isenção de garantias</h2>
          <p>
            O serviço é fornecido "no estado em que se encontra", sem garantias de
            disponibilidade ininterrupta, ausência de erros ou adequação a uma finalidade
            específica, na máxima medida permitida pela legislação aplicável.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>10. Limitação de responsabilidade</h2>
          <p>
            Na máxima medida permitida pela legislação, a {CONTROLLER} não se responsabiliza
            por danos indiretos, incidentais ou consequentes decorrentes do uso ou da
            impossibilidade de uso do serviço, incluindo eventual perda de dados.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>11. Suspensão e encerramento</h2>
          <p>
            A {CONTROLLER} pode suspender ou encerrar contas que violem estes Termos. Você
            pode encerrar a sua conta a qualquer momento, pelo próprio aplicativo.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>12. Alterações</h2>
          <p>
            O serviço e estes Termos podem ser alterados a qualquer momento. Mudanças
            relevantes serão comunicadas, e o uso continuado do serviço após as alterações
            implica concordância com a nova versão.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>13. Lei aplicável e foro</h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Para
            dirimir controvérsias, fica eleito o foro do domicílio do usuário, conforme a
            legislação aplicável.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>14. Contato</h2>
          <p>
            Dúvidas sobre estes Termos podem ser enviadas para{' '}
            <a className={styles.link} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
