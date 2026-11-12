
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Interface de terminal para interações com o usuário.
const rl = readline.createInterface({ input, output });

// ============ USUARIO ============

/** Classe-base: concentra os dados e operações comuns a todos os perfis. */
class Usuario {
  #_nome;
  #_senha;
  #_profissao;
  #_saldo;

  constructor(nome, senha, profissao = undefined, saldo = 0) {
    this.#_nome = nome;
    this.#_senha = senha;
    this.#_profissao = profissao;
    this.#_saldo = saldo;
  }

  get nome() { return this.#_nome; }
  get senha() { return this.#_senha; }
  get profissao() { return this.#_profissao; }

  get saldo() {
    return this.#_saldo >= 1 ? this.#_saldo : 0;
  }

  set saldo(novoSaldo) {
    this.#_saldo = novoSaldo;
  }

  /** Persiste os dados básicos do usuário em usuario.json. */
  salvarUsuario() {
    const caminho = path.join(__dirname, "usuario.json");

    const dados = {
      nome: this.#_nome,
      profissao: this.#_profissao,
      saldo: this.#_saldo
    };

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
  }
}

// ============ CLIENTE ============

/** Representa quem realiza compras e acompanha o estado do pedido. */
class Cliente extends Usuario {
  #_pedido;
  #_statusDaCompra;
  #_produto;
  #_caminhoArquivo;

  constructor(nome, senha, profissao, saldo, pedido, statusDaCompra = undefined, produto) {
    super(nome, senha, profissao, saldo);

    this.#_pedido = pedido;
    this.#_statusDaCompra = statusDaCompra;
    this.#_produto = produto;

    this.#_caminhoArquivo = path.join(__dirname, "cliente.json");

    this.carregar();
  }

  get pedido() {
    if (this.saldo >= 1) return this.#_pedido;
  }

  get statusDaCompra() {
    return this.#_statusDaCompra;
  }

  get produto() {
    return this.#_produto;
  }

  /** Recupera do JSON os dados persistidos para esta instância. */
  carregar() {
    if (!fs.existsSync(this.#_caminhoArquivo)) {
      this.salvar();
      return;
    }

    const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8");

    if (!conteudo.trim()) return;

    const dados = JSON.parse(conteudo);

    this.#_pedido = dados.pedidos?.[0] ?? this.#_pedido;
    this.#_produto = dados.produto ?? this.#_produto;
    this.#_statusDaCompra = dados.statusDaCompra ?? this.#_statusDaCompra;
  }

  /** Serializa o estado atual da instância no arquivo associado à classe. */
  salvar() {
    const dados = {
      pedidos: this.#_pedido ? [this.#_pedido] : [],
      produto: this.#_produto,
      statusDaCompra: this.#_statusDaCompra
    };

    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
  }

  /** Conclui a compra somente quando o saldo disponível cobre o valor informado. */
  efetuarCompra(valor, produto) {
    if (this.saldo >= valor) {
      this.saldo = this.saldo - valor;
      this.#_produto = produto;
      this.#_pedido = produto;
      this.#_statusDaCompra = "comprado";

      this.salvar();

      return this.saldo;
    } else {
      console.log("Saldo insuficiente!");
    }
  }

  /** Informa o estado de recebimento da compra. */
  receberCompra() {
    if (this.statusDaCompra) {
      console.log("A compra foi recebida com sucesso!");
    } else {
      console.log("Nenhuma compra recebida ainda!");
    }
  }

  /** Registra a devolução e credita ao cliente o valor informado. */
  devolverCompra(valor, produto) {
    this.saldo = this.saldo + valor;
    this.#_statusDaCompra = "devolvido";

    this.salvar();

    console.log("Devolução concedida com sucesso!");
  }
}

// ============ ENTREGADOR ============

/** Representa o entregador e controla o ciclo de vida dos serviços atribuídos a ele. */
class Entregador extends Usuario {
  #_prazoEntrega;
  #_servicosEmAndamento;
  #_enderecoPedido;
  #_caminhoArquivo;

  constructor(nome, senha, saldo = 0, prazoEntrega, enderecoPedido = {}) {
    super(nome, senha, 'entregador', saldo);

    this.#_prazoEntrega = prazoEntrega;
    this.#_servicosEmAndamento = [];
    this.#_enderecoPedido = enderecoPedido;

    this.#_caminhoArquivo = path.join(__dirname, "entregador.json");

    this.carregar();
  }

  get prazoEntrega() { return this.#_prazoEntrega; }
  get servicosEmAndamento() { return this.#_servicosEmAndamento; }
  get enderecoPedido() { return this.#_enderecoPedido; }

  carregar() {
    if (!fs.existsSync(this.#_caminhoArquivo)) {
      this.salvar();
      return;
    }

    const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8");

    if (!conteudo.trim()) return;

    const dados = JSON.parse(conteudo);

    this.#_servicosEmAndamento = dados.servicosEmAndamento || [];
  }

  salvar() {
    const dados = {
      servicosEmAndamento: this.#_servicosEmAndamento
    };

    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
  }

  /** Registra um novo serviço na fila do entregador, inicialmente pendente. */
  escolherServicos(idServico, pedido, endereco, valor, statusDoServico = "pendente") {
    const servico = {
      id: idServico,
      pedido,
      endereco,
      valor,
      status: statusDoServico
    };

    this.#_servicosEmAndamento.push(servico);

    console.log(`Serviço ${idServico} - ${pedido} escolhido. Aguardando aceitar.`);

    this.salvar();

    return servico;
  }

  /** Aceita somente serviços existentes que ainda estejam pendentes. */
  aceitarServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico);

    if (!servico) return console.log("Serviço não encontrado");

    if (servico.status !== "pendente") {
      return console.log(`O servico não pode ser aceito no momento, status do serviço: ${servico.status}`);
    }

    servico.status = "aceito";

    console.log(`Serviço ${idServico} aceito! Pode buscar o pedido.`);

    this.salvar();
  }

  /** Inicia a execução apenas depois que o serviço foi aceito. */
  fazerServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico);

    if (!servico) return console.log("Serviço não encontrado");

    if (servico.status !== "aceito") {
      return console.log(`Precisa aceitar antes. Status: ${servico.status}`);
    }

    servico.status = "em andamento";

    console.log(`Entregando ${servico.pedido} para ${servico.endereco}...`);

    this.salvar();
  }

  /** Finaliza um serviço em andamento e credita sua remuneração ao entregador. */
  finalizarServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico);

    if (!servico) return console.log("Serviço não encontrado");

    if (servico.status !== "em andamento") {
      return console.log(`Precisa estar fazendo. Status: ${servico.status}`);
    }

    servico.status = "finalizado";

    console.log(`Serviço ${idServico} finalizado!`);

    this.salvar();

    this.receberPorServico(servico.valor);
  }

  /** Atualiza o saldo do entregador após a conclusão de um serviço. */
  receberPorServico(valor) {
    this.saldo = this.saldo + valor;

    console.log(`Você recebeu R$${valor}. Saldo atual: R$${this.saldo}`);

    this.salvar();
  }

  /** Remove da fila apenas serviços que ainda estejam pendentes. */
  recusarServico(idServico) {
    const indice = this.#_servicosEmAndamento.findIndex(s => s.id === idServico);

    if (indice === -1) return console.log("Serviço não encontrado");

    const servico = this.#_servicosEmAndamento[indice];

    if (servico.status !== "pendente") {
      return console.log(`Não dá pra recusar, já está ${servico.status}`);
    }

    this.#_servicosEmAndamento.splice(indice, 1);

    console.log(`Serviço ${idServico} recusado.`);

    this.salvar();
  }
}

// ============ EMPRESARIO ============

/** Representa a empresa: divulga serviços, contrata funcionários e realiza pagamentos. */
class Empresario extends Usuario {
  #_saldoDaEmpresa;
  #_servicosFornecidos;
  #_cnpj;
  #_num_funcionarios;
  #_caminhoArquivo;
  #_funcionarios;
  #_servicosAprovados;

  constructor(nome, senha, profissao = undefined, saldo = 0, saldoDaEmpresa, cnpj, funcionarios = 0) {
    super(nome, senha, profissao, saldo);

    this.#_saldoDaEmpresa = saldoDaEmpresa;
    this.#_servicosFornecidos = [];
    this.#_cnpj = cnpj;
    this.#_num_funcionarios = funcionarios;

    this.#_caminhoArquivo = path.join(__dirname, "empresario.json");

    this.#_funcionarios = [];
    this.#_servicosAprovados = [];

    this.carregar();
  }

  get saldoDaEmpresa() { return this.#_saldoDaEmpresa; }
  get servicosFornecidos() { return this.#_servicosFornecidos; }
  get cnpj() { return this.#_cnpj; }
  get num_funcionarios() { return this.#_num_funcionarios; }
  get funcionarios() { return this.#_funcionarios; }
  get servicosAprovados() { return this.#_servicosAprovados; }

  carregar() {
    if (!fs.existsSync(this.#_caminhoArquivo)) {
      this.salvarServico();
      return;
    }

    const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8");

    if (!conteudo.trim()) return;

    const dados = JSON.parse(conteudo);

    if (Array.isArray(dados)) {
      this.#_servicosFornecidos = dados;
      return;
    }

    this.#_servicosFornecidos = dados.servicosFornecidos || [];
    this.#_servicosAprovados = dados.servicosAprovados || [];
    this.#_funcionarios = dados.funcionarios || [];
    this.#_saldoDaEmpresa = dados.saldoDaEmpresa ?? this.#_saldoDaEmpresa;

    this.#_num_funcionarios = this.#_funcionarios.length;
  }

  /** Persiste os dados administrativos e financeiros da empresa. */
  salvarServico() {
    const dados = {
      servicosFornecidos: this.#_servicosFornecidos,
      servicosAprovados: this.#_servicosAprovados,
      funcionarios: this.#_funcionarios,
      saldoDaEmpresa: this.#_saldoDaEmpresa
    };

    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");

    console.log("Servicos salvos em empresario.json");
  }

  /** Inclui um serviço na lista da empresa, evitando duplicidade. */
  adicionarNovoServico(servico) {
    if (this.#_servicosFornecidos.includes(servico)) {
      console.log("Serviço já existe");
      return;
    }

    this.#_servicosFornecidos.push(servico);

    console.log("Novo servico adicionado a empresa");

    this.salvarServico();
  }

  /** Retorna a quantidade de vagas informada para divulgação. */
  adicionarVagas(qtd) {
    return qtd;
  }

  /** Registra o serviço e exibe as condições de divulgação da oportunidade. */
  divulgarServicos(servico, vagas, remuneracao) {
    this.adicionarNovoServico(servico);

    console.log(`Divulgado: ${servico} - ${vagas} vagas - R$${remuneracao}`);
  }

  /** Registra um entregador quando a opção de entrega já foi divulgada. */
  contratarEntregador(entregador) {
    const nome = typeof entregador === "string" ? entregador : entregador.nome;

    // A contratação depende da divulgação prévia do serviço pela empresa.
    if (!this.#_servicosFornecidos.includes("Entregador")) {
      return console.log("Não dá pra contratar, você nem divulga serviço de Entregador ainda");
    }

    if (this.#_funcionarios.find(f => f.nome === nome)) {
      return console.log(`${nome} já é funcionário`);
    }

    this.#_funcionarios.push({ nome, cargo: "entregador" });
    this.#_num_funcionarios += 1;

    console.log(`${nome} contratado como Entregador! Total: ${this.#_num_funcionarios}`);

    this.salvarServico();
  }

  /** Contrata um vendedor se a empresa tiver divulgado esse tipo de serviço. */
  contratarVendedor(vendedor) {
    const nome = typeof vendedor === "string" ? vendedor : vendedor.nome;

    if (!this.#_servicosFornecidos.includes("Vendedor")) {
      return console.log("Não dá pra contratar, você nem divulga serviço de Vendedor ainda");
    }

    if (this.#_funcionarios.find(f => f.nome === nome)) {
      return console.log(`${nome} já é funcionário`);
    }

    this.#_funcionarios.push({ nome, cargo: "vendedor" });
    this.#_num_funcionarios += 1;

    console.log(`${nome} contratado como Vendedor! Total: ${this.#_num_funcionarios}`);

    this.salvarServico();
  }

  /** Aprova para pagamento um serviço previamente cadastrado pela empresa. */
  aprovarServico(servico) {
    if (!this.#_servicosFornecidos.includes(servico)) {
      return console.log(`Serviço ${servico} nem existe pra aprovar`);
    }

    if (this.#_servicosAprovados.includes(servico)) {
      return console.log(`Serviço ${servico} já estava aprovado`);
    }

    this.#_servicosAprovados.push(servico);

    console.log(`Serviço ${servico} aprovado!`);

    this.salvarServico();
  }

  /** Paga um serviço aprovado, desde que a empresa tenha saldo suficiente. */
  pagarPorServico(servico, valor, quemRecebe) {
    if (!this.#_servicosAprovados.includes(servico)) {
      return console.log(`Não dá pra pagar, ${servico} ainda não foi aprovado`);
    }

    if (this.#_saldoDaEmpresa < valor) {
      return console.log(`Saldo insuficiente! Tem R$${this.#_saldoDaEmpresa}`);
    }

    this.#_saldoDaEmpresa -= valor;

    if (quemRecebe) {
      quemRecebe.saldo = quemRecebe.saldo + valor;
    }

    console.log(`Pago R$${valor} por ${servico} para ${quemRecebe?.nome || "funcionário"}. Saldo empresa: R$${this.#_saldoDaEmpresa}`);

    this.salvarServico();
  }
}

// ============ VENDEDOR ============

/** Representa o vendedor e administra catálogo, divulgação e vendas. */
class Vendedor extends Usuario {
  #_VendasEmAndamento;
  #_saldoVendas;
  #_produtos;
  #_comercios;
  #_servicosDivulgados;
  #_entregadoresContratados;
  #_caminhoArquivo;

  constructor(nome, senha, profissao = "vendedor", saldo = 0, saldoVendas = 0) {
    super(nome, senha, profissao, saldo);

    this.#_VendasEmAndamento = [];
    this.#_saldoVendas = saldoVendas;
    this.#_produtos = [];
    this.#_comercios = [];
    this.#_servicosDivulgados = [];
    this.#_entregadoresContratados = [];

    this.#_caminhoArquivo = path.join(__dirname, "vendedor.json");

    this.carregar();
  }

  get vendasEmAndamento() { return this.#_VendasEmAndamento; }
  get saldoVendas() { return this.#_saldoVendas; }

  set saldoVendas(valor) {
    this.#_saldoVendas = valor;
  }

  get produtos() { return this.#_produtos; }
  get comercios() { return this.#_comercios; }
  get servicosDivulgados() { return this.#_servicosDivulgados; }
  get entregadoresContratados() { return this.#_entregadoresContratados; }

  get totalProdutos() {
    return this.#_produtos.reduce((t, p) => t + p.estoque, 0);
  }

  get totalVendasPendentes() {
    return this.#_VendasEmAndamento.filter(v => v.status === "pendente").length;
  }

  /** Recupera do JSON o catálogo, os serviços e os dados financeiros. */
  carregar() {
    if (!fs.existsSync(this.#_caminhoArquivo)) {
      this.salvar();
      return;
    }

    const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8");

    if (!conteudo.trim()) return;

    const dados = JSON.parse(conteudo);

    this.#_produtos = dados.produtos || [];
    this.#_comercios = dados.comercios || [];
    this.#_servicosDivulgados = dados.servicos || [];
    this.#_entregadoresContratados = dados.entregadores || [];
    this.#_saldoVendas = dados.saldoVendas ?? this.#_saldoVendas;
    this.#_VendasEmAndamento = dados.vendas || [];
  }

  /** Cadastra um produto ou soma unidades ao estoque de um produto existente. */
  divulgarProduto(nomeProduto, preco, estoque = 1) {
    const jaExiste = this.#_produtos.find(p => p.nome === nomeProduto);

    if (jaExiste) {
      jaExiste.estoque += estoque;

      console.log(`${nomeProduto} já existia, estoque: ${jaExiste.estoque}`);

      this.salvar();
      return;
    }

    this.#_produtos.push({
      nome: nomeProduto,
      preco,
      estoque
    });

    console.log(`Produto divulgado: ${nomeProduto} - R$${preco}`);

    this.salvar();
  }

  /** Registra um comércio divulgado pelo vendedor, evitando nomes repetidos. */
  divulgarComercio(nomeComercio, endereco = "") {
    if (this.#_comercios.includes(nomeComercio)) {
      return console.log(`Comércio ${nomeComercio} já divulgado`);
    }

    this.#_comercios.push(nomeComercio);

    console.log(`Comércio divulgado: ${nomeComercio} - ${endereco}`);

    this.salvar();
  }

  /** Adiciona à lista os serviços que o vendedor oferece. */
  divulgarServicos(servico) {
    if (this.#_servicosDivulgados.includes(servico)) {
      return console.log(`Serviço ${servico} já divulgado`);
    }

    this.#_servicosDivulgados.push(servico);

    console.log(`Serviço divulgado: ${servico}`);

    this.salvar();
  }

  /** Contrata um entregador depois de divulgar a opção de entrega. */
  contratarEntregador(entregador) {
    const nome = typeof entregador === "string" ? entregador : entregador.nome;

    // O vendedor só pode contratar entregador depois de divulgar a opção de entrega.
    if (!this.#_servicosDivulgados.includes("Entrega")) {
      return console.log("Precisa divulgar 'Entrega' antes");
    }

    if (this.#_entregadoresContratados.find(e => e.nome === nome)) {
      return console.log(`${nome} já é seu entregador`);
    }

    this.#_entregadoresContratados.push({ nome });

    console.log(`${nome} contratado`);

    this.salvar();
  }

  /** Paga um entregador contratado, se houver saldo de vendas suficiente. */
  pagarEntregador(nomeEntregador, valor, entregadorObjeto = null) {
    if (!this.#_entregadoresContratados.find(e => e.nome === nomeEntregador)) {
      return console.log(`${nomeEntregador} não é seu entregador`);
    }

    if (this.#_saldoVendas < valor) {
      return console.log(`Saldo insuficiente! Tem R$${this.#_saldoVendas}`);
    }

    this.#_saldoVendas -= valor;

    if (entregadorObjeto) {
      entregadorObjeto.saldo = entregadorObjeto.saldo + valor;
    }

    console.log(`Pago R$${valor} para ${nomeEntregador}. Saldo vendas: R$${this.#_saldoVendas}`);

    this.salvar();
  }

  /** Debita o pagamento de um serviço divulgado, respeitando o saldo disponível. */
  pagarPorServico(servico, valor) {
    if (!this.#_servicosDivulgados.includes(servico)) {
      return console.log(`Serviço ${servico} nem foi divulgado`);
    }

    if (this.#_saldoVendas < valor) {
      return console.log(`Saldo insuficiente para pagar ${servico}`);
    }

    this.#_saldoVendas -= valor;

    console.log(`Pago R$${valor} por ${servico}. Saldo: R$${this.#_saldoVendas}`);

    this.salvar();
  }

  /** Registra a venda, reduz o estoque e atualiza o saldo de vendas. */
  venderProduto(nomeProduto) {
    const produto = this.#_produtos.find(p => p.nome === nomeProduto);

    if (!produto) return console.log("Produto não encontrado");

    if (produto.estoque <= 0) return console.log("Sem estoque");

    produto.estoque -= 1;
    this.#_saldoVendas += produto.preco;

    this.#_VendasEmAndamento.push({
      produto: nomeProduto,
      valor: produto.preco,
      status: "pendente"
    });

    console.log(`Vendido: ${nomeProduto} por R$${produto.preco}`);

    this.salvar();
  }

  /** Persiste os dados comerciais e financeiros do vendedor. */
  salvar() {
    const dados = {
      produtos: this.#_produtos,
      comercios: this.#_comercios,
      servicos: this.#_servicosDivulgados,
      entregadores: this.#_entregadoresContratados,
      saldoVendas: this.#_saldoVendas,
      vendas: this.#_VendasEmAndamento
    };

    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
  }
}

// ============ EXECUÇÃO DO PROJETO ============

// Demonstração das operações principais do projeto FLACHS.
console.log("===================================================================================");
console.log(" SEJA BEM-VINDO AO PROJETO FLACHS ");
console.log("===================================================================================");
console.log("\n");

// ============ EMPRESÁRIO ============

const emp = new Empresario("Joao", "123", "empresario", 0, 10000, "123456");

emp.divulgarServicos("Entregador", 2, 1800);
emp.aprovarServico("Entregador");

const carlos = new Entregador("Carlos", "123", 0, "30min");

emp.contratarEntregador(carlos);
emp.pagarPorServico("Entregador", 25, carlos);

console.log(
  "Empresario:",
  emp.servicosFornecidos,
  "Saldo empresa:",
  emp.saldoDaEmpresa,
  "Carlos:",
  carlos.saldo
);

// ============ VENDEDOR ============

const vend = new Vendedor("Maria", "123", "vendedor", 0, 1000);

vend.divulgarProduto("Camiseta", 50, 10);
vend.divulgarComercio("Loja da Maria");
vend.divulgarServicos("Entrega");

vend.contratarEntregador(carlos);

console.log("Vendedor:", vend.produtos, vend.comercios);

// Encerra a interface de leitura do terminal.
rl.close();
