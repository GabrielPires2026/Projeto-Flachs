/*
    Variáveis dos elementos do documento Cadastro.html, que serão usadas para capturar eventos 
    dos respectivos inputs 
    Por exemplo:
    Se eu pego o evento: blur do nome, eu posso validar, se o campo está ou não está preenchido, validar se o nome 
    inicia com letra maiúscula, guardar o atributo value do input (o atributo value pega a string do elemento) e guardar
    os valores desse atributo na memória do navegador (localStorage) 
*/
//Variáveis dos campos de informações
const frm = document.querySelector("form");
const nome = document.getElementById("inNome");
const email = document.getElementById("inEmail");
const cpf = document.getElementById("inCpf");
const senha = document.getElementById("inSenha");
const confirmador = document.getElementById("inConfirmaSenha");
//Variáveis dos radios dos perfís de usuário
const cliente = document.getElementById("inCliente").checked;
const empresario = document.getElementById("inEmpresario").checked;
const entregador = document.getElementById("inEntregador").checked;
//Variáveis dos radios dos veículos
const bicicleta = document.getElementById("inBicicleta").checked;
const carro = document.getElementById("inCarro").checked;
const moto = document.getElementById("inMoto").checked;
const naoPossuiVeiculo = document.getElementById("inNaoPossuiVeiculo");
const outroVeiculo = document.getElementById("inOutroVeiculo");
//Botoes do formulário
const btnCadastrar = document.getElementById("btnEnviar");
const btnResetarPagina = document.getElementById("btnResetar"); 

/*
    Variáveis dos elementos do documento Cliente.html.
*/
//Variáveis do menu de opções
const menuOpcoes = document.querySelector(".section-menu-opcoes");
const btnPerfil = document.querySelector(".dir-perfil");
const btnChat = document.querySelector(".dir-chat");
const btnfinanceiro = document.querySelector(".config-financeira");
const btnOpcional = document.querySelector(".config");
//Variáveis do article de pedidos
const btnChatEntregador = document.querySelector(".chat-entregador");
const btnCancelaEntrega = document.querySelector(".cancela-pedido");
const btnAdicionarPedido = document.querySelector(".novo-pedido");
//Variáveis da seção de perfil
const fotoPerfil = document.querySelector(".img-perfil");
const txtBiografia = document.querySelector(".biografia");
const txtRedesSociais = document.querySelector(".redes-sociais");
const btnAlterarPerfil = document.querySelector(".config-alteracao-perfil");
