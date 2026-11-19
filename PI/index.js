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