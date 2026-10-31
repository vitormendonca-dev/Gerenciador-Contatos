# Gerenciador de Contatos
 
Gerenciador de contatos desenvolvido para praticar a integração entre front-end e back-end. O backend é uma API REST em Flask com as operações de listar, criar, editar e excluir contatos. O front-end consome essa API usando `fetch`.
 
> **Sobre o desenvolvimento:** o front-end foi gerado com auxílio de IA (Claude), já que o foco deste projeto era praticar o backend e a integração via API REST. O backend, em Flask, foi desenvolvido por mim.
 
## Tecnologias
 
- Python 3
- Flask
- Flask-CORS
- HTML, CSS e JavaScript (front-end)
## Como rodar
 
1. Clone o repositório e entre na pasta do projeto.
2. Instale as dependências:
```
   pip install flask flask-cors
```
 
3. Inicie o servidor:
```
   python server.py
```
 
4. Abra `http://localhost:5000` no navegador.
## Estrutura do projeto
 
```
Gerenciador-Contatos/
├── server.py          # API Flask
├── templates/
│   └── index.html     # Página principal
└── static/
    ├── style.css      # Estilos
    └── script.js      # Lógica do front-end (fetch)
```
 
## Rotas da API
 
| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Página principal |
| GET | `/api/status` | Status da API |
| GET | `/contacts` | Lista todos os contatos |
| POST | `/contacts` | Cria um contato (`name` é obrigatório) |
| PUT | `/contacts/<id>` | Atualiza um contato |
| DELETE | `/contacts/<id>` | Remove um contato |
 
### Exemplo de contato
 
```json
{
  "id": 1,
  "name": "Maria",
  "phone": "45 99999-0000",
  "email": "maria@email.com"
}
```****
