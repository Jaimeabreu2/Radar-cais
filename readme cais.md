# Radar CAIS — Sistema de Inteligência de Editais e Fomento à Inovação

Plataforma web e agente automatizado de prospecção, qualificação estratégica e gestão de pipeline de oportunidades de financiamento à pesquisa, desenvolvimento e inovação (PD&I) do **Instituto CAIS (Centro Ágil de Inovação e Saber)**.

---

## 1. Visão Geral do Ecossistema

O **Radar CAIS** transforma o monitoramento de chamadas públicas em um fluxo contínuo, automatizado e visual. O sistema combina um motor de coleta e qualificação em Python (`agente_editais_cais.py`) com um painel executivo moderno integrado (Front-End web) para apoiar a tomada de decisão rápida (**Go / No-Go**) da equipe de Inteligência de Editais e Apoio a Projetos.

### Principais Funcionalidades Implementadas
- **Varredura Automatizada em Camadas:** Monitoramento programado de portais oficiais nacionais e estaduais (incluindo **ETICE - Empresa de Tecnologia da Informação do Ceará**, FINEP, FUNCAP, CNPq, EMBRAPII, BNDES, etc.) divididos em ciclos diário, semanal, quinzenal e mensal.
- **Inspeção Profunda (Deep-Fetch):** Extração inteligente de prazos (`DD/MM/AAAA` e datas por extenso), valores financiados (`R$`, `US$`, `€`), contrapartida e elegibilidade diretamente nas páginas oficiais das chamadas.
- **⚡ Botão de Resumo Rápido Executivo:** Cada oportunidade conta com o botão **"⚡ Resumo Rápido"** no cartão e na tabela para exibição imediata de um cartão executivo didático e botão de **1 clique para copiar o resumo formatado para WhatsApp/E-mail** com emojis e dados estratégicos.
- **Qualificação Inteligente (Framework CAIS de 5 Etapas):** Integração com a API do Google Gemini (`gemini-2.5-flash`) e fallback heurístico local para pontuar aderência temática, atratividade financeira, complexidade e chance de aprovação.
- **Dashboard Institucional Interativo:** Interface web ultra didática de alto contraste, moderna e responsiva (WCAG AA/AAA) com KPIs em tempo real, busca instantânea, filtros semânticos, alertas de vencimento ($\le 7$ dias), scorecard visual de 5 etapas e alternância entre modo Cards e Tabela Pipeline.
- **Servidor Web & API REST Integrados no Python:** Inicialização com um único comando (`python agente_editais_cais.py --web`) na porta `8080`, sem necessidade de instalar frameworks pesados. Endpoints disponíveis: `/api/editais`, `/api/kpis`, `/api/resumo?id=<id>`, `/api/varredura`, `/api/status-varredura` e `/api/download/csv`.
- **Persistência Híbrida e Exportação:** Armazenamento deduplicado em JSON (`historico_editais.json`), banco relacional SQLite (`banco_editais_cais.db`) e planilha pronta para Excel / Google Sheets (`pipeline_oportunidades_cais.csv`).

---

## 2. Identidade Visual e Paleta Oficial (Instituto CAIS)

O design da plataforma segue rigorosamente a identidade visual corporativa do **Instituto CAIS**, garantindo alto contraste e leitura sem fadiga visual.

| Token / Elemento | Cor Hex | Aplicação na Interface | Relação de Contraste |
| :--- | :--- | :--- | :--- |
| **Azul Marinho CAIS (Primary Dark)** | `#0B2545` | Cabeçalho principal, barra de status, títulos e botões ativos | 15.4:1 sobre `#FFFFFF` |
| **Azul Cerúleo CAIS (Brand Accent)** | `#0284C7` | Botões primários, links ativos, ícones e foco | 4.6:1 sobre `#FFFFFF` |
| **Grafite Institucional (Body Text)** | `#1E293B` | Texto principal de leitura, descrições e tabelas | 13.5:1 sobre `#FFFFFF` |
| **Cinza Ardósia (Muted Text)** | `#475569` | Metadados, subtítulos, rótulos secundários e datas | 7.5:1 sobre `#FFFFFF` |
| **Superfície Base (Background)** | `#F8FAFC` | Fundo geral da aplicação para reduzir fadiga visual | — |
| **Superfície de Card (Surface)** | `#FFFFFF` | Cartões de editais, gavetas modais e tabela (borda `#E2E8F0`) | — |
| **Status GO / Alta Prioridade** | `#047857` | Badge/borda sobre fundo `#ECFDF5` para oportunidades recomendadas | 5.6:1 sobre `#ECFDF5` |
| **Status Avaliar / Média Prioridade** | `#B45309` | Badge/borda sobre fundo `#FFFBEB` para análise com parceiros | 5.1:1 sobre `#FFFBEB` |
| **Alerta Crítico ($\le 7$ dias)** | `#BE123C` | Badge/borda sobre fundo `#FFF1F2` para prazos prestes a vencer | 6.1:1 sobre `#FFF1F2` |

---

