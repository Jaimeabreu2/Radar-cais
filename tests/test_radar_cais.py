"""
Suíte Oficial de Testes Automatizados e Quality Gate — Radar CAIS
Execução:
    python -m unittest discover -s tests -v
"""

import csv
import json
import re
import sqlite3
import sys
import unittest
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

import agente_editais_cais as ag  # noqa: E402


class TestRadarCais(unittest.TestCase):
    """Valida integridade dos dados, regras de negócio, segurança, frontend e automação."""

    @classmethod
    def setUpClass(cls):
        cls.dados_root = json.loads((BASE_DIR / "historico_editais.json").read_text(encoding="utf-8"))
        cls.dados_front = json.loads((BASE_DIR / "frontend" / "historico_editais.json").read_text(encoding="utf-8"))
        cls.editais = cls.dados_root.get("editais", {})

    def test_01_sincronia_json_sqlite_csv(self):
        """Garante que JSON raiz, JSON do frontend, SQLite e planilha CSV estão 100% sincronizados."""
        editais_front = self.dados_front.get("editais", {})
        self.assertEqual(len(self.editais), len(editais_front), "Dessincronia entre JSON raiz e frontend/historico_editais.json")
        self.assertGreaterEqual(len(self.editais), 50, "Quantidade de editais abaixo do mínimo esperado (50)")

        with sqlite3.connect(BASE_DIR / "banco_editais_cais.db") as conn:
            total_db = conn.execute("SELECT COUNT(*) FROM editais").fetchone()[0]
        self.assertEqual(total_db, len(self.editais), f"SQLite ({total_db}) dessincronizado do JSON ({len(self.editais)})")

        with (BASE_DIR / "pipeline_oportunidades_cais.csv").open("r", encoding="utf-8-sig") as f:
            linhas_csv = list(csv.reader(f))
        self.assertEqual(len(linhas_csv), len(self.editais) + 1, "Quantidade de linhas no CSV difere do total de editais + cabeçalho")

        titulos = [ed.get("titulo", "").strip() for ed in self.editais.values()]
        links = [ed.get("link", "").strip() for ed in self.editais.values()]
        self.assertEqual(len(titulos), len(set(titulos)), "Existem títulos duplicados na base de editais")
        self.assertEqual(len(links), len(set(links)), "Existem links duplicados na base de editais")

    def test_02_qualidade_factual_e_ausencia_de_ruido(self):
        """Impõe ausência de lixo de scraping, links quebrados ou valores truncados nos editais."""
        for id_ed, ed in self.editais.items():
            link = ed.get("link", "")
            resumo = ed.get("resumo_objetivo", "")
            valor = ed.get("valor_financiado", "")
            titulo = ed.get("titulo", "")

            self.assertTrue(link.startswith(("http://", "https://")), f"Link inválido em {id_ed}: {link}")
            self.assertNotIn("news.confap.org.br", link.lower(), f"Notícia em vez de edital em {id_ed}")
            self.assertNotIn("Acessibilidade | Alto Contraste", resumo, f"Ruído de menu FINEP em {id_ed}")
            self.assertNotIn("= Home = Categorias", resumo, f"Ruído de menu SENAI em {id_ed}")
            self.assertFalse(resumo.startswith(("= Categoria", "Info ")), f"Ruído residual no resumo de {id_ed}")
            self.assertNotIn(valor, ("R$ 30,0 mil", "R$ 15,0 mil", "R$ 1 mil", "R$ 2 mil", "R$ 1.000.000,00 Mil"), f"Valor truncado em {id_ed}: {valor}")
            self.assertNotEqual(titulo.strip().lower(), "busca de chamadas abertas", f"Título genérico de página de busca em {id_ed}")
            self.assertNotIn("consultar cronograma", str(ed.get("prazo_submissao", "")).lower(), f"Prazo não extraído do PDF/página em {id_ed}")
            self.assertTrue(bool(ed.get("cronograma_etapas")), f"Campo cronograma_etapas ausente em {id_ed}")

    def test_03_matematica_score_e_semaforo_de_prazos(self):
        """Valida o cálculo da Nota CAIS (0 a 10) e impede que editais vencidos recebam recomendação GO."""
        exemplo = {
            "nota_aderencia": 10.0,
            "nota_chance_aprovacao": 8.0,
            "nota_financeira": 8.0,
            "nota_complexidade": 2.0,  # Viabilidade = 10 - 2 = 8.0
        }
        # 10*0.40 (4.0) + 8*0.25 (2.0) + 8*0.20 (1.6) + 8*0.15 (1.2) = 8.8
        self.assertAlmostEqual(ag.calcular_score_ponderado(exemplo), 8.8, places=2)

        for id_ed, ed in self.editais.items():
            esperado = ag.calcular_score_ponderado(ed)
            atual = float(ed.get("score_ponderado", 0))
            self.assertAlmostEqual(atual, esperado, delta=0.01, msg=f"Score divergente no edital {id_ed}")

            dias = ag.calcular_dias_restantes(ed.get("prazo_submissao", ""))
            decisao = ed.get("decisao_recomendada", "")
            if dias is not None and dias < 0:
                self.assertIn("NO-GO", decisao, f"Edital vencido ({ed.get('prazo_submissao')}) marcado como ativo em {id_ed}")

    def test_04_seguranca_csv_e_servidor_local(self):
        """Verifica proteções contra CSV Formula Injection e Path Traversal no servidor local."""
        self.assertEqual(ag._sanitizar_celula_csv("=CMD|' /C calc'!A0"), "'=CMD|' /C calc'!A0")
        self.assertEqual(ag._sanitizar_celula_csv("+10+20"), "'+10+20")
        self.assertEqual(ag._sanitizar_celula_csv("-2+5"), "'-2+5")
        self.assertEqual(ag._sanitizar_celula_csv("@SUM(A1:A2)"), "'@SUM(A1:A2)")

        ps1_txt = (BASE_DIR / "servidor_local.ps1").read_text(encoding="utf-8")
        self.assertIn("StartsWith($frontendDirFull", ps1_txt, "Proteção Path Traversal ausente em servidor_local.ps1")
        self.assertIn("X-Content-Type-Options", ps1_txt, "Header X-Content-Type-Options ausente em servidor_local.ps1")
        self.assertIn("Permissions-Policy", ps1_txt, "Header Permissions-Policy ausente em servidor_local.ps1")

        html_txt = (BASE_DIR / "frontend" / "index.html").read_text(encoding="utf-8")
        js_txt = (BASE_DIR / "frontend" / "app.js").read_text(encoding="utf-8")
        self.assertIn("Content-Security-Policy", html_txt, "Meta CSP ausente em frontend/index.html")
        self.assertIn("sanitizarUrlSegura", js_txt, "Sanitização de protocolo URL ausente em frontend/app.js")
        self.assertIn("x-goog-api-key", js_txt, "Chave Gemini deve ser enviada no header x-goog-api-key e não na URL")
        self.assertNotIn("ghp_", js_txt + html_txt, "Token GitHub vazado no frontend!")

    def test_05_frontend_dom_e_responsividade_mobile(self):
        """Garante que todos os IDs usados pelo JS existem no HTML e que as regras mobile estão ativas."""
        html_txt = (BASE_DIR / "frontend" / "index.html").read_text(encoding="utf-8")
        js_txt = (BASE_DIR / "frontend" / "app.js").read_text(encoding="utf-8")
        css_txt = (BASE_DIR / "frontend" / "style.css").read_text(encoding="utf-8")

        ids_js = set(re.findall(r"getElementById\('([^']+)'\)", js_txt))
        ids_html = set(re.findall(r'id="([^"]+)"', html_txt))
        faltando = ids_js - ids_html - {"modalPublico"}
        self.assertFalse(faltando, f"IDs referenciados no app.js mas ausentes no index.html: {faltando}")

        self.assertEqual(css_txt.count("{"), css_txt.count("}"), "Chaves desbalanceadas no frontend/style.css")
        self.assertEqual(js_txt.count("{"), js_txt.count("}"), "Chaves desbalanceadas no frontend/app.js")
        self.assertIn("@media (max-width: 768px)", css_txt, "Media query mobile ausente no style.css")
        self.assertIn("overflow-x: clip", css_txt, "Proteção de overflow horizontal mobile ausente no style.css")
        self.assertIn("100dvh", css_txt, "Altura dinâmica mobile (100dvh) ausente no modal")
        self.assertIn("construirIndiceVetorialRag", js_txt, "Motor RAG Vetorial TF-IDF ausente no app.js")
        self.assertIn("calcularPredicaoMlEdital", js_txt, "Motor Preditivo de Machine Learning ausente no app.js")
        self.assertIn("painelCopilotoRagMl", html_txt, "Painel do Copiloto RAG + ML ausente no index.html")
        self.assertIn("montarTextoConviteParceiro", js_txt, "Gerador de Convite para Parceiro ausente no app.js")
        self.assertIn("btnCopiarConviteParceiro", html_txt, "Botão de Convite para Parceiro ausente no index.html")
        self.assertIn("btnMapaBolso", html_txt, "Botão discreto Mapa Top 5 ausente no index.html")
        self.assertIn("abrirMapaBolsoTop5", js_txt, "Tela executiva Mapa Top 5 ausente no app.js")
        self.assertIn("btnToggleFiltros", html_txt, "Botão de encolher/expandir filtros ausente no index.html")
        self.assertIn("btnCopiarLinkEdital", html_txt, "Botão de link direto do edital ausente no index.html")
        self.assertIn('data-tipo="novos"', html_txt, "Chip de filtro Novos (7d) ausente no index.html")
        self.assertTrue(hasattr(ag, "detectar_retificacao_edital"), "Detector de retificações ausente em agente_editais_cais.py")
        self.assertTrue(hasattr(ag, "atualizar_saude_fontes"), "Monitor de saúde das fontes ausente em agente_editais_cais.py")
        self.assertTrue(hasattr(ag, "obter_top5_vigentes_cais"), "Gerador do Top 5 semanal ausente em agente_editais_cais.py")
        self.assertIn("DTEND;VALUE=DATE:${dtFim}", js_txt, "Evento .ics deve usar DTEND exclusivo (dia seguinte, RFC 5545)")
        self.assertTrue(hasattr(ag, "io"), "Módulo padrão 'io' deve estar importado em agente_editais_cais.py para leitura de PDF")
        self.assertEqual(ag._extrair_texto_pdf_bytes(b"not-a-pdf"), "", "Extrator de PDF deve falhar de forma controlada sem NameError")

    def test_06_workflow_github_actions(self):
        """Verifica se o workflow diário executa os testes antes de publicar e não bloqueia o build do GitHub Pages."""
        wf_txt = (BASE_DIR / ".github" / "workflows" / "monitor_editais.yml").read_text(encoding="utf-8")
        self.assertIn("unittest", wf_txt, "O workflow diário deve rodar a suíte de testes antes de publicar")
        # O commit da branch gh-pages não pode ter [skip ci], senão o GitHub Pages ignora o deploy do site
        linhas_gh_pages = wf_txt.split("gh-pages")[-2] if "gh-pages" in wf_txt else ""
        self.assertNotIn("[skip ci]", linhas_gh_pages, "O commit na branch gh-pages não deve conter [skip ci]")


if __name__ == "__main__":
    unittest.main(verbosity=2)
