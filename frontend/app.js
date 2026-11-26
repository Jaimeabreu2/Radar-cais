/**
 * RADAR CAIS — CONTROLLER JAVASCRIPT ULTRA DIDÁTICO & INTUITIVO (10/10)
 * Instituto CAIS (Centro Ágil de Inovação e Saber)
 * Interface limpa: Cards escaneáveis na tela inicial e Master Pop-up com detalhes completos.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado global da aplicação
  let editais = [];
  let editaisFiltrados = [];
  let editalSelecionado = null;
  let modoVisualizacao = 'cards'; // 'cards', 'tabela', 'cronograma' ou 'pipeline'
  let varreduraEmProgresso = false;
  let filtrarApenasFavoritos = false;
  let filtrarApenasNovos7d = false;
  const CHAVE_STORAGE_GESTAO = 'radar_cais_gestao_v1';
  let gestaoInterna = carregarGestaoLocal();

  // Elementos da Interface
  const painelInicialLimpo = document.getElementById('painelInicialLimpo');
  const painelFiltros = document.getElementById('painelFiltros');
  const areaResultados = document.getElementById('areaResultados');
  const gridCartoes = document.getElementById('gridCartoes');
  const wrapperTabela = document.getElementById('wrapperTabela');
  const corpoTabela = document.getElementById('corpoTabela');
  const wrapperCronograma = document.getElementById('wrapperCronograma');
  const wrapperPipeline = document.getElementById('wrapperPipeline');
  const estadoVazio = document.getElementById('estadoVazio');
  const contadorResultados = document.getElementById('contadorResultados');

  // Guia 1, 2, 3 retrátil
  const btnToggleGuia = document.getElementById('btnToggleGuia');
  const gridPassos = document.getElementById('gridPassos');
  const textoToggleGuia = document.getElementById('textoToggleGuia');

  // Filtros e busca
  const campoBusca = document.getElementById('campoBusca');
  const btnLimparBusca = document.getElementById('btnLimparBusca');
  const dicaAtalhoBusca = document.getElementById('dicaAtalhoBusca');
  const chipsContainer = document.getElementById('chipsContainer');
  const filtroDecisao = document.getElementById('filtroDecisao');
  const filtroOrgao = document.getElementById('filtroOrgao');
  const filtroPrazo = document.getElementById('filtroPrazo');
  const filtroLaboratorio = document.getElementById('filtroLaboratorio');
  const selectOrdenacao = document.getElementById('selectOrdenacao');
  const chkOcultarEncerrados = document.getElementById('chkOcultarEncerrados');
  const btnResetarFiltros = document.getElementById('btnResetarFiltros');
  const btnLimparFiltrosTopo = document.getElementById('btnLimparFiltrosTopo');
  const btnToggleFiltros = document.getElementById('btnToggleFiltros');
  const textoToggleFiltros = document.getElementById('textoToggleFiltros');
  const corpoPainelFiltros = document.getElementById('corpoPainelFiltros');

  // Cards KPI Clicáveis
  const cardKpiTotal = document.getElementById('cardKpiTotal');
  const cardKpiGo = document.getElementById('cardKpiGo');
  const cardKpiUrgentes = document.getElementById('cardKpiUrgentes');

  // Alternadores e botões de ação
  const btnModoCards = document.getElementById('btnModoCards');
  const btnModoTabela = document.getElementById('btnModoTabela');
  const btnModoCronograma = document.getElementById('btnModoCronograma');
  const btnModoPipeline = document.getElementById('btnModoPipeline');
  const btnVarreduraTopo = document.getElementById('btnVarreduraTopo');
  const btnIniciarVarreduraCentral = document.getElementById('btnIniciarVarreduraCentral');
  const btnExportarCsv = document.getElementById('btnExportarCsv');
  const btnRelatorioExecutivo = document.getElementById('btnRelatorioExecutivo');
  const btnMapaBolso = document.getElementById('btnMapaBolso');

  // Cards de Métricas (KPIs)
  const kpiTotal = document.getElementById('kpiTotal');
  const kpiGo = document.getElementById('kpiGo');
  const kpiUrgentes = document.getElementById('kpiUrgentes');
  const kpiMediaScore = document.getElementById('kpiMediaScore');
  const kpiOrgaos = document.getElementById('kpiOrgaos');

  // Status de conexão / varredura
  const textoStatus = document.getElementById('textoStatus');
  const pontoStatus = document.getElementById('pontoStatus');

  // Master Pop-up Modal (Visualização rica e didática)
  const fundoModal = document.getElementById('fundoModal');
  const btnFecharModal = document.getElementById('btnFecharModal');
  const btnFavoritoModal = document.getElementById('btnFavoritoModal');
  const btnEditalAnterior = document.getElementById('btnEditalAnterior');
  const btnEditalProximo = document.getElementById('btnEditalProximo');
  const indiceNavModal = document.getElementById('indiceNavModal');
  const btnLinkOficial = document.getElementById('btnLinkOficial');
  const btnPortalOrgao = document.getElementById('btnPortalOrgao');
  const btnCopiarLinkEdital = document.getElementById('btnCopiarLinkEdital');
  const btnCopiarResumo = document.getElementById('btnCopiarResumo');
  const btnGerarMinuta = document.getElementById('btnGerarMinuta');
  const btnTogglePreviaConvite = document.getElementById('btnTogglePreviaConvite');
  const btnCopiarConviteParceiro = document.getElementById('btnCopiarConviteParceiro');
  const boxPreviaConviteParceiro = document.getElementById('boxPreviaConviteParceiro');
  const textareaConviteParceiro = document.getElementById('textareaConviteParceiro');
  const abaBtnEstrategia = document.getElementById('abaBtnEstrategia');
  const abaBtnNotas = document.getElementById('abaBtnNotas');
  const abaBtnChecklist = document.getElementById('abaBtnChecklist');
  const painelAbaEstrategia = document.getElementById('painelAbaEstrategia');
  const painelAbaNotas = document.getElementById('painelAbaNotas');
  const painelAbaChecklist = document.getElementById('painelAbaChecklist');

  // Elementos da Aba 3 (Checklist & Gestão Interna)
  const selectEtapaFunilModal = document.getElementById('selectEtapaFunilModal');
  const inputResponsavelModal = document.getElementById('inputResponsavelModal');
  const inputNotasInternasModal = document.getElementById('inputNotasInternasModal');
  const btnSalvarGestaoModal = document.getElementById('btnSalvarGestaoModal');
  const btnAdicionarAgendaModal = document.getElementById('btnAdicionarAgendaModal');
  const listaItensChecklist = document.getElementById('listaItensChecklist');
  const badgeProgressoChecklist = document.getElementById('badgeProgressoChecklist');
  const labelChecklistOrgao = document.getElementById('labelChecklistOrgao');

  // Notificações Toast
  const containerToasts = document.getElementById('containerToasts');

  // Elementos do Copiloto IA (RAG + LLM) & Motor Preditivo (Machine Learning)
  const btnAbrirCopilotoTopo = document.getElementById('btnAbrirCopilotoTopo');
  const painelCopilotoRagMl = document.getElementById('painelCopilotoRagMl');
  const btnToggleCorpoCopiloto = document.getElementById('btnToggleCorpoCopiloto');
  const textoToggleCopiloto = document.getElementById('textoToggleCopiloto');
  const corpoCopilotoRagMl = document.getElementById('corpoCopilotoRagMl');
  const btnConfigGeminiKey = document.getElementById('btnConfigGeminiKey');
  const labelStatusGemini = document.getElementById('labelStatusGemini');
  const boxConfigGemini = document.getElementById('boxConfigGemini');
  const inputChaveGeminiUser = document.getElementById('inputChaveGeminiUser');
  const btnSalvarChaveGemini = document.getElementById('btnSalvarChaveGemini');
  const btnRemoverChaveGemini = document.getElementById('btnRemoverChaveGemini');
  const btnAbaAssistenteBusca = document.getElementById('btnAbaAssistenteBusca');
  const btnAbaAssistentePrioridades = document.getElementById('btnAbaAssistentePrioridades');
  const abaAssistenteBusca = document.getElementById('abaAssistenteBusca');
  const abaAssistentePrioridades = document.getElementById('abaAssistentePrioridades');
  const chipsPromptsRag = document.getElementById('chipsPromptsRag');
  const inputPerguntaRag = document.getElementById('inputPerguntaRag');
  const btnExecutarRag = document.getElementById('btnExecutarRag');
  const resultadoRagContainer = document.getElementById('resultadoRagContainer');
  const listaTopRoiMl = document.getElementById('listaTopRoiMl');
  const resumoGargalosMl = document.getElementById('resumoGargalosMl');
  const boxPredicaoMlModal = document.getElementById('boxPredicaoMlModal');
  const CHAVE_STORAGE_GEMINI = 'radar_cais_gemini_api_key_v1';
  let indiceVetorialRag = null;

  // Inicialização
  inicializar();

  function inicializar() {
    configurarEventos();
    carregarDados();
  }

  function configurarEventos() {
    // Busca em tempo real
    campoBusca.addEventListener('input', () => {
      const temTexto = Boolean(campoBusca.value);
      btnLimparBusca.style.display = temTexto ? 'block' : 'none';
      if (dicaAtalhoBusca) dicaAtalhoBusca.style.display = temTexto ? 'none' : 'inline-block';
      aplicarFiltros();
    });

    btnLimparBusca.addEventListener('click', () => {
      campoBusca.value = '';
      btnLimparBusca.style.display = 'none';
      if (dicaAtalhoBusca) dicaAtalhoBusca.style.display = 'inline-block';
      aplicarFiltros();
      campoBusca.focus();
    });

    // Atalho "/" para focar na busca rapidamente (expande filtros se estiverem recolhidos)
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== campoBusca && !fundoModal.classList.contains('aberto')) {
        const tag = (document.activeElement && document.activeElement.tagName) || '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          e.preventDefault();
          if (corpoPainelFiltros && corpoPainelFiltros.style.display === 'none' && btnToggleFiltros) {
            btnToggleFiltros.click();
          }
          campoBusca.focus();
        }
      }
    });

    // Filtros dropdown padrão
    filtroDecisao.addEventListener('change', () => {
      filtrarApenasFavoritos = false;
      if (filtroDecisao.value === 'NO-GO' && chkOcultarEncerrados) {
        chkOcultarEncerrados.checked = false;
      }
      sincronizarChipsComSelects();
      aplicarFiltros();
    });
    filtroOrgao.addEventListener('change', () => {
      filtrarApenasFavoritos = false;
      const valorOrg = filtroOrgao.value;
      if (chkOcultarEncerrados && chkOcultarEncerrados.checked && valorOrg) {
        const abertosDoOrgao = editais.filter(ed => {
          if (ed.orgao !== valorOrg) return false;
          const d = calcularDiasRestantes(ed.prazo_submissao);
          const dec = (ed.decisao_recomendada || '').toUpperCase();
          return !((d !== null && d < 0) || dec.includes('ENCERRADO'));
        });
        const totalDoOrgao = editais.filter(ed => ed.orgao === valorOrg).length;
        if (abertosDoOrgao.length === 0 && totalDoOrgao > 0) {
          chkOcultarEncerrados.checked = false;
          exibirToast(`Exibindo histórico de ${totalDoOrgao} chamadas mapeadas de ${valorOrg}.`, 'info');
        }
      }
      sincronizarChipsComSelects();
      aplicarFiltros();
    });
    filtroPrazo.addEventListener('change', () => {
      filtrarApenasFavoritos = false;
      sincronizarChipsComSelects();
      aplicarFiltros();
    });
    if (filtroLaboratorio) {
      filtroLaboratorio.addEventListener('change', () => {
        sincronizarChipsComSelects();
        aplicarFiltros();
      });
    }
    selectOrdenacao.addEventListener('change', aplicarFiltros);
    if (chkOcultarEncerrados) {
      chkOcultarEncerrados.addEventListener('change', aplicarFiltros);
    }

    if (btnResetarFiltros) {
      btnResetarFiltros.addEventListener('click', resetarFiltros);
    }
    if (btnLimparFiltrosTopo) {
      btnLimparFiltrosTopo.addEventListener('click', resetarFiltros);
    }

    // Encolher / Expandir painel de filtros para visual ainda mais limpo
    if (btnToggleFiltros && corpoPainelFiltros) {
      btnToggleFiltros.addEventListener('click', () => {
        const estavaOculto = corpoPainelFiltros.style.display === 'none';
        corpoPainelFiltros.style.display = estavaOculto ? 'flex' : 'none';
        painelFiltros.classList.toggle('recolhido', !estavaOculto);
        btnToggleFiltros.setAttribute('aria-expanded', estavaOculto ? 'true' : 'false');
        if (textoToggleFiltros) {
          textoToggleFiltros.textContent = estavaOculto ? '▲ Encolher filtros' : '▼ Mostrar filtros';
        }
      });
    }

    // Suporte a Deep Link (#edital=ID) ao mudar a URL
    window.addEventListener('hashchange', abrirEditalPorHashUrl);

    // Clique e Teclado (Enter/Espaço) nos KPIs Superiores para Filtragem Rápida
    const vincularKpiAtalho = (el, tipo) => {
      if (!el) return;
      el.addEventListener('click', () => acionarChipAtalho(tipo));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          acionarChipAtalho(tipo);
        }
      });
    };
    vincularKpiAtalho(cardKpiTotal, 'todos');
    vincularKpiAtalho(cardKpiGo, 'go');
    vincularKpiAtalho(cardKpiUrgentes, 'urgente');

    // Toggle do Guia Metodológico
    if (btnToggleGuia && gridPassos) {
      btnToggleGuia.addEventListener('click', () => {
        const estaOculto = gridPassos.style.display === 'none';
        gridPassos.style.display = estaOculto ? 'grid' : 'none';
        if (textoToggleGuia) {
          textoToggleGuia.textContent = estaOculto ? 'Ocultar Critérios' : 'Entender Nota';
        }
      });
    }

    // Chips de Filtro Rápido (1 clique)
    if (chipsContainer) {
      chipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip-filtro');
        if (!chip) return;

        // Atualiza estado visual dos chips
        chipsContainer.querySelectorAll('.chip-filtro').forEach(c => c.classList.remove('ativo'));
        chip.classList.add('ativo');

        const tipo = chip.dataset.tipo;
        const valor = chip.dataset.valor;

        if (tipo === 'todos') {
          filtrarApenasFavoritos = false;
          filtrarApenasNovos7d = false;
          filtroDecisao.value = '';
          filtroOrgao.value = '';
          filtroPrazo.value = '';
          if (filtroLaboratorio) filtroLaboratorio.value = '';
        } else if (tipo === 'go') {
          filtrarApenasFavoritos = false;
          filtrarApenasNovos7d = false;
          filtroDecisao.value = 'GO';
          filtroOrgao.value = '';
          filtroPrazo.value = '';
        } else if (tipo === 'novos') {
          filtrarApenasFavoritos = false;
          filtrarApenasNovos7d = true;
          filtroDecisao.value = '';
          filtroOrgao.value = '';
          filtroPrazo.value = '';
        } else if (tipo === 'urgente') {
          filtrarApenasFavoritos = false;
          filtrarApenasNovos7d = false;
          filtroPrazo.value = 'urgente';
          filtroDecisao.value = '';
          filtroOrgao.value = '';
        } else if (tipo === 'favoritos') {
          filtrarApenasFavoritos = true;
          filtrarApenasNovos7d = false;
          filtroDecisao.value = '';
          filtroOrgao.value = '';
          filtroPrazo.value = '';
          if (chkOcultarEncerrados && chkOcultarEncerrados.checked) {
            const favsTotal = editais.filter(e => Boolean(obterGestaoEdital(e.id_edital).favorito)).length;
            if (favsTotal === 0) {
              exibirToast('Clique na estrela (☆) em qualquer edital para adicioná-lo aos Favoritos da equipe CAIS!', 'info');
            }
          }
        } else if (tipo === 'orgao') {
          filtrarApenasFavoritos = false;
          filtrarApenasNovos7d = false;
          filtroOrgao.value = valor || '';
          filtroDecisao.value = '';
          filtroPrazo.value = '';
          // Se o órgão selecionado possui editais na base, mas todos estão encerrados e "Ocultar encerrados" está marcado, desmarca automaticamente
          if (chkOcultarEncerrados && chkOcultarEncerrados.checked && valor) {
            const abertosDoOrgao = editais.filter(ed => {
              if (ed.orgao !== valor) return false;
              const d = calcularDiasRestantes(ed.prazo_submissao);
              const dec = (ed.decisao_recomendada || '').toUpperCase();
              return !((d !== null && d < 0) || dec.includes('ENCERRADO'));
            });
            const totalDoOrgao = editais.filter(ed => ed.orgao === valor).length;
            if (abertosDoOrgao.length === 0 && totalDoOrgao > 0) {
              chkOcultarEncerrados.checked = false;
              exibirToast(`Exibindo histórico de ${totalDoOrgao} chamadas mapeadas de ${valor}.`, 'info');
            }
          }
        }

        aplicarFiltros();
      });
    }

    // Alternar Visualização Cards vs Planilha vs Cronograma vs Pipeline
    btnModoCards.addEventListener('click', () => alternarModo('cards'));
    btnModoTabela.addEventListener('click', () => alternarModo('tabela'));
    if (btnModoCronograma) {
      btnModoCronograma.addEventListener('click', () => alternarModo('cronograma'));
    }
    if (btnModoPipeline) {
      btnModoPipeline.addEventListener('click', () => alternarModo('pipeline'));
    }

    // Relatório Executivo para Reunião (Impressão / PDF) e Mapa de Bolso Top 5
    if (btnRelatorioExecutivo) {
      btnRelatorioExecutivo.addEventListener('click', gerarRelatorioExecutivoImpressao);
    }
    if (btnMapaBolso) {
      btnMapaBolso.addEventListener('click', abrirMapaBolsoTop5);
    }

    // Botões de Varredura Web Oficial
    btnVarreduraTopo.addEventListener('click', executarVarreduraAoVivo);
    if (btnIniciarVarreduraCentral) {
      btnIniciarVarreduraCentral.addEventListener('click', executarVarreduraAoVivo);
    }

    // Exportação CSV (respeita filtros ativos na tela; sem filtros, usa API local ou gera CSV client-side)
    btnExportarCsv.addEventListener('click', async () => {
      if (editais.length === 0) {
        exibirToast('Nenhum edital disponível para exportar.', 'info');
        return;
      }
      if (editaisFiltrados.length > 0 && editaisFiltrados.length < editais.length) {
        exportarCsvClientSide();
        return;
      }
      try {
        const checkApi = await fetch('/api/download/csv', { method: 'HEAD' });
        if (checkApi.ok) {
          window.location.href = '/api/download/csv';
          return;
        }
      } catch (e) {
        // Fallback client-side abaixo (GitHub Pages / Hospedagem Estática)
      }
      exportarCsvClientSide();
    });

    // Fechamento do Master Modal
    btnFecharModal.addEventListener('click', fecharModal);
    fundoModal.addEventListener('click', (e) => {
      if (e.target === fundoModal) fecharModal();
    });

    document.addEventListener('keydown', (e) => {
      if (!fundoModal.classList.contains('aberto')) return;
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (e.key === 'Escape') {
        fecharModal();
      } else if (e.key === 'ArrowLeft' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        navegarEditalModal(-1);
      } else if (e.key === 'ArrowRight' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        navegarEditalModal(1);
      }
    });

    if (btnEditalAnterior) {
      btnEditalAnterior.addEventListener('click', () => navegarEditalModal(-1));
    }
    if (btnEditalProximo) {
      btnEditalProximo.addEventListener('click', () => navegarEditalModal(1));
    }
    if (btnFavoritoModal) {
      btnFavoritoModal.addEventListener('click', () => {
        if (editalSelecionado) {
          alternarFavoritoEdital(editalSelecionado);
          atualizarEstadoBotaoFavoritoModal(editalSelecionado);
        }
      });
    }

    // Abas do Master Modal
    if (abaBtnEstrategia && abaBtnNotas) {
      abaBtnEstrategia.addEventListener('click', () => alternarAbaModal('estrategia'));
      abaBtnNotas.addEventListener('click', () => alternarAbaModal('notas'));
    }
    if (abaBtnChecklist) {
      abaBtnChecklist.addEventListener('click', () => alternarAbaModal('checklist'));
    }

    // Ações da Aba 3 (Salvar Gestão Interna + Auto-save imediato + Exportar Agenda .ics)
    if (btnSalvarGestaoModal) {
      btnSalvarGestaoModal.addEventListener('click', () => salvarGestaoDoModal(true));
    }
    if (selectEtapaFunilModal) {
      selectEtapaFunilModal.addEventListener('change', () => salvarGestaoDoModal(true));
    }
    if (inputResponsavelModal) {
      inputResponsavelModal.addEventListener('input', () => salvarGestaoDoModal(false));
      inputResponsavelModal.addEventListener('change', () => salvarGestaoDoModal(false));
    }
    if (inputNotasInternasModal) {
      inputNotasInternasModal.addEventListener('input', () => salvarGestaoDoModal(false));
      inputNotasInternasModal.addEventListener('change', () => salvarGestaoDoModal(false));
    }
    if (btnAdicionarAgendaModal) {
      btnAdicionarAgendaModal.addEventListener('click', () => {
        if (editalSelecionado) exportarEventoCalendarioIcs(editalSelecionado);
      });
    }

    // Copiar Resumo Executivo, Minuta Técnica 1-Page e Convite para Parceiro
    btnCopiarResumo.addEventListener('click', copiarResumoDidatico);
    if (btnGerarMinuta) {
      btnGerarMinuta.addEventListener('click', () => {
        if (editalSelecionado) gerarMinutaTecnicaProjeto(editalSelecionado);
      });
    }
    if (btnTogglePreviaConvite && boxPreviaConviteParceiro) {
      btnTogglePreviaConvite.addEventListener('click', () => {
        const estavaOculto = boxPreviaConviteParceiro.style.display === 'none';
        boxPreviaConviteParceiro.style.display = estavaOculto ? 'block' : 'none';
        btnTogglePreviaConvite.setAttribute('aria-expanded', estavaOculto ? 'true' : 'false');
        btnTogglePreviaConvite.textContent = estavaOculto ? 'Ocultar texto' : 'Ver texto';
        if (estavaOculto && textareaConviteParceiro && editalSelecionado && !textareaConviteParceiro.value.trim()) {
          textareaConviteParceiro.value = montarTextoConviteParceiro(editalSelecionado);
        }
      });
    }
    if (btnCopiarConviteParceiro) {
      btnCopiarConviteParceiro.addEventListener('click', () => {
        if (editalSelecionado) copiarConviteParceiro(editalSelecionado);
      });
    }
    if (btnCopiarLinkEdital) {
      btnCopiarLinkEdital.addEventListener('click', () => {
        if (!editalSelecionado) return;
        const linkDireto = obterLinkDiretoEdital(editalSelecionado);
        copiarParaAreaDeTransferencia(
          linkDireto,
          '🔗 Link direto deste edital copiado! Quem abrir vai direto para esta janela.'
        );
      });
    }

    // Eventos do Copiloto CAIS (RAG + LLM) & Motor Preditivo (Machine Learning)
    configurarEventosCopilotoRagMl();
  }

  function alternarAbaModal(aba) {
    const corpoModalEl = document.getElementById('corpoModal') || document.querySelector('.corpo-modal');
    const todasAbas = [
      { btn: abaBtnEstrategia, painel: painelAbaEstrategia, id: 'estrategia' },
      { btn: abaBtnNotas, painel: painelAbaNotas, id: 'notas' },
      { btn: abaBtnChecklist, painel: painelAbaChecklist, id: 'checklist' },
    ];
    todasAbas.forEach(({ btn, painel, id }) => {
      if (!btn || !painel) return;
      const ativo = id === aba;
      btn.classList.toggle('ativa', ativo);
      painel.classList.toggle('ativo', ativo);
      painel.style.display = ativo ? 'block' : 'none';
    });
    if (corpoModalEl) {
      corpoModalEl.scrollTop = 0;
    }
  }

  function acionarChipAtalho(tipo) {
    if (!chipsContainer) return;
    const chipAlvo = chipsContainer.querySelector(`[data-tipo="${tipo}"]`);
    if (chipAlvo) {
      chipAlvo.click();
      painelFiltros.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function sincronizarChipsComSelects() {
    if (!chipsContainer) return;
    const chips = chipsContainer.querySelectorAll('.chip-filtro');
    chips.forEach(c => c.classList.remove('ativo'));

    const dec = filtroDecisao.value;
    const org = filtroOrgao.value;
    const prz = filtroPrazo.value;
    const lab = filtroLaboratorio ? filtroLaboratorio.value : '';

    if (cardKpiTotal) cardKpiTotal.classList.remove('kpi-ativo');
    if (cardKpiGo) cardKpiGo.classList.remove('kpi-ativo');
    if (cardKpiUrgentes) cardKpiUrgentes.classList.remove('kpi-ativo');

    if (filtrarApenasFavoritos) {
      const chipFav = chipsContainer.querySelector('[data-tipo="favoritos"]');
      if (chipFav) chipFav.classList.add('ativo');
    } else if (filtrarApenasNovos7d) {
      const chipNovos = chipsContainer.querySelector('[data-tipo="novos"]');
      if (chipNovos) chipNovos.classList.add('ativo');
    } else if (!dec && !org && !prz && !lab) {
      const chipTodos = chipsContainer.querySelector('[data-tipo="todos"]');
      if (chipTodos) chipTodos.classList.add('ativo');
    } else if (dec === 'GO' && !org && !prz) {
      const chipGo = chipsContainer.querySelector('[data-tipo="go"]');
      if (chipGo) chipGo.classList.add('ativo');
      if (cardKpiGo) cardKpiGo.classList.add('kpi-ativo');
    } else if (prz === 'urgente' && !dec && !org) {
      const chipUrg = chipsContainer.querySelector('[data-tipo="urgente"]');
      if (chipUrg) chipUrg.classList.add('ativo');
      if (cardKpiUrgentes) cardKpiUrgentes.classList.add('kpi-ativo');
    } else if (org && !dec && !prz) {
      const chipOrg = chipsContainer.querySelector(`[data-tipo="orgao"][data-valor="${org}"]`);
      if (chipOrg) chipOrg.classList.add('ativo');
    }
  }

  function obterDataHojeBR() {
    const agora = new Date();
    const d = String(agora.getDate()).padStart(2, '0');
    const m = String(agora.getMonth() + 1).padStart(2, '0');
    const y = agora.getFullYear();
    return `${d}/${m}/${y}`;
  }

  async function carregarDados() {
    const ts = Date.now();
    try {
      const res = await fetch(`/api/editais?t=${ts}`, { cache: 'no-store' });
      if (res.ok) {
        const dados = await res.json();
        processarDados(dados);
        return;
      }
    } catch (e) {
      console.log('API local indisponível, tentando historico_editais.json...');
    }

    try {
      const resJson = await fetch(`historico_editais.json?t=${ts}`, { cache: 'no-store' });
      if (resJson.ok) {
        const dados = await resJson.json();
        processarDados(dados);
        return;
      }
    } catch (e) {
      console.log('Sem JSON relativo direto, tentando no nível superior...');
    }

    try {
      const resJsonPai = await fetch(`../historico_editais.json?t=${ts}`, { cache: 'no-store' });
      if (resJsonPai.ok) {
        const dados = await resJsonPai.json();
        processarDados(dados);
        return;
      }
    } catch (e) {
      console.log('Sem JSON no nível pai.');
    }

    // Inicia limpo se não houver dados
    processarDados({ editais: {}, ultima_execucao: new Date().toISOString() });
  }

  function processarDados(dados) {
    if (dados && dados.gestao_interna && typeof dados.gestao_interna === 'object') {
      gestaoInterna = { ...dados.gestao_interna, ...gestaoInterna };
      salvarGestaoLocal(false);
    }
    const hojeBR = obterDataHojeBR();
    const editaisObj = dados.editais || {};
    editais = Object.values(editaisObj).map((ed) => {
      const copia = { ...ed };
      copia.data_descoberta = copia.data_descoberta || hojeBR;
      copia.data_atualizacao = copia.data_atualizacao || copia.data_descoberta;

      const prazoStr = String(copia.prazo_submissao || '').trim();
      if (!prazoStr) {
        copia.prazo_submissao = 'Consultar cronograma no edital';
      }
      const diasAtuais = calcularDiasRestantes(copia.prazo_submissao);
      if (diasAtuais !== null && diasAtuais < 0) {
        copia.decisao_recomendada = 'NO-GO (Prazo Encerrado)';
      }
      return copia;
    });

    if (editais.length === 0) {
      painelInicialLimpo.style.display = 'block';
      painelFiltros.style.display = 'none';
      if (painelCopilotoRagMl) painelCopilotoRagMl.style.display = 'none';
      areaResultados.style.display = 'none';
      textoStatus.textContent = `Pronto (${hojeBR}) — Aguardando Varredura`;
      pontoStatus.className = 'ponto-status amarelo';
      btnExportarCsv.style.opacity = '0.6';
    } else {
      painelInicialLimpo.style.display = 'none';
      painelFiltros.style.display = 'block';
      if (painelCopilotoRagMl) painelCopilotoRagMl.style.display = 'block';
      areaResultados.style.display = 'block';
      btnExportarCsv.style.opacity = '1';
    }

    atualizarKpis(dados);
    popularFiltroOrgaos();
    construirIndiceVetorialRag();
    renderizarPainelPreditivoMl();
    executarConsultaRag(
      (inputPerguntaRag && inputPerguntaRag.value) ||
      'Quais editais abertos financiam Inteligência Artificial, Ciência de Dados ou Semicondutores sem exigir contrapartida financeira?',
      false
    );
    aplicarFiltros();
    abrirEditalPorHashUrl();
  }

  function obterLinkDiretoEdital(ed) {
    if (!ed || !ed.id_edital) return 'https://jaimeabreu2.github.io/radar-cais/';
    const base = window.location.protocol.startsWith('http')
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://jaimeabreu2.github.io/radar-cais/';
    return `${base}#edital=${encodeURIComponent(ed.id_edital)}`;
  }

  function abrirEditalPorHashUrl() {
    const hash = String(window.location.hash || '');
    const m = hash.match(/#edital=([a-zA-Z0-9_\-]+)/);
    if (!m || editais.length === 0) return;
    const idAlvo = decodeURIComponent(m[1]);
    const edAlvo = editais.find(e => e.id_edital === idAlvo);
    if (edAlvo) {
      abrirModal(edAlvo);
    }
  }

  function ehDescobertoUltimos7Dias(ed) {
    if (!ed || !ed.data_descoberta) return false;
    const dias = calcularDiasRestantes(ed.data_descoberta);
    return dias !== null && dias <= 0 && dias >= -7;
  }

  function popularFiltroOrgaos() {
    const orgaos = [...new Set(editais.map(e => e.orgao).filter(Boolean))].sort();
    const atual = filtroOrgao.value;
    filtroOrgao.innerHTML = '<option value="">Todos os Órgãos</option>';
    orgaos.forEach(org => {
      const opt = document.createElement('option');
      opt.value = org;
      opt.textContent = org;
      filtroOrgao.appendChild(opt);
    });
    filtroOrgao.value = atual;
  }

  function calcularDiasRestantes(prazoStr) {
    if (!prazoStr) return null;
    const match = String(prazoStr).match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (match) {
      const [_, dia, mes, ano] = match;
      const dataPrazo = new Date(Number(ano), Number(mes) - 1, Number(dia), 0, 0, 0, 0);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const diffTime = dataPrazo.getTime() - hoje.getTime();
      return Math.round(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
  }

  function formatarPrazoDidatico(prazoStr, dias) {
    if (!prazoStr) return 'Consultar cronograma no edital';
    if (dias === null) return prazoStr;
    if (dias < 0) return `${prazoStr} (Encerrado há ${Math.abs(dias)}d)`;
    if (dias === 0) return `${prazoStr} (Encerra Hoje!)`;
    if (dias === 1) return `${prazoStr} (Falta 1 dia)`;
    return `${prazoStr} (Faltam ${dias}d)`;
  }

  function atualizarKpis(dados) {
    const total = editais.length;
    const gos = editais.filter(e => {
      const dec = (e.decisao_recomendada || '').toUpperCase();
      return dec.includes('GO') && !dec.includes('NO-GO');
    }).length;

    let urgentes = 0;
    let somaScore = 0;
    const orgaosSet = new Set();

    editais.forEach(e => {
      const dias = calcularDiasRestantes(e.prazo_submissao);
      if (dias !== null && dias >= 0 && dias <= 7) {
        urgentes++;
      }
      somaScore += Number(e.score_ponderado || 0);
      if (e.orgao) orgaosSet.add(e.orgao);
    });

    const media = total > 0 ? (somaScore / total).toFixed(1) : '0.0';

    kpiTotal.textContent = total;
    kpiGo.textContent = gos;
    kpiUrgentes.textContent = urgentes;
    kpiMediaScore.innerHTML = `${media}<span class="kpi-max">/10</span>`;

    atualizarContadoresChips(total, gos, urgentes);

    const refData = (editais[0] && (editais[0].data_atualizacao || editais[0].data_descoberta)) || obterDataHojeBR();
    if (total === 0) {
      kpiOrgaos.textContent = 'Clique para puxar oportunidades oficiais';
    } else {
      const vigentesCount = editais.filter(e => {
        const d = calcularDiasRestantes(e.prazo_submissao);
        const dec = (e.decisao_recomendada || '').toUpperCase();
        return !((d !== null && d < 0) || dec.includes('ENCERRADO'));
      }).length;
      const histCount = total - vigentesCount;
      kpiOrgaos.textContent = `${vigentesCount} vigentes • ${histCount} histórico • ${orgaosSet.size} órgãos`;
    }

    if (dados && dados.ultima_execucao) {
      try {
        const dtExec = new Date(dados.ultima_execucao);
        if (!isNaN(dtExec.getTime())) {
          const dataFmt = dtExec.toLocaleDateString('pt-BR');
          const horaFmt = dtExec.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          textoStatus.textContent = `Última varredura: ${dataFmt} às ${horaFmt}`;
          pontoStatus.className = 'ponto-status verde';
          return;
        }
      } catch (err) {
        // Fallback abaixo
      }
    }
    textoStatus.textContent = `Base sincronizada (${refData})`;
    pontoStatus.className = 'ponto-status verde';
  }

  function editalEnvolvePetrobras(ed) {
    if (!ed) return false;
    const texto = `${ed.orgao || ''} ${ed.titulo || ''} ${ed.resumo_objetivo || ''} ${ed.parceiros_sugeridos || ''} ${ed.justificativa_cais || ''}`.toLowerCase();
    return texto.includes('petrobras') || texto.includes('cenpes');
  }

  function atualizarContadoresChips(total, gos, urgentes) {
    if (!chipsContainer) return;
    chipsContainer.querySelectorAll('.chip-filtro').forEach(chip => {
      if (!chip.dataset.rotuloBase) {
        chip.dataset.rotuloBase = chip.textContent.trim();
      }
      const base = chip.dataset.rotuloBase;
      const tipo = chip.dataset.tipo;
      const valor = chip.dataset.valor;
      let qtd = 0;

      if (tipo === 'todos') qtd = total;
      else if (tipo === 'go') qtd = gos;
      else if (tipo === 'novos') {
        qtd = editais.filter(e => ehDescobertoUltimos7Dias(e)).length;
      } else if (tipo === 'urgente') qtd = urgentes;
      else if (tipo === 'favoritos') {
        qtd = editais.filter(e => Boolean(obterGestaoEdital(e.id_edital).favorito)).length;
      } else if (tipo === 'orgao' && valor) {
        if (valor.toLowerCase() === 'petrobras') {
          qtd = editais.filter(e => editalEnvolvePetrobras(e)).length;
        } else {
          qtd = editais.filter(e => e.orgao === valor).length;
        }
      }

      chip.innerHTML = `${escapeHtml(base)}<span class="chip-contador">${qtd}</span>`;
    });
  }

  function aplicarFiltros() {
    if (editais.length === 0) return;

    const termo = (campoBusca.value || '').toLowerCase().trim();
    const decisao = filtroDecisao.value;
    const orgao = filtroOrgao.value;
    const prazo = filtroPrazo.value;
    const laboratorio = filtroLaboratorio ? filtroLaboratorio.value : '';
    const ordenacao = selectOrdenacao.value;

    editaisFiltrados = editais.filter(ed => {
      // Filtro de Favoritos da equipe CAIS
      if (filtrarApenasFavoritos) {
        const infoFav = obterGestaoEdital(ed.id_edital);
        if (!infoFav.favorito) return false;
      }

      // Filtro de Novos desta semana (últimos 7 dias)
      if (filtrarApenasNovos7d && !ehDescobertoUltimos7Dias(ed)) {
        return false;
      }

      // Filtro por Laboratório / Núcleo CAIS recomendado
      if (laboratorio && obterLaboratorioCais(ed) !== laboratorio) {
        return false;
      }

      // Busca por palavras-chave
      if (termo) {
        const textoGeral = [
          ed.titulo,
          ed.orgao,
          ed.resumo_objetivo,
          ed.ideia_projeto_cais,
          ed.parceiros_sugeridos,
          ed.publico_elegivel,
          ed.valor_financiado,
          ed.prazo_submissao
        ].join(' ').toLowerCase();

        if (!textoGeral.includes(termo)) return false;
      }

      // Decisão Semáforo
      if (decisao) {
        const dec = (ed.decisao_recomendada || '').toUpperCase();
        if (decisao === 'GO' && (!dec.includes('GO') || dec.includes('NO-GO'))) return false;
        if (decisao === 'AVALIAR' && !dec.includes('AVALIAR')) return false;
        if (decisao === 'NO-GO' && !dec.includes('NO-GO')) return false;
      }

      // Órgão (para Petrobras, inclui também editais em parceria/colaboração com FINEP, CNPq, Sebrae etc.)
      if (orgao) {
        if (orgao.toLowerCase() === 'petrobras') {
          if (!editalEnvolvePetrobras(ed)) return false;
        } else if (ed.orgao !== orgao) {
          return false;
        }
      }

      // Prazo / Urgência
      if (prazo) {
        const dias = calcularDiasRestantes(ed.prazo_submissao);
        if (dias === null || dias < 0) return false;
        if (prazo === 'urgente' && dias > 7) return false;
        if (prazo === 'quinzena' && dias > 15) return false;
        if (prazo === 'mes' && dias > 30) return false;
      }

      // Ocultar encerrados quando marcado
      if (chkOcultarEncerrados && chkOcultarEncerrados.checked) {
        const dias = calcularDiasRestantes(ed.prazo_submissao);
        const dec = (ed.decisao_recomendada || '').toUpperCase();
        if ((dias !== null && dias < 0) || dec.includes('ENCERRADO')) return false;
      }

      return true;
    });

    // Ordenação (sempre priorizando editais abertos antes dos encerrados por padrão)
    editaisFiltrados.sort((a, b) => {
      const diasA = calcularDiasRestantes(a.prazo_submissao);
      const diasB = calcularDiasRestantes(b.prazo_submissao);
      const encA = diasA !== null && diasA < 0 ? 1 : 0;
      const encB = diasB !== null && diasB < 0 ? 1 : 0;
      if (encA !== encB) return encA - encB;

      if (ordenacao === 'score_desc') {
        return (Number(b.score_ponderado) || 0) - (Number(a.score_ponderado) || 0);
      }
      if (ordenacao === 'orgao_asc') {
        return (a.orgao || '').localeCompare(b.orgao || '');
      }
      if (ordenacao === 'prazo_asc') {
        const pesoA = (diasA === null || diasA < 0) ? 9999 : diasA;
        const pesoB = (diasB === null || diasB < 0) ? 9999 : diasB;
        return pesoA - pesoB;
      }
      return 0;
    });

    const temFiltroAtivo = Boolean(termo || decisao || orgao || prazo || laboratorio || filtrarApenasFavoritos || filtrarApenasNovos7d || (chkOcultarEncerrados && !chkOcultarEncerrados.checked));
    if (btnLimparFiltrosTopo) {
      btnLimparFiltrosTopo.style.display = temFiltroAtivo ? 'inline-flex' : 'none';
    }
    sincronizarChipsComSelects();
    renderizarResultados();
  }

  function renderizarResultados() {
    const totalEncerrados = editais.filter(e => {
      const d = calcularDiasRestantes(e.prazo_submissao);
      const dec = (e.decisao_recomendada || '').toUpperCase();
      return (d !== null && d < 0) || dec.includes('ENCERRADO');
    }).length;
    const labelOcultar = document.getElementById('labelOcultarEncerrados');
    if (labelOcultar) {
      labelOcultar.textContent = totalEncerrados > 0 ? `Ocultar encerrados (${totalEncerrados})` : 'Ocultar encerrados';
    }

    const sufixoVigentes = (chkOcultarEncerrados && chkOcultarEncerrados.checked && totalEncerrados > 0)
      ? ` • ${totalEncerrados} encerrados ocultos`
      : '';
    contadorResultados.textContent = `Mostrando ${editaisFiltrados.length} de ${editais.length} oportunidades oficiais${sufixoVigentes}`;

    if (editaisFiltrados.length === 0) {
      gridCartoes.style.display = 'none';
      wrapperTabela.style.display = 'none';
      if (wrapperCronograma) wrapperCronograma.style.display = 'none';
      if (wrapperPipeline) wrapperPipeline.style.display = 'none';
      estadoVazio.style.display = 'block';
      return;
    }

    estadoVazio.style.display = 'none';
    gridCartoes.style.display = modoVisualizacao === 'cards' ? 'grid' : 'none';
    wrapperTabela.style.display = modoVisualizacao === 'tabela' ? 'block' : 'none';
    if (wrapperCronograma) wrapperCronograma.style.display = modoVisualizacao === 'cronograma' ? 'flex' : 'none';
    if (wrapperPipeline) wrapperPipeline.style.display = modoVisualizacao === 'pipeline' ? 'grid' : 'none';

    if (modoVisualizacao === 'cards') {
      renderizarCartoes();
    } else if (modoVisualizacao === 'tabela') {
      renderizarTabela();
    } else if (modoVisualizacao === 'cronograma') {
      renderizarCronograma();
    } else if (modoVisualizacao === 'pipeline') {
      renderizarPipeline();
    }
  }

  function resumirValorCard(valorStr) {
    if (!valorStr) return 'Consultar edital';
    const semParenteses = String(valorStr).replace(/\s*\([^)]*\)/g, '').trim();
    if (semParenteses.length > 36) {
      return semParenteses.substring(0, 34) + '…';
    }
    return semParenteses || valorStr;
  }

  function resumirPrazoCard(prazoStr, dias) {
    if (!prazoStr) return 'Consultar edital';
    const str = String(prazoStr);
    if (str.toLowerCase().includes('fluxo contínuo') || str.toLowerCase().includes('fluxo continuo')) {
      return 'Fluxo Contínuo';
    }
    const match = str.match(/(\d{2}\/\d{2}\/\d{4})/);
    const dataCurta = match ? match[1] : str;
    if (dias === null) return dataCurta;
    if (dias < 0) return `${dataCurta} (Encerrado)`;
    if (dias === 0) return `${dataCurta} (Hoje!)`;
    return `${dataCurta} (${dias}d)`;
  }

  /**
   * Renderiza os cartões limpos e minimalistas na tela principal:
   * Informações essenciais (Órgão, Semáforo, Nota, Título, Valor e Prazo),
   * botão rápido de cópia de resumo e botão "Ver Detalhes".
   */
  function renderizarCartoes() {
    gridCartoes.innerHTML = '';
    editaisFiltrados.forEach(ed => {
      const card = document.createElement('article');
      card.className = 'cartao-edital';

      const dias = calcularDiasRestantes(ed.prazo_submissao);
      const isUrgente = dias !== null && dias >= 0 && dias <= 7;
      const isEncerrado = dias !== null && dias < 0;
      const dec = (ed.decisao_recomendada || '').toUpperCase();
      const isGo = dec.includes('GO') && !dec.includes('NO-GO') && !isEncerrado;
      const isAvaliar = dec.includes('AVALIAR') && !isEncerrado;

      if (isEncerrado) card.classList.add('cartao-encerrado');
      else if (isGo) card.classList.add('cartao-go');
      else if (isAvaliar) card.classList.add('cartao-avaliar');
      else card.classList.add('cartao-encerrado');

      if (isUrgente) card.classList.add('cartao-urgente');

      // Tag Semáforo Executiva
      let badgeSemaforo = '';
      if (isEncerrado) {
        badgeSemaforo = '<span class="badge-tag badge-encerrado">● ENCERRADO</span>';
      } else if (isGo) {
        badgeSemaforo = '<span class="badge-tag badge-go">● GO!</span>';
      } else if (isAvaliar) {
        badgeSemaforo = '<span class="badge-tag badge-avaliar">● AVALIAR</span>';
      } else {
        badgeSemaforo = '<span class="badge-tag badge-encerrado">● NO-GO</span>';
      }

      // Tag Prazo Crítico e Retificação Recente
      let badgeUrgente = '';
      if (isUrgente) {
        badgeUrgente = `<span class="badge-tag badge-urgente">${dias === 0 ? 'Vence hoje' : `Prazo: ${dias}d`}</span>`;
      }
      const retCard = ed.retificacao_recente;
      const badgeRetificacao = (retCard && retCard.de && retCard.para)
        ? `<span class="badge-tag badge-retificacao" title="Retificação detectada em ${escapeHtml(retCard.data || '')}: de ${escapeHtml(retCard.de)} para ${escapeHtml(retCard.para)}">⚠️ Prazo alterado: ${escapeHtml(retCard.para)}</span>`
        : '';

      const valorCurto = resumirValorCard(ed.valor_financiado);
      const prazoCurto = resumirPrazoCard(ed.prazo_submissao, dias);
      const prazoVerificado = Boolean(
        ed.prazo_verificado_fonte ||
        (ed.prazo_submissao && !String(ed.prazo_submissao).toLowerCase().includes('consultar'))
      );
      const valorVerificado = Boolean(
        ed.valor_verificado_fonte ||
        (ed.valor_financiado && !String(ed.valor_financiado).toLowerCase().includes('consultar') && !String(ed.valor_financiado).toLowerCase().includes('ver pdf') && !String(ed.valor_financiado).toLowerCase().includes('ver tópico'))
      );

      const sinteseCurta = ed.justificativa_cais || ed.resumo_objetivo || ed.ideia_projeto_cais || '';
      const infoGestao = obterGestaoEdital(ed.id_edital);
      const isFavorito = Boolean(infoGestao.favorito);
      const badgeEtapaInterna = infoGestao.etapa && infoGestao.etapa !== 'triagem'
        ? `<span class="badge-etapa-card" title="Status interno no Funil CAIS">${escapeHtml(rotuloEtapaFunil(infoGestao.etapa))}</span>`
        : '';
      const labCais = obterLaboratorioCais(ed);
      const termoAtivo = (campoBusca.value || '').trim();
      const tituloFormatado = destacarTermoBusca(ed.titulo, termoAtivo);
      const sinteseFormatada = destacarTermoBusca(sinteseCurta, termoAtivo);

      const scoreNum = Number(ed.score_ponderado || 0);
      const pctNota = Math.min(100, Math.round(scoreNum * 10));

      card.innerHTML = `
        <div class="corpo-card-minimal">
          <div class="topo-cartao">
            <div class="grupo-badges">
              <button type="button" class="btn-favorito-card ${isFavorito ? 'ativo' : ''}" title="${isFavorito ? 'Remover dos Favoritos da equipe CAIS' : 'Marcar como Favorito / Priorizado pela equipe CAIS'}">${isFavorito ? '★' : '☆'}</button>
              <span class="badge-tag badge-orgao">${escapeHtml(ed.orgao)}</span>
              ${badgeSemaforo}
              ${badgeUrgente}
              ${badgeRetificacao}
              ${badgeEtapaInterna}
            </div>
            <div class="nota-circulo nota-circulo-didatica" title="Nota Ponderada CAIS (${scoreNum.toFixed(1)} de 10)">
              <span>Nota ${scoreNum.toFixed(1)}/10</span>
              <div class="mini-trilho-nota"><div class="mini-preenchimento-nota" style="width:${pctNota}%"></div></div>
            </div>
          </div>

          <h3 class="titulo-edital" title="${escapeHtml(ed.titulo)}">${tituloFormatado}</h3>
          <p class="resumo-curto-card" title="${escapeHtml(sinteseCurta)}"><span class="prefixo-didatico-card">Foco CAIS:</span> ${sinteseFormatada}</p>

          <div class="pilares-card">
            <div class="pilar-item" title="${escapeHtml(ed.valor_financiado || '')} ${valorVerificado ? '(Extraído da página oficial)' : '(Consultar PDF oficial)'}">
              <span class="pilar-label">Recurso ${valorVerificado ? '• Verificado' : '• Ver PDF'}</span>
              <span class="pilar-valor valor-grana font-mono">${escapeHtml(valorCurto)}</span>
            </div>
            <div class="pilar-item" title="${escapeHtml(ed.prazo_submissao || '')} ${prazoVerificado ? '(Extraído da página oficial)' : '(Consultar cronograma no PDF oficial)'}">
              <span class="pilar-label">Prazo Final ${prazoVerificado ? '• Verificado' : '• Ver PDF'}</span>
              <span class="pilar-valor font-mono ${isEncerrado ? 'prazo-encerrado-txt' : ''}">${escapeHtml(prazoCurto)}</span>
            </div>
          </div>
        </div>

        <div class="rodape-acao-card">
          <span class="badge-lab-cais" title="Laboratório / Núcleo CAIS com maior aderência técnica">${escapeHtml(labCais)}</span>
          <div style="display:flex; gap:6px; align-items:center;">
            <a href="${escapeHtml(ed.link || '#')}" target="_blank" rel="noopener noreferrer" class="btn-link-direto-card" title="Abrir página oficial do órgão em nova aba">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <button type="button" class="btn-resumo-rapido-card" title="Copiar sumário executivo">
              Copiar
            </button>
            <button type="button" class="btn-ver-detalhes-card">
              <span>Plano CAIS</span>
              <span class="seta-acao">&rarr;</span>
            </button>
          </div>
        </div>
      `;

      const btnFavCard = card.querySelector('.btn-favorito-card');
      if (btnFavCard) {
        btnFavCard.addEventListener('click', (e) => {
          e.stopPropagation();
          alternarFavoritoEdital(ed);
        });
      }

      const btnLinkDireto = card.querySelector('.btn-link-direto-card');
      if (btnLinkDireto) {
        btnLinkDireto.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      const btnResumoCard = card.querySelector('.btn-resumo-rapido-card');
      if (btnResumoCard) {
        btnResumoCard.addEventListener('click', (e) => {
          e.stopPropagation();
          copiarResumoDeEdital(ed);
        });
      }

      card.addEventListener('click', () => abrirModal(ed));
      gridCartoes.appendChild(card);
    });
  }

  /**
   * Renderiza a visualização em tabela / planilha
   */
  function renderizarTabela() {
    corpoTabela.innerHTML = '';
    editaisFiltrados.forEach(ed => {
      const tr = document.createElement('tr');
      const dias = calcularDiasRestantes(ed.prazo_submissao);
      const isUrgente = dias !== null && dias >= 0 && dias <= 7;
      const isEncerrado = dias !== null && dias < 0;
      const dec = (ed.decisao_recomendada || '').toUpperCase();
      const isGo = dec.includes('GO') && !dec.includes('NO-GO') && !isEncerrado;
      const isAvaliar = dec.includes('AVALIAR') && !isEncerrado;

      let badgeStatusTabela = '<span class="badge-tag badge-encerrado">● NO-GO</span>';
      if (isEncerrado) badgeStatusTabela = '<span class="badge-tag badge-encerrado">● ENCERRADO</span>';
      else if (isGo) badgeStatusTabela = '<span class="badge-tag badge-go">● GO!</span>';
      else if (isAvaliar) badgeStatusTabela = '<span class="badge-tag badge-avaliar">● AVALIAR</span>';

      if (isGo) tr.classList.add('linha-go');
      else if (isAvaliar) tr.classList.add('linha-avaliar');
      else tr.classList.add('linha-encerrado');

      const infoGTabela = obterGestaoEdital(ed.id_edital);
      const isFavTabela = Boolean(infoGTabela.favorito);

      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <button type="button" class="btn-favorito-card ${isFavTabela ? 'ativo' : ''}" title="${isFavTabela ? 'Remover dos Favoritos' : 'Marcar como Favorito'}">${isFavTabela ? '★' : '☆'}</button>
            ${badgeStatusTabela}
          </div>
        </td>
        <td><span class="badge-tag badge-orgao">${escapeHtml(ed.orgao)}</span></td>
        <td>
          <div style="font-weight:600; color:var(--cais-slate-dark); cursor:pointer;">${escapeHtml(ed.titulo)}</div>
          <div style="display:flex; gap:6px; align-items:center; margin-top:4px; flex-wrap:wrap;">
            <span class="badge-lab-cais">${escapeHtml(obterLaboratorioCais(ed))}</span>
            ${isUrgente ? `<span class="badge-tag badge-urgente">${dias === 0 ? 'Vence hoje' : `Vence em ${dias} dias`}</span>` : ''}
          </div>
        </td>
        <td class="font-mono ${isEncerrado ? 'prazo-encerrado-txt' : ''}">${escapeHtml(formatarPrazoDidatico(ed.prazo_submissao, dias))}</td>
        <td class="font-mono" style="font-weight:600; color:#0369A1;">${escapeHtml(ed.valor_financiado || '—')}</td>
        <td><span class="nota-circulo">${Number(ed.score_ponderado || 0).toFixed(1)}/10</span></td>
        <td>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="botao botao-secundario btn-tabela-resumo" type="button" title="Copiar sumário executivo" style="padding: 5px 10px; font-size:12px;">
              Sumário
            </button>
            <button class="botao botao-primario btn-tabela-detalhes" type="button" style="padding: 5px 12px; font-size:12px;">
              Análise
            </button>
          </div>
        </td>
      `;

      const btnFavTab = tr.querySelector('.btn-favorito-card');
      if (btnFavTab) {
        btnFavTab.addEventListener('click', (e) => {
          e.stopPropagation();
          alternarFavoritoEdital(ed);
        });
      }

      const btnResumo = tr.querySelector('.btn-tabela-resumo');
      if (btnResumo) {
        btnResumo.addEventListener('click', (e) => {
          e.stopPropagation();
          copiarResumoDeEdital(ed);
        });
      }

      const btnDetalhes = tr.querySelector('.btn-tabela-detalhes');
      if (btnDetalhes) {
        btnDetalhes.addEventListener('click', (e) => {
          e.stopPropagation();
          abrirModal(ed);
        });
      }

      tr.addEventListener('click', () => abrirModal(ed));
      corpoTabela.appendChild(tr);
    });
  }

  function alternarModo(modo) {
    modoVisualizacao = modo;
    [
      { btn: btnModoCards, id: 'cards' },
      { btn: btnModoTabela, id: 'tabela' },
      { btn: btnModoCronograma, id: 'cronograma' },
      { btn: btnModoPipeline, id: 'pipeline' },
    ].forEach(({ btn, id }) => {
      if (btn) btn.classList.toggle('ativo', id === modo);
    });
    renderizarResultados();
  }

  /**
   * Renderiza a visão Cronograma de Prazos com exportação direta para Agenda (.ics)
   */
  function renderizarCronograma() {
    if (!wrapperCronograma) return;
    wrapperCronograma.innerHTML = '';

    const grupos = [
      { id: 'critico', titulo: 'Ação Imediata / Curto Prazo (Até 15 dias)', classe: 'crono-critico', itens: [] },
      { id: 'proximo', titulo: 'Janela de Médio Prazo (16 a 60 dias)', classe: 'crono-proximo', itens: [] },
      { id: 'planejado', titulo: 'Planejamento & Cooperação Internacional (> 60 dias / 2027)', classe: 'crono-planejado', itens: [] },
      { id: 'continuo', titulo: 'Fluxo Contínuo & Credenciamento Permanente (Abertos o Ano Todo)', classe: 'crono-continuo', itens: [] },
    ];

    editaisFiltrados.forEach(ed => {
      const dias = calcularDiasRestantes(ed.prazo_submissao);
      if (dias !== null && dias < 0) return; // Oculta encerrados no cronograma futuro
      if (dias !== null && dias <= 15) {
        grupos[0].itens.push({ ed, dias });
      } else if (dias !== null && dias <= 60) {
        grupos[1].itens.push({ ed, dias });
      } else if (dias !== null && dias > 60) {
        grupos[2].itens.push({ ed, dias });
      } else {
        grupos[3].itens.push({ ed, dias });
      }
    });

    grupos.forEach(g => {
      g.itens.sort((a, b) => {
        if (a.dias !== null && b.dias !== null) return a.dias - b.dias;
        return (Number(b.ed.score_ponderado) || 0) - (Number(a.ed.score_ponderado) || 0);
      });
    });

    let algumGrupoRenderizado = false;
    grupos.forEach(g => {
      if (g.itens.length === 0) return;
      algumGrupoRenderizado = true;

      const sec = document.createElement('div');
      sec.className = 'grupo-cronograma';
      sec.innerHTML = `
        <div class="cabecalho-grupo-crono ${g.classe}">
          <div class="titulo-grupo-crono">${escapeHtml(g.titulo)}</div>
          <span class="contador-grupo-crono">${g.itens.length} ${g.itens.length === 1 ? 'edital' : 'editais'}</span>
        </div>
        <div class="lista-itens-crono"></div>
      `;

      const listaEl = sec.querySelector('.lista-itens-crono');
      g.itens.forEach(({ ed, dias }) => {
        const row = document.createElement('div');
        row.className = 'linha-crono';
        const infoG = obterGestaoEdital(ed.id_edital);
        const prazoPrincipal = dias !== null ? ed.prazo_submissao : (ed.prazo_submissao || 'Fluxo Contínuo');
        const subPrazo = dias !== null
          ? (dias === 0 ? 'Vence hoje!' : `Faltam ${dias} dias`)
          : 'Submissão aberta';

        row.innerHTML = `
          <div class="coluna-data-crono">
            <span class="data-principal-crono font-mono">${escapeHtml(prazoPrincipal)}</span>
            <span class="contagem-dias-crono ${dias !== null && dias <= 7 ? 'urgente' : 'continuo'}">${escapeHtml(subPrazo)}</span>
          </div>
          <div class="coluna-info-crono">
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              <span class="badge-tag badge-orgao">${escapeHtml(ed.orgao)}</span>
              <span class="nota-circulo">Nota ${Number(ed.score_ponderado || 0).toFixed(1)}</span>
              ${infoG.etapa && infoG.etapa !== 'triagem' ? `<span class="badge-etapa-card">${escapeHtml(rotuloEtapaFunil(infoG.etapa))}</span>` : ''}
              ${infoG.responsavel ? `<span class="card-pipeline-responsavel" style="margin:0;">Líder: ${escapeHtml(infoG.responsavel)}</span>` : ''}
            </div>
            <div class="titulo-linha-crono" title="${escapeHtml(ed.titulo)}">${escapeHtml(ed.titulo)}</div>
            <div class="sub-linha-crono">
              <span><strong>Recurso:</strong> ${escapeHtml(resumirValorCard(ed.valor_financiado))}</span>
              <span>•</span>
              <span><strong>Proposta CAIS:</strong> ${escapeHtml(truncarTexto(ed.ideia_projeto_cais || ed.justificativa_cais, 95))}</span>
            </div>
          </div>
          <div class="coluna-acoes-crono">
            <button type="button" class="btn-resumo-rapido-card btn-ics-crono" title="Salvar lembrete no Outlook / Google Agenda (.ics)">
              + Agenda (.ics)
            </button>
            <button type="button" class="btn-ver-detalhes-card">
              <span>Plano CAIS</span>
              <span class="seta-acao">&rarr;</span>
            </button>
          </div>
        `;

        const btnIcs = row.querySelector('.btn-ics-crono');
        if (btnIcs) {
          btnIcs.addEventListener('click', (e) => {
            e.stopPropagation();
            exportarEventoCalendarioIcs(ed);
          });
        }
        row.addEventListener('click', () => abrirModal(ed));
        listaEl.appendChild(row);
      });

      wrapperCronograma.appendChild(sec);
    });

    if (!algumGrupoRenderizado) {
      wrapperCronograma.innerHTML = `
        <div class="estado-vazio" style="margin-top:0;">
          <h3>Nenhum edital com prazo aberto nos filtros atuais</h3>
          <p>Altere o filtro de recomendação para visualizar o cronograma de oportunidades vigentes.</p>
        </div>
      `;
    }
  }

  /**
   * Renderiza o Funil de Submissão CAIS (Kanban Executivo de 4 colunas)
   */
  function renderizarPipeline() {
    if (!wrapperPipeline) return;
    wrapperPipeline.innerHTML = '';

    const colunas = [
      { id: 'triagem', titulo: '1. Em Triagem / Radar', classe: 'etapa-triagem', itens: [] },
      { id: 'articulacao', titulo: '2. Articulação de Parceiros', classe: 'etapa-articulacao', itens: [] },
      { id: 'redacao', titulo: '3. Redigindo Proposta', classe: 'etapa-redacao', itens: [] },
      { id: 'submetido', titulo: '4. Proposta Submetida', classe: 'etapa-submetido', itens: [] },
    ];

    editaisFiltrados.forEach(ed => {
      const dias = calcularDiasRestantes(ed.prazo_submissao);
      const infoG = obterGestaoEdital(ed.id_edital);
      const etapa = infoG.etapa || 'triagem';
      // Em Triagem mostra prioritariamente os editais vigentes; nas demais colunas mostra todos os alocados
      if (etapa === 'triagem' && dias !== null && dias < 0) return;
      const col = colunas.find(c => c.id === etapa) || colunas[0];
      col.itens.push({ ed, dias, infoG });
    });

    colunas.forEach(col => {
      const colEl = document.createElement('div');
      colEl.className = 'coluna-pipeline';
      colEl.innerHTML = `
        <div class="topo-coluna-pipeline ${col.classe}">
          <span class="titulo-coluna-pipeline">${escapeHtml(col.titulo)}</span>
          <span class="contador-grupo-crono">${col.itens.length}</span>
        </div>
        <div class="corpo-coluna-pipeline"></div>
      `;

      const corpoCol = colEl.querySelector('.corpo-coluna-pipeline');
      if (col.itens.length === 0) {
        corpoCol.innerHTML = `<div style="font-size:12px; color:#64748B; text-align:center; padding:22px 10px;">Nenhum edital nesta etapa. Mova um edital pelo seletor abaixo de qualquer cartão.</div>`;
      } else {
        col.itens.forEach(({ ed, dias, infoG }) => {
          const cardP = document.createElement('div');
          const dec = (ed.decisao_recomendada || '').toUpperCase();
          const isGo = dec.includes('GO') && !dec.includes('NO-GO');
          cardP.className = `card-pipeline ${isGo ? 'pipe-go' : 'pipe-avaliar'}`;

          cardP.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
              <span class="badge-tag badge-orgao" style="font-size:10px; padding:2px 6px;">${escapeHtml(ed.orgao)}</span>
              <span class="nota-circulo" style="font-size:11px; padding:2px 7px;">Nota ${Number(ed.score_ponderado || 0).toFixed(1)}</span>
            </div>
            <div class="card-pipeline-titulo" title="${escapeHtml(ed.titulo)}">${escapeHtml(ed.titulo)}</div>
            ${infoG.responsavel ? `<div class="card-pipeline-responsavel">👤 ${escapeHtml(infoG.responsavel)}</div>` : ''}
            <div class="card-pipeline-meta">
              <span class="font-mono">${escapeHtml(resumirPrazoCard(ed.prazo_submissao, dias))}</span>
              <span class="font-mono" style="color:#0369A1; font-weight:600;">${escapeHtml(resumirValorCard(ed.valor_financiado))}</span>
            </div>
            <select class="select-rapido-pipeline" title="Mover edital de etapa no Funil CAIS">
              <option value="triagem" ${col.id === 'triagem' ? 'selected' : ''}>Etapa: 1. Em Triagem</option>
              <option value="articulacao" ${col.id === 'articulacao' ? 'selected' : ''}>Etapa: 2. Articulação</option>
              <option value="redacao" ${col.id === 'redacao' ? 'selected' : ''}>Etapa: 3. Redigindo Proposta</option>
              <option value="submetido" ${col.id === 'submetido' ? 'selected' : ''}>Etapa: 4. Submetido</option>
            </select>
          `;

          const selectEtapa = cardP.querySelector('.select-rapido-pipeline');
          if (selectEtapa) {
            selectEtapa.addEventListener('click', (e) => e.stopPropagation());
            selectEtapa.addEventListener('change', (e) => {
              e.stopPropagation();
              atualizarGestaoEdital(ed.id_edital, { etapa: e.target.value });
              renderizarPipeline();
              exibirToast(`Edital movido para "${rotuloEtapaFunil(e.target.value)}"!`, 'success');
            });
          }

          cardP.addEventListener('click', () => abrirModal(ed));
          corpoCol.appendChild(cardP);
        });
      }

      wrapperPipeline.appendChild(colEl);
    });
  }

  function obterPortalOficialOrgao(orgao, linkFallback) {
    const o = String(orgao || '').toLowerCase();
    if (o.includes('finep')) return 'https://www.finep.gov.br/chamadas-publicas/';
    if (o.includes('petrobras')) return 'https://conexoes-inovacao.petrobras.com.br/s/?language=pt_BR';
    if (o.includes('funcap')) return 'https://montenegro.funcap.ce.gov.br/sugba/script/id_solicitacao.php?cnpj=00078007000126';
    if (o.includes('etice')) return 'https://www.ce.gov.br/etice/';
    if (o.includes('cnpq')) return 'https://www.gov.br/cnpq/pt-br/chamadas/Busca_abertas';
    if (o.includes('embrapii')) return 'https://embrapii.org.br/chamadas-publicas/';
    if (o.includes('capes')) return 'https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/editais-e-resultados';
    if (o.includes('sebrae') || o.includes('catalisa')) return 'https://sebrae.com.br/subsites/catalisa-ict';
    if (o.includes('senai') || o.includes('mover')) return 'https://www.portaldaindustria.com.br/canais/plataforma-inovacao-para-industria/';
    if (o.includes('bndes')) return 'https://www.bndes.gov.br/wps/portal/site/home/financiamento/produto/bndes-funtec';
    if (o.includes('nordeste') || o.includes('fundeci')) return 'https://www.bnb.gov.br/fundeci/editais';
    if (o.includes('confap')) return 'https://confap.org.br/';
    if (o.includes('horizon')) return 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals';
    if (o.includes('mcti')) return 'https://www.gov.br/mcti/pt-br';
    if (o.includes('abdi')) return 'https://www.abdi.com.br/';
    try {
      const u = new URL(linkFallback);
      return u.origin;
    } catch (e) {
      return linkFallback || '#';
    }
  }

  /**
   * Abre o Master Pop-up Modal unificado
   */
  function abrirModal(ed, preservarAba = false) {
    editalSelecionado = ed;

    const modalTitulo = document.getElementById('modalTitulo');
    const tagsModal = document.getElementById('tagsModal');
    const modalSubtitulo = document.getElementById('modalSubtitulo');

    const dias = calcularDiasRestantes(ed.prazo_submissao);
    const isUrgente = dias !== null && dias >= 0 && dias <= 7;
    const isEncerrado = dias !== null && dias < 0;
    const dec = (ed.decisao_recomendada || '').toUpperCase();
    const isGo = dec.includes('GO') && !dec.includes('NO-GO') && !isEncerrado;
    const isAvaliar = dec.includes('AVALIAR') && !isEncerrado;

    const dataRef = ed.data_atualizacao || ed.data_descoberta || obterDataHojeBR();
    const dataDesc = ed.data_descoberta || dataRef;

    let tagDecisaoModal = '<span class="badge-tag badge-encerrado">● NO-GO (Monitorar)</span>';
    if (isEncerrado) {
      tagDecisaoModal = '<span class="badge-tag badge-encerrado">● PRAZO ENCERRADO</span>';
    } else if (isGo) {
      tagDecisaoModal = '<span class="badge-tag badge-go">● GO! — SUBMETER PROPOSTA</span>';
    } else if (isAvaliar) {
      tagDecisaoModal = '<span class="badge-tag badge-avaliar">● AVALIAR COM PARCEIROS</span>';
    }

    const prazoVerificado = Boolean(
      ed.prazo_verificado_fonte ||
      (ed.prazo_submissao && !String(ed.prazo_submissao).toLowerCase().includes('consultar'))
    );
    const valorVerificado = Boolean(
      ed.valor_verificado_fonte ||
      (ed.valor_financiado && !String(ed.valor_financiado).toLowerCase().includes('consultar') && !String(ed.valor_financiado).toLowerCase().includes('ver pdf') && !String(ed.valor_financiado).toLowerCase().includes('ver tópico'))
    );
    const badgeProveniencia = (prazoVerificado && valorVerificado)
      ? '<span class="badge-tag badge-origem-real" title="Prazo e valor extraídos diretamente do portal ou PDF oficial">Prazo e Valor Verificados</span>'
      : (prazoVerificado
        ? '<span class="badge-tag badge-origem-real" title="Prazo extraído do edital oficial; valor detalhado por faixa no PDF">Prazo Verificado • Teto no Edital</span>'
        : '<span class="badge-tag badge-origem-real" title="Consulte o anexo PDF oficial na página do órgão">Conferir Anexo Oficial</span>');

    const labCaisModal = obterLaboratorioCais(ed);
    const retModal = ed.retificacao_recente;
    const badgeRetModal = (retModal && retModal.de && retModal.para)
      ? `<span class="badge-tag badge-retificacao">⚠️ Prazo alterado: de ${escapeHtml(retModal.de)} para ${escapeHtml(retModal.para)}</span>`
      : '';
    tagsModal.innerHTML = `
      <span class="badge-tag badge-orgao">${escapeHtml(ed.orgao)}</span>
      ${tagDecisaoModal}
      <span class="badge-tag font-mono">Score: ${Number(ed.score_ponderado || 0).toFixed(1)}/10</span>
      ${isUrgente ? `<span class="badge-tag badge-urgente">${dias === 0 ? 'Encerra Hoje' : `Restam ${dias} dias`}</span>` : ''}
      ${badgeRetModal}
      <span class="badge-lab-cais">${escapeHtml(labCaisModal)}</span>
      ${badgeProveniencia}
    `;

    // Atualiza estado das setas Anterior / Próximo do Modal
    const idxAtual = editaisFiltrados.findIndex(item => item.id_edital === ed.id_edital);
    const totalLista = editaisFiltrados.length;
    if (indiceNavModal) {
      indiceNavModal.textContent = idxAtual >= 0 ? `${idxAtual + 1}/${totalLista}` : 'Histórico';
    }
    if (btnEditalAnterior) {
      btnEditalAnterior.disabled = idxAtual <= 0;
    }
    if (btnEditalProximo) {
      btnEditalProximo.disabled = idxAtual < 0 || idxAtual >= totalLista - 1;
    }

    modalTitulo.textContent = ed.titulo;
    modalSubtitulo.textContent = `ID: ${ed.id_edital || 'CAIS-ID'} • Capturado em: ${dataDesc} • Auditado em: ${dataRef} • Escopo e Consórcio: Parecer Consultivo CAIS`;

    // Faixa de Métricas Didáticas e Plano de Ação CAIS
    const publicoTexto = ed.publico_elegivel || 'ICTs sem fins lucrativos (como o Instituto CAIS/UECE) e empresas parceiras';
    const elValor = document.getElementById('modalValor');
    const elPrazo = document.getElementById('modalPrazo');
    const elPublico = document.getElementById('modalPublico');
    const elContrapartida = document.getElementById('modalContrapartida');
    const elPublicoDetalhado = document.getElementById('modalPublicoDetalhado');

    if (elValor) elValor.textContent = ed.valor_financiado || 'Consultar termo oficial';
    if (elPrazo) elPrazo.textContent = formatarPrazoDidatico(ed.prazo_submissao, dias);
    if (elPublico) elPublico.textContent = publicoTexto;
    if (elContrapartida) elContrapartida.textContent = ed.contrapartida || 'Não exigida';
    if (elPublicoDetalhado) elPublicoDetalhado.textContent = publicoTexto;

    const elCronogramaEtapas = document.getElementById('modalCronogramaEtapas');
    const boxCronogramaModal = document.getElementById('boxCronogramaModal');
    if (elCronogramaEtapas && boxCronogramaModal) {
      const textoCrono = ed.cronograma_etapas ||
        (ed.prazo_submissao === 'Fluxo Contínuo'
          ? `Recebimento contínuo de propostas em fluxo permanente no portal oficial (${ed.orgao}).`
          : `Submissão de propostas até ${ed.prazo_submissao} no portal oficial (${ed.orgao}).`);
      elCronogramaEtapas.textContent = textoCrono;
    }

    const faixaSinteseModal = document.getElementById('faixaSinteseModal');
    if (faixaSinteseModal) {
      if (isEncerrado) {
        faixaSinteseModal.className = 'faixa-sintese-decisao sintese-encerrado';
        faixaSinteseModal.innerHTML = `<span>● <strong>Chamada Encerrada:</strong> Mantida na base para histórico e preparação para a próxima edição.</span><span><strong>Núcleo:</strong> ${escapeHtml(labCaisModal)}</span>`;
      } else if (isGo) {
        faixaSinteseModal.className = 'faixa-sintese-decisao';
        faixaSinteseModal.innerHTML = `<span>● <strong>Recomendação GO (Prioridade Alta):</strong> Excelente aderência técnica e institucional para submissão pelo CAIS.</span><span><strong>Núcleo Indicado:</strong> ${escapeHtml(labCaisModal)}</span>`;
      } else {
        faixaSinteseModal.className = 'faixa-sintese-decisao sintese-avaliar';
        faixaSinteseModal.innerHTML = `<span>● <strong>Recomendação AVALIAR:</strong> Viável mediante articulação prévia de consórcio ou parceiro externo.</span><span><strong>Núcleo Indicado:</strong> ${escapeHtml(labCaisModal)}</span>`;
      }
    }

    document.getElementById('modalIdeiaProjeto').textContent = ed.ideia_projeto_cais || 'Ideia de projeto em elaboração pela equipe CAIS.';
    document.getElementById('modalParceiros').textContent = ed.parceiros_sugeridos || 'UECE, Laboratórios do LDI e indústrias associadas.';
    document.getElementById('modalResumo').textContent = ed.resumo_objetivo || 'Sem resumo disponível.';
    document.getElementById('modalJustificativa').textContent = ed.justificativa_cais || 'Oportunidade oficial qualificada pelo Radar CAIS.';

    // Atualiza o convite personalizado para parceiro na caixa 3
    if (textareaConviteParceiro) {
      textareaConviteParceiro.value = montarTextoConviteParceiro(ed);
    }
    if (!preservarAba && boxPreviaConviteParceiro && btnTogglePreviaConvite) {
      boxPreviaConviteParceiro.style.display = 'none';
      btnTogglePreviaConvite.setAttribute('aria-expanded', 'false');
      btnTogglePreviaConvite.textContent = 'Ver texto';
    }

    // Aba 2: Termômetro de Notas 5 Etapas
    const aderencia = Number(ed.nota_aderencia || 0);
    const chance = Number(ed.nota_chance_aprovacao || 0);
    const financeira = Number(ed.nota_financeira || 0);
    const complexidade = Number(ed.nota_complexidade || 5);
    const viabilidade = Math.max(0, Number((10 - complexidade).toFixed(1)));
    const scoreFinal = Number(ed.score_ponderado || 0).toFixed(1);

    document.getElementById('notaAderencia').textContent = `${aderencia}/10`;
    document.getElementById('barraAderencia').style.width = `${Math.min(100, aderencia * 10)}%`;

    document.getElementById('notaChance').textContent = `${chance}/10`;
    document.getElementById('barraChance').style.width = `${Math.min(100, chance * 10)}%`;

    document.getElementById('notaFinanceira').textContent = `${financeira}/10`;
    document.getElementById('barraFinanceira').style.width = `${Math.min(100, financeira * 10)}%`;

    document.getElementById('notaViabilidade').textContent = `${viabilidade}/10`;
    document.getElementById('barraViabilidade').style.width = `${Math.min(100, viabilidade * 10)}%`;

    document.getElementById('modalScoreFinal').innerHTML = `${scoreFinal} <span class="max-nota">/ 10</span>`;

    const badgeDecisao = document.getElementById('modalDecisaoFinal');
    if (isEncerrado) {
      badgeDecisao.textContent = '● PRAZO DE SUBMISSÃO ENCERRADO';
      badgeDecisao.style.background = 'var(--semaforo-vermelho-bg)';
      badgeDecisao.style.color = 'var(--semaforo-vermelho-txt)';
      badgeDecisao.style.borderColor = 'var(--semaforo-vermelho-border)';
    } else if (isGo) {
      badgeDecisao.textContent = '● DIRETRIZ: SUBMETER PROPOSTA (GO!)';
      badgeDecisao.style.background = 'var(--semaforo-verde-bg)';
      badgeDecisao.style.color = 'var(--semaforo-verde-txt)';
      badgeDecisao.style.borderColor = 'var(--semaforo-verde-border)';
    } else if (isAvaliar) {
      badgeDecisao.textContent = '● DIRETRIZ: AVALIAR COM PARCEIROS';
      badgeDecisao.style.background = 'var(--semaforo-amarelo-bg)';
      badgeDecisao.style.color = 'var(--semaforo-amarelo-txt)';
      badgeDecisao.style.borderColor = 'var(--semaforo-amarelo-border)';
    } else {
      badgeDecisao.textContent = '● DIRETRIZ: NO-GO (APENAS MONITORAR)';
      badgeDecisao.style.background = 'var(--semaforo-vermelho-bg)';
      badgeDecisao.style.color = 'var(--semaforo-vermelho-txt)';
      badgeDecisao.style.borderColor = 'var(--semaforo-vermelho-border)';
    }

    // Link oficial da oportunidade + Portal oficial do órgão
    const linkOficialLimpo = String(ed.link || '#')
      .replace('http://legacy.finep.gov.br', 'https://www.finep.gov.br')
      .replace('https://legacy.finep.gov.br', 'https://www.finep.gov.br');
    btnLinkOficial.href = linkOficialLimpo;
    if (btnPortalOrgao) {
      btnPortalOrgao.href = obterPortalOficialOrgao(ed.orgao, linkOficialLimpo);
    }

    // Atualiza botão Favoritar do Topo do Modal
    atualizarEstadoBotaoFavoritoModal(ed);

    // Popula Aba 3: Checklist de Documentos & Gestão Interna CAIS
    popularAbaChecklistModal(ed);

    // Popula Diagnóstico Preditivo ML + Cluster de Similaridade na Aba 2
    renderizarPredicaoMlNoModal(ed);

    // Abre por padrão na Aba 1 (Estratégia) ao clicar num cartão, mas preserva a aba ativa ao navegar com ← / →
    if (!preservarAba || !fundoModal.classList.contains('aberto')) {
      alternarAbaModal('estrategia');
    }

    fundoModal.classList.add('aberto');
    document.body.style.overflow = 'hidden';
    if (ed.id_edital && window.history && typeof window.history.replaceState === 'function') {
      try {
        window.history.replaceState(null, '', `#edital=${encodeURIComponent(ed.id_edital)}`);
      } catch (e) {}
    }
  }

  function atualizarEstadoBotaoFavoritoModal(ed) {
    if (!btnFavoritoModal || !ed) return;
    const isFav = Boolean(obterGestaoEdital(ed.id_edital).favorito);
    btnFavoritoModal.classList.toggle('ativo', isFav);
    btnFavoritoModal.textContent = isFav ? '★ Favoritado' : '☆ Favoritar';
  }

  function fecharModal() {
    if (editalSelecionado) {
      salvarGestaoDoModal(false);
    }
    fundoModal.classList.remove('aberto');
    document.body.style.overflow = '';
    if (window.location.hash.startsWith('#edital=') && window.history && typeof window.history.replaceState === 'function') {
      try {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      } catch (e) {}
    }
  }

  function copiarParaAreaDeTransferencia(texto, msgSucesso) {
    const usarFallback = () => {
      try {
        const areaTemp = document.createElement('textarea');
        areaTemp.value = texto;
        areaTemp.setAttribute('readonly', '');
        areaTemp.style.position = 'fixed';
        areaTemp.style.opacity = '0';
        areaTemp.style.left = '-9999px';
        document.body.appendChild(areaTemp);
        areaTemp.select();
        const ok = document.execCommand('copy');
        areaTemp.remove();
        if (ok) {
          exibirToast(msgSucesso, 'success');
        } else {
          exibirToast('Não foi possível copiar automaticamente. Use "Ver texto" para copiar manualmente.', 'error');
        }
      } catch (e) {
        exibirToast('Não foi possível copiar automaticamente.', 'error');
      }
    };

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(texto).then(() => {
        exibirToast(msgSucesso, 'success');
      }).catch(() => {
        usarFallback();
      });
    } else {
      usarFallback();
    }
  }

  function identificarPerfilParceiroConvite(ed) {
    const texto = `${ed.parceiros_sugeridos || ''} ${ed.publico_elegivel || ''} ${ed.orgao || ''} ${ed.titulo || ''}`.toLowerCase();

    if (texto.includes('startup') || texto.includes('catalisa') || texto.includes('centelha') || texto.includes('sebrae')) {
      return {
        rotulo: 'Startup / Empresa de Base Tecnológica',
        ganhoParceiro: 'acelerar o desenvolvimento tecnológico com recurso de fomento (sem abrir mão de participação societária) e apoio de pesquisadores especializados.',
        papelCais: 'pesquisa aplicada e engenharia (IA, software, dados ou hardware), coordenação técnica de P&D e escrita completa do projeto para o edital.',
        papelParceiro: 'liderar a validação de mercado, o modelo de negócio e a aplicação prática da solução junto aos clientes.'
      };
    }

    if (
      texto.includes('indústria') || texto.includes('industria') || texto.includes('fiec') ||
      texto.includes('empresa') || texto.includes('embrapii') || texto.includes('senai') ||
      texto.includes('mover') || texto.includes('bndes') || texto.includes('finep')
    ) {
      return {
        rotulo: 'Indústria / Empresa Parceira',
        ganhoParceiro: 'desenvolver uma solução sob medida para a operação de vocês compartilhando custos e riscos técnicos com recursos do edital.',
        papelCais: 'pesquisa e desenvolvimento (IA, ciência de dados, software ou sistemas embarcados), equipe de especialistas e redação técnica da proposta.',
        papelParceiro: 'apresentar o desafio real da operação, apoiar a validação prática em campo e compor a contrapartida prevista no edital.'
      };
    }

    if (
      texto.includes('governo') || texto.includes('secretaria') || texto.includes('etice') ||
      texto.includes('funceme') || texto.includes('sema') || texto.includes('municíp') ||
      texto.includes('municip') || texto.includes('defesa civil') || texto.includes('cientista chefe') ||
      texto.includes('público') || texto.includes('publico')
    ) {
      return {
        rotulo: 'Órgão Público / Governo',
        ganhoParceiro: 'resolver um desafio prioritário da gestão pública com tecnologia aplicada e financiamento dedicado à inovação.',
        papelCais: 'desenvolvimento técnico da solução (IA, sistemas, nuvem ou sensores), coordenação dos pesquisadores e elaboração integral do projeto.',
        papelParceiro: 'indicar a demanda prioritária do órgão, viabilizar o acesso técnico para teste piloto e emitir a anuência institucional.'
      };
    }

    return {
      rotulo: 'Universidade / Laboratório de Pesquisa',
      ganhoParceiro: 'unir a excelência científica do laboratório à engenharia aplicada do CAIS, fortalecendo a nota da proposta para captar bolsas e custeio.',
      papelCais: 'engenharia de software, IA e prototipagem, além do apoio direto na estruturação executiva e escrita do plano de trabalho.',
      papelParceiro: 'somar na coordenação científica, na indicação de pesquisadores/bolsistas e no enquadramento acadêmico exigido pela chamada.'
    };
  }

  function montarTextoConviteParceiro(ed) {
    if (!ed) return '';
    const perfil = identificarPerfilParceiroConvite(ed);
    const dias = calcularDiasRestantes(ed.prazo_submissao);
    const prazoBruto = String(ed.prazo_submissao || '').trim();

    let prazoNatural = prazoBruto || 'conforme cronograma oficial';
    if (prazoBruto.toLowerCase().includes('fluxo contínuo') || prazoBruto.toLowerCase().includes('fluxo continuo')) {
      prazoNatural = 'Fluxo Contínuo (inscrições abertas)';
    } else if (dias !== null && dias > 1) {
      prazoNatural = `até ${prazoBruto} (faltam ${dias} dias)`;
    } else if (dias === 1) {
      prazoNatural = `até ${prazoBruto} (falta 1 dia)`;
    } else if (dias === 0) {
      prazoNatural = `até hoje (${prazoBruto})`;
    }

    const ideiaLimpa = String(ed.ideia_projeto_cais || ed.resumo_objetivo || 'Desenvolvimento conjunto de solução tecnológica aplicada.')
      .replace(/\s+/g, ' ')
      .trim();

    const contrapartidaLimpa = String(ed.contrapartida || 'Não exigida').trim();
    const valorLimpo = String(ed.valor_financiado || 'Conforme edital oficial').trim();

    return [
      'Olá! Tudo bem?',
      '',
      `Aqui é da equipe do Instituto CAIS. Identificamos um edital aberto da ${ed.orgao} com ótima aderência para construirmos um projeto em parceria:`,
      '',
      `• Edital: ${ed.titulo}`,
      `• Recurso disponível: ${valorLimpo}`,
      `• Prazo de submissão: ${prazoNatural}`,
      `• Contrapartida: ${contrapartidaLimpa}`,
      '',
      `A ideia inicial é: ${ideiaLimpa}`,
      '',
      'Como funcionaria na prática:',
      `• Ganho para vocês: ${perfil.ganhoParceiro}`,
      `• O que o Instituto CAIS entrega: ${perfil.papelCais}`,
      `• O que caberia a vocês: ${perfil.papelParceiro}`,
      '',
      `• Página oficial do edital: ${ed.link || ''}`,
      `• Resumo e plano no Radar CAIS: ${obterLinkDiretoEdital(ed)}`,
      '',
      'Faz sentido conversarmos 15 minutos esta semana para avaliarmos se vale seguirmos juntos nessa oportunidade?',
      '',
      'Um abraço,',
      'Equipe Instituto CAIS'
    ].join('\n');
  }

  function copiarConviteParceiro(ed) {
    if (!ed) return;
    const perfil = identificarPerfilParceiroConvite(ed);
    const textoFinal = (
      textareaConviteParceiro &&
      boxPreviaConviteParceiro &&
      boxPreviaConviteParceiro.style.display !== 'none' &&
      textareaConviteParceiro.value.trim()
    )
      ? textareaConviteParceiro.value.trim()
      : montarTextoConviteParceiro(ed);

    if (textareaConviteParceiro) {
      textareaConviteParceiro.value = textoFinal;
    }

    copiarParaAreaDeTransferencia(
      textoFinal,
      `🤝 Convite personalizado (${perfil.rotulo}) copiado! Pronto para colar no WhatsApp ou E-mail.`
    );
  }

  function copiarResumoDeEdital(ed) {
    if (!ed) return;
    const dias = calcularDiasRestantes(ed.prazo_submissao);
    const dataRef = ed.data_atualizacao || ed.data_descoberta || obterDataHojeBR();
    const prazoFormatado = formatarPrazoDidatico(ed.prazo_submissao, dias);
    const texto = `
📌 RADAR CAIS — OPORTUNIDADE OFICIAL (Ref: ${dataRef})
======================================================
🏢 Órgão: ${ed.orgao}
📄 Edital: ${ed.titulo}
🌐 Link Oficial: ${ed.link}

💰 Quanto Dinheiro: ${ed.valor_financiado}
📅 Prazo Fatal: ${prazoFormatado}
👥 Quem Pode Submeter: ${ed.publico_elegivel}
🤝 Contrapartida: ${ed.contrapartida}

🎯 SEMÁFORO CAIS: ${ed.decisao_recomendada} (Nota: ${Number(ed.score_ponderado || 0).toFixed(1)}/10)
- Aderência Temática: ${ed.nota_aderencia || 0}/10
- Chance de Aprovação: ${ed.nota_chance_aprovacao || 0}/10
- Atratividade Financeira: ${ed.nota_financeira || 0}/10

💡 Ideia de Projeto para o CAIS:
${ed.ideia_projeto_cais}

🤝 Parceiros Recomendados:
${ed.parceiros_sugeridos}
======================================================
    `.trim();

    copiarParaAreaDeTransferencia(texto, 'Resumo executivo copiado para a área de transferência!');
  }

  function copiarResumoDidatico() {
    if (!editalSelecionado) return;
    copiarResumoDeEdital(editalSelecionado);
  }

  function restaurarEstadoBotoesVarredura() {
    varreduraEmProgresso = false;
    btnVarreduraTopo.disabled = false;
    if (btnIniciarVarreduraCentral) btnIniciarVarreduraCentral.disabled = false;
    document.getElementById('labelVarredura').textContent = 'Atualizar Varredura';
    const icone = document.getElementById('iconeGirar');
    if (icone) icone.style.animation = '';
  }

  async function executarVarreduraAoVivo() {
    if (varreduraEmProgresso) {
      exibirToast('Uma varredura já está em andamento neste momento!', 'info');
      return;
    }

    try {
      varreduraEmProgresso = true;
      btnVarreduraTopo.disabled = true;
      if (btnIniciarVarreduraCentral) btnIniciarVarreduraCentral.disabled = true;

      document.getElementById('labelVarredura').textContent = 'Robô consultando portais...';
      const icone = document.getElementById('iconeGirar');
      if (icone) {
        icone.style.display = 'inline-block';
        icone.style.animation = 'spin 1s linear infinite';
      }
      pontoStatus.className = 'ponto-status amarelo';
      textoStatus.textContent = 'Coletando nos portais do governo...';

      exibirToast('O robô iniciou a varredura ao vivo nas páginas governamentais (ETICE, FINEP, FUNCAP, CNPq...)!', 'info');

      const res = await fetch('/api/varredura', { method: 'POST' });
      if (!res.ok) {
        restaurarEstadoBotoesVarredura();
        await carregarDados();
        pontoStatus.className = 'ponto-status verde';
        exibirToast('🌐 Modo Online (GitHub Pages): Base sincronizada com a última coleta automática do GitHub Actions!', 'success');
        return;
      }

      exibirToast('🛰️ Robô navegando nos portais do governo. Isso leva de 15 a 30 segundos.', 'info');

      // Polling para acompanhar término da varredura real (sem finally prematuro)
      let segundos = 0;
      const pollingStatus = setInterval(async () => {
        segundos += 2;
        if (segundos > 180) {
          clearInterval(pollingStatus);
          restaurarEstadoBotoesVarredura();
          exibirToast('Tempo limite de acompanhamento atingido. Recarregando base...', 'info');
          await carregarDados();
          return;
        }
        try {
          const statusRes = await fetch('/api/status-varredura', { cache: 'no-store' });
          if (statusRes.ok) {
            const st = await statusRes.json();
            textoStatus.textContent = `${st.mensagem || 'Consultando páginas oficiais...'} (${segundos}s)`;

            if (!st.em_progresso) {
              clearInterval(pollingStatus);
              restaurarEstadoBotoesVarredura();
              pontoStatus.className = 'ponto-status verde';

              await carregarDados();
              if (editais.length > 0) {
                exibirToast(`✅ Varredura concluída! ${editais.length} oportunidades disponíveis no painel.`, 'success');
              } else {
                exibirToast('Varredura finalizada. Nenhum novo edital aberto neste exato instante.', 'info');
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    } catch (err) {
      restaurarEstadoBotoesVarredura();
      await carregarDados();
      pontoStatus.className = 'ponto-status verde';
      exibirToast('🌐 Modo Online (GitHub Pages): Base sincronizada com a última coleta automática!', 'success');
    }
  }

  function exportarCsvClientSide() {
    const sanitizarCelula = (val) => {
      let s = String(val ?? '').replace(/[\r\n]+/g, ' ').trim();
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
      return `"${s.replace(/"/g, '""')}"`;
    };
    const cabecalho = [
      'ID', 'Orgao', 'Titulo', 'Prazo_Submissao', 'Valor_Financiado',
      'Contrapartida', 'Publico_Elegivel', 'Score_Ponderado', 'Decisao_Recomendada',
      'Nucleo_Lab_CAIS', 'Ideia_Projeto_CAIS', 'Parceiros_Sugeridos', 'Link_Oficial'
    ];
    const linhas = [cabecalho.join(',')];
    editaisFiltrados.forEach(ed => {
      linhas.push([
        sanitizarCelula(ed.id_edital),
        sanitizarCelula(ed.orgao),
        sanitizarCelula(ed.titulo),
        sanitizarCelula(ed.prazo_submissao),
        sanitizarCelula(ed.valor_financiado),
        sanitizarCelula(ed.contrapartida),
        sanitizarCelula(ed.publico_elegivel),
        sanitizarCelula(ed.score_ponderado),
        sanitizarCelula(ed.decisao_recomendada),
        sanitizarCelula(obterLaboratorioCais(ed)),
        sanitizarCelula(ed.ideia_projeto_cais),
        sanitizarCelula(ed.parceiros_sugeridos),
        sanitizarCelula(ed.link),
      ].join(','));
    });
    const blob = new Blob(['\uFEFF' + linhas.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline_oportunidades_cais.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    exibirToast(`Planilha CSV (${editaisFiltrados.length} oportunidades) exportada com sucesso!`, 'success');
  }

  function resetarFiltros() {
    campoBusca.value = '';
    btnLimparBusca.style.display = 'none';
    if (dicaAtalhoBusca) dicaAtalhoBusca.style.display = 'inline-block';
    filtrarApenasFavoritos = false;
    filtrarApenasNovos7d = false;
    filtroDecisao.value = '';
    filtroOrgao.value = '';
    filtroPrazo.value = '';
    if (filtroLaboratorio) filtroLaboratorio.value = '';
    if (chkOcultarEncerrados) chkOcultarEncerrados.checked = true;
    selectOrdenacao.value = 'score_desc';
    sincronizarChipsComSelects();
    aplicarFiltros();
    exibirToast('Filtros restaurados!', 'info');
  }

  function exibirToast(msg, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (tipo === 'success') toast.style.borderLeftColor = 'var(--semaforo-verde-txt)';
    if (tipo === 'error') toast.style.borderLeftColor = 'var(--semaforo-vermelho-txt)';
    toast.textContent = msg;

    containerToasts.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  function truncarTexto(txt, limite) {
    if (!txt) return '';
    return txt.length > limite ? txt.substring(0, limite) + '...' : txt;
  }

  // ============================================================================
  // GESTÃO INTERNA DO FUNIL, CHECKLIST POR ÓRGÃO, AGENDA (.ICS) E RELATÓRIO PDF
  // ============================================================================
  function carregarGestaoLocal() {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE_GESTAO);
      return salvo ? JSON.parse(salvo) : {};
    } catch (e) {
      return {};
    }
  }

  function salvarGestaoLocal(sincronizarServidor = true) {
    try {
      localStorage.setItem(CHAVE_STORAGE_GESTAO, JSON.stringify(gestaoInterna));
    } catch (e) {
      // Fallback silencioso
    }
    if (sincronizarServidor) {
      fetch('/api/gestao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gestaoInterna),
      }).catch(() => { });
    }
  }

  function navegarEditalModal(direcao) {
    if (!editalSelecionado || editaisFiltrados.length <= 1) return;
    salvarGestaoDoModal(false);
    const idxAtual = editaisFiltrados.findIndex(item => item.id_edital === editalSelecionado.id_edital);
    if (idxAtual < 0) return;
    const novoIdx = idxAtual + direcao;
    if (novoIdx >= 0 && novoIdx < editaisFiltrados.length) {
      abrirModal(editaisFiltrados[novoIdx], true);
    }
  }

  function obterLaboratorioCais(ed) {
    const texto = `${ed.titulo || ''} ${ed.ideia_projeto_cais || ''} ${ed.orgao || ''}`.toLowerCase();
    if (texto.includes('semicondutor') || texto.includes('embarcad') || texto.includes('microeletrônica') || texto.includes('risc-v') || texto.includes('hardware') || texto.includes('iot')) {
      return 'Lab Semicondutores & Embarcados';
    }
    if (texto.includes('nuvem') || texto.includes('cloud') || texto.includes('cinturão digital') || texto.includes('rede') || texto.includes('ciber') || texto.includes('telecom')) {
      return 'Lab Nuvem, Redes & Cibersegurança';
    }
    if (texto.includes('hidrogênio') || texto.includes('transição energética') || texto.includes('hídric') || texto.includes('water4all') || texto.includes('caatinga') || texto.includes('biorrefino') || texto.includes('resíduos') || texto.includes('florest')) {
      return 'Lab Transição Energética & Clima';
    }
    if (texto.includes('startup') || texto.includes('catalisa') || texto.includes('centelha') || texto.includes('empreendedora') || texto.includes('empresas juniores')) {
      return 'Núcleo de Inovação & Spin-offs';
    }
    return 'Lab IA & Ciência de Dados';
  }

  function destacarTermoBusca(texto, termo) {
    const seguro = escapeHtml(texto || '');
    if (!termo || termo.length < 2) return seguro;
    const termoEscapado = escapeHtml(termo).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      const regex = new RegExp(`(${termoEscapado})`, 'gi');
      return seguro.replace(regex, '<mark class="grifo-busca">$1</mark>');
    } catch (e) {
      return seguro;
    }
  }

  function obterGestaoEdital(idEdital) {
    if (!idEdital) return { etapa: 'triagem', responsavel: '', notas: '', checks: {} };
    return gestaoInterna[idEdital] || { etapa: 'triagem', responsavel: '', notas: '', checks: {} };
  }

  function atualizarGestaoEdital(idEdital, novosCampos) {
    if (!idEdital) return;
    const atual = obterGestaoEdital(idEdital);
    gestaoInterna[idEdital] = { ...atual, ...novosCampos };
    salvarGestaoLocal();
  }

  function alternarFavoritoEdital(ed) {
    if (!ed || !ed.id_edital) return;
    const atual = obterGestaoEdital(ed.id_edital);
    const novoFav = !atual.favorito;
    atualizarGestaoEdital(ed.id_edital, { favorito: novoFav });
    const gos = editais.filter(e => {
      const dec = (e.decisao_recomendada || '').toUpperCase();
      return dec.includes('GO') && !dec.includes('NO-GO');
    }).length;
    const urgentes = editais.filter(e => {
      const dias = calcularDiasRestantes(e.prazo_submissao);
      return dias !== null && dias >= 0 && dias <= 7;
    }).length;
    atualizarContadoresChips(editais.length, gos, urgentes);
    aplicarFiltros();
    exibirToast(
      novoFav
        ? `★ "${truncarTexto(ed.titulo, 48)}" adicionado aos Favoritos da equipe CAIS!`
        : 'Removido dos Favoritos.',
      novoFav ? 'success' : 'info'
    );
  }

  function gerarMinutaTecnicaProjeto(ed) {
    if (!ed) return;
    const hojeBR = obterDataHojeBR();
    const lab = obterLaboratorioCais(ed);
    const infoG = obterGestaoEdital(ed.id_edital);
    const itensCheck = obterChecklistPorOrgao(ed);
    const checklistTxt = itensCheck.map((it, idx) => `   [ ] ${idx + 1}. (${it.cat}) ${it.texto}`).join('\n');

    const minuta = [
      '========================================================================',
      'INSTITUTO CAIS (CENTRO ÁGIL DE INOVAÇÃO E SABER) — MINUTA TÉCNICA 1-PAGE',
      'TERMO DE ABERTURA DE PROPOSTA DE PD&I E CAPTAÇÃO DE FOMENTO',
      '========================================================================',
      `Data de Emissão: ${hojeBR} | ID Radar CAIS: ${ed.id_edital || 'N/A'}`,
      `Status Interno: ${rotuloEtapaFunil(infoG.etapa || 'triagem')} | Líder Designado: ${infoG.responsavel || 'A definir pelo Comitê Técnico'}`,
      '',
      '1. IDENTIFICAÇÃO OFICIAL DA CHAMADA',
      `   • Órgão Financiador: ${ed.orgao}`,
      `   • Chamada / Edital: ${ed.titulo}`,
      `   • Link Oficial Verificado: ${ed.link}`,
      `   • Prazo Final de Submissão: ${ed.prazo_submissao}`,
      `   • Dotação / Recurso Financiável: ${ed.valor_financiado}`,
      `   • Contrapartida Exigida: ${ed.contrapartida}`,
      '',
      '2. TESE DE ADERÊNCIA E RECOMENDAÇÃO ESTRATÉGICA CAIS',
      `   • Semáforo & Nota Ponderada: ${ed.decisao_recomendada} (Score ${Number(ed.score_ponderado || 0).toFixed(2)}/10)`,
      `   • Matriz Técnica: Aderência ${ed.nota_aderencia}/10 | Chance ${ed.nota_chance_aprovacao}/10 | Financeiro ${ed.nota_financeira}/10`,
      `   • Núcleo Executor Recomendado: ${lab}`,
      `   • Objeto da Chamada: ${ed.resumo_objetivo}`,
      `   • Justificativa Executiva CAIS: ${ed.justificativa_cais}`,
      '',
      '3. ESCOPO TÉCNICO PRELIMINAR E PACOTES DE TRABALHO (WORK PACKAGES)',
      `   • Proposta Central CAIS: ${ed.ideia_projeto_cais}`,
      '   • Estrutura Sugerida de Pacotes de Trabalho (WPs):',
      '     - WP1 (Requisitos & Arquitetura): Levantamento de requisitos técnicos, estado da arte e especificação da arquitetura junto ao parceiro.',
      `     - WP2 (P&D Nuclear — ${lab}): Desenvolvimento dos algoritmos, modelos de IA, software ou protótipo de hardware embarcado.`,
      '     - WP3 (Integração & Validação em Ambiente Real): Testes de bancada/campo, aferição de métricas de desempenho (TRL) e segurança.',
      '     - WP4 (Transferência Tecnológica & Propriedade Intelectual): Documentação técnica, registro de software/patente (INPI) e capacitação.',
      '',
      '4. ELEGIBILIDADE E ARRANJO DE CONSÓRCIO RECOMENDADO',
      `   • Regras de Elegibilidade: ${ed.publico_elegivel}`,
      `   • Parceiros Estratégicos Sugeridos: ${ed.parceiros_sugeridos}`,
      '',
      '5. CHECKLIST IMEDIATO DE SUBMISSÃO (' + ed.orgao + ')',
      checklistTxt,
      '========================================================================',
    ].join('\n');

    copiarParaAreaDeTransferencia(
      minuta,
      'Minuta Técnica (1-Page Pitch com Work Packages) copiada! Cole no Google Docs, Word ou Notion.'
    );
  }

  function rotuloEtapaFunil(etapa) {
    const mapa = {
      triagem: 'Em Triagem',
      articulacao: 'Em Articulação',
      redacao: 'Redigindo Proposta',
      submetido: 'Submetido',
    };
    return mapa[etapa] || 'Em Triagem';
  }

  function obterChecklistPorOrgao(ed) {
    const org = (ed.orgao || '').toUpperCase();
    if (org.includes('FUNCAP')) {
      return [
        { id: 'fc_1', cat: 'CADASTRO', texto: 'Verificar vínculo e currículo atualizado do Coordenador (Doutor) na Plataforma Montenegro FUNCAP' },
        { id: 'fc_2', cat: 'ANUÊNCIA', texto: 'Emitir Carta de Anuência Institucional assinada pela direção do Instituto CAIS / Reitoria ou PPG da UECE' },
        { id: 'fc_3', cat: 'TÉCNICO', texto: 'Estruturar Plano de Trabalho Técnico com metas trimestrais, entregáveis de PD&I e indicadores para o Ceará' },
        { id: 'fc_4', cat: 'EQUIPE', texto: 'Definir plano de alocação de bolsistas (Doutores/Mestres/BICT) e pesquisadores associados do LDI/CAIS' },
        { id: 'fc_5', cat: 'ORÇAMENTO', texto: 'Detalhar memória de cálculo das rubricas (Bolsas, Custeio e Capital) respeitando os tetos do edital FUNCAP' },
        { id: 'fc_6', cat: 'SUBMISSÃO', texto: 'Submeter formulário eletrônico e anexos PDF assinados digitalmente (Gov.br) na Plataforma Montenegro' },
      ];
    }
    if (org.includes('FINEP')) {
      return [
        { id: 'fn_1', cat: 'CONSÓRCIO', texto: 'Formalizar Termo de Compromisso / Acordo de Parceria entre a Empresa Líder e o Instituto CAIS (ICT Coexecutora)' },
        { id: 'fn_2', cat: 'CADASTRO', texto: 'Validar cadastro institucional ativo do Instituto CAIS/UECE e da Empresa Líder no portal FINEP / FAP' },
        { id: 'fn_3', cat: 'TÉCNICO', texto: 'Redigir memorial descritivo de inovação tecnológica, grau de maturidade (TRL inicial e final) e risco tecnológico' },
        { id: 'fn_4', cat: 'FINANCEIRO', texto: 'Dimensionar orçamento de serviços técnicos especializados e equipe de P&D do CAIS + contrapartida da empresa' },
        { id: 'fn_5', cat: 'JURÍDICO', texto: 'Conferir certidões de regularidade fiscal (CND Federal, FGTS, Trabalhista) e cláusulas de Propriedade Intelectual' },
        { id: 'fn_6', cat: 'SUBMISSÃO', texto: 'Transmitir proposta no Sistema de Apoio e Financiamento da FINEP com assinatura eletrônica dos representantes' },
      ];
    }
    if (org.includes('CNPQ')) {
      return [
        { id: 'cn_1', cat: 'LATTES', texto: 'Atualizar Currículo Lattes do Coordenador do Projeto e de todos os pesquisadores doutores da equipe CAIS/UECE' },
        { id: 'cn_2', cat: 'PICC', texto: 'Verificar cadastro institucional na Plataforma Integrada Carlos Chagas (PICC / CNPq)' },
        { id: 'cn_3', cat: 'PARCERIA', texto: 'Coletar Carta de Anuência / Termo de Adesão da empresa ou instituição parceira (quando exigido pela chamada)' },
        { id: 'cn_4', cat: 'TÉCNICO', texto: 'Elaborar Projeto de Pesquisa Aplicada destacando originalidade, metodologia científica e impacto tecnológico' },
        { id: 'cn_5', cat: 'ORÇAMENTO', texto: 'Distribuir cotas de bolsas (MAI/DAI, DT, IC, Pós-Doc) e itens de custeio/taxa de bancada permitidos' },
        { id: 'cn_6', cat: 'SUBMISSÃO', texto: 'Enviar proposta na Plataforma Carlos Chagas até o horário limite de Brasília especificado na chamada' },
      ];
    }
    if (org.includes('ETICE')) {
      return [
        { id: 'et_1', cat: 'HABILITAÇÃO', texto: 'Reunir documentação jurídica, fiscal e estatutária do Instituto CAIS e parceiros tecnológicos do consórcio' },
        { id: 'et_2', cat: 'ATESTADOS', texto: 'Selecionar Atestados de Capacidade Técnica em Arquitetura em Nuvem, IA, Redes ou Segurança da Informação' },
        { id: 'et_3', cat: 'ARQUITETURA', texto: 'Documentar catálogo de serviços técnicos e arquitetura de referência para atendimento ao Governo do Ceará' },
        { id: 'et_4', cat: 'EQUIPE', texto: 'Comprovar certificações técnicas e titulação da equipe de engenheiros de software, dados e redes do CAIS' },
        { id: 'et_5', cat: 'CONFORMIDADE', texto: 'Validar requisitos de LGPD, segurança cibernética e soberania de dados exigidos pelo termo da ETICE' },
        { id: 'et_6', cat: 'PROTOCOLO', texto: 'Protocolar dossiê de pré-qualificação / credenciamento permanente junto à comissão da ETICE' },
      ];
    }
    if (org.includes('PETROBRAS')) {
      return [
        { id: 'pb_1', cat: 'PORTAL', texto: 'Realizar ou atualizar cadastro da instituição/equipe no Portal Petrobras Conexões para Inovação (conexoes-inovacao.petrobras.com.br)' },
        { id: 'pb_2', cat: 'ANP / ICT', texto: 'Confirmar enquadramento da unidade parceira (UECE / Instituto CAIS) no credenciamento de ICTs da Cláusula de PD&I da ANP' },
        { id: 'pb_3', cat: 'DESAFIO', texto: 'Selecionar o desafio aberto ou módulo aderente (Parcerias Tecnológicas, Radar de Soluções ou Módulo Startups) e validar requisitos' },
        { id: 'pb_4', cat: 'TÉCNICO', texto: 'Estruturar proposta técnica com entregas, maturidade tecnológica (TRL), equipe de pesquisadores e aplicabilidade operacional' },
        { id: 'pb_5', cat: 'PI / JURÍDICO', texto: 'Alinhar minuta de confidencialidade (NDA), propriedade intelectual e plano de trabalho conforme diretrizes do CENPES/Petrobras' },
        { id: 'pb_6', cat: 'SUBMISSÃO', texto: 'Submeter a proposta oficial na plataforma Conexões para Inovação e acompanhar o retorno da banca técnica do CENPES' },
      ];
    }
    if (org.includes('CONFAP') || org.includes('HORIZON')) {
      return [
        { id: 'he_1', cat: 'CONSÓRCIO UE', texto: 'Articular participação com pelo menos 3 instituições de Estados-Membros/Associados da União Europeia' },
        { id: 'he_2', cat: 'ELEGIBILIDADE', texto: 'Confirmar diretrizes específicas de cofinanciamento da FUNCAP (Ceará) para pesquisadores brasileiros na chamada' },
        { id: 'he_3', cat: 'PIC NUMBER', texto: 'Validar o Participant Identification Code (PIC) da instituição no EU Funding & Tenders Portal' },
        { id: 'he_4', cat: 'WORK PACKAGE', texto: 'Definir o Work Package (Pacote de Trabalho) liderado pelo CAIS/UECE (ex: WP de IA, Gêmeos Digitais ou IoT)' },
        { id: 'he_5', cat: 'ORÇAMENTO', texto: 'Elaborar orçamento espelho: solicitação internacional em Euros (consórcio) + rubrica estadual via FUNCAP/CONFAP' },
        { id: 'he_6', cat: 'SUBMISSÃO', texto: 'Submeter a proposta conjunta em inglês no portal europeu + cadastro complementar na plataforma CONFAP/FUNCAP' },
      ];
    }
    return [
      { id: 'ge_1', cat: 'EDITAL', texto: 'Realizar leitura integral do regulamento oficial e anexos para confirmar enquadramento do Instituto CAIS/UECE' },
      { id: 'ge_2', cat: 'PARCEIROS', texto: 'Articular reunião de alinhamento com os parceiros estratégicos (UECE, LDI e indústria parceira) e colher anuência' },
      { id: 'ge_3', cat: 'ESCOPO', texto: 'Estruturar o escopo técnico preliminar baseado na sugestão de projeto do Radar CAIS, com cronograma físico' },
      { id: 'ge_4', cat: 'ORÇAMENTO', texto: 'Levantar custos de equipe de P&D, bolsas, equipamentos e verificar exigência de contrapartida econômica/financeira' },
      { id: 'ge_5', cat: 'DOCUMENTOS', texto: 'Atualizar certidões institucionais, estatuto de ICT sem fins lucrativos e currículos da equipe executora' },
      { id: 'ge_6', cat: 'SUBMISSÃO', texto: 'Realizar cadastro e submissão na plataforma oficial do órgão financiador com antecedência mínima de 48h' },
    ];
  }

  function popularAbaChecklistModal(ed) {
    if (!ed) return;
    const infoG = obterGestaoEdital(ed.id_edital);
    if (selectEtapaFunilModal) selectEtapaFunilModal.value = infoG.etapa || 'triagem';
    if (inputResponsavelModal) inputResponsavelModal.value = infoG.responsavel || '';
    if (inputNotasInternasModal) inputNotasInternasModal.value = infoG.notas || '';
    if (labelChecklistOrgao) labelChecklistOrgao.textContent = `Requisitos de Submissão • ${ed.orgao}`;

    const itens = obterChecklistPorOrgao(ed);
    const checksSalvos = infoG.checks || {};

    if (!listaItensChecklist) return;
    listaItensChecklist.innerHTML = '';

    const atualizarContadorChecklist = () => {
      const estadoAtual = obterGestaoEdital(ed.id_edital).checks || {};
      const concluidos = itens.filter(it => Boolean(estadoAtual[it.id])).length;
      if (badgeProgressoChecklist) {
        badgeProgressoChecklist.textContent = `${concluidos}/${itens.length} concluídos`;
      }
    };

    itens.forEach(item => {
      const marcado = Boolean(checksSalvos[item.id]);
      const labelEl = document.createElement('label');
      labelEl.className = `item-checklist-linha ${marcado ? 'concluido' : ''}`;
      labelEl.innerHTML = `
        <input type="checkbox" ${marcado ? 'checked' : ''}>
        <div class="texto-item-checklist">
          <span class="tag-categoria-check">${escapeHtml(item.cat)}</span>
          <span>${escapeHtml(item.texto)}</span>
        </div>
      `;

      const checkbox = labelEl.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => {
        const atual = obterGestaoEdital(ed.id_edital);
        const novosChecks = { ...(atual.checks || {}), [item.id]: checkbox.checked };
        atualizarGestaoEdital(ed.id_edital, { checks: novosChecks });
        labelEl.classList.toggle('concluido', checkbox.checked);
        atualizarContadorChecklist();
      });

      listaItensChecklist.appendChild(labelEl);
    });

    atualizarContadorChecklist();
  }

  function salvarGestaoDoModal(mostrarToast = true) {
    if (!editalSelecionado) return;
    const etapa = selectEtapaFunilModal ? selectEtapaFunilModal.value : 'triagem';
    const responsavel = inputResponsavelModal ? inputResponsavelModal.value.trim() : '';
    const notas = inputNotasInternasModal ? inputNotasInternasModal.value.trim() : '';

    atualizarGestaoEdital(editalSelecionado.id_edital, { etapa, responsavel, notas });
    renderizarResultados();
    if (mostrarToast) {
      exibirToast(`Status salvo no Funil CAIS (${rotuloEtapaFunil(etapa)})!`, 'success');
    }
  }

  function exportarEventoCalendarioIcs(ed) {
    if (!ed) return;
    const match = String(ed.prazo_submissao || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
    let dataBase;
    if (match) {
      const [_, d, m, y] = match;
      dataBase = new Date(Number(y), Number(m) - 1, Number(d));
    } else {
      dataBase = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    const formatarDataIcs = (dt) => {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      return `${y}${m}${d}`;
    };
    const dtInicio = formatarDataIcs(dataBase);
    const dataFim = new Date(dataBase.getFullYear(), dataBase.getMonth(), dataBase.getDate() + 1);
    const dtFim = formatarDataIcs(dataFim);

    const limparIcs = (str) => String(str || '').replace(/[\r\n]+/g, ' ').replace(/[,;\\]/g, ' ').trim();
    const sumario = limparIcs(`[Prazo Edital ${ed.orgao}] ${ed.titulo}`);
    const descricao = limparIcs(
      `Órgão: ${ed.orgao} | Nota CAIS: ${Number(ed.score_ponderado || 0).toFixed(1)}/10 | Recurso: ${ed.valor_financiado} | Proposta Sugerida CAIS: ${ed.ideia_projeto_cais} | Link Oficial: ${ed.link}`
    );

    const conteudoIcs = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Instituto CAIS//Radar CAIS Inteligencia de Editais//PT-BR',
      'BEGIN:VEVENT',
      `UID:radar-cais-${ed.id_edital || Date.now()}@institutocais.org.br`,
      `DTSTAMP:${dtInicio}T120000Z`,
      `DTSTART;VALUE=DATE:${dtInicio}`,
      `DTEND;VALUE=DATE:${dtFim}`,
      `SUMMARY:${sumario}`,
      `DESCRIPTION:${descricao}`,
      `URL:${ed.link || ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([conteudoIcs], { type: 'text/calendar;charset=utf-8' });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = `prazo_${(ed.orgao || 'edital').toLowerCase().replace(/[^a-z0-9]/g, '_')}_${ed.id_edital || 'cais'}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlBlob);
    exibirToast('Evento de calendário (.ics) baixado! Abra para adicionar ao Outlook ou Google Agenda.', 'success');
  }

  function gerarRelatorioExecutivoImpressao() {
    if (editais.length === 0) {
      exibirToast('Carregue os editais antes de gerar o relatório executivo.', 'info');
      return;
    }

    const hojeBR = obterDataHojeBR();
    const prioritarios = editaisFiltrados.filter(ed => {
      const dias = calcularDiasRestantes(ed.prazo_submissao);
      const isEnc = dias !== null && dias < 0;
      const dec = (ed.decisao_recomendada || '').toUpperCase();
      return !isEnc && (dec.includes('GO') || dec.includes('AVALIAR'));
    });

    const listaRelatorio = prioritarios.length > 0 ? prioritarios : editaisFiltrados;

    const linhasHtml = listaRelatorio.map((ed, idx) => {
      const infoG = obterGestaoEdital(ed.id_edital);
      const etapaTxt = rotuloEtapaFunil(infoG.etapa || 'triagem');
      const liderTxt = infoG.responsavel ? ` • Líder: ${escapeHtml(infoG.responsavel)}` : '';
      return `
        <tr>
          <td style="font-weight:700; color:#0B2545;">${idx + 1}. ${escapeHtml(ed.orgao)}</td>
          <td>
            <div style="font-weight:700; color:#0F172A; margin-bottom:4px;">${escapeHtml(ed.titulo)}</div>
            <div style="font-size:11.5px; color:#334155; margin-bottom:4px;"><strong>Proposta Sugerida CAIS:</strong> ${escapeHtml(ed.ideia_projeto_cais || ed.resumo_objetivo)}</div>
            <div style="font-size:11px; color:#475569;"><strong>Parceiros:</strong> ${escapeHtml(ed.parceiros_sugeridos || 'UECE / LDI')} &nbsp;|&nbsp; <strong>Status Interno:</strong> ${escapeHtml(etapaTxt)}${liderTxt}</div>
          </td>
          <td style="font-family:monospace; font-weight:600; color:#0369A1;">${escapeHtml(ed.valor_financiado)}</td>
          <td style="font-family:monospace; white-space:nowrap;">${escapeHtml(ed.prazo_submissao)}</td>
          <td style="font-family:monospace; font-weight:700; text-align:center;">${Number(ed.score_ponderado || 0).toFixed(1)}/10</td>
        </tr>
      `;
    }).join('');

    const janelaPrint = window.open('', '_blank');
    if (!janelaPrint) {
      exibirToast('Permita pop-ups no navegador para abrir o Relatório Executivo para impressão/PDF.', 'error');
      return;
    }

    janelaPrint.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Relatório Executivo de Editais e Fomento — Instituto CAIS (${hojeBR})</title>
        <style>
          body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #0F172A; margin: 24px; line-height: 1.45; }
          .cabecalho { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0B2545; padding-bottom: 12px; margin-bottom: 18px; }
          .titulo { font-size: 20px; font-weight: 700; color: #0B2545; margin: 0; }
          .subtitulo { font-size: 12.5px; color: #475569; margin: 4px 0 0 0; }
          .meta { font-size: 12px; color: #334155; text-align: right; }
          .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 18px; }
          .kpi-box { border: 1px solid #CBD5E1; border-top: 3px solid #0B2545; border-radius: 6px; padding: 10px 14px; background: #F8FAFC; }
          .kpi-label { font-size: 10.5px; text-transform: uppercase; color: #475569; font-weight: 700; }
          .kpi-val { font-size: 20px; font-weight: 700; color: #0F172A; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #0B2545; color: #FFFFFF; text-align: left; padding: 9px 10px; font-size: 11px; text-transform: uppercase; }
          td { border-bottom: 1px solid #CBD5E1; padding: 10px; vertical-align: top; }
          tr:nth-child(even) { background: #F8FAFC; }
          .acoes-topo { margin-bottom: 16px; display: flex; justify-content: flex-end; gap: 10px; }
          .btn-print { background: #0284C7; color: #FFF; border: none; padding: 8px 16px; border-radius: 5px; font-weight: 600; cursor: pointer; }
          @media print { .acoes-topo { display: none; } body { margin: 10mm; } }
        </style>
      </head>
      <body>
        <div class="acoes-topo">
          <button class="btn-print" onclick="window.print()">Imprimir / Salvar como PDF</button>
        </div>
        <div class="cabecalho">
          <div>
            <h1 class="titulo">Radar CAIS — Pauta Executiva de Captação e Fomento em PD&amp;I</h1>
            <p class="subtitulo">Instituto CAIS (Centro Ágil de Inovação e Saber) • Base Oficial Auditada</p>
          </div>
          <div class="meta">
            <div><strong>Data de Emissão:</strong> ${hojeBR}</div>
            <div><strong>Oportunidades Qualificadas:</strong> ${listaRelatorio.length} vigentes</div>
          </div>
        </div>
        <div class="kpis">
          <div class="kpi-box"><div class="kpi-label">Total Mapeado</div><div class="kpi-val">${editais.length} editais</div></div>
          <div class="kpi-box"><div class="kpi-label">Recomendados (GO)</div><div class="kpi-val" style="color:#065F46;">${kpiGo.textContent} prioritários</div></div>
          <div class="kpi-box"><div class="kpi-label">Prazo Crítico (&le; 7d)</div><div class="kpi-val" style="color:#9F1239;">${kpiUrgentes.textContent} urgentes</div></div>
          <div class="kpi-box"><div class="kpi-label">Nota Média CAIS</div><div class="kpi-val">${kpiMediaScore.textContent}</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:13%;">Órgão</th>
              <th style="width:52%;">Chamada Pública &amp; Plano de Ação Sugerido para o CAIS</th>
              <th style="width:16%;">Recurso / Teto</th>
              <th style="width:11%;">Prazo</th>
              <th style="width:8%;">Nota</th>
            </tr>
          </thead>
          <tbody>
            ${linhasHtml}
          </tbody>
        </table>
      </body>
      </html>
    `);
    janelaPrint.document.close();
  }

  function montarMensagemChefeTop5(top5, totalVigentes) {
    const hojeBR = obterDataHojeBR();
    const linhas = [
      'Olá! Tudo bem?',
      '',
      `Preparei um resumo atualizado da nossa prospecção de editais (${hojeBR}). Monitoramos ${editais.length} chamadas oficiais e hoje temos ${totalVigentes} oportunidades abertas. Separei os 5 editais com maior aderência para o Instituto CAIS:`,
      ''
    ];

    top5.forEach((ed, idx) => {
      const dias = calcularDiasRestantes(ed.prazo_submissao);
      const prazoLimpo = String(ed.prazo_submissao || '').toLowerCase().includes('fluxo')
        ? 'Fluxo Contínuo'
        : (dias !== null && dias >= 0 ? `até ${ed.prazo_submissao} (${dias}d)` : (ed.prazo_submissao || 'Consultar edital'));
      const ideiaCurta = truncarTexto(String(ed.ideia_projeto_cais || ed.resumo_objetivo || '').replace(/\s+/g, ' ').trim(), 165);
      const tituloLimpo = String(ed.titulo || '').toLowerCase().startsWith(String(ed.orgao || '').toLowerCase())
        ? ed.titulo
        : `${ed.orgao} — ${ed.titulo}`;
      linhas.push(`${idx + 1}. ${tituloLimpo} (Nota ${Number(ed.score_ponderado || 0).toFixed(1)}/10)`);
      linhas.push(`   • Recurso: ${ed.valor_financiado || 'Conforme edital'} | Prazo: ${prazoLimpo}`);
      linhas.push(`   • O que podemos propor: ${ideiaCurta}`);
      linhas.push('');
    });

    linhas.push('Já deixei mapeado o escopo inicial e os parceiros recomendados para cada um deles. Qual dessas frentes faz mais sentido priorizarmos primeiro?');
    return linhas.join('\n');
  }

  function abrirMapaBolsoTop5() {
    if (editais.length === 0) {
      exibirToast('Carregue os editais antes de abrir o Mapa Top 5.', 'info');
      return;
    }

    const hojeBR = obterDataHojeBR();
    const vigentes = editais.filter(ed => {
      const dias = calcularDiasRestantes(ed.prazo_submissao);
      const dec = (ed.decisao_recomendada || '').toUpperCase();
      return !((dias !== null && dias < 0) || dec.includes('ENCERRADO'));
    });

    const ordenados = [...vigentes].sort((a, b) => {
      const diffScore = (Number(b.score_ponderado) || 0) - (Number(a.score_ponderado) || 0);
      if (Math.abs(diffScore) > 0.001) return diffScore;
      const diffAder = (Number(b.nota_aderencia) || 0) - (Number(a.nota_aderencia) || 0);
      if (Math.abs(diffAder) > 0.001) return diffAder;
      return (Number(b.nota_chance_aprovacao) || 0) - (Number(a.nota_chance_aprovacao) || 0);
    });

    const top5 = ordenados.slice(0, 5);
    if (top5.length === 0) {
      exibirToast('Nenhum edital vigente encontrado no momento.', 'info');
      return;
    }

    const mensagemChefe = montarMensagemChefeTop5(top5, vigentes.length);

    const cardsTop5Html = top5.map((ed, idx) => {
      const dias = calcularDiasRestantes(ed.prazo_submissao);
      const prazoTxt = formatarPrazoDidatico(ed.prazo_submissao, dias);
      const lab = obterLaboratorioCais(ed);
      const score = Number(ed.score_ponderado || 0).toFixed(1);
      const passosChecklist = obterChecklistPorOrgao(ed).slice(0, 3);
      const contrapartida = ed.contrapartida || 'Não exigida';
      const pontosFortes = [
        `Alta compatibilidade técnica com o CAIS (${ed.nota_aderencia || 0}/10) — núcleo indicado: ${lab}.`,
        ed.justificativa_cais || 'Forte aderência ao portfólio de PD&I do Instituto CAIS.',
        `Chance estimada de aprovação: ${ed.nota_chance_aprovacao || 0}/10 • Contrapartida: ${contrapartida}.`
      ];

      const tituloIndividual = String(ed.titulo || '').toLowerCase().startsWith(String(ed.orgao || '').toLowerCase())
        ? ed.titulo
        : `${ed.orgao} — ${ed.titulo}`;
      const textoIndividual = [
        `Olá! Segue o resumo do edital #${idx + 1} do nosso Mapa Top 5 CAIS:`,
        '',
        `• Edital: ${tituloIndividual}`,
        `• Compatibilidade CAIS: ${score}/10`,
        `• Recurso: ${ed.valor_financiado || 'Conforme edital'}`,
        `• Prazo: ${prazoTxt}`,
        `• Contrapartida: ${contrapartida}`,
        '',
        `Por que vale a pena: ${ed.justificativa_cais || 'Alta aderência ao Instituto CAIS.'}`,
        `Escopo sugerido: ${ed.ideia_projeto_cais || ed.resumo_objetivo || ''}`,
        `Parceiros sugeridos: ${ed.parceiros_sugeridos || 'UECE / Parceiros CAIS'}`,
        `Link oficial: ${ed.link || ''}`
      ].join('\n');

      return `
        <article class="card-top5">
          <div class="card-topo">
            <div class="card-topo-esq">
              <span class="pos-badge">${idx + 1}º lugar</span>
              <span class="orgao-badge">${escapeHtml(ed.orgao)}</span>
              <span class="lab-badge">${escapeHtml(lab)}</span>
            </div>
            <div class="nota-destaque">Nota ${score}<span>/10</span></div>
          </div>

          <h2 class="card-titulo">${escapeHtml(ed.titulo)}</h2>

          <div class="metricas-linha">
            <div class="metrica-item">
              <span class="metrica-label">Recurso disponível</span>
              <strong class="metrica-valor destaque-azul">${escapeHtml(ed.valor_financiado || 'Consultar edital')}</strong>
            </div>
            <div class="metrica-item">
              <span class="metrica-label">Prazo de submissão</span>
              <strong class="metrica-valor">${escapeHtml(prazoTxt)}</strong>
            </div>
            <div class="metrica-item">
              <span class="metrica-label">Contrapartida</span>
              <strong class="metrica-valor">${escapeHtml(contrapartida)}</strong>
            </div>
          </div>

          <div class="secao-card">
            <span class="secao-label">Resumo objetivo</span>
            <p>${escapeHtml(ed.resumo_objetivo || 'Chamada oficial de fomento à pesquisa e inovação.')}</p>
          </div>

          <div class="grade-dupla">
            <div class="box-suave box-verde">
              <span class="secao-label verde">Pontos fortes deste edital</span>
              <ul>
                ${pontosFortes.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
              </ul>
            </div>

            <div class="box-suave box-azul">
              <span class="secao-label azul">Escopo sugerido para o CAIS</span>
              <p>${escapeHtml(ed.ideia_projeto_cais || 'Estruturar proposta aplicada com equipe de PD&I do CAIS.')}</p>
              <p class="parceiro-linha"><strong>Com quem articular:</strong> ${escapeHtml(ed.parceiros_sugeridos || 'UECE e parceiros do ecossistema CAIS.')}</p>
            </div>
          </div>

          <div class="box-suave box-passos">
            <span class="secao-label">Como submeter (primeiros passos práticos)</span>
            <ol>
              ${passosChecklist.map(st => `<li>${escapeHtml(st.texto)}</li>`).join('')}
            </ol>
          </div>

          <div class="card-rodape">
            <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
              <a href="${escapeHtml(ed.link || '#')}" target="_blank" rel="noopener noreferrer" class="btn-copiar-item" style="text-decoration:none; background:#0284C7; color:#FFFFFF; border-color:#0284C7;" title="Abrir a página oficial do órgão financiador">🌐 Página Oficial</a>
              <a href="${escapeHtml(obterLinkDiretoEdital(ed))}" target="_blank" rel="noopener noreferrer" class="btn-copiar-item" style="text-decoration:none;" title="Abrir este edital direto no painel Radar CAIS">🔗 Abrir no Radar CAIS</a>
            </div>
            <button type="button" class="btn-copiar-item" data-texto="${escapeHtml(textoIndividual)}">Copiar resumo</button>
          </div>
        </article>
      `;
    }).join('');

    const janelaMapa = window.open('', '_blank');
    if (!janelaMapa) {
      exibirToast('Permita pop-ups no navegador para abrir a tela do Mapa Top 5.', 'error');
      return;
    }

    janelaMapa.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mapa de Bolso CAIS — Top 5 Editais Prioritários (${hojeBR})</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: #DCE3EC;
            color: #090D16;
            line-height: 1.58;
            padding: 24px 16px 48px 16px;
          }
          .container { max-width: 920px; margin: 0 auto; }
          .topo-pagina {
            background: linear-gradient(135deg, #071933 0%, #0B2545 100%);
            color: #FFFFFF;
            border: 1px solid #1E3A5F;
            border-radius: 12px;
            padding: 22px 24px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            flex-wrap: wrap;
            box-shadow: 0 6px 18px rgba(7, 25, 51, 0.22);
          }
          .eyebrow {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #38BDF8;
            margin-bottom: 4px;
          }
          h1 { margin: 0; font-size: 21px; line-height: 1.3; color: #FFFFFF; }
          .sub { margin: 6px 0 0 0; font-size: 13.5px; color: #E2E8F0; max-width: 580px; }
          .acoes-topo { display: flex; gap: 8px; flex-wrap: wrap; }
          .btn {
            font-family: inherit;
            font-size: 13px;
            font-weight: 700;
            padding: 9px 15px;
            border-radius: 8px;
            cursor: pointer;
            border: 1px solid transparent;
            transition: all 0.15s ease;
          }
          .btn-primario { background: #0284C7; color: #FFFFFF; border-color: #0369A1; }
          .btn-primario:hover { background: #0369A1; }
          .btn-claro { background: rgba(255,255,255,0.16); color: #FFFFFF; border-color: rgba(255,255,255,0.38); }
          .btn-claro:hover { background: rgba(255,255,255,0.26); }

          .box-mensagem-chefe {
            background: #FFFFFF;
            border: 1px solid #64748B;
            border-left: 5px solid #0B2545;
            border-radius: 10px;
            padding: 18px 20px;
            margin-bottom: 24px;
            box-shadow: 0 4px 12px rgba(11, 37, 69, 0.10);
          }
          .topo-box-msg {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }
          .topo-box-msg h2 { margin: 0; font-size: 16px; color: #090D16; }
          .dica-msg { font-size: 12.5px; color: #334155; font-weight: 500; margin: 2px 0 0 0; }
          .area-msg {
            width: 100%;
            min-height: 185px;
            font-family: inherit;
            font-size: 13.5px;
            font-weight: 500;
            line-height: 1.55;
            color: #090D16;
            background: #F8FAFC;
            border: 1.5px solid #64748B;
            border-radius: 8px;
            padding: 12px;
            resize: vertical;
          }
          .area-msg:focus { outline: none; border-color: #0284C7; background: #FFFFFF; }

          .card-top5 {
            background: #FFFFFF;
            border: 1px solid #94A3B8;
            border-top: 4px solid #0B2545;
            border-radius: 12px;
            padding: 20px 22px;
            margin-bottom: 18px;
            box-shadow: 0 4px 14px rgba(11, 37, 69, 0.10);
            page-break-inside: avoid;
          }
          .card-topo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }
          .card-topo-esq { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
          .pos-badge {
            background: #0B2545;
            color: #FFFFFF;
            font-size: 11.5px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 999px;
          }
          .orgao-badge {
            background: #075985;
            color: #FFFFFF;
            font-size: 11.5px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
          }
          .lab-badge {
            background: #E2E8F0;
            color: #0F172A;
            border: 1px solid #94A3B8;
            font-size: 11.5px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 6px;
          }
          .nota-destaque {
            font-size: 15.5px;
            font-weight: 800;
            color: #FFFFFF;
            background: #047857;
            border: 1px solid #065F46;
            padding: 5px 12px;
            border-radius: 8px;
          }
          .nota-destaque span { font-size: 12px; font-weight: 600; color: #D1FAE5; }
          .card-titulo { margin: 0 0 14px 0; font-size: 17.5px; font-weight: 700; color: #090D16; line-height: 1.35; }

          .metricas-linha {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 14px;
          }
          .metrica-item {
            background: #F1F5F9;
            border: 1px solid #94A3B8;
            border-radius: 8px;
            padding: 10px 12px;
          }
          .metrica-label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: #334155;
            margin-bottom: 3px;
          }
          .metrica-valor { font-size: 13.5px; font-weight: 700; color: #090D16; }
          .destaque-azul { color: #075985; }

          .secao-card { margin-bottom: 14px; }
          .secao-card p { margin: 4px 0 0 0; font-size: 13.5px; font-weight: 500; color: #0F172A; }
          .secao-label {
            display: block;
            font-size: 11.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #0B2545;
            margin-bottom: 6px;
          }
          .secao-label.verde { color: #065F46; }
          .secao-label.azul { color: #075985; }

          .grade-dupla {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 12px;
          }
          .box-suave {
            border-radius: 8px;
            padding: 13px 15px;
            font-size: 13px;
            font-weight: 500;
            color: #0F172A;
          }
          .box-verde { background: #ECFDF5; border: 1px solid #34D399; border-left: 4px solid #047857; }
          .box-azul { background: #F0F9FF; border: 1px solid #38BDF8; border-left: 4px solid #0284C7; }
          .box-passos { background: #F8FAFC; border: 1px solid #94A3B8; border-left: 4px solid #0B2545; margin-bottom: 14px; }
          .box-suave ul, .box-suave ol { margin: 0; padding-left: 18px; }
          .box-suave li { margin-bottom: 5px; }
          .box-suave p { margin: 0 0 8px 0; }
          .parceiro-linha { margin-bottom: 0 !important; font-size: 12.5px; color: #0F172A; }

          .card-rodape {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            padding-top: 12px;
            border-top: 1px solid #CBD5E1;
          }
          .link-oficial {
            font-size: 13px;
            font-weight: 700;
            color: #0369A1;
            text-decoration: none;
          }
          .link-oficial:hover { text-decoration: underline; }
          .btn-copiar-item {
            font-family: inherit;
            font-size: 12.5px;
            font-weight: 700;
            color: #0B2545;
            background: #FFFFFF;
            border: 1.5px solid #64748B;
            border-radius: 7px;
            padding: 7px 13px;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .btn-copiar-item:hover { background: #F1F5F9; border-color: #0B2545; }

          .aviso-copia {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #065F46;
            color: #FFFFFF;
            font-size: 13px;
            font-weight: 600;
            padding: 10px 16px;
            border-radius: 8px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.18);
            display: none;
          }

          @media (max-width: 720px) {
            .metricas-linha, .grade-dupla { grid-template-columns: 1fr; }
            .area-msg { font-size: 16px; }
          }
          @media print {
            body { background: #FFFFFF; padding: 0; }
            .acoes-topo, .box-mensagem-chefe, .btn-copiar-item { display: none !important; }
            .card-top5 { box-shadow: none; border-color: #CBD5E1; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="topo-pagina">
            <div>
              <div class="eyebrow">Mapa de Bolso • Radar CAIS (${hojeBR})</div>
              <h1>Top 5 Editais Prioritários para o Instituto CAIS</h1>
              <p class="sub">
                Seleção automática dos 5 editais abertos com maior aderência técnica e institucional
                (de ${editais.length} monitorados • ${vigentes.length} vigentes hoje), prontos para apresentação à diretoria.
              </p>
            </div>
            <div class="acoes-topo">
              <button type="button" class="btn btn-primario" id="btnCopiarChefeTopo">Copiar Mensagem para o Chefe</button>
              <button type="button" class="btn btn-claro" onclick="window.print()">Imprimir / Salvar PDF</button>
            </div>
          </header>

          <section class="box-mensagem-chefe">
            <div class="topo-box-msg">
              <div>
                <h2>Mensagem pronta para enviar ao seu gestor</h2>
                <p class="dica-msg">Texto direto, respeitoso e objetivo — você pode ajustar antes de copiar para WhatsApp, Teams ou E-mail.</p>
              </div>
              <button type="button" class="btn btn-primario" id="btnCopiarChefeBox">Copiar Mensagem</button>
            </div>
            <textarea id="textoMensagemChefe" class="area-msg">${escapeHtml(mensagemChefe)}</textarea>
          </section>

          <section>
            ${cardsTop5Html}
          </section>
        </div>

        <div id="avisoCopia" class="aviso-copia">Copiado para a área de transferência!</div>

        <script>
          function copiarTexto(texto, rotulo) {
            const mostrar = () => {
              const el = document.querySelector('#avisoCopia');
              el.textContent = rotulo || 'Copiado!';
              el.style.display = 'block';
              clearTimeout(window._tAviso);
              window._tAviso = setTimeout(() => { el.style.display = 'none'; }, 2800);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(texto).then(mostrar).catch(() => fallback(texto, mostrar));
            } else {
              fallback(texto, mostrar);
            }
          }
          function fallback(texto, cb) {
            const ta = document.createElement('textarea');
            ta.value = texto;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            cb();
          }
          const copiarChefe = () => {
            const txt = document.querySelector('#textoMensagemChefe').value.trim();
            copiarTexto(txt, 'Mensagem pronta para o gestor copiada!');
          };
          document.querySelector('#btnCopiarChefeTopo').addEventListener('click', copiarChefe);
          document.querySelector('#btnCopiarChefeBox').addEventListener('click', copiarChefe);
          document.querySelectorAll('.btn-copiar-item').forEach(btn => {
            btn.addEventListener('click', () => {
              copiarTexto(btn.getAttribute('data-texto') || '', 'Resumo do edital copiado!');
            });
          });
        </script>
      </body>
      </html>
    `);
    janelaMapa.document.close();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ============================================================================
  // MÓDULO: COPILOTO CAIS (RAG VETORIAL TF-IDF/COSSENO + GEMINI LLM) &
  //         MOTOR PREDITIVO DE CAPTAÇÃO (MACHINE LEARNING)
  // ============================================================================

  const STOPWORDS_PT = new Set([
    'a', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as', 'ate',
    'com', 'como', 'da', 'das', 'de', 'dela', 'delas', 'dele', 'deles', 'depois', 'do',
    'dos', 'e', 'ela', 'elas', 'ele', 'eles', 'em', 'entre', 'era', 'essa', 'essas',
    'esse', 'esses', 'esta', 'estas', 'este', 'estes', 'eu', 'foi', 'for', 'foram',
    'ha', 'isso', 'isto', 'ja', 'la', 'lhe', 'lhes', 'mais', 'mas', 'me', 'mesmo',
    'meu', 'meus', 'minha', 'minhas', 'muito', 'na', 'nas', 'nem', 'no', 'nos', 'nossa',
    'nossas', 'nosso', 'nossos', 'num', 'numa', 'o', 'os', 'ou', 'para', 'pela', 'pelas',
    'pelo', 'pelos', 'por', 'qual', 'quais', 'quando', 'que', 'quem', 'sao', 'se', 'sem',
    'ser', 'seu', 'seus', 'so', 'sua', 'suas', 'tambem', 'te', 'tem', 'temos', 'tenho',
    'ter', 'teu', 'teus', 'tu', 'tua', 'tuas', 'um', 'uma', 'umas', 'uns', 'voce', 'voces',
    'edital', 'editais', 'chamada', 'chamadas', 'programa', 'projeto', 'projetos', 'cais',
    'instituto', 'abertos', 'aberto', 'hoje', 'melhor', 'melhores', 'maior', 'quero', 'queremos'
  ]);

  const SINONIMOS_DOMINIO_CAIS = {
    ia: ['inteligencia', 'artificial', 'machine', 'learning', 'dados', 'algoritmos', 'llm', 'visao', 'computacional'],
    inteligencia: ['ia', 'artificial', 'dados', 'machine', 'learning'],
    chip: ['semicondutores', 'embarcados', 'hardware', 'iot', 'sensores', 'microeletronica'],
    chips: ['semicondutores', 'embarcados', 'hardware', 'iot', 'sensores', 'microeletronica'],
    semicondutores: ['embarcados', 'hardware', 'iot', 'sensores', 'microeletronica'],
    bolsa: ['bolsas', 'mestrado', 'doutorado', 'fixacao', 'pesquisadores', 'funcap', 'cnpq', 'capes', 'profix'],
    bolsas: ['bolsa', 'mestrado', 'doutorado', 'fixacao', 'pesquisadores', 'funcap', 'cnpq', 'capes'],
    uece: ['universidade', 'ict', 'doutores', 'bolsas', 'pesquisa', 'academica', 'funcap'],
    empresa: ['industria', 'industrial', 'startup', 'startups', 'embrapii', 'subvencao', 'mover', 'sebrae', 'parceria'],
    industria: ['empresa', 'industrial', 'embrapii', 'mover', 'senai', 'bndes', 'subvencao'],
    startup: ['startups', 'sebrae', 'centelha', 'catalisa', 'spin', 'inovacao', 'subvencao'],
    nuvem: ['cloud', 'ciberseguranca', 'redes', 'etice', 'governo', 'digital', 'software'],
    energia: ['energetica', 'hidrogenio', 'clima', 'sustentabilidade', 'renovavel', 'descarbonizacao', 'florestal'],
    rapido: ['continuo', 'fluxo', 'credenciamento', 'simplificado', 'embrapii', 'etice']
  };

  function normalizarTextoRag(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ');
  }

  function tokenizarRag(texto, expandirSinonimos = false) {
    const norm = normalizarTextoRag(texto);
    const brutos = norm.split(/\s+/).filter(t => t.length >= 2 && !STOPWORDS_PT.has(t));
    const tokens = [];
    brutos.forEach(tok => {
      const raiz = tok.length > 5 ? tok.replace(/(acoes|acao|mentos|mento|dores|doras|icos|icas|ais|eis|ois|res|oes|s)$/, '') : tok;
      tokens.push(raiz || tok);
      if (expandirSinonimos && SINONIMOS_DOMINIO_CAIS[tok]) {
        SINONIMOS_DOMINIO_CAIS[tok].forEach(sin => {
          const rSin = sin.length > 5 ? sin.replace(/(acoes|acao|mentos|mento|dores|doras|icos|icas|ais|eis|ois|res|oes|s)$/, '') : sin;
          tokens.push(rSin || sin);
        });
      }
    });
    return tokens;
  }

  /**
   * Motor Preditivo de Machine Learning para cada edital:
   * Estima dias de preparo documental, probabilidade de conversão, risco de gargalo e ROI sobre o tempo da equipe.
   */
  function calcularPredicaoMlEdital(ed) {
    const diasRestantes = calcularDiasRestantes(ed.prazo_submissao);
    const isEncerrado = diasRestantes !== null && diasRestantes < 0;
    const complexidade = Number(ed.nota_complexidade || 5);
    const aderencia = Number(ed.nota_aderencia || 7);
    const chance = Number(ed.nota_chance_aprovacao || 7);
    const financeira = Number(ed.nota_financeira || 7);
    const orgaoUp = String(ed.orgao || '').toUpperCase();
    const contrapartidaTxt = normalizarTextoRag(ed.contrapartida || '');
    const semContrapartida = contrapartidaTxt.includes('nao exigida') || contrapartidaTxt.includes('isento') || contrapartidaTxt.includes('100');

    // Predição de esforço (em dias úteis de articulação + escrita técnica)
    let baseDiasPreparo = Math.round(6 + complexidade * 1.9);
    if (orgaoUp.includes('HORIZON') || orgaoUp.includes('CONFAP') || orgaoUp.includes('BNDES')) {
      baseDiasPreparo += 4;
    } else if (orgaoUp.includes('EMBRAPII') || orgaoUp.includes('ETICE')) {
      baseDiasPreparo = Math.max(6, baseDiasPreparo - 2);
    }
    const diasPreparo = Math.min(28, Math.max(5, baseDiasPreparo));

    // Classificação preditiva de gargalo (Prazo Restante vs Tempo Estimado de Preparo)
    let statusGargalo = 'confortavel';
    let classeGargalo = 'ml-janela-ok';
    let rotuloJanela = '🟢 Janela Confortável';
    let penalidadePrazo = 0;

    if (isEncerrado) {
      statusGargalo = 'encerrado';
      classeGargalo = 'ml-janela-critica';
      rotuloJanela = '🔴 Encerrado';
      penalidadePrazo = 40;
    } else if (diasRestantes !== null) {
      if (diasRestantes < diasPreparo) {
        statusGargalo = 'critico';
        classeGargalo = 'ml-janela-critica';
        rotuloJanela = `🔴 Gargalo (${diasRestantes}d < ~${diasPreparo}d preparo)`;
        penalidadePrazo = 14;
      } else if (diasRestantes <= Math.round(diasPreparo * 1.6)) {
        statusGargalo = 'atencao';
        classeGargalo = 'ml-janela-atencao';
        rotuloJanela = `🟡 Iniciar Já (Faltam ${diasRestantes}d)`;
        penalidadePrazo = 4;
      } else {
        rotuloJanela = `🟢 Janela Confortável (${diasRestantes}d)`;
      }
    } else {
      rotuloJanela = '🟢 Fluxo Contínuo / Vigente';
    }

    // Probabilidade Preditiva de Conversão e Índice de ROI do Esforço (0 a 100%)
    const eficienciaEsforco = Math.max(2, 10 - complexidade);
    const bonusSemContrapartida = semContrapartida ? 4 : 0;
    const bonusRegional = (orgaoUp.includes('FUNCAP') || orgaoUp.includes('ETICE') || orgaoUp.includes('BNB')) ? 4 : 0;

    const scoreRoiBruto =
      (aderencia * 3.6) +
      (chance * 3.2) +
      (financeira * 1.7) +
      (eficienciaEsforco * 1.5) +
      bonusSemContrapartida +
      bonusRegional -
      penalidadePrazo;

    const indiceRoi = isEncerrado ? 0 : Math.min(99, Math.max(45, Math.round(scoreRoiBruto)));
    const probConversao = isEncerrado ? 0 : Math.min(95, Math.max(35, Math.round((chance * 6.5) + (aderencia * 2.5) + bonusRegional - (penalidadePrazo * 0.6))));

    const explicacaoCurta = `Predição ML: ROI do esforço ${indiceRoi}% | Chance estimada ${probConversao}% | Tempo médio de preparo documental: ~${diasPreparo} dias.`;

    return {
      diasPreparo,
      diasRestantes,
      statusGargalo,
      classeGargalo,
      rotuloJanela,
      indiceRoi,
      probConversao,
      semContrapartida,
      explicacaoCurta
    };
  }

  /**
   * Constrói o índice vetorial TF-IDF sobre todos os editais para busca RAG e clustering por similaridade de cosseno.
   */
  function construirIndiceVetorialRag() {
    if (!editais || editais.length === 0) {
      indiceVetorialRag = null;
      return;
    }

    const docsTokens = [];
    const df = {};
    const N = editais.length;

    editais.forEach(ed => {
      const lab = obterLaboratorioCais(ed);
      // Pesos maiores para campos mais informativos (Título, Órgão, Ideia CAIS, Resumo e Lab)
      const textoPonderado = [
        ed.titulo, ed.titulo, ed.titulo,
        ed.orgao, ed.orgao,
        lab, lab,
        ed.ideia_projeto_cais, ed.ideia_projeto_cais,
        ed.resumo_objetivo, ed.resumo_objetivo,
        ed.justificativa_cais,
        ed.publico_elegivel,
        ed.parceiros_sugeridos,
        ed.valor_financiado,
        ed.contrapartida
      ].join(' ');

      const tokens = tokenizarRag(textoPonderado, false);
      docsTokens.push({ id: ed.id_edital, ed, tokens });

      const unicos = new Set(tokens);
      unicos.forEach(t => {
        df[t] = (df[t] || 0) + 1;
      });
    });

    const idf = {};
    Object.keys(df).forEach(t => {
      idf[t] = Math.log(1 + (N / (1 + df[t])));
    });

    const vetoresDocs = docsTokens.map(doc => {
      const tf = {};
      doc.tokens.forEach(t => {
        tf[t] = (tf[t] || 0) + 1;
      });
      const vec = {};
      let normaSq = 0;
      Object.keys(tf).forEach(t => {
        const peso = (1 + Math.log(tf[t])) * (idf[t] || 1);
        vec[t] = peso;
        normaSq += peso * peso;
      });
      return {
        id: doc.id,
        ed: doc.ed,
        vec,
        norma: Math.sqrt(normaSq) || 1
      };
    });

    indiceVetorialRag = { idf, vetoresDocs };
  }

  function calcularSimilaridadeCossenoVetores(vecA, normaA, vecB, normaB) {
    if (!normaA || !normaB) return 0;
    let prod = 0;
    const chavesMenores = Object.keys(vecA).length <= Object.keys(vecB).length ? vecA : vecB;
    const outro = chavesMenores === vecA ? vecB : vecA;
    Object.keys(chavesMenores).forEach(t => {
      if (outro[t]) {
        prod += vecA[t] * vecB[t];
      }
    });
    return prod / (normaA * normaB);
  }

  /**
   * Encontra os 2 editais vigentes mais similares matematicamente (Cosine Similarity Cluster)
   * para permitir reaproveitamento de proposta técnica pela equipe CAIS.
   */
  function obterEditaisSimilaresMl(edAlvo, limite = 2) {
    if (!indiceVetorialRag || !edAlvo) return [];
    const docAlvo = indiceVetorialRag.vetoresDocs.find(d => d.id === edAlvo.id_edital);
    if (!docAlvo) return [];

    const candidatos = [];
    indiceVetorialRag.vetoresDocs.forEach(doc => {
      if (doc.id === edAlvo.id_edital) return;
      const dias = calcularDiasRestantes(doc.ed.prazo_submissao);
      if (dias !== null && dias < 0) return; // Prioriza vigentes
      const sim = calcularSimilaridadeCossenoVetores(docAlvo.vec, docAlvo.norma, doc.vec, doc.norma);
      const mesmoLab = obterLaboratorioCais(doc.ed) === obterLaboratorioCais(edAlvo) ? 0.12 : 0;
      const afinidade = Math.min(98, Math.round((sim * 185 + mesmoLab * 100 + 38)));
      candidatos.push({ ed: doc.ed, sim: sim + mesmoLab, afinidade });
    });

    candidatos.sort((a, b) => b.sim - a.sim);
    return candidatos.slice(0, limite);
  }

  /**
   * Renderiza o Painel Preditivo de Machine Learning (Coluna 2 do Copiloto):
   * - Top 3 Editais com maior ROI do Esforço
   * - Diagnóstico de Gargalos de Prazo e distribuição por Laboratório CAIS
   */
  function renderizarPainelPreditivoMl() {
    if (!listaTopRoiMl || !resumoGargalosMl) return;

    const vigentes = editais.filter(ed => {
      const d = calcularDiasRestantes(ed.prazo_submissao);
      const dec = (ed.decisao_recomendada || '').toUpperCase();
      return !((d !== null && d < 0) || dec.includes('ENCERRADO'));
    });

    const comPredicao = vigentes.map(ed => ({
      ed,
      ml: calcularPredicaoMlEdital(ed),
      lab: obterLaboratorioCais(ed)
    }));

    comPredicao.sort((a, b) => {
      if (b.ml.indiceRoi !== a.ml.indiceRoi) return b.ml.indiceRoi - a.ml.indiceRoi;
      return (Number(b.ed.score_ponderado) || 0) - (Number(a.ed.score_ponderado) || 0);
    });

    const top3 = comPredicao.slice(0, 3);
    listaTopRoiMl.innerHTML = '';

    top3.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'card-top-roi-ml';
      div.innerHTML = `
        <div class="topo-card-roi-ml">
          <span class="rank-roi-ml">${idx + 1}º</span>
          <span class="badge-tag badge-orgao">${escapeHtml(item.ed.orgao)}</span>
          <span class="pilula-roi-ml font-mono">Nota ${Number(item.ed.score_ponderado || 0).toFixed(1)} • Chance ~${item.ml.probConversao}%</span>
        </div>
        <div class="titulo-card-roi-ml">${escapeHtml(item.ed.titulo)}</div>
        <div class="meta-card-roi-ml">
          <span class="pill-rag-meta">⏱️ ~${item.ml.diasPreparo}d preparo</span>
          <span class="pill-rag-meta">${escapeHtml(item.ml.rotuloJanela)}</span>
          <span class="link-abrir-roi-ml">Abrir &rarr;</span>
        </div>
      `;
      div.addEventListener('click', () => abrirModal(item.ed));
      listaTopRoiMl.appendChild(div);
    });

    // Contabiliza gargalos de prazo e distribuição por Laboratório CAIS
    const gargalosCriticos = comPredicao.filter(i => i.ml.statusGargalo === 'critico' || i.ml.statusGargalo === 'atencao');
    const contagemLabs = {};
    comPredicao.forEach(i => {
      contagemLabs[i.lab] = (contagemLabs[i.lab] || 0) + 1;
    });

    const alertaGargaloHtml = gargalosCriticos.length > 0
      ? `<div class="alerta-gargalo-ml">
           <strong>⚠️ Atenção ao prazo (${gargalosCriticos.length}):</strong>
           ${escapeHtml(gargalosCriticos[0].ed.orgao)} — ${escapeHtml(truncarTexto(gargalosCriticos[0].ed.titulo, 55))} (faltam <strong>${gargalosCriticos[0].ml.diasRestantes}d</strong>; preparo ~${gargalosCriticos[0].ml.diasPreparo}d).
         </div>`
      : `<div class="alerta-gargalo-ml alerta-gargalo-ok">
           <strong>✅ Prazos sob controle:</strong> todos os ${vigentes.length} editais abertos têm margem confortável de preparo.
         </div>`;

    const chipsLabsHtml = Object.entries(contagemLabs)
      .sort((a, b) => b[1] - a[1])
      .map(([nomeLab, qtd]) => {
        const pct = Math.round((qtd / Math.max(1, vigentes.length)) * 100);
        return `
          <button type="button" class="barra-lab-ml" data-lab="${escapeHtml(nomeLab)}" title="Clique para filtrar os ${qtd} editais vigentes do ${escapeHtml(nomeLab)}">
            <div class="info-barra-lab-ml">
              <span class="nome-barra-lab-ml">${escapeHtml(nomeLab)}</span>
              <span class="qtd-barra-lab-ml font-mono">${qtd} vigentes (${pct}%)</span>
            </div>
            <div class="trilho-barra-lab-ml"><div class="preenchimento-barra-lab-ml" style="width:${Math.max(8, pct)}%"></div></div>
          </button>
        `;
      }).join('');

    resumoGargalosMl.innerHTML = `
      ${alertaGargaloHtml}
      <div class="grade-barras-labs-ml">${chipsLabsHtml}</div>
    `;

    resumoGargalosMl.querySelectorAll('.barra-lab-ml').forEach(btn => {
      btn.addEventListener('click', () => {
        const labAlvo = btn.getAttribute('data-lab') || '';
        if (filtroLaboratorio) {
          filtroLaboratorio.value = labAlvo;
          sincronizarChipsComSelects();
          aplicarFiltros();
          areaResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
          exibirToast(`Filtrando carteira pelo núcleo: ${labAlvo}`, 'info');
        }
      });
    });
  }

  /**
   * Popula o Diagnóstico Preditivo ML + Cluster de Reaproveitamento dentro da Aba 2 do Modal
   */
  function renderizarPredicaoMlNoModal(ed) {
    if (!boxPredicaoMlModal || !ed) return;
    const ml = calcularPredicaoMlEdital(ed);
    const similares = obterEditaisSimilaresMl(ed, 2);

    const similaresHtml = similares.length > 0
      ? `<div class="bloco-cluster-ml">
           <div class="titulo-cluster-ml">💡 Dica Prática — Aproveite o mesmo projeto em outros editais parecidos:</div>
           <p class="sub-cluster-ml">Se você escrever uma proposta para este edital, pode usar quase o mesmo texto para concorrer também nestes:</p>
           <div class="lista-similares-ml">
             ${similares.map(s => `
               <button type="button" class="item-similar-ml" data-id="${escapeHtml(s.ed.id_edital)}">
                 <span class="badge-tag badge-orgao">${escapeHtml(s.ed.orgao)}</span>
                 <span class="texto-similar-ml">${escapeHtml(truncarTexto(s.ed.titulo, 68))}</span>
                 <span class="afinidade-similar-ml font-mono">${s.afinidade}% parecido &rarr;</span>
               </button>
             `).join('')}
           </div>
         </div>`
      : '';

    boxPredicaoMlModal.innerHTML = `
      <div class="cabecalho-predicao-modal">
        <span class="tag-modulo-ia tag-ml">⏱️ PLANEJAMENTO PRÁTICO DE SUBMISSÃO</span>
      </div>
      <div class="grid-metricas-ml-modal">
        <div class="item-metrica-ml-modal">
          <span class="label-metrica-ml">Chance Estimada</span>
          <strong class="valor-metrica-ml font-mono">~${ml.probConversao}%</strong>
        </div>
        <div class="item-metrica-ml-modal">
          <span class="label-metrica-ml">Tempo para Preparar Proposta</span>
          <strong class="valor-metrica-ml font-mono">Cerca de ${ml.diasPreparo} dias</strong>
        </div>
        <div class="item-metrica-ml-modal">
          <span class="label-metrica-ml">Situação do Prazo</span>
          <strong class="valor-metrica-ml">${escapeHtml(ml.rotuloJanela)}</strong>
        </div>
      </div>
      ${similaresHtml}
    `;

    boxPredicaoMlModal.querySelectorAll('.item-similar-ml').forEach(btn => {
      btn.addEventListener('click', () => {
        const idAlvo = btn.getAttribute('data-id');
        const edAlvo = editais.find(item => item.id_edital === idAlvo);
        if (edAlvo) {
          abrirModal(edAlvo, true);
          exibirToast(`Exibindo edital similar (${edAlvo.orgao})`, 'info');
        }
      });
    });
  }

  /**
   * Executa a recuperação vetorial RAG (TF-IDF + Cosine Similarity + Boosts Semânticos)
   * e sintetiza o Parecer Consultivo (com suporte híbrido ao Google Gemini LLM).
   */
  async function executarConsultaRag(perguntaUsuario, usarLlm = false) {
    if (!resultadoRagContainer) return;
    if (!indiceVetorialRag || editais.length === 0) {
      construirIndiceVetorialRag();
    }
    if (!indiceVetorialRag) return;

    const consulta = String(perguntaUsuario || '').trim() ||
      'Quais os melhores editais abertos hoje com maior ROI e aderência para o Instituto CAIS?';

    const normConsulta = normalizarTextoRag(consulta);
    const tokensConsulta = tokenizarRag(consulta, true);

    // Monta vetor TF-IDF da consulta
    const tfQ = {};
    tokensConsulta.forEach(t => {
      tfQ[t] = (tfQ[t] || 0) + 1;
    });
    const vecQ = {};
    let normaQSq = 0;
    Object.keys(tfQ).forEach(t => {
      const peso = (1 + Math.log(tfQ[t])) * (indiceVetorialRag.idf[t] || 1.2);
      vecQ[t] = peso;
      normaQSq += peso * peso;
    });
    const normaQ = Math.sqrt(normaQSq) || 1;

    // Intenções semânticas detectadas na pergunta
    const pedeSemContrapartida = normConsulta.includes('sem contrapartida') || normConsulta.includes('fundo perdido') || normConsulta.includes('100') || normConsulta.includes('nao reembolsavel');
    const pedeBolsa = normConsulta.includes('bolsa') || normConsulta.includes('doutor') || normConsulta.includes('mestrado') || normConsulta.includes('uece') || normConsulta.includes('fixacao');
    const pedeEmpresa = normConsulta.includes('empresa') || normConsulta.includes('industria') || normConsulta.includes('startup') || normConsulta.includes('parceria');
    const pedeRapidoRoi = normConsulta.includes('roi') || normConsulta.includes('rapido') || normConsulta.includes('rapida') || normConsulta.includes('menor esforco') || normConsulta.includes('continuo');

    const ranqueados = [];
    indiceVetorialRag.vetoresDocs.forEach(doc => {
      const ed = doc.ed;
      const dias = calcularDiasRestantes(ed.prazo_submissao);
      const isEncerrado = dias !== null && dias < 0;
      if (isEncerrado) return; // RAG foca nos editais vigentes para ação prática

      const simCosseno = calcularSimilaridadeCossenoVetores(vecQ, normaQ, doc.vec, doc.norma);
      const ml = calcularPredicaoMlEdital(ed);
      const textoDocNorm = normalizarTextoRag(`${ed.orgao} ${ed.titulo} ${ed.valor_financiado} ${ed.contrapartida} ${ed.publico_elegivel} ${ed.ideia_projeto_cais}`);

      let boostIntencao = 0;
      if (pedeSemContrapartida && ml.semContrapartida) boostIntencao += 0.22;
      if (pedeBolsa && (textoDocNorm.includes('bolsa') || textoDocNorm.includes('doutor') || textoDocNorm.includes('mestrado'))) boostIntencao += 0.25;
      if (pedeEmpresa && (textoDocNorm.includes('empresa') || textoDocNorm.includes('industria') || textoDocNorm.includes('startup') || textoDocNorm.includes('embrapii'))) boostIntencao += 0.22;
      if (pedeRapidoRoi) boostIntencao += (ml.indiceRoi / 400);

      const scoreCombinado = (simCosseno * 0.68) + boostIntencao + ((Number(ed.score_ponderado) || 7) * 0.025) + (ml.indiceRoi * 0.0015);
      const pctMatch = Math.min(99, Math.max(68, Math.round(58 + (simCosseno * 175) + (boostIntencao * 85))));

      ranqueados.push({
        ed,
        ml,
        simCosseno,
        scoreCombinado,
        pctMatch,
        lab: obterLaboratorioCais(ed)
      });
    });

    ranqueados.sort((a, b) => b.scoreCombinado - a.scoreCombinado);
    const topRecuperados = ranqueados.slice(0, 3);

    if (topRecuperados.length === 0) {
      resultadoRagContainer.innerHTML = `<div class="parecer-rag-box">Nenhum edital aberto encontrado para esta busca.</div>`;
      return;
    }

    const primeiro = topRecuperados[0];
    const contrapartidaCurta = truncarTexto(primeiro.ed.contrapartida || 'Sem contrapartida', 48);
    const tituloPrimeiro = String(primeiro.ed.titulo || '').toLowerCase().startsWith(String(primeiro.ed.orgao || '').toLowerCase())
      ? primeiro.ed.titulo
      : `${primeiro.ed.orgao} — ${primeiro.ed.titulo}`;

    // Resumo em 1 linha direta + etiquetas curtas (sem paredão de texto)
    let sinteseRagHtml = `
      <div class="parecer-rag-linha">
        <span><strong>💡 Melhor opção hoje:</strong> ${escapeHtml(truncarTexto(tituloPrimeiro, 78))}</span>
        <div class="parecer-rag-pills">
          <span class="pill-rag-meta">${primeiro.pctMatch}% compatível</span>
          <span class="pill-rag-meta">⏱️ ~${primeiro.ml.diasPreparo}d preparo</span>
          <span class="pill-rag-meta">${escapeHtml(contrapartidaCurta)}</span>
        </div>
      </div>
    `;

    const cardsRecuperadosHtml = topRecuperados.map((item, idx) => `
      <div class="card-recuperado-rag" data-id="${escapeHtml(item.ed.id_edital)}">
        <div class="topo-card-rag">
          <span class="badge-match-rag">${idx + 1}º • ${item.pctMatch}%</span>
          <span class="badge-tag badge-orgao">${escapeHtml(item.ed.orgao)}</span>
          <span class="nota-circulo font-mono" style="font-size:11px; padding:2px 6px;">${Number(item.ed.score_ponderado || 0).toFixed(1)}</span>
        </div>
        <div class="titulo-card-rag">${escapeHtml(item.ed.titulo)}</div>
        <div class="rodape-card-rag">
          <span>💰 ${escapeHtml(resumirValorCard(item.ed.valor_financiado))}</span>
          <span class="acao-abrir-rag">Abrir &rarr;</span>
        </div>
      </div>
    `).join('');

    resultadoRagContainer.innerHTML = `
      <div class="parecer-rag-box" id="boxTextoParecerRag">
        ${sinteseRagHtml}
      </div>
      <div class="grade-recuperados-rag">
        ${cardsRecuperadosHtml}
      </div>
    `;

    resultadoRagContainer.querySelectorAll('.card-recuperado-rag').forEach(el => {
      el.addEventListener('click', () => {
        const idAlvo = el.getAttribute('data-id');
        const edAlvo = editais.find(item => item.id_edital === idAlvo);
        if (edAlvo) abrirModal(edAlvo);
      });
    });

    // Se o usuário conectou uma chave opcional do Google Gemini e acionou uma consulta interativa, enriquece o parecer via LLM
    const chaveGemini = (localStorage.getItem(CHAVE_STORAGE_GEMINI) || '').trim();
    if (chaveGemini && usarLlm && perguntaUsuario) {
      const boxParecer = resultadoRagContainer.querySelector('.parecer-rag-box');
      if (boxParecer) {
        boxParecer.innerHTML += `<div class="status-llm-rag">🤖 <em>Consultando Google Gemini 2.5 Flash com os ${topRecuperados.length} editais mais compatíveis...</em></div>`;
      }
      try {
        const contextoRag = topRecuperados.map((it, i) =>
          `[${i + 1}] Órgão: ${it.ed.orgao} | Título: ${it.ed.titulo} | Nota CAIS: ${it.ed.score_ponderado}/10 | Recurso: ${it.ed.valor_financiado} | Contrapartida: ${it.ed.contrapartida} | Prazo: ${it.ed.prazo_submissao} | Proposta CAIS: ${it.ed.ideia_projeto_cais} | Parceiros: ${it.ed.parceiros_sugeridos}`
        ).join('\n');

        const promptRagLlm = `Você é o Copiloto Estratégico de PD&I do Instituto CAIS (Ceará). Responda em português de forma executiva, direta e prática (máximo 2 parágrafos curtos) à pergunta do pesquisador usando EXCLUSIVAMENTE os editais oficiais recuperados abaixo:\n\nPERGUNTA/PROJETO: ${consulta}\n\nEDITAIS RECUPERADOS (RAG):\n${contextoRag}`;

        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(chaveGemini)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptRagLlm }] }],
            generationConfig: { temperature: 0.25, maxOutputTokens: 320 }
          })
        });
        if (resp.ok) {
          const jsonLlm = await resp.json();
          const textoLlm = jsonLlm?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textoLlm && boxParecer) {
            boxParecer.innerHTML = `
              <p><strong>🤖 Parecer Generativo (Gemini 2.5 Flash + RAG Vetorial CAIS):</strong></p>
              <p style="margin-top:4px; white-space:pre-line;">${escapeHtml(textoLlm.trim())}</p>
            `;
          }
        } else {
          const st = resultadoRagContainer.querySelector('.status-llm-rag');
          if (st) st.remove();
        }
      } catch (err) {
        const st = resultadoRagContainer.querySelector('.status-llm-rag');
        if (st) st.remove();
      }
    }
  }

  function atualizarBadgeStatusGemini() {
    if (!labelStatusGemini) return;
    const chave = (localStorage.getItem(CHAVE_STORAGE_GEMINI) || '').trim();
    if (chave) {
      labelStatusGemini.textContent = '🟢 Gemini Ativo';
    } else {
      labelStatusGemini.textContent = '⚙️ Gemini';
    }
  }

  function alternarAbaInternaAssistente(qualAba) {
    if (!abaAssistenteBusca || !abaAssistentePrioridades) return;
    const isBusca = qualAba === 'busca';
    abaAssistenteBusca.style.display = isBusca ? 'block' : 'none';
    abaAssistentePrioridades.style.display = isBusca ? 'none' : 'block';
    if (btnAbaAssistenteBusca) btnAbaAssistenteBusca.classList.toggle('ativa', isBusca);
    if (btnAbaAssistentePrioridades) btnAbaAssistentePrioridades.classList.toggle('ativa', !isBusca);
  }

  function configurarEventosCopilotoRagMl() {
    atualizarBadgeStatusGemini();

    if (btnAbaAssistenteBusca) {
      btnAbaAssistenteBusca.addEventListener('click', () => alternarAbaInternaAssistente('busca'));
    }
    if (btnAbaAssistentePrioridades) {
      btnAbaAssistentePrioridades.addEventListener('click', () => alternarAbaInternaAssistente('prioridades'));
    }

    if (btnAbrirCopilotoTopo && painelCopilotoRagMl) {
      btnAbrirCopilotoTopo.addEventListener('click', () => {
        painelCopilotoRagMl.style.display = 'block';
        if (corpoCopilotoRagMl) {
          const estavaOculto = corpoCopilotoRagMl.style.display === 'none';
          corpoCopilotoRagMl.style.display = estavaOculto ? 'block' : 'none';
          if (textoToggleCopiloto) {
            textoToggleCopiloto.textContent = estavaOculto ? 'Fechar Assistente' : 'Abrir Assistente Inteligente';
          }
          if (btnToggleCorpoCopiloto) {
            btnToggleCorpoCopiloto.setAttribute('aria-expanded', estavaOculto ? 'true' : 'false');
          }
          if (estavaOculto) {
            painelCopilotoRagMl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (inputPerguntaRag) inputPerguntaRag.focus();
          }
        }
      });
    }

    if (btnToggleCorpoCopiloto && corpoCopilotoRagMl) {
      btnToggleCorpoCopiloto.addEventListener('click', () => {
        const oculto = corpoCopilotoRagMl.style.display === 'none';
        corpoCopilotoRagMl.style.display = oculto ? 'block' : 'none';
        btnToggleCorpoCopiloto.setAttribute('aria-expanded', oculto ? 'true' : 'false');
        if (textoToggleCopiloto) {
          textoToggleCopiloto.textContent = oculto ? 'Fechar Assistente' : 'Abrir Assistente Inteligente';
        }
      });
    }

    if (btnConfigGeminiKey && boxConfigGemini) {
      btnConfigGeminiKey.addEventListener('click', () => {
        const oculto = boxConfigGemini.style.display === 'none';
        boxConfigGemini.style.display = oculto ? 'block' : 'none';
        if (oculto && inputChaveGeminiUser) {
          inputChaveGeminiUser.value = localStorage.getItem(CHAVE_STORAGE_GEMINI) || '';
          inputChaveGeminiUser.focus();
        }
      });
    }

    if (btnSalvarChaveGemini && inputChaveGeminiUser) {
      btnSalvarChaveGemini.addEventListener('click', () => {
        const val = inputChaveGeminiUser.value.trim();
        if (!val) {
          exibirToast('Cole uma chave válida do Google AI Studio ou use o motor RAG Vetorial Local.', 'info');
          return;
        }
        localStorage.setItem(CHAVE_STORAGE_GEMINI, val);
        atualizarBadgeStatusGemini();
        if (boxConfigGemini) boxConfigGemini.style.display = 'none';
        exibirToast('Chave Gemini salva no navegador! O Copiloto agora usará RAG + Gemini 2.5 Flash.', 'success');
      });
    }

    if (btnRemoverChaveGemini) {
      btnRemoverChaveGemini.addEventListener('click', () => {
        localStorage.removeItem(CHAVE_STORAGE_GEMINI);
        if (inputChaveGeminiUser) inputChaveGeminiUser.value = '';
        atualizarBadgeStatusGemini();
        if (boxConfigGemini) boxConfigGemini.style.display = 'none';
        exibirToast('Modo RAG Vetorial Local (100% gratuito e instantâneo) ativado.', 'info');
      });
    }

    if (btnExecutarRag && inputPerguntaRag) {
      btnExecutarRag.addEventListener('click', () => {
        executarConsultaRag(inputPerguntaRag.value, true);
      });
      inputPerguntaRag.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executarConsultaRag(inputPerguntaRag.value, true);
        }
      });
    }

    if (chipsPromptsRag) {
      chipsPromptsRag.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip-prompt-ia');
        if (!chip) return;
        chipsPromptsRag.querySelectorAll('.chip-prompt-ia').forEach(c => c.classList.remove('ativo'));
        chip.classList.add('ativo');
        const promptTxt = chip.getAttribute('data-prompt') || '';
        if (inputPerguntaRag) inputPerguntaRag.value = promptTxt;
        executarConsultaRag(promptTxt, true);
      });
    }
  }
});
