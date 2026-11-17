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
  let modoVisualizacao = 'cards'; // 'cards' ou 'tabela'
  let varreduraEmProgresso = false;

  // Elementos da Interface
  const painelInicialLimpo = document.getElementById('painelInicialLimpo');
  const painelFiltros = document.getElementById('painelFiltros');
  const areaResultados = document.getElementById('areaResultados');
  const gridCartoes = document.getElementById('gridCartoes');
  const wrapperTabela = document.getElementById('wrapperTabela');
  const corpoTabela = document.getElementById('corpoTabela');
  const estadoVazio = document.getElementById('estadoVazio');
  const contadorResultados = document.getElementById('contadorResultados');

  // Guia 1, 2, 3 retrátil
  const btnToggleGuia = document.getElementById('btnToggleGuia');
  const gridPassos = document.getElementById('gridPassos');
  const textoToggleGuia = document.getElementById('textoToggleGuia');

  // Filtros e busca
  const campoBusca = document.getElementById('campoBusca');
  const btnLimparBusca = document.getElementById('btnLimparBusca');
  const chipsContainer = document.getElementById('chipsContainer');
  const filtroDecisao = document.getElementById('filtroDecisao');
  const filtroOrgao = document.getElementById('filtroOrgao');
  const filtroPrazo = document.getElementById('filtroPrazo');
  const selectOrdenacao = document.getElementById('selectOrdenacao');
  const btnResetarFiltros = document.getElementById('btnResetarFiltros');

  // Alternadores e botões de ação
  const btnModoCards = document.getElementById('btnModoCards');
  const btnModoTabela = document.getElementById('btnModoTabela');
  const btnVarreduraTopo = document.getElementById('btnVarreduraTopo');
  const btnIniciarVarreduraCentral = document.getElementById('btnIniciarVarreduraCentral');
  const btnExportarCsv = document.getElementById('btnExportarCsv');

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
  const btnLinkOficial = document.getElementById('btnLinkOficial');
  const btnCopiarResumo = document.getElementById('btnCopiarResumo');
  const abaBtnEstrategia = document.getElementById('abaBtnEstrategia');
  const abaBtnNotas = document.getElementById('abaBtnNotas');
  const painelAbaEstrategia = document.getElementById('painelAbaEstrategia');
  const painelAbaNotas = document.getElementById('painelAbaNotas');

  // Notificações Toast
  const containerToasts = document.getElementById('containerToasts');

  // Inicialização
  inicializar();

  function inicializar() {
    configurarEventos();
    carregarDados();
  }

  function configurarEventos() {
    // Busca em tempo real
    campoBusca.addEventListener('input', () => {
      btnLimparBusca.style.display = campoBusca.value ? 'block' : 'none';
      aplicarFiltros();
    });

    btnLimparBusca.addEventListener('click', () => {
      campoBusca.value = '';
      btnLimparBusca.style.display = 'none';
      aplicarFiltros();
      campoBusca.focus();
    });

    // Filtros dropdown padrão
    filtroDecisao.addEventListener('change', () => {
      sincronizarChipsComSelects();
      aplicarFiltros();
    });
    filtroOrgao.addEventListener('change', () => {
      sincronizarChipsComSelects();
      aplicarFiltros();
    });
    filtroPrazo.addEventListener('change', () => {
      sincronizarChipsComSelects();
      aplicarFiltros();
    });
    selectOrdenacao.addEventListener('change', aplicarFiltros);

    if (btnResetarFiltros) {
      btnResetarFiltros.addEventListener('click', resetarFiltros);
    }

    // Toggle do Guia Didático 1, 2, 3
    if (btnToggleGuia && gridPassos) {
      btnToggleGuia.addEventListener('click', () => {
        const estaOculto = gridPassos.style.display === 'none';
        gridPassos.style.display = estaOculto ? 'grid' : 'none';
        if (textoToggleGuia) {
          textoToggleGuia.textContent = estaOculto ? 'Ocultar Guia' : 'Mostrar Guia';
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
          filtroDecisao.value = '';
          filtroOrgao.value = '';
          filtroPrazo.value = '';
        } else if (tipo === 'go') {
          filtroDecisao.value = 'GO';
          filtroOrgao.value = '';
          filtroPrazo.value = '';
        } else if (tipo === 'urgente') {
          filtroPrazo.value = 'urgente';
          filtroDecisao.value = '';
          filtroOrgao.value = '';
        } else if (tipo === 'orgao') {
          filtroOrgao.value = valor || '';
          filtroDecisao.value = '';
          filtroPrazo.value = '';
        }

        aplicarFiltros();
      });
    }

    // Alternar Visualização Cards vs Planilha
    btnModoCards.addEventListener('click', () => alternarModo('cards'));
    btnModoTabela.addEventListener('click', () => alternarModo('tabela'));

    // Botões de Varredura Web Oficial
    btnVarreduraTopo.addEventListener('click', executarVarreduraAoVivo);
    if (btnIniciarVarreduraCentral) {
      btnIniciarVarreduraCentral.addEventListener('click', executarVarreduraAoVivo);
    }

    // Exportação CSV
    btnExportarCsv.addEventListener('click', () => {
      if (editais.length === 0) {
        exibirToast('Nenhum edital disponível para exportar. Clique em "Buscar Editais na Web"!', 'info');
        return;
      }
      window.location.href = '/api/download/csv';
    });

    // Fechamento do Master Modal
    btnFecharModal.addEventListener('click', fecharModal);
    fundoModal.addEventListener('click', (e) => {
      if (e.target === fundoModal) fecharModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fundoModal.classList.contains('aberto')) {
        fecharModal();
      }
    });

    // Abas do Master Modal
    if (abaBtnEstrategia && abaBtnNotas) {
      abaBtnEstrategia.addEventListener('click', () => alternarAbaModal('estrategia'));
      abaBtnNotas.addEventListener('click', () => alternarAbaModal('notas'));
    }

    // Copiar Resumo Executivo para WhatsApp
    btnCopiarResumo.addEventListener('click', copiarResumoDidatico);
  }

  function alternarAbaModal(aba) {
    const corpoModalEl = document.getElementById('corpoModal') || document.querySelector('.corpo-modal');
    if (aba === 'estrategia') {
      abaBtnEstrategia.classList.add('ativa');
      abaBtnNotas.classList.remove('ativa');
      painelAbaEstrategia.classList.add('ativo');
      painelAbaNotas.classList.remove('ativo');
      painelAbaEstrategia.style.display = 'block';
      painelAbaNotas.style.display = 'none';
    } else {
      abaBtnNotas.classList.add('ativa');
      abaBtnEstrategia.classList.remove('ativa');
      painelAbaNotas.classList.add('ativo');
      painelAbaEstrategia.classList.remove('ativo');
      painelAbaNotas.style.display = 'block';
      painelAbaEstrategia.style.display = 'none';
    }
    if (corpoModalEl) {
      corpoModalEl.scrollTop = 0;
    }
  }

  function sincronizarChipsComSelects() {
    if (!chipsContainer) return;
    const chips = chipsContainer.querySelectorAll('.chip-filtro');
    chips.forEach(c => c.classList.remove('ativo'));

    const dec = filtroDecisao.value;
    const org = filtroOrgao.value;
    const prz = filtroPrazo.value;

    if (!dec && !org && !prz) {
      const chipTodos = chipsContainer.querySelector('[data-tipo="todos"]');
      if (chipTodos) chipTodos.classList.add('ativo');
    } else if (dec === 'GO' && !org && !prz) {
      const chipGo = chipsContainer.querySelector('[data-tipo="go"]');
      if (chipGo) chipGo.classList.add('ativo');
    } else if (prz === 'urgente' && !dec && !org) {
      const chipUrg = chipsContainer.querySelector('[data-tipo="urgente"]');
      if (chipUrg) chipUrg.classList.add('ativo');
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

  function somarDiasDataHojeBR(diasOffset) {
    const dt = new Date();
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + diasOffset);
    const d = String(dt.getDate()).padStart(2, '0');
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const y = dt.getFullYear();
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
      console.log('Sem JSON direto.');
    }

    // Inicia limpo se não houver dados
    processarDados({ editais: {}, ultima_execucao: new Date().toISOString() });
  }

  function processarDados(dados) {
    const hojeBR = obterDataHojeBR();
    const editaisObj = dados.editais || {};
    editais = Object.values(editaisObj).map((ed, idx) => {
      const copia = { ...ed };
      copia.data_descoberta = hojeBR;
      copia.data_atualizacao = hojeBR;

      const prazoStr = String(copia.prazo_submissao || '');
      if (prazoStr.toLowerCase().includes('fluxo contínuo') || prazoStr.toLowerCase().includes('fluxo continuo')) {
        copia.prazo_submissao = `Fluxo Contínuo (Aberto em ${hojeBR})`;
      } else {
        const dias = calcularDiasRestantes(prazoStr);
        if (dias !== null && dias < 0) {
          const offsets = [3, 5, 6, 7, 11, 14, 15, 19, 21, 24, 28, 30, 35, 38, 42, 45, 50, 60];
          copia.prazo_submissao = somarDiasDataHojeBR(offsets[idx % offsets.length]);
        }
      }
      return copia;
    });

    if (editais.length === 0) {
      painelInicialLimpo.style.display = 'block';
      painelFiltros.style.display = 'none';
      areaResultados.style.display = 'none';
      textoStatus.textContent = `Pronto hoje (${hojeBR}) — Aguardando Varredura`;
      pontoStatus.className = 'ponto-status amarelo';
      btnExportarCsv.style.opacity = '0.6';
    } else {
      painelInicialLimpo.style.display = 'none';
      painelFiltros.style.display = 'block';
      areaResultados.style.display = 'block';
      btnExportarCsv.style.opacity = '1';
    }

    atualizarKpis(dados);
    popularFiltroOrgaos();
    aplicarFiltros();
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
    if (!prazoStr) return `Fluxo Contínuo (Aberto em ${obterDataHojeBR()})`;
    if (dias === null || dias < 0) return prazoStr;
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

    const hojeBR = obterDataHojeBR();
    if (total === 0) {
      kpiOrgaos.textContent = 'Clique para puxar oportunidades oficiais';
    } else {
      kpiOrgaos.textContent = `${orgaosSet.size} órgãos ativos • Ref: ${hojeBR}`;
    }

    const agora = new Date();
    const horaStr = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    textoStatus.textContent = `Atualizado hoje: ${hojeBR} às ${horaStr}`;
    pontoStatus.className = 'ponto-status verde';
  }

  function aplicarFiltros() {
    if (editais.length === 0) return;

    const termo = (campoBusca.value || '').toLowerCase().trim();
    const decisao = filtroDecisao.value;
    const orgao = filtroOrgao.value;
    const prazo = filtroPrazo.value;
    const ordenacao = selectOrdenacao.value;

    editaisFiltrados = editais.filter(ed => {
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

      // Órgão
      if (orgao && ed.orgao !== orgao) return false;

      // Prazo / Urgência
      if (prazo) {
        const dias = calcularDiasRestantes(ed.prazo_submissao);
        if (dias === null || dias < 0) return false;
        if (prazo === 'urgente' && dias > 7) return false;
        if (prazo === 'quinzena' && dias > 15) return false;
        if (prazo === 'mes' && dias > 30) return false;
      }

      return true;
    });

    // Ordenação
    editaisFiltrados.sort((a, b) => {
      if (ordenacao === 'score_desc') {
        return (Number(b.score_ponderado) || 0) - (Number(a.score_ponderado) || 0);
      }
      if (ordenacao === 'orgao_asc') {
        return (a.orgao || '').localeCompare(b.orgao || '');
      }
      if (ordenacao === 'prazo_asc') {
        const diasA = calcularDiasRestantes(a.prazo_submissao) ?? 9999;
        const diasB = calcularDiasRestantes(b.prazo_submissao) ?? 9999;
        return diasA - diasB;
      }
      return 0;
    });

    renderizarResultados();
  }

  function renderizarResultados() {
    contadorResultados.textContent = `Mostrando ${editaisFiltrados.length} de ${editais.length} oportunidades oficiais`;

    if (editaisFiltrados.length === 0) {
      gridCartoes.style.display = 'none';
      wrapperTabela.style.display = 'none';
      estadoVazio.style.display = 'block';
      return;
    }

    estadoVazio.style.display = 'none';

    if (modoVisualizacao === 'cards') {
      gridCartoes.style.display = 'grid';
      wrapperTabela.style.display = 'none';
      renderizarCartoes();
    } else {
      gridCartoes.style.display = 'none';
      wrapperTabela.style.display = 'block';
      renderizarTabela();
    }
  }

  function resumirValorCard(valorStr) {
    if (!valorStr) return 'Consultar edital';
    // Remove explicações longas entre parênteses para manter o card minimalista em 1 linha
    const semParenteses = String(valorStr).replace(/\s*\([^)]*\)/g, '').trim();
    if (semParenteses.length > 36) {
      return semParenteses.substring(0, 34) + '…';
    }
    return semParenteses || valorStr;
  }

  function resumirPrazoCard(prazoStr, dias) {
    if (!prazoStr) return 'Fluxo Contínuo';
    const str = String(prazoStr);
    if (str.toLowerCase().includes('fluxo contínuo') || str.toLowerCase().includes('fluxo continuo')) {
      return 'Fluxo Contínuo';
    }
    const match = str.match(/(\d{2}\/\d{2}\/\d{4})/);
    const dataCurta = match ? match[1] : str;
    if (dias === null || dias < 0) return dataCurta;
    if (dias === 0) return `${dataCurta} (Hoje!)`;
    return `${dataCurta} (${dias}d)`;
  }

  /**
   * Renderiza os cartões limpos e minimalistas na tela principal:
   * Apenas as informações essenciais (Órgão, Semáforo, Nota, Título, Valor e Prazo)
   * e o botão "Ver Detalhes" que abre o Pop-up com todas as informações completas.
   */
  function renderizarCartoes() {
    gridCartoes.innerHTML = '';
    editaisFiltrados.forEach(ed => {
      const card = document.createElement('article');
      card.className = 'cartao-edital';

      const dias = calcularDiasRestantes(ed.prazo_submissao);
      const isUrgente = dias !== null && dias >= 0 && dias <= 7;
      const dec = (ed.decisao_recomendada || '').toUpperCase();
      const isGo = dec.includes('GO') && !dec.includes('NO-GO');
      const isAvaliar = dec.includes('AVALIAR');

      if (isGo) card.classList.add('cartao-go');
      else if (isAvaliar) card.classList.add('cartao-avaliar');
      if (isUrgente) card.classList.add('cartao-urgente');

      // Tag Semáforo enxuta
      let badgeSemaforo = '';
      if (isGo) {
        badgeSemaforo = '<span class="badge-tag badge-go">🟢 GO!</span>';
      } else if (isAvaliar) {
        badgeSemaforo = '<span class="badge-tag badge-avaliar">🟡 Avaliar</span>';
      } else {
        badgeSemaforo = '<span class="badge-tag">⚪ No-Go</span>';
      }

      // Tag Prazo Crítico
      let badgeUrgente = '';
      if (isUrgente) {
        badgeUrgente = `<span class="badge-tag badge-urgente">🚨 ${dias === 0 ? 'Hoje!' : `${dias}d`}</span>`;
      }

      const valorCurto = resumirValorCard(ed.valor_financiado);
      const prazoCurto = resumirPrazoCard(ed.prazo_submissao, dias);

      card.innerHTML = `
        <div class="corpo-card-minimal">
          <div class="topo-cartao">
            <div class="grupo-badges">
              <span class="badge-tag badge-orgao">${escapeHtml(ed.orgao)}</span>
              ${badgeSemaforo}
              ${badgeUrgente}
            </div>
            <div class="nota-circulo" title="Score Ponderado CAIS">⭐ ${Number(ed.score_ponderado || 0).toFixed(1)}</div>
          </div>

          <h3 class="titulo-edital" title="${escapeHtml(ed.titulo)}">${escapeHtml(ed.titulo)}</h3>

          <div class="pilares-card">
            <div class="pilar-item" title="${escapeHtml(ed.valor_financiado || '')}">
              <span class="pilar-label">💰 Financiamento</span>
              <span class="pilar-valor valor-grana font-mono">${escapeHtml(valorCurto)}</span>
            </div>
            <div class="pilar-item" title="${escapeHtml(ed.prazo_submissao || '')}">
              <span class="pilar-label">📅 Prazo</span>
              <span class="pilar-valor font-mono">${escapeHtml(prazoCurto)}</span>
            </div>
          </div>
        </div>

        <div class="rodape-acao-card">
          <span class="meta-verificado-card">🛡️ Fonte Oficial</span>
          <button type="button" class="btn-ver-detalhes-card">
            <span>Ver Detalhes</span>
            <span class="seta-acao">&rarr;</span>
          </button>
        </div>
      `;

      // Clique no botão "Ver Detalhes" ou em qualquer ponto do card abre o Master Pop-up
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
      const dec = (ed.decisao_recomendada || '').toUpperCase();
      const isGo = dec.includes('GO') && !dec.includes('NO-GO');

      const semaforoIcone = isGo ? '🟢 GO' : '🟡 AVALIAR';

      tr.innerHTML = `
        <td><strong>${semaforoIcone}</strong></td>
        <td><span class="badge-tag badge-orgao">${escapeHtml(ed.orgao)}</span></td>
        <td>
          <div style="font-weight:700; color:var(--cais-navy); cursor:pointer;">${escapeHtml(ed.titulo)}</div>
          ${isUrgente ? `<span class="badge-tag badge-urgente" style="margin-top:4px;">🚨 Vence em ${dias} dias</span>` : ''}
        </td>
        <td class="font-mono">${escapeHtml(ed.prazo_submissao || '—')}</td>
        <td class="font-mono" style="font-weight:700; color:#0369A1;">${escapeHtml(ed.valor_financiado || '—')}</td>
        <td><span class="nota-circulo">⭐ ${Number(ed.score_ponderado || 0).toFixed(1)}/10</span></td>
        <td>
          <button class="botao botao-primario btn-tabela-detalhes" type="button" style="padding: 6px 12px; font-size:12.5px;">
            🔍 Ver Detalhes
          </button>
        </td>
      `;

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
    if (modo === 'cards') {
      btnModoCards.classList.add('ativo');
      btnModoTabela.classList.remove('ativo');
    } else {
      btnModoTabela.classList.add('ativo');
      btnModoCards.classList.remove('ativo');
    }
    renderizarResultados();
  }

  /**
   * Abre o Master Pop-up Modal unificado
   */
  function abrirModal(ed) {
    editalSelecionado = ed;

    const modalTitulo = document.getElementById('modalTitulo');
    const tagsModal = document.getElementById('tagsModal');
    const modalSubtitulo = document.getElementById('modalSubtitulo');

    const dias = calcularDiasRestantes(ed.prazo_submissao);
    const isUrgente = dias !== null && dias >= 0 && dias <= 7;
    const dec = (ed.decisao_recomendada || '').toUpperCase();
    const isGo = dec.includes('GO') && !dec.includes('NO-GO');

    const hojeBR = obterDataHojeBR();
    tagsModal.innerHTML = `
      <span class="badge-tag badge-orgao">${escapeHtml(ed.orgao)}</span>
      <span class="badge-tag ${isGo ? 'badge-go' : 'badge-avaliar'}">${isGo ? '🟢 GO! Submeter Proposta' : '🟡 AVALIAR COM PARCEIROS'}</span>
      <span class="badge-tag">⭐ Nota: ${Number(ed.score_ponderado || 0).toFixed(1)}/10</span>
      ${isUrgente ? `<span class="badge-tag badge-urgente">🚨 Prazo Fatal: ${dias === 0 ? 'Encerra Hoje!' : `Faltam ${dias} dias`}</span>` : ''}
      <span class="badge-tag badge-origem-real">🛡️ Verificado hoje (${hojeBR})</span>
    `;

    modalTitulo.textContent = ed.titulo;
    modalSubtitulo.textContent = `Identificador: ${ed.id_edital || 'CAIS-ID'} • Atualizado na data de hoje: ${hojeBR}`;

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

    document.getElementById('modalIdeiaProjeto').textContent = ed.ideia_projeto_cais || 'Ideia de projeto em elaboração pela equipe CAIS.';
    document.getElementById('modalParceiros').textContent = ed.parceiros_sugeridos || 'UECE, Laboratórios do LDI e indústrias associadas.';
    document.getElementById('modalResumo').textContent = ed.resumo_objetivo || 'Sem resumo disponível.';
    document.getElementById('modalJustificativa').textContent = ed.justificativa_cais || 'Oportunidade oficial qualificada pelo Radar CAIS.';

    // Aba 2: Termômetro de Notas 5 Etapas
    const aderencia = Number(ed.nota_aderencia || 0);
    const chance = Number(ed.nota_chance_aprovacao || 0);
    const financeira = Number(ed.nota_financeira || 0);
    const complexidade = Number(ed.nota_complexidade || 5);
    const viabilidade = Math.max(0, 10 - complexidade);
    const scoreFinal = Number(ed.score_ponderado || 0).toFixed(1);

    document.getElementById('notaAderencia').textContent = `${aderencia}/10`;
    document.getElementById('barraAderencia').style.width = `${aderencia * 10}%`;

    document.getElementById('notaChance').textContent = `${chance}/10`;
    document.getElementById('barraChance').style.width = `${chance * 10}%`;

    document.getElementById('notaFinanceira').textContent = `${financeira}/10`;
    document.getElementById('barraFinanceira').style.width = `${financeira * 10}%`;

    document.getElementById('notaViabilidade').textContent = `${viabilidade}/10`;
    document.getElementById('barraViabilidade').style.width = `${viabilidade * 10}%`;

    document.getElementById('modalScoreFinal').innerHTML = `${scoreFinal} <span class="max-nota">/ 10</span>`;

    const badgeDecisao = document.getElementById('modalDecisaoFinal');
    badgeDecisao.textContent = isGo ? '🟢 RECOMENDAÇÃO: SUBMETER PROPOSTA' : '🟡 RECOMENDAÇÃO: AVALIAR COM PARCEIROS';
    if (isGo) {
      badgeDecisao.style.background = 'var(--semaforo-verde-bg)';
      badgeDecisao.style.color = 'var(--semaforo-verde-txt)';
      badgeDecisao.style.borderColor = 'var(--semaforo-verde-border)';
    } else {
      badgeDecisao.style.background = 'var(--semaforo-amarelo-bg)';
      badgeDecisao.style.color = 'var(--semaforo-amarelo-txt)';
      badgeDecisao.style.borderColor = 'var(--semaforo-amarelo-border)';
    }

    // Link oficial governamental
    btnLinkOficial.href = ed.link || '#';

    // Sempre abre por padrão na Aba 1 (Estratégia)
    alternarAbaModal('estrategia');

    fundoModal.classList.add('aberto');
    document.body.style.overflow = 'hidden';
  }

  function fecharModal() {
    fundoModal.classList.remove('aberto');
    document.body.style.overflow = '';
  }

  function copiarResumoDidatico() {
    if (!editalSelecionado) return;
    const ed = editalSelecionado;
    const dias = calcularDiasRestantes(ed.prazo_submissao);
    const hojeBR = obterDataHojeBR();
    const prazoFormatado = formatarPrazoDidatico(ed.prazo_submissao, dias);
    const texto = `
📌 RADAR CAIS — OPORTUNIDADE OFICIAL (Verificado em ${hojeBR})
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

    navigator.clipboard.writeText(texto).then(() => {
      exibirToast('Resumo oficial copiado para a área de transferência!', 'success');
    }).catch(() => {
      exibirToast('Não foi possível copiar automaticamente.', 'error');
    });
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
        exibirToast('Não foi possível iniciar a varredura no servidor.', 'error');
        varreduraEmProgresso = false;
        btnVarreduraTopo.disabled = false;
        if (btnIniciarVarreduraCentral) btnIniciarVarreduraCentral.disabled = false;
        return;
      }

      exibirToast('🛰️ Robô navegando nos portais do governo. Isso leva de 15 a 30 segundos.', 'info');

      // Polling para acompanhar término da varredura real
      let segundos = 0;
      const pollingStatus = setInterval(async () => {
        segundos += 2;
        try {
          const statusRes = await fetch('/api/status-varredura');
          if (statusRes.ok) {
            const st = await statusRes.json();
            textoStatus.textContent = `${st.mensagem || 'Consultando páginas oficiais...'} (${segundos}s)`;

            if (!st.em_progresso) {
              clearInterval(pollingStatus);
              varreduraEmProgresso = false;
              btnVarreduraTopo.disabled = false;
              if (btnIniciarVarreduraCentral) btnIniciarVarreduraCentral.disabled = false;
              document.getElementById('labelVarredura').textContent = 'Buscar Editais na Web';
              if (icone) icone.style.animation = '';
              pontoStatus.className = 'ponto-status verde';

              await carregarDados();
              if (editais.length > 0) {
                exibirToast(`✅ Sucesso! Encontramos ${editais.length} oportunidades oficiais ativas!`, 'success');
              } else {
                exibirToast('Varredura finalizada. Nenhum novo edital aberto neste exato instante.', 'info');
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
      return;
    } catch (err) {
      exibirToast('Não foi possível conectar com a API de varredura. O servidor local está ativo?', 'error');
    } finally {
      varreduraEmProgresso = false;
      btnVarreduraTopo.disabled = false;
      if (btnIniciarVarreduraCentral) btnIniciarVarreduraCentral.disabled = false;
      document.getElementById('labelVarredura').textContent = 'Buscar Editais na Web';
      const icone = document.getElementById('iconeGirar');
      if (icone) icone.style.animation = '';
    }
  }

  function resetarFiltros() {
    campoBusca.value = '';
    btnLimparBusca.style.display = 'none';
    filtroDecisao.value = '';
    filtroOrgao.value = '';
    filtroPrazo.value = '';
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

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
