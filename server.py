from flask import Flask, jsonify,request, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

contacts = []
proximoId = 1

@app.route('/', methods = ['GET'])
def inicio():
    return render_template('index.html')

@app.route('/api/status', methods = ['GET'])
def status():
    return jsonify({"API": "Gerenciador de Contatos", "status": "online" , "versao": "1.0"})

@app.route('/contacts', methods = ['GET'])
def listarContatos():
    return jsonify(contacts)

@app.route('/contacts', methods = ['POST'])
def criarContato():
    global proximoId
    dados = request.get_json() or {}
    name = dados.get("name", "")
    if not name:
        return jsonify({"Erro": "O campo name é Obrigatorio!"}),400
    
    email = dados.get("email", "")
    phone = dados.get("phone", "")

    contato = {
        "id" : proximoId,
        "name": name,
        "email": email,
        "phone": phone
    }
    proximoId +=1
    contacts.append(contato)
    return jsonify(contato),201


@app.route('/contacts/<int:contactId>', methods = ['PUT'])
def atualizarContato(contactId):
    dados = request.get_json() or {}
    name = dados.get("name", "")
    email = dados.get("email", "")
    phone = dados.get("phone", "")

    for contact in contacts:
        if contact['id'] == contactId:
            contact['name'] = name
            contact['email'] = email
            contact['phone'] = phone
            return jsonify(contact), 200

    return jsonify({"Erro": "Contato nao encontrado"}),404

@app.route('/contacts/<int:contactId>', methods = ['DELETE'])
def deletarContato(contactId):
    for contact in contacts:
        if contact['id'] == contactId:
            contacts.remove(contact)
            return '', 204

    return jsonify({"Erro": "Contato nao encontrado"}),404    


if __name__ == '__main__':
    app.run(host = "0.0.0.0",debug = True, port = 5000) 



