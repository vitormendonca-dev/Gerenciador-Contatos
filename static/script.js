// ============================================================
// CONTRATO DA API (o seu backend precisa implementar isto):
//
//   GET    /contacts       -> 200  [ { id, name, phone, email }, ... ]
//   POST   /contacts       -> 201  { id, name, phone, email }
//                          body: { name, phone, email }
//   PUT    /contacts/:id   -> 200  { id, name, phone, email }
//                          body: { name, phone, email }
//   DELETE /contacts/:id   -> 204  (sem corpo)
//
//   Erros: devolva 400 (dados inválidos) ou 404 (id não existe).
//   Lembre de habilitar CORS no backend.
// ============================================================

const $ = (id) => document.getElementById(id);
let contacts = [];
let editingId = null;

const baseUrl = () => $('apiUrl').value.trim().replace(/\/$/, '');

function showError(msg) {
  $('error').textContent = msg;
  $('error').hidden = !msg;
}

async function api(path, options = {}) {
  const res = await fetch(baseUrl() + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Erro ${res.status} em ${options.method || 'GET'} ${path}\n${text}`);
  }
  return res.status === 204 ? null : res.json();
}

async function load() {
  try {
    contacts = await api('/contacts');
    $('dot').className = 'dot ok';
    showError('');
  } catch (e) {
    $('dot').className = 'dot fail';
    contacts = [];
    showError(e instanceof TypeError
      ? 'Não consegui falar com a API. Ela está rodando? O CORS está habilitado?'
      : e.message);
  }
  render();
}

async function run(action) {
  try {
    await action();
    showError('');
    await load();
    return true;
  } catch (e) {
    showError(e.message);
    return false;
  }
}

function resetForm() {
  editingId = null;
  $('form').reset();
  $('formTitle').textContent = 'Novo contato';
  $('submitBtn').textContent = 'Adicionar contato';
  $('cancelBtn').hidden = true;
}

function startEdit(c) {
  editingId = c.id;
  $('name').value = c.name || '';
  $('phone').value = c.phone || '';
  $('email').value = c.email || '';
  $('formTitle').textContent = 'Editar contato';
  $('submitBtn').textContent = 'Salvar alterações';
  $('cancelBtn').hidden = false;
  $('name').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  const term = $('search').value.trim().toLowerCase();
  const shown = contacts.filter((c) => (c.name || '').toLowerCase().includes(term));
  const list = $('list');
  list.innerHTML = '';

  if (!shown.length) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.className = 'msg';
    span.textContent = contacts.length
      ? 'Nenhum contato encontrado para essa busca.'
      : 'Nenhum contato ainda. Preencha o formulário acima para adicionar o primeiro.';
    li.appendChild(span);
    list.appendChild(li);
  }

  shown.forEach((c) => {
    const li = document.createElement('li');

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = (c.name || '?').trim().charAt(0).toUpperCase();
    li.appendChild(avatar);

    const info = document.createElement('div');
    info.className = 'info';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = c.name;
    const detail = document.createElement('div');
    detail.className = 'detail';
    detail.textContent = [c.phone, c.email].filter(Boolean).join('  |  ') || 'Sem telefone ou email';
    info.appendChild(name);
    info.appendChild(detail);
    li.appendChild(info);

    const edit = document.createElement('button');
    edit.className = 'small';
    edit.textContent = 'Editar';
    edit.onclick = () => startEdit(c);
    li.appendChild(edit);

    const del = document.createElement('button');
    del.className = 'small danger';
    del.textContent = 'Excluir';
    del.onclick = () => {
      if (!confirm(`Excluir o contato "${c.name}"?`)) return;
      if (editingId === c.id) resetForm();
      run(() => api(`/contacts/${c.id}`, { method: 'DELETE' }));
    };
    li.appendChild(del);

    list.appendChild(li);
  });

  $('count').textContent = contacts.length
    ? `${shown.length} de ${contacts.length} contatos`
    : '';
}

$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = JSON.stringify({
    name: $('name').value.trim(),
    phone: $('phone').value.trim(),
    email: $('email').value.trim(),
  });
  const ok = editingId === null
    ? await run(() => api('/contacts', { method: 'POST', body }))
    : await run(() => api(`/contacts/${editingId}`, { method: 'PUT', body }));
  if (ok) resetForm();
});

$('cancelBtn').addEventListener('click', resetForm);
$('search').addEventListener('input', render);
$('reconnect').addEventListener('click', load);
load();