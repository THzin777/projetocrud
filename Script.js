import { app, db } from './firebaseConfig.js'; 
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";

function getInputs() {
    return {
        nome: document.getElementById('nome'),
        cpf: document.getElementById('cpf'),
        telefone: document.getElementById('telefone'),
        email: document.getElementById('email'),
        historicoReservas: document.getElementById('historico-reservas')
    };
}

function getValores({ nome, cpf, telefone, email, historicoReservas }) {
    return {
        nome: nome.value.trim(),
        cpf: cpf.value.trim(),
        telefone: telefone.value.trim(),
        email: email.value.trim(),
        historicoReservas: historicoReservas.value.trim()
    };
}


function limpar({ nome, cpf, telefone, email, historicoReservas }) {
    nome.value = '';
    cpf.value = '';
    telefone.value = '';
    email.value = '';
    historicoReservas.value = '';
}

// Cadastrar Cliente
document.getElementById("btnEnviar").addEventListener('click', async function () {
    const Inputs = getInputs();
    const dados = getValores(Inputs);

    if (!dados.nome || !dados.cpf || !dados.telefone || !dados.email || !dados.historicoReservas) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const ref = await addDoc(collection(db, "clientes"), dados);
        console.log("ID do documento", ref.id);
        limpar(Inputs);
        alert("Cliente cadastrado com sucesso!");
    } catch (e) {
        console.error("Erro: ", e);
    }
});

// Função para buscar os clientes do banco
async function buscarClientes() {
    const dadosBanco = await getDocs(collection(db, "clientes"));
    const clientes = [];
    for (let cliente of dadosBanco.docs) {
        clientes.push({ id: cliente.id, ...cliente.data() });
    }
    return clientes;
}

const listaClientesDiv = document.getElementById("listar-clientes");

async function carregarListaDeClientes() {
    listaClientesDiv.innerHTML = '<p> Carregando lista de clientes... </p>';
    try {
        let clientes = await buscarClientes();
        renderizarListaDeClientes(clientes);
    } catch (error) {
        console.error("Erro ao carregar lista de clientes:", error);
        listaClientesDiv.innerHTML = '<p> Erro ao carregar a lista de clientes... </p>';
    }
}

function renderizarListaDeClientes(clientes) {
    listaClientesDiv.innerHTML = '';
    if (clientes.length === 0) {
        listaClientesDiv.innerHTML = '<p> Nenhum cliente cadastrado ainda ;( </p>';
        return;
    }
    for (let cliente of clientes) {
        const clienteDiv = document.createElement('div');
        clienteDiv.innerHTML = `
            <strong>Nome:</strong> ${cliente.nome} <br>
            <strong>CPF:</strong> ${cliente.cpf} <br>
            <strong>Telefone:</strong> ${cliente.telefone} <br>
            <strong>Email:</strong> ${cliente.email} <br>
            <strong>Histórico de Reservas:</strong> ${cliente.historicoReservas} <br>
            <button class="btn-excluir" data-id="${cliente.id}">Excluir</button>
            <button class="btn-editar" data-id="${cliente.id}">Editar</button>
            <hr>
        `;
        listaClientesDiv.appendChild(clienteDiv);
    }
}

document.addEventListener('DOMContentLoaded', carregarListaDeClientes);

// Excluir Cliente
async function excluirCliente(idCliente) {
    try {
        const docToDelete = doc(db, 'clientes', idCliente);
        await deleteDoc(docToDelete);
        alert("Cliente excluído com sucesso!");
        carregarListaDeClientes();
    } catch (e) {
        console.error("Erro ao excluir cliente:", e);
        alert("Erro ao excluir cliente. Tente novamente.");
    }
}

// Editar Cliente
async function editarCliente(idCliente) {
    const clienteDoc = doc(db, "clientes", idCliente);
    const clienteSnapshot = await getDoc(clienteDoc);
    if (clienteSnapshot.exists()) {
        const cliente = clienteSnapshot.data();
        document.getElementById("editar-nome").value = cliente.nome;
        document.getElementById("editar-cpf").value = cliente.cpf;
        document.getElementById("editar-telefone").value = cliente.telefone;
        document.getElementById("editar-email").value = cliente.email;
        document.getElementById("editar-historico-reservas").value = cliente.historicoReservas;
        document.getElementById("editar-id").value = clienteSnapshot.id;
        document.getElementById("formulario-edicao").style.display = "block";
    }
}

// Salvar Edição
document.getElementById("btn-salvar-edicao").addEventListener("click", async function () {
    const id = document.getElementById("editar-id").value;
    const novosDados = {
        nome: document.getElementById("editar-nome").value.trim(),
        cpf: document.getElementById("editar-cpf").value.trim(),
        telefone: document.getElementById("editar-telefone").value.trim(),
        email: document.getElementById("editar-email").value.trim(),
        historicoReservas: document.getElementById("editar-historico-reservas").value.trim()
    };
    try {
        const ref = doc(db, "clientes", id);
        await setDoc(ref, novosDados);
        alert("Cliente atualizado com sucesso!");
        document.getElementById("formulario-edicao").style.display = "none";
        carregarListaDeClientes();
    } catch (e) {
        console.error("Erro ao salvar edição", e);
        alert("Erro ao atualizar cliente.");
    }
});

// Cancelar Edição
document.getElementById("btn-cancelar-edicao").addEventListener("click", function () {
    document.getElementById("formulario-edicao").style.display = "none";
});


document.getElementById("listar-clientes").addEventListener("click", function (event) {
    const btnExcluir = event.target.closest(".btn-excluir");
    if (btnExcluir) {
        const idCliente = btnExcluir.dataset.id;
        const confirmar = confirm("Tem certeza que deseja excluir esse cliente?");
        if (confirmar) {
            excluirCliente(idCliente);
        }
    }
    
    const btnEditar = event.target.closest(".btn-editar");
    if (btnEditar) {
        const idCliente = btnEditar.dataset.id;
        editarCliente(idCliente);
    }
});