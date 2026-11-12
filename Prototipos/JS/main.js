import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rl = readline.createInterface({ input, output });

// ============ USUARIO ============
class Usuario {
  #_nome; #_senha; #_profissao; #_saldo;
  constructor(nome, senha, profissao = undefined, saldo = 0) {
    this.#_nome = nome; this.#_senha = senha; this.#_profissao = profissao; this.#_saldo = saldo;
  }
  get nome() { return this.#_nome; }
  get senha() { return this.#_senha; }
  get profissao() { return this.#_profissao; }
  get saldo() { return this.#_saldo >= 1 ? this.#_saldo : 0; }
  set saldo(novoSaldo) { this.#_saldo = novoSaldo; }
}

// ============ CLIENTE ============
class Cliente extends Usuario {
  #_pedido; #_statusDaCompra; #_produto;
  constructor(nome, senha, profissao, saldo, pedido, statusDaCompra = undefined, produto) {
    super(nome, senha, profissao, saldo);
    this.#_pedido = pedido; this.#_statusDaCompra = statusDaCompra; this.#_produto = produto;
  }
  get pedido() { if (this.saldo >= 1) return this.#_pedido; }
  get statusDaCompra() { return this.#_statusDaCompra; }
  efetuarCompra(valor, produto) {
    if (this.saldo >= valor) { this.saldo = this.saldo - valor; this.#_produto = produto; return this.saldo; }
    else console.log("Saldo insuficiente!");
  }
  receberCompra() {
    if (this.statusDaCompra) console.log("A compra foi recebida com sucesso!");
    else console.log("Nenhuma compra recebida ainda!");
  }
  devolverCompra(valor, produto) { this.saldo = this.saldo + valor; console.log("Devolução concedida com sucesso!"); }
}

// ============ ENTREGADOR ============
class Entregador extends Usuario {
  #_prazoEntrega; #_servicosEmAndamento; #_enderecoPedido;
  constructor(nome, senha, saldo = 0, prazoEntrega, enderecoPedido = {}) {
    super(nome, senha, 'entregador', saldo);
    this.#_prazoEntrega = prazoEntrega; this.#_servicosEmAndamento = []; this.#_enderecoPedido = enderecoPedido;
  }
  get prazoEntrega() { return this.#_prazoEntrega; }
  get servicosEmAndamento() { return this.#_servicosEmAndamento; } // CORRIGIDO: só 1 getter agora
  get enderecoPedido() { return this.#_enderecoPedido; }

  escolherServicos(idServico, pedido, endereco, valor, statusDoServico = "pendente") {
    const servico = { id: idServico, pedido, endereco, valor, status: statusDoServico };
    this.#_servicosEmAndamento.push(servico);
    console.log(`Serviço ${idServico} - ${pedido} escolhido. Aguardando aceitar.`);
    return servico;
  }
  aceitarServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico);
    if (!servico) return console.log("Serviço não encontrado");
    if (servico.status !== "pendente") return console.log(`Não dá pra aceitar, status atual: ${servico.status}`);
    servico.status = "aceito"; console.log(`Serviço ${idServico} aceito! Pode buscar o pedido.`);
  }
  fazerServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico);
    if (!servico) return console.log("Serviço não encontrado");
    if (servico.status !== "aceito") return console.log(`Precisa aceitar antes. Status: ${servico.status}`);
    servico.status = "em andamento"; console.log(`Entregando ${servico.pedido} para ${servico.endereco}...`);
  }
  finalizarServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico);
    if (!servico) return console.log("Serviço não encontrado");
    if (servico.status !== "em andamento") return console.log(`Precisa estar fazendo. Status: ${servico.status}`);
    servico.status = "finalizado"; console.log(`Serviço ${idServico} finalizado!`); this.receberPorServico(servico.valor);
  }
  receberPorServico(valor) { this.saldo = this.saldo + valor; console.log(`Você recebeu R$${valor}. Saldo atual: R$${this.saldo}`); }
  recusarServico(idServico) {
    const indice = this.#_servicosEmAndamento.findIndex(s => s.id === idServico);
    if (indice === -1) return console.log("Serviço não encontrado");
    const servico = this.#_servicosEmAndamento[indice];
    if (servico.status !== "pendente") return console.log(`Não dá pra recusar, já está ${servico.status}`);
    this.#_servicosEmAndamento.splice(indice, 1); console.log(`Serviço ${idServico} recusado e removido da sua lista.`);
  }
}

// ============ EMPRESARIO ============
class Empresario extends Usuario {
  #_saldoDaEmpresa; #_servicosFornecidos; #_cnpj; #_num_funcionarios; #_caminhoArquivo; #_funcionarios; #_servicosAprovados;
  constructor(nome, senha, profissao = undefined, saldo = 0, saldoDaEmpresa, cnpj, funcionarios = 0) {
    super(nome, senha, profissao, saldo);
    this.#_saldoDaEmpresa = saldoDaEmpresa; this.#_servicosFornecidos = []; this.#_cnpj = cnpj;
    this.#_num_funcionarios = funcionarios; this.#_caminhoArquivo = path.join(__dirname, "servicos.json");
    this.#_funcionarios = []; this.#_servicosAprovados = []; this.carregar();
  }
  get saldoDaEmpresa() { return this.#_saldoDaEmpresa; }
  get servicosFornecidos() { return this.#_servicosFornecidos; }
  get cnpj() { return this.#_cnpj; }
  get num_funcionarios() { return this.#_num_funcionarios; }
  get funcionarios() { return this.#_funcionarios; }
  get servicosAprovados() { return this.#_servicosAprovados; }

  // CORRIGIDO: carrega OBJETO, não só array
  carregar() {
    if (!fs.existsSync(this.#_caminhoArquivo)) { this.salvarServico(); return; }
    const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8");
    if (!conteudo.trim()) return;
    const dados = JSON.parse(conteudo);
    // Se o JSON antigo era só ["Entregador"], trata como array
    if (Array.isArray(dados)) { this.#_servicosFornecidos = dados; return; }
    this.#_servicosFornecidos = dados.servicosFornecidos || [];
    this.#_servicosAprovados = dados.servicosAprovados || [];
    this.#_funcionarios = dados.funcionarios || [];
    this.#_saldoDaEmpresa = dados.saldoDaEmpresa ?? this.#_saldoDaEmpresa;
    this.#_num_funcionarios = this.#_funcionarios.length;
  }
  // CORRIGIDO: salva OBJETO completo
  salvarServico() {
    const dados = {
      servicosFornecidos: this.#_servicosFornecidos,
      servicosAprovados: this.#_servicosAprovados,
      funcionarios: this.#_funcionarios,
      saldoDaEmpresa: this.#_saldoDaEmpresa
    };
    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
    console.log("Servicos salvos em servidor");
  }
  adicionarNovoServico(servico) {
    if (this.#_servicosFornecidos.includes(servico)) { console.log("Serviço já existe"); return; }
    this.#_servicosFornecidos.push(servico); console.log("Novo servico adicionado a empresa"); this.salvarServico();
  }
  adicionarVagas(qtd) { return qtd; }
  divulgarServicos(servico, vagas, remuneracao) {
    this.adicionarNovoServico(servico);
    console.log(`Divulgado: ${servico} - ${vagas} vagas - R$${remuneracao}`);
  }
  contratarEntregador(entregador) {
    const nome = typeof entregador === "string" ? entregador : entregador.nome;
    if (!this.#_servicosFornecidos.includes("Entregador")) return console.log("Não dá pra contratar, você nem divulga serviço de Entregador ainda");
    if (this.#_funcionarios.find(f => f.nome === nome)) return console.log(`${nome} já é funcionário`);
    this.#_funcionarios.push({ nome, cargo: "entregador" }); this.#_num_funcionarios += 1;
    console.log(`${nome} contratado como Entregador! Total: ${this.#_num_funcionarios}`); this.salvarServico();
  }
  contratarVendedor(vendedor) {
    const nome = typeof vendedor === "string" ? vendedor : vendedor.nome;
    if (!this.#_servicosFornecidos.includes("Vendedor")) return console.log("Não dá pra contratar, você nem divulga serviço de Vendedor ainda");
    if (this.#_funcionarios.find(f => f.nome === nome)) return console.log(`${nome} já é funcionário`);
    this.#_funcionarios.push({ nome, cargo: "vendedor" }); this.#_num_funcionarios += 1;
    console.log(`${nome} contratado como Vendedor! Total: ${this.#_num_funcionarios}`); this.salvarServico();
  }
  aprovarServico(servico) {
    if (!this.#_servicosFornecidos.includes(servico)) return console.log(`Serviço ${servico} nem existe pra aprovar`);
    if (this.#_servicosAprovados.includes(servico)) return console.log(`Serviço ${servico} já estava aprovado`);
    this.#_servicosAprovados.push(servico); console.log(`Serviço ${servico} aprovado! Agora pode ser contratado.`); this.salvarServico();
  }
  pagarPorServico(servico, valor, quemRecebe) {
    if (!this.#_servicosAprovados.includes(servico)) return console.log(`Não dá pra pagar, ${servico} ainda não foi aprovado`);
    if (this.#_saldoDaEmpresa < valor) return console.log(`Saldo da empresa insuficiente! Tem R$${this.#_saldoDaEmpresa}, precisa R$${valor}`);
    this.#_saldoDaEmpresa -= valor;
    if (quemRecebe) quemRecebe.saldo = quemRecebe.saldo + valor;
    console.log(`Pago R$${valor} por ${servico} para ${quemRecebe?.nome || "funcionário"}. Saldo da empresa: R$${this.#_saldoDaEmpresa}`);
    this.salvarServico();
  }
}

// ============ VENDEDOR ============
class Vendedor extends Usuario {
  #_VendasEmAndamento; #_saldoVendas; #_produtos; #_comercios; #_servicosDivulgados; #_entregadoresContratados; #_caminhoArquivo;
  constructor(nome, senha, profissao = "vendedor", saldo = 0, saldoVendas = 0) {
    super(nome, senha, profissao, saldo);
    this.#_VendasEmAndamento = []; this.#_saldoVendas = saldoVendas; this.#_produtos = [];
    this.#_comercios = []; this.#_servicosDivulgados = []; this.#_entregadoresContratados = [];
    this.#_caminhoArquivo = path.join(__dirname, "vendedor.json"); this.carregar();
  }
  get vendasEmAndamento() { return this.#_VendasEmAndamento; }
  get saldoVendas() { return this.#_saldoVendas; }
  set saldoVendas(valor) { this.#_saldoVendas = valor; }
  get produtos() { return this.#_produtos; }
  get comercios() { return this.#_comercios; }
  get servicosDivulgados() { return this.#_servicosDivulgados; }
  get entregadoresContratados() { return this.#_entregadoresContratados; }
  get totalProdutos() { return this.#_produtos.reduce((t, p) => t + p.estoque, 0); }
  get totalVendasPendentes() { return this.#_VendasEmAndamento.filter(v => v.status === "pendente").length; }

  // CORRIGIDO: agora tem carregar() igual o Empresario
  carregar() {
    if (!fs.existsSync(this.#_caminhoArquivo)) { this.salvar(); return; }
    const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8");
    if (!conteudo.trim()) return;
    const dados = JSON.parse(conteudo);
    this.#_produtos = dados.produtos || []; this.#_comercios = dados.comercios || [];
    this.#_servicosDivulgados = dados.servicos || []; this.#_entregadoresContratados = dados.entregadores || [];
    this.#_saldoVendas = dados.saldoVendas ?? this.#_saldoVendas;
    this.#_VendasEmAndamento = dados.vendas || [];
  }
  divulgarProduto(nomeProduto, preco, estoque = 1) {
    const jaExiste = this.#_produtos.find(p => p.nome === nomeProduto);
    if (jaExiste) { jaExiste.estoque += estoque; console.log(`${nomeProduto} já existia, estoque: ${jaExiste.estoque}`); this.salvar(); return; }
    this.#_produtos.push({ nome: nomeProduto, preco, estoque }); console.log(`Produto divulgado: ${nomeProduto} - R$${preco}`); this.salvar();
  }
  divulgarComercio(nomeComercio, endereco = "") {
    if (this.#_comercios.includes(nomeComercio)) return console.log(`Comércio ${nomeComercio} já divulgado`);
    this.#_comercios.push(nomeComercio); console.log(`Comércio divulgado: ${nomeComercio} - ${endereco}`); this.salvar();
  }
  divulgarServicos(servico) {
    if (this.#_servicosDivulgados.includes(servico)) return console.log(`Serviço ${servico} já divulgado`);
    this.#_servicosDivulgados.push(servico); console.log(`Serviço divulgado: ${servico}`); this.salvar();
  }
  contratarEntregador(entregador) {
    const nome = typeof entregador === "string" ? entregador : entregador.nome;
    if (!this.#_servicosDivulgados.includes("Entrega")) return console.log("Precisa divulgar 'Entrega' antes");
    if (this.#_entregadoresContratados.find(e => e.nome === nome)) return console.log(`${nome} já é seu entregador`);
    this.#_entregadoresContratados.push({ nome }); console.log(`${nome} contratado`); this.salvar();
  }
  pagarEntregador(nomeEntregador, valor, entregadorObjeto = null) {
    if (!this.#_entregadoresContratados.find(e => e.nome === nomeEntregador)) return console.log(`${nomeEntregador} não é seu entregador`);
    if (this.#_saldoVendas < valor) return console.log(`Saldo insuficiente! Tem R$${this.#_saldoVendas}`);
    this.#_saldoVendas -= valor; if (entregadorObjeto) entregadorObjeto.saldo = entregadorObjeto.saldo + valor;
    console.log(`Pago R$${valor} para ${nomeEntregador}. Saldo vendas: R$${this.#_saldoVendas}`); this.salvar();
  }
  pagarPorServico(servico, valor) {
    if (!this.#_servicosDivulgados.includes(servico)) return console.log(`Serviço ${servico} nem foi divulgado`);
    if (this.#_saldoVendas < valor) return console.log(`Saldo insuficiente para pagar ${servico}`);
    this.#_saldoVendas -= valor; console.log(`Pago R$${valor} por ${servico}. Saldo: R$${this.#_saldoVendas}`); this.salvar();
  }
  venderProduto(nomeProduto) {
    const produto = this.#_produtos.find(p => p.nome === nomeProduto);
    if (!produto) return console.log("Produto não encontrado");
    if (produto.estoque <= 0) return console.log("Sem estoque");
    produto.estoque -= 1; this.#_saldoVendas += produto.preco;
    this.#_VendasEmAndamento.push({ produto: nomeProduto, valor: produto.preco, status: "pendente" });
    console.log(`Vendido: ${nomeProduto} por R$${produto.preco}`); this.salvar();
  }
  salvar() {
    const dados = { produtos: this.#_produtos, comercios: this.#_comercios, servicos: this.#_servicosDivulgados, entregadores: this.#_entregadoresContratados, saldoVendas: this.#_saldoVendas, vendas: this.#_VendasEmAndamento };
    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
  }
}

console.log("===================================================================================");
console.log(" SEJA BEM-VINDO AO PROJETO FLACHS ");
console.log("=====================================================================================");
console.log("\n");

// Teste completo
const emp = new Empresario("Joao", "123", "empresario", 0, 10000, "123456");
emp.divulgarServicos("Entregador", 2, 1800);
emp.aprovarServico("Entregador");
const carlos = new Entregador("Carlos", "123", 0, "30min");
emp.contratarEntregador(carlos);
emp.pagarPorServico("Entregador", 25, carlos);
console.log("Empresario:", emp.servicosFornecidos, "Saldo empresa:", emp.saldoDaEmpresa, "Carlos:", carlos.saldo);

const vend = new Vendedor("Maria", "123", "vendedor", 0, 1000);
vend.divulgarProduto("Camiseta", 50, 10);
vend.divulgarComercio("Loja da Maria");
vend.divulgarServicos("Entrega");
vend.contratarEntregador(carlos);
console.log("Vendedor:", vend.produtos, vend.comercios);

rl.close();