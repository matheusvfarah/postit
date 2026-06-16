const API_URL = 'http://localhost:3000/bilhetes';
const INTERVALO = 30000;

const ROTACOES  = [-4, -2.5, -1.5, 0, 1.5, 2.5, 4, -3, 3];
const IMAS      = ['vermelho', 'azul-ima', 'verde-ima', 'roxo', 'laranja-ima', 'prata'];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatarData(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

const BADGES = { recado: '📝 Recado', lista: '✅ Lista', reuniao: '📅 Reunião' };

function criarPostit(b) {
  const rot = rand(ROTACOES);
  const ima = rand(IMAS);

  const el = document.createElement('div');
  el.className = `postit ${b.cor}`;
  el.style.setProperty('--rot', `${rot}deg`);

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

  el.innerHTML = `
    <div class="ima ${ima}"></div>
    <span class="postit-tipo">${BADGES[b.tipo] || b.tipo}</span>
    <h2 class="postit-titulo">${b.titulo}</h2>
    ${conteudo}
    <span class="postit-autor">— ${b.autor}</span>
  `;

  return el;
}

async function carregar() {
  const mural  = document.getElementById('mural');
  const status = document.getElementById('status');

  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error();
    const bilhetes = await resp.json();

    mural.innerHTML = '';

    if (bilhetes.length === 0) {
      mural.innerHTML = '<p class="vazio">Nenhum bilhete ainda.<br>Crie um pelo celular! 📱</p>';
    } else {
      bilhetes.forEach(b => mural.appendChild(criarPostit(b)));
    }

    const hora = new Date().toLocaleTimeString('pt-BR');
    status.textContent = `Atualizado às ${hora} · próxima atualização em 30s`;
  } catch {
    status.textContent = 'Sem conexão com o servidor...';
  }
}

function tickRelogio() {
  const el = document.getElementById('relogio');
  el.textContent = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

carregar();
tickRelogio();
setInterval(carregar, INTERVALO);
setInterval(tickRelogio, 1000);