## 3. Arquitetura do Sistema e Estrutura de Arquivos

```text
Cais/
├── agente_editais_cais.py          # Motor Back-End, Coleta, API REST e Servidor Web
├── historico_editais.json          # Base de conhecimento JSON deduplicada
├── banco_editais_cais.db           # Banco de dados SQLite relacional
├── pipeline_oportunidades_cais.csv # Planilha formatada para Excel / Google Sheets
├── relatorio_ultimo_ciclo.md       # Relatório textual da última varredura
├── relatorio_ultimo_ciclo.html     # Relatório executivo HTML com identidade visual CAIS
├── frontend/                       # Interface Web do Dashboard Executivo
│   ├── index.html                  # Estrutura HTML semântica com modais e KPIs
│   ├── style.css                   # Sistema de design oficial Instituto CAIS
│   └── app.js                      # Controller JavaScript (filtros, KPIs, API local)
└── .github/
    └── workflows/
        └── monitor_editais.yml     # Automação diária gratuita via GitHub Actions (08h00 BRT)
```

---

## 4. Como Executar e Utilizar

### Passo 1: Instalar Dependências Básicas
```bash
pip install requests beautifulsoup4 google-genai
```

### Passo 2: Inicializar o Dashboard Executivo no Navegador
Para abrir a plataforma web completa imediatamente:
```bash
python agente_editais_cais.py --web
```
> O servidor iniciará em `http://localhost:8080` e abrirá o seu navegador automaticamente. Se a base de dados ainda estiver vazia no primeiro acesso, o sistema pré-carregará automaticamente 9 oportunidades verossímeis e ricas do ecossistema CAIS!

### Passo 3: Outros Comandos Úteis via Terminal
- **Carregar/Resetar Base de Demonstração (Mock Realista):**
  ```bash
  python agente_editais_cais.py --mock
  ```
- **Executar Varredura em Segundo Plano em Todas as Fontes:**
  ```bash
  python agente_editais_cais.py --ciclo todos
  ```
- **Executar Apenas o Ciclo do Dia (Diário + Conforme Calendário):**
  ```bash
  python agente_editais_cais.py --ciclo auto
  ```
- **Simulação (Dry-Run sem Gravar no Banco nem Enviar E-mails):**
  ```bash
  python agente_editais_cais.py --dry-run
  ```
- **Trocar Porta do Servidor Web:**
  ```bash
  python agente_editais_cais.py --web --porta 9000
  ```

---

## 5. Fontes Monitoradas por Ciclo de Varredura

| Ciclo | Frequência | Instituições e Programas Mapeados |
| :--- | :--- | :--- |
| **Diário** | Todos os dias (08h00) | ETICE (Ceará), FINEP, FUNCAP (Ceará), CNPq, EMBRAPII, CAPES e Programa Mover (MDIC/FUNDEP) |
| **Semanal** | Segundas-feiras | Sebrae (Catalisa ICT), SENAI (Plataforma Inovação), ABDI, BNDES Funtec e BNB (FUNDECI) |
| **Quinzenal** | Dias 1 e 15 do mês | Ministério da Ciência, Tecnologia e Inovação (MCTI) e CONFAP |
| **Mensal** | Dia 1 de cada mês | Horizon Europe (UE), BID Lab, Fundação Lemann, Fundação Telefônica Vivo, Itaú Social e Fundação Grupo Boticário |

---

## 6. Framework CAIS de 5 Etapas & Matriz de Scoring

Cada oportunidade capturada recebe notas de `0` a `10` nos critérios estratégicos do Instituto CAIS:

1. **Etapa 1 (Triagem Preliminar & Elegibilidade):** Extração de prazos, valor global financiado, contrapartida exigida e público elegível.
2. **Etapa 2 (Análise Temática Estratégica):** Avaliação de alinhamento com Inteligência Artificial, Semicondutores, GovTech, Transição Energética e Sustentabilidade.
3. **Etapa 3 (Inteligência de Captação & Consórcios):** Geração de ideias de projetos aplicados e sugestão de parceiros estratégicos (UECE, laboratórios LDI, indústrias parceiras).
4. **Etapa 4 (Análise de Risco & Complexidade):** Avaliação do esforço burocrático e viabilidade operacional ($\text{Viabilidade} = 10 - \text{Complexidade}$).
5. **Etapa 5 (Scorecard Ponderado e Decisão Go / No-Go):**

$$\text{Score Final} = (\text{Aderência} \times 0{,}40) + (\text{Chance de Aprovação} \times 0{,}25) + (\text{Atratividade Financeira} \times 0{,}20) + (\text{Viabilidade Operacional} \times 0{,}15)$$

- **Score $\ge 8{,}1$:** Prioridade Alta $\rightarrow$ **GO (Submeter Proposta)**
- **Score entre $6{,}5$ e $8{,}0$:** Prioridade Média $\rightarrow$ **AVALIAR COM PARCEIRO**
- **Score $< 6{,}5$:** Prioridade Baixa $\rightarrow$ **NO-GO (Monitorar)**
