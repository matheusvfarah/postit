const API_URL = 'http://localhost:3000/bilhetes';
const INTERVALO = 30000;

const ROTACOES = [-3, -1.5, 0, 1.5, 3, -2, 2];

function rotacaoAleatoria() {
  return ROTACOES[Math.floor(Math.random() * ROTACOES.length)];
}

function formatarData(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function iconesTipo(tipo) {
  const icones = { recado: '📝 Recado', lista: '✅ Lista', reuniao: '📅 Reunião' };
  return icones[tipo] || tipo;
}

function renderizarBilhete(b) {
  const rot = rotacaoAleatoria();
  const div = document.createElement('div');
  div.className = `postit ${b.cor}`;
  div.style.setProperty('--rot', `${rot}deg`);

  let conteudo = '';

  if (b.tipo === 'lista' && b.itens_lista) {
    const itens = Array.isArray(b.itens_lista) ? b.itens_lista : JSON.parse(b.itens_lista);
    conteudo = `<ul class="postit-lista">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;
  } else if (b.tipo === 'reuniao') {
    conteudo = `
      ${b.mensagem ? `<p class="postit-mensagem">${b.mensagem}</p>` : ''}
      <span class="postit-horario">🕐 ${formatarData(b.horario)}</span>
    `;
  } else {
    conteudo = b.mensagem ? `<p class="postit-mensagem">${b.mensagem}</p>` : '';
  }

  div.innerHTML = `
    <span class="postit-tipo">${iconesTipo(b.tipo)}</span>
    <h2 class="postit-titulo">${b.titulo}</h2>
    ${conteudo}
    <span class="postit-autor">— ${b.autor}</span>
  `;

  return div;
}

async function carregarBilhetes() {
  const mural = document.getElementById('mural');
  const status = document.getElementById('status');

  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error('Falha na requisição');
    const bilhetes = await resp.json();

    mural.innerHTML = '';

    if (bilhetes.length === 0) {
      mural.innerHTML = '<p class="vazio">Nenhum bilhete ainda. Crie um pelo celular! 📱</p>';
    } else {
      bilhetes.forEach(b => mural.appendChild(renderizarBilhete(b)));
    }

    const agora = new Date().toLocaleTimeString('pt-BR');
    status.textContent = `Última atualização: ${agora} · Próxima em 30 segundos`;
  } catch (err) {
    status.textContent = 'Erro ao conectar com o servidor. Tentando novamente...';
  }
}

function atualizarRelogio() {
  const el = document.getElementById('relogio');
  const agora = new Date();
  el.textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

carregarBilhetes();
atualizarRelogio();

setInterval(carregarBilhetes, INTERVALO);
setInterval(atualizarRelogio, 1000);
