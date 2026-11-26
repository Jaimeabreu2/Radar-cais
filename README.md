# 🎯 Radar CAIS — Inteligência de Editais e Fomento em PD&I

[![Painel Online](https://img.shields.io/badge/Painel_Online-GitHub_Pages-0284C7?style=for-the-badge&logo=github)](https://jaimeabreu2.github.io/radar-cais/)
[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-0B2545?style=for-the-badge&logo=python)](https://www.python.org/)
[![Testes Automatizados](https://img.shields.io/badge/Quality_Gate-6_Testes_Ativos-059669?style=for-the-badge)](#6-testes-automatizados-quality-gate)

O **Radar CAIS** é a plataforma de inteligência, triagem e gestão de oportunidades de financiamento à Pesquisa, Desenvolvimento e Inovação (PD&I) do **Instituto CAIS (Centro Ágil de Inovação e Saber)**.

Ele monitora automaticamente **20 portais oficiais de fomento** (nacionais, estaduais e internacionais — incluindo **Petrobras Conexões para Inovação**), calcula uma **Nota de Aderência (0 a 10)** para cada chamada pública e entrega um plano prático de submissão em um painel web responsivo (computador e celular).

---

## 🌐 1. Acesso Rápido ao Painel Online

👉 **[https://jaimeabreu2.github.io/radar-cais/](https://jaimeabreu2.github.io/radar-cais/)**

- **Atualização automática:** Todos os dias às **08h00 (horário de Brasília)** via GitHub Actions.
- **4 modos de visualização:**
  - **Cartões Executivos:** Visão rápida com semáforo de decisão, recurso, prazo e laboratório CAIS indicado.
  - **Tabela Compacta:** Planilha filtrável para comparação lado a lado.
  - **Cronograma de Prazos:** Linha do tempo por urgência com botão `+ Agenda (.ics)` para Outlook/Google Agenda.
  - **Funil CAIS (Kanban):** Gestão interna em 4 etapas (*Em Triagem*, *Articulação*, *Redigindo Proposta*, *Submetido*).
- **Ferramentas de 1 clique em cada edital:**
  - **🤖 Copiloto CAIS (`RAG + LLM`):** Busca vetorial semântica (TF-IDF + Similaridade de Cosseno) para responder perguntas em linguagem natural e fazer o *match* automático entre ideias de projeto do laboratório e os editais abertos (com suporte híbrido gratuito ao `gemini-2.5-flash`).
  - **🔮 Motor Preditivo de Captação (`Machine Learning`):** Calcula o **Índice de ROI do Esforço (`0–100%`)**, estima o **tempo médio de preparo documental (dias úteis)**, alerta sobre **Risco de Gargalo de Prazo** e sugere o **reaproveitamento de propostas** entre editais similares (*Cluster ML*).
  - **🤝 Copiar Convite para Parceiro:** Dentro dos detalhes do edital, gera e copia em 1 clique uma mensagem natural, clara e personalizada para convidar o parceiro ideal (Indústria/Empresa, Startup, Órgão Público ou Laboratório/UECE), com verba, prazo, ganhos mútuos e divisão de papéis.
  - **Copiar Sumário Executivo:** Texto formatado pronto para enviar no WhatsApp ou e-mail da diretoria.
  - **Copiar Minuta Técnica (1-Page):** Rascunho estruturado de pré-projeto (*Concept Note* com pacotes de trabalho) para iniciar a escrita.
  - **Exportação:** Planilha `.CSV` compatível com Excel e Relatório Executivo em `.PDF`.

---

## 🧠 2. Como a Nota CAIS (0 a 10) é Calculada?

Cada edital passa por uma avaliação ponderada em **4 critérios** para apoiar a decisão rápida da equipe:

| Critério | Peso | O que avalia |
| :--- | :---: | :--- |
| **1. Aderência ao CAIS** | **40%** | Alinhamento com IA, Ciência de Dados, Semicondutores, Sistemas Embarcados, Nuvem/Cibersegurança e Transição Energética. |
| **2. Chance de Aprovação** | **25%** | Elegibilidade direta de ICTs/associações sem fins lucrativos, histórico e foco regional (Ceará/Nordeste). |
| **3. Atratividade Financeira** | **20%** | Volume de recursos não reembolsáveis (subvenção/bolsas) versus exigência de contrapartida. |
| **4. Viabilidade Operacional** | **15%** | Facilidade administrativa e prazo hábil para articular parceiros ($\text{Viabilidade} = 10 - \text{Complexidade}$). |

$$\text{Nota Final} = (\text{Aderência} \times 0{,}40) + (\text{Chance} \times 0{,}25) + (\text{Financeiro} \times 0{,}20) + (\text{Viabilidade} \times 0{,}15)$$

### Semáforo de Decisão
- 🟢 **GO ($\ge 8{,}1$):** Alta aderência técnica e financeira — **priorizar submissão**.
- 🟡 **AVALIAR ($6{,}5 \text{ a } 8{,}0$):** Bom potencial, mas exige **articular empresa ou universidade parceira (ex.: UECE)**.
- 🔴 **NO-GO ($< 6{,}5$) ou ENCERRADO:** Baixa aderência ou prazo de submissão já encerrado (mantido apenas para histórico).

---

## 🏛️ 3. Portais Monitorados por Ciclo

| Ciclo | Frequência | Fontes Oficiais Auditadas (19 Portais) |
| :--- | :--- | :--- |
| **Diário** | Todos os dias às 08h00 | **FINEP**, **Petrobras (Conexões para Inovação)**, **FUNCAP (Ceará)**, **ETICE (Ceará)**, **CNPq**, **EMBRAPII**, **CAPES** e **Programa Mover (MDIC/FUNDEP)** |
| **Semanal** | Segundas-feiras | **Sebrae (Catalisa ICT)**, **SENAI (Plataforma Inovação)**, **ABDI**, **BNDES Funtec** e **Banco do Nordeste (FUNDECI)** |
| **Quinzenal** | Dias 1 e 15 do mês | **MCTI** e **CONFAP** (Chamadas Internacionais) |
| **Mensal** | Dia 1 de cada mês | **Horizon Europe (União Europeia)**, **BID Lab**, **Fundação Lemann**, **Fundação Telefônica Vivo**, **Itaú Social** e **Fundação Grupo Boticário** |

---

## 🗂️ 4. Arquitetura e Estrutura do Projeto

```text
radar-cais/
├── README.md                       # Documentação oficial do projeto
├── requirements.txt                # Dependências Python do motor de coleta
├── agente_editais_cais.py          # Motor Back-End: coleta, qualificação, SQLite, CSV e API REST
├── iniciar_painel.bat              # Atalho Windows (1 clique) para abrir o painel localmente
├── servidor_local.ps1              # Servidor HTTP local leve e seguro (porta 8080)
├── historico_editais.json          # Base principal deduplicada de editais auditados
├── banco_editais_cais.db           # Banco relacional SQLite
├── pipeline_oportunidades_cais.csv # Planilha pronta para Excel / Google Sheets
├── frontend/                       # Painel Web Executivo (HTML5 + CSS3 + JS Vanilla, zero dependências)
│   ├── index.html                  # Estrutura semântica do dashboard e modal de 3 abas
│   ├── style.css                   # Design System Instituto CAIS (Desktop & Mobile)
│   ├── app.js                      # Filtros, busca, favoritos, funil Kanban, .ICS e minuta 1-page
│   └── historico_editais.json      # Espelho sincronizado para o GitHub Pages
├── tests/                          # Suíte de testes automatizados (Quality Gate)
│   └── test_radar_cais.py          # Valida dados, fórmulas, segurança, DOM e responsividade
└── .github/workflows/
    └── monitor_editais.yml         # Automação diária: Coleta -> Testes -> Publicação no GitHub Pages
```

---

## 💻 5. Como Rodar no seu Computador

### Pré-requisitos
- **Python 3.10+** instalado (ou Windows PowerShell para abrir apenas o painel visual).

### Opção A — Abrir o painel no Windows com 2 cliques
Dê duplo clique no arquivo **`iniciar_painel.bat`**. Ele sobe o servidor local e abre `http://localhost:8080` automaticamente.

### Opção B — Via Terminal (Completa, com Motor de Varredura em Python)
1. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Inicie o servidor web integrado:**
   ```bash
   python agente_editais_cais.py --web
   ```
3. **Comandos úteis de coleta:**
   ```bash
   # Executar o ciclo automático do dia
   python agente_editais_cais.py --ciclo auto

   # Executar varredura completa em todas as 19 fontes
   python agente_editais_cais.py --ciclo todos

   # Simular coleta sem gravar alterações no banco (dry-run)
   python agente_editais_cais.py --dry-run
   ```

> **Variáveis de Ambiente Opcionais (`.env`):** Veja o arquivo [`.env.example`](.env.example) caso deseje configurar chave da API Gemini (`GEMINI_API_KEY`) para enriquecimento textual via LLM ou alertas por e-mail/webhook. Sem chave configurada, o sistema utiliza seu classificador heurístico determinístico local.

---

## 🛡️ 6. Testes Automatizados (Quality Gate)

A suíte [`tests/test_radar_cais.py`](tests/test_radar_cais.py) funciona como uma **trava de segurança**: ela roda tanto localmente quanto **todos os dias no GitHub Actions** antes de publicar qualquer atualização no site. Se algum portal governamental mudar de layout e gerar dados inválidos, o teste barra a publicação para proteger o painel online.

Para rodar os testes manualmente:
```bash
python -m unittest discover -s tests -v
```

### O que é verificado automaticamente:
1. **Sincronia de Dados:** `historico_editais.json`, `frontend/historico_editais.json`, `banco_editais_cais.db` e `pipeline_oportunidades_cais.csv` precisam ter exatamente os mesmos registros, sem títulos ou links duplicados.
2. **Auditoria Factual:** Todos os links devem ser URLs oficiais válidas (`http/https`), sem ruídos de menus ou valores truncados.
3. **Fórmula Matemática e Prazos:** Recalcula o score ponderado de todos os editais e garante que nenhum edital com prazo encerrado receba status `GO` ou `AVALIAR`.
4. **Segurança:** Testa a blindagem contra *CSV Formula Injection* no Excel e *Path Traversal* no servidor local.
5. **Integridade do Front-End & Mobile:** Confere todos os seletores entre `index.html`, `app.js` e `style.css`, incluindo as regras de responsividade para celular.
6. **Saúde do Workflow Diário:** Garante que o pipeline do GitHub Actions execute os testes antes do deploy e atualize a branch `gh-pages` corretamente.
