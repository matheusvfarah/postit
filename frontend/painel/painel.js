const API_URL = 'http://localhost:3000/bilhetes';

// Elementos
const lista       = document.getElementById('lista');
const overlay     = document.getElementById('overlay');
const form        = document.getElementById('form');
const modalTitulo = document.getElementById('modal-titulo');
const bilheteId   = document.getElementById('bilheteId');
const inputTitulo = document.getElementById('titulo');
const inputAutor  = document.getElementById('autor');
const selectTipo  = document.getElementById('tipo');
const txtMensagem = document.getElementById('mensagem');
const inputHorario = document.getElementById('horario');
const campoMensagem = document.getElementById('campo-mensagem');
const campoHorario  = document.getElementById('campo-horario');
const campoLista    = document.getElementById('campo-lista');
const itensWrapper  = document.getElementById('itens-wrapper');
const erroEl        = document.getElementById('erro');

// Adapta campos conforme tipo selecionado
selectTipo.addEventListener('change', adaptarCampos);

function adaptarCampos() {
  const tipo = selectTipo.value;
  campoMensagem.hidden = tipo === 'lista';
  campoHorario.hidden  = tipo !== 'reuniao';
  campoLista.hidden    = tipo !== 'lista';
}

// Itens da lista dinâmicos
document.getElementById('btnAddItem').addEventListener('click', () => adicionarItem(''));

function adicionarItem(valor) {
  const row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML = `
    <input type="text" placeholder="Ex: Arroz" value="${valor}" maxlength="100" />
    <button type="button" class="btn-remove-item" title="Remover">✕</button>
  `;
  row.querySelector('.btn-remove-item').addEventListener('click', () => row.remove());
  itensWrapper.appendChild(row);
}

function coletarItens() {
  return Array.from(itensWrapper.querySelectorAll('input'))
    .map(i => i.value.trim())
    .filter(Boolean);
}

// Modal
function abrirModal(bilhete = null) {
  form.reset();
  itensWrapper.innerHTML = '';
  erroEl.hidden = true;
  bilheteId.value = '';

  if (bilhete) {
    modalTitulo.textContent = 'Editar Bilhete';
    bilheteId.value   = bilhete.id;
    inputTitulo.value = bilhete.titulo;
    inputAutor.value  = bilhete.autor;
    selectTipo.value  = bilhete.tipo;
    txtMensagem.value = bilhete.mensagem || '';

    // Cor
    const radio = form.querySelector(`input[name="cor"][value="${bilhete.cor}"]`);
    if (radio) radio.checked = true;

    if (bilhete.horario) {
      inputHorario.value = bilhete.horario.slice(0, 16);
    }

    if (bilhete.tipo === 'lista' && bilhete.itens_lista) {
      const itens = Array.isArray(bilhete.itens_lista)
        ? bilhete.itens_lista
        : JSON.parse(bilhete.itens_lista);
      itens.forEach(i => adicionarItem(i));
    }
  } else {
    modalTitulo.textContent = 'Novo Bilhete';
    // Seleciona amarelo por padrão
    form.querySelector('input[name="cor"][value="amarelo"]').checked = true;
  }

  adaptarCampos();
  overlay.hidden = false;
  inputTitulo.focus();
}

function fecharModal() {
  overlay.hidden = true;
}

document.getElementById('btnNovo').addEventListener('click', () => abrirModal());
document.getElementById('btnFechar').addEventListener('click', fecharModal);
overlay.addEventListener('click', e => { if (e.target === overlay) fecharModal(); });

// Submissão do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  erroEl.hidden = true;

  const tipo = selectTipo.value;
  const corInput = form.querySelector('input[name="cor"]:checked');

  if (!corInput) {
    mostrarErro('Selecione uma cor para o bilhete.');
    return;
  }

  const payload = {
    titulo:     inputTitulo.value.trim(),
    autor:      inputAutor.value.trim(),
    tipo,
    cor:        corInput.value,
    mensagem:   tipo !== 'lista' ? txtMensagem.value.trim() : null,
    horario:    tipo === 'reuniao' ? inputHorario.value || null : null,
    itens_lista: tipo === 'lista' ? coletarItens() : null,
  };

  if (tipo === 'lista' && payload.itens_lista.length === 0) {
    mostrarErro('Adicione pelo menos um item à lista.');
    return;
  }

  const id = bilheteId.value;
  const url    = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';

  try {
    const resp = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const data = await resp.json();
      mostrarErro(data.erro || 'Erro ao salvar bilhete.');
      return;
    }

    fecharModal();
    carregarBilhetes();
  } catch {
    mostrarErro('Não foi possível conectar ao servidor.');
  }
});

function mostrarErro(msg) {
  erroEl.textContent = msg;
  erroEl.hidden = false;
}

// Carregar e renderizar bilhetes
async function carregarBilhetes() {
  lista.innerHTML = '<div class="carregando">Carregando...</div>';
  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error();
    const bilhetes = await resp.json();
    renderizarLista(bilhetes);
  } catch {
    lista.innerHTML = '<div class="carregando">Erro ao carregar. Verifique o servidor.</div>';
  }
}

function renderizarLista(bilhetes) {
  lista.innerHTML = '';

  if (bilhetes.length === 0) {
    lista.innerHTML = '<div class="vazio">Nenhum bilhete ainda.<br>Toque em + para criar o primeiro!</div>';
    return;
  }

  bilhetes.forEach(b => lista.appendChild(criarCard(b)));
}

function criarCard(b) {
  const card = document.createElement('div');
  card.className = `card ${b.cor}`;

  const badges = { recado: '📝 Recado', lista: '✅ Lista', reuniao: '📅 Reunião' };
  let conteudo = '';

  if (b.tipo === 'lista' && b.itens_lista) {
    const itens = Array.isArray(b.itens_lista) ? b.itens_lista : JSON.parse(b.itens_lista);
    conteudo = `<ul class="card-lista">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;
  } else {
    if (b.mensagem) conteudo += `<p class="card-mensagem">${b.mensagem}</p>`;
    if (b.tipo === 'reuniao' && b.horario) {
      const d = new Date(b.horario);
      conteudo += `<span class="card-horario">🕐 ${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>`;
    }
  }

  card.innerHTML = `
    <div class="card-header">
      <span class="card-badge">${badges[b.tipo] || b.tipo}</span>
      <div class="card-acoes">
        <button class="btn-editar">Editar</button>
        <button class="btn-excluir">Excluir</button>
      </div>
    </div>
    <h3 class="card-titulo">${b.titulo}</h3>
    ${conteudo}
    <span class="card-autor">— ${b.autor}</span>
  `;

  card.querySelector('.btn-editar').addEventListener('click', () => abrirModal(b));
  card.querySelector('.btn-excluir').addEventListener('click', () => excluir(b.id));

  return card;
}

async function excluir(id) {
  if (!confirm('Excluir este bilhete?')) return;
  try {
    const resp = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!resp.ok) throw new Error();
    carregarBilhetes();
  } catch {
    alert('Erro ao excluir bilhete.');
  }
}

carregarBilhetes();
