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
const secaoPerfil = document.querySelector(".section-info-perfil");
const cabecalhoPerfil = document.querySelector(".header-info-perfil");
const localInformacaoPerfil = document.querySelector(".article-info-perfil");
const campoBiografia = document.querySelector(".info-biografia");
const fotoPerfil = document.querySelector(".img-perfil");
const txtBiografia = document.querySelector(".biografia");
const txtRedesSociais = document.querySelector(".redes-sociais");
const saldoAtual = document.querySelector(".info-saldo");
const formaPagamento = {
    exibirTipo: document.querySelector(".title-forma-pagamento"),
    formaPagamento: document.querySelector(".info-forma-pagamento") 
} 
const btnAlterarPerfil = document.querySelector(".config-alteracao-perfil");
//Variáveis da seção de chat
const secaoChat = document.querySelector(".section-chat");
const contentChat = document.querySelector(".chat-menu-content");
const menuChat = document.querySelector(".chat-menu");
const opcaoChat = document.getElementsByClassName("opcao-msg-content");
const containerChat = document.querySelector(".section-container-chat");
const cabecalhoChat = {
    container: document.querySelector(".headerChat"),
    imgPerfil: document.querySelector(".img-perfil-chat"),
    nomePerfil: document.querySelector(".nome-perfil")
}
const telaMsg = {
    msgContent: document.querySelector(".paragrafo-msg"),
    inputContainerMsg: document.getElementById("msg-input"),
    btnEnviatMsg: document.getElementById(".msg-submit"),
    frm:  document.querySelector(".form-msg")
}
//Variáveis ds sessao de histórico financeiro
const sessaoHistoricoFinanceiro = {
    container: document.querySelector(".section-info-financeiras"),
    cabecalho: document.querySelector(".header-info-financeiras"),
    registroFinanceiro: document.querySelector(".registro-financeiro"),
    tituloRegistro: document.querySelector(".title-registro-financeiro"),
    codigoRegistro: document.querySelector(".codigo-registro-financeiro"),
    tituloEstabelecimento: document.querySelector(".title-estabelecimento"),
    localServico:  document.querySelector(".nome-estabelecimento"),
    tituloDespesa: document.querySelector(".title-despesa"),
    saida: document.querySelector(".despesa"),
    entrada: document.querySelector(".despesa"),
    operacao: document.querySelector(".detalhe-operacao"),
    statusOperacao: document.querySelector(".status-operacao")
}
const configuracaoFinanceira = {
    container: document.querySelector(".section-config-financeiras"),
    cabecalho: document.querySelector(".header-config-financeiras"),
    frm: document.querySelector(".form-config-financeiras"),
    configBanco: document.getElementById("inNovoBanco"),
    configAgencia: document.getElementById("inNumeroAgencia"),
    configFormaPagamento: document.getElementById("inFormaPagamento"),
    //Propriedades responsáveis pela configuração de novos depósitos
    bancoDeposito: document.getElementById("inBancoDeposito"),
    valorDeposito: document.getElementById("inValorDeposito"),
    btnEnviar: document.getElementById("btnEnviarConfig")
}
/*
Variáveis respectivas ao perfil do empresário
*/
//Variáveis do perfil do empresário
const perfilEmpresario = {
    //Propriedades das informações básicas de perfil do empresário
    nomeEmpresario: document.querySelector(".nome-empresario"),
    imgPerfilEmpresario: document.querySelector(".img-perfil-empresario"),
    cnpj: document.querySelector(".text-cnpj"),
    biografia: document.querySelector(".text-biografia"),
    //Propriedades responsáveis pela exibição de informaçções financeiras
    btnSaldo: document.querySelector(".btn-saldo"),
    saldo: document.querySelector(".info-saldo"),
    btnSaldoEmpresa: document.querySelector(".btn-saldo-empresa"),
    saldoEmporesa: document.querySelector(".info-saldo-empresa"),
    btnFormaPagamento: document.querySelector(".btn-forma-pagamento"),
    formaPagamento: document.querySelector(".forma-pagamento-atual")
}
//Propriedades das cofigurações de forma de pagamento
const modalConfigFormasPagamento = {
    btnConfigFormaPagamento: document.querySelector(".btn-config-forma-pagamento"),
    modalConfigFormasPagamento: document.querySelector(".modal-config-formas-pagamento"),
    frm: document.querySelector(".form-formas-pagamentos"),
    adicionaFormaPagamento: document.querySelector(".inForma-pagamento"),
    codigoFormaPagamento: document.querySelector(".inIdentificador-forma-pagamento"),
    btnEnviarFormaPagamento: document.querySelector(".btnEnviar-forma-pagamento"),
    btnCancelarOperacao: document.querySelector(".btnCancelar-forma-pagamento")
}

const modalConfigPerfil = {
    btnConfigPerfil: document.querySelector(".btn-config-perfil"),
    modalConfigPerfil: document.querySelector(".modal-config-perfil"),
    frm: document.querySelector(".form-config-perfil"),
    fotoPerfil: document.getElementById("inFoto-perfil"),
    nomeUsuario: document.getElementById("inNome-usuario"),
    biografiaUsuario: document.getElementById("inBiografia-usuario"), 
    btnEnviar: document.getElementById("btnEnviar-informacoes-perfil"),
    btnCancelar: document.getElementById("btnCancelar-modificacoes")
}