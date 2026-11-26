document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. MAPEAMENTO DAS PÁGINAS (SPA) E ROTATION SYSTEM
    // ==========================================================================
    const paginas = {
        cadastro: document.querySelector('.pagina-cadastro'),
        cliente: document.querySelector('.pagina-cliente'),
        empresario: document.querySelector('.pagina-empresario'),
        entregador: document.querySelector('.pagina-entregador')
    };

    /**
     * Alterna a exibição das telas da SPA.
     * @param {string} nomePagina - Nome da página ('cadastro', 'cliente', 'empresario', 'entregador')
     */
    function navegarPara(nomePagina) {
        Object.keys(paginas).forEach(chave => {
            if (paginas[chave]) {
                paginas[chave].classList.remove('pagina-ativa');
                paginas[chave].style.display = 'none'; // Garante o display none
            }
        });

        if (paginas[nomePagina]) {
            paginas[nomePagina].classList.add('pagina-ativa');
            paginas[nomePagina].style.display = 'flex'; // Exibe a página selecionada
        }
    }

    // Inicia a SPA na tela de cadastro
    navegarPara('cadastro');


    // ==========================================================================
    // 2. ELEMENTOS DO FORMULÁRIO DE CADASTRO
    // ==========================================================================
    const formCadastro = document.querySelector('.form-cadastro');
    const inNome = document.getElementById('inNome');
    const inEmail = document.getElementById('inEmail');
    const inCpf = document.getElementById('inCpf');
    const inSenha = document.getElementById('inSenha');
    const inConfirmarSenha = document.getElementById('inConfirmarSenha');
    const inEstado = document.getElementById('inEstado');
    const inCidade = document.getElementById('inCidade');
    const inBairro = document.getElementById('inBairro');
    const inRua = document.getElementById('inRua');
    const inNumero = document.getElementById('inNumero');
    const inSN = document.getElementById('inSN');

    // ==========================================================================
    // 3. VALIDAÇÃO E ENVIO DO CADASTRO
    // ==========================================================================
    if (formCadastro) {
        formCadastro.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o recarregamento da página

            const nomeVal = inNome.value.trim();
            const emailVal = inEmail.value.trim();
            const cpfVal = inCpf.value.trim();
            const senhaVal = inSenha.value;
            const confirmarSenhaVal = inConfirmarSenha.value;
            const estadoVal = inEstado.value.trim();
            const cidadeVal = inCidade.value.trim();
            const bairroVal = inBairro.value.trim();
            const ruaVal = inRua.value.trim();
            const perfilChecado = document.querySelector('input[name="tipoPerfil"]:checked');

            // --- REGRAS DE VALIDAÇÃO ---

            // 1. Validação de Nome (Primeira letra Maiúscula)
            if (nomeVal === '' || nomeVal[0] !== nomeVal[0].toUpperCase()) {
                alert('O nome deve começar com uma letra MAIÚSCULA.');
                inNome.focus();
                return;
            }

            // 2. Validação de E-mail (Deve conter @gmail)
            if (!emailVal.toLowerCase().includes('@gmail')) {
                alert('Por favor, insira um e-mail válido do Google (deve conter @gmail).');
                inEmail.focus();
                return;
            }

            // 3. Validação de CPF
            if (cpfVal.length < 11) {
                alert('Por favor, preencha um CPF válido.');
                inCpf.focus();
                return;
            }

            // 4. Validação da Senha e Confirmação
            if (senhaVal === '' || confirmarSenhaVal === '') {
                alert('Preencha a senha e a confirmação de senha.');
                inSenha.focus();
                return;
            }

            if (senhaVal !== confirmarSenhaVal) {
                alert('As senhas não coincidem. Digite novamente.');
                inConfirmarSenha.focus();
                return;
            }

            // 5. Validação dos Campos de Localização
            if (estadoVal === '' || cidadeVal === '' || bairroVal === '' || ruaVal === '') {
                alert('Por favor, preencha todos os campos da localização.');
                return;
            }

            // 6. Validação do Perfil (Radio)
            if (!perfilChecado) {
                alert('Por favor, selecione uma forma de cadastro (Cliente, Entregador ou Empresário).');
                return;
            }

            // --- TUDO VÁLIDO: ATUALIZAR OS PERFIS COM OS DADOS DIGITADOS ---
            const dadosUsuario = {
                nome: nomeVal,
                email: emailVal,
                cpf: cpfVal,
                localizacao: `${bairroVal}, ${cidadeVal} - ${estadoVal}`,
                tipoPerfil: perfilChecado.value
            };

            atualizarInformacoesDePerfil(dadosUsuario);

            // Redireciona para a tela correspondente ao rádio marcado
            alert(`Cadastro realizado com sucesso! Bem-vindo(a), ${dadosUsuario.nome}.`);
            navegarPara(dadosUsuario.tipoPerfil);
        });
    }


    // ==========================================================================
    // 4. ATUALIZAÇÃO DINÂMICA DOS PERFIS
    // ==========================================================================
    function atualizarInformacoesDePerfil(dados) {
        // A) Atualizar Perfil Cliente
        const clienteNomeHeader = document.querySelector('.pagina-cliente .header-info-perfil h1');
        const clienteBio = document.querySelector('.pagina-cliente .Biografia');
        if (clienteNomeHeader) clienteNomeHeader.textContent = dados.nome;
        if (clienteBio) clienteBio.textContent = `Cliente residente em ${dados.localizacao}.`;

        // B) Atualizar Perfil Empresário
        const empresarioNomeHeader = document.querySelector('.pagina-empresario .header-info-perfil h1');
        const empresarioCnpj = document.querySelector('.pagina-empresario .info-cnpj');
        const empresarioBio = document.querySelector('.pagina-empresario .Biografia');
        if (empresarioNomeHeader) empresarioNomeHeader.textContent = dados.nome;
        if (empresarioCnpj) empresarioCnpj.textContent = dados.cpf; // Exibe o documento cadastrado
        if (empresarioBio) empresarioBio.textContent = `Estabelecimento localizado em ${dados.localizacao}.`;

        // C) Atualizar Perfil Entregador
        const entregadorNome = document.querySelector('.pagina-entregador .nome-entregador');
        const entregadorDoc = document.querySelector('.pagina-entregador .documento-entregador');
        const entregadorBio = document.querySelector('.pagina-entregador .Biografia');
        if (entregadorNome) entregadorNome.textContent = dados.nome;
        if (entregadorDoc) entregadorDoc.textContent = `CPF: ${dados.cpf} | Veículo: Cadastrado`;
        if (entregadorBio) entregadorBio.textContent = `Entregador parceiro atuando em ${dados.localizacao}.`;
    }


    // ==========================================================================
    // 5. MODAIS (<dialog>) - NOVO PEDIDO E CHAT
    // ==========================================================================

    // --- MODAL A: CHAT COM ENTREGADOR / CLIENTE ---
    const dialogChat = document.querySelector('.dialog-chat-entregador');
    const btnsAbrirChat = document.querySelectorAll('.chat-entregador, .btn-chat-entregador');
    const btnSairChat = document.getElementById('btnSair');
    const btnEnviarMsg = document.getElementById('btnEnviar-msg');
    const inMsgInput = document.getElementById('inMsg');
    const msgContentArea = document.querySelector('.msg-content');

    // Abrir Chat
    btnsAbrirChat.forEach(btn => {
        btn.addEventListener('click', () => {
            if (dialogChat) dialogChat.showModal();
        });
    });

    // Fechar Chat
    if (btnSairChat && dialogChat) {
        btnSairChat.addEventListener('click', () => {
            dialogChat.close();
        });
    }

    // Enviar Mensagem no Chat
    if (btnEnviarMsg && inMsgInput && msgContentArea) {
        btnEnviarMsg.addEventListener('click', () => {
            const texto = inMsgInput.value.trim();
            if (texto !== '') {
                const p = document.createElement('p');
                p.style.margin = '4px 0';
                p.innerHTML = `<strong>Você:</strong> ${texto}`;
                msgContentArea.appendChild(p);
                inMsgInput.value = '';
                msgContentArea.scrollTop = msgContentArea.scrollHeight;
            }
        });
    }


    // --- MODAL B: NOVO PEDIDO ---
    const dialogNovoPedido = document.querySelector('.dialog-novo-pedido');
    const btnAbrirNovoPedido = document.querySelector('.novo-pedido');
    const btnCancelarPedidoModal = document.getElementById('btnCancelar-acao-pedido');
    const btnEnviarPedidoModal = document.getElementById('btnEnviar-pedido');
    const inNomePedidoInput = document.getElementById('inNome-pedido');

    // Abrir Modal de Novo Pedido
    if (btnAbrirNovoPedido && dialogNovoPedido) {
        btnAbrirNovoPedido.addEventListener('click', () => {
            dialogNovoPedido.showModal();
        });
    }

    // Fechar Modal de Novo Pedido
    if (btnCancelarPedidoModal && dialogNovoPedido) {
        btnCancelarPedidoModal.addEventListener('click', () => {
            dialogNovoPedido.close();
        });
    }

    // Confirmar Envio do Novo Pedido
    if (btnEnviarPedidoModal && dialogNovoPedido) {
        btnEnviarPedidoModal.addEventListener('click', (e) => {
            e.preventDefault();
            const pedidoTexto = inNomePedidoInput ? inNomePedidoInput.value.trim() : '';
            if (pedidoTexto === '') {
                alert('Por favor, digite o nome do item que deseja pedir.');
                return;
            }
            alert(`Pedido "${pedidoTexto}" enviado com sucesso ao estabelecimento!`);
            if (inNomePedidoInput) inNomePedidoInput.value = '';
            dialogNovoPedido.close();
        });
    }


    // ==========================================================================
    // 6. FUNÇÕES DOS BOTÕES DENTRO DOS CONTAINERS DE PÁGINAS
    // ==========================================================================

    // A) Alterar Perfil (Redireciona para o cadastro para editar)
    const btnsAlterarPerfil = document.querySelectorAll('.config-alteracao-perfil');
    btnsAlterarPerfil.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Deseja voltar ao formulário para alterar os dados do seu perfil?')) {
                navegarPara('cadastro');
            }
        });
    });

    // B) Cancelar Pedidos / Adiar Entrega
    const btnsCancelar = document.querySelectorAll('.cancela-pedido, .btn-cancelar-pedido');
    btnsCancelar.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Tem certeza de que deseja cancelar ou adiar esta operação?')) {
                alert('Operação cancelada/adiada com sucesso.');
            }
        });
    });

    // C) Concluir Entrega (Entregador)
    const btnFinalizarEntrega = document.querySelector('.finalizar-entrega');
    if (btnFinalizarEntrega) {
        btnFinalizarEntrega.addEventListener('click', () => {
            alert('Parabéns! Entrega concluída e valor creditado na sua conta.');
        });
    }

    // D) Ver Detalhes do Pedido
    const btnVerInfo = document.querySelector('.ver-informacoes');
    if (btnVerInfo) {
        btnVerInfo.addEventListener('click', () => {
            alert('Detalhes da Entrega:\n- Origem: House Burguer 190\n- Destino: Rua Central, nº 45, Bairro Centro\n- Status: Concluída');
        });
    }

    // E) Configurações Financeiras: Depósito e Chave PIX
    const formConfigFinanceiras = document.querySelector('.form-config-financeiras');
    const inValorDeposito = document.getElementById('inValorDeposito');
    const infoSaldoCliente = document.querySelector('.pagina-cliente .info-saldo');

    if (formConfigFinanceiras) {
        formConfigFinanceiras.addEventListener('submit', (e) => {
            e.preventDefault();
            const valorDep = parseFloat(inValorDeposito ? inValorDeposito.value : 0);

            if (!isNaN(valorDep) && valorDep > 0) {
                alert(`Depósito de R$ ${valorDep.toFixed(2)} realizado com sucesso!`);
                if (infoSaldoCliente) {
                    // Atualiza o saldo exibido na tela
                    infoSaldoCliente.textContent = `R$ ${(135.90 + valorDep).toFixed(2)}`;
                }
                inValorDeposito.value = '';
            } else {
                alert('Dados financeiros atualizados com sucesso!');
            }
        });
    }

    // F) Botão Voltar ao Topo
    const iconeVoltarTopo = document.querySelector('.icone-seta');
    if (iconeVoltarTopo) {
        iconeVoltarTopo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
