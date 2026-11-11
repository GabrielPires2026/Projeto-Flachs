import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Em ESM não existe __dirname, tem que criar assim:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({ input, output });

// ============ USUARIO ============
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
    if (this.#_saldo >= 1) return this.#_saldo;
    return 0;
  }

  set saldo(novoSaldo) { this.#_saldo = novoSaldo; }
}

// ============ CLIENTE ============
class Cliente extends Usuario {
  #_pedido;
  #_statusDaCompra;
  #_produto;

  constructor(nome, senha, profissao, saldo, pedido, statusDaCompra = undefined, produto) {
    super(nome, senha, profissao, saldo);
    this.#_pedido = pedido;
    this.#_statusDaCompra = statusDaCompra;
    this.#_produto = produto;
  }

  get pedido() {
    if (this.saldo >= 1) return this.#_pedido;
  }
  get statusDaCompra() { return this.#_statusDaCompra; }

  efetuarCompra(valor, produto) {
    if (this.saldo >= valor) {
      this.saldo = this.saldo - valor;
      this.#_produto = produto;
      return this.saldo;
    } else {
      console.log("Saldo insuficiente!");
    }
  }

  receberCompra() {
    if (this.statusDaCompra) console.log("A compra foi recebida com sucesso!");
    else console.log("Nenhuma compra recebida ainda!");
  }

  devolverCompra(valor, produto) {
    this.saldo = this.saldo + valor;
    console.log("Devolução concedida com sucesso!");
  }
}

// ============ ENTREGADOR ============
class Entregador extends Usuario { // corrigido: Usuario com U maiúsculo
  #_prazoEntrega;
  #_servicosEmAndamento;
  #_enderecoPedido;

  constructor(nome, senha, saldo = 0, prazoEntrega, enderecoPedido = {}) {
    super(nome, senha, 'entregador', saldo);
    this.#_prazoEntrega = prazoEntrega;
    this.#_servicosEmAndamento = [];
    // agora vem por parâmetro, não variável solta
    this.#_enderecoPedido = enderecoPedido;
  }

  get prazoEntrega() { return this.#_prazoEntrega; }
  get servicosEmAndamento() { return this.#_servicosEmAndamento; }
  get enderecoPedido() { return this.#_enderecoPedido; }
  get servicosEmAndamento(){ return this.#_servicosEmAndamento}

  // 1. ESCOLHER: ele vê um serviço disponível e coloca na lista dele como "pendente"
  escolherServicos(idServico, pedido, endereco, valor, statusDoServico = "pendente") {
    const servico = {
      id: idServico,
      pedido: pedido,
      endereco: endereco,
      valor: valor,
      status: statusDoServico
    };
    this.#_servicosEmAndamento.push(servico);
    console.log(`Serviço ${idServico} - ${pedido} escolhido. Aguardando aceitar.`);
    return servico;
  }

  // 2. ACEITAR: muda de "pendente" para "aceito"
  aceitarServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico);
    if (!servico) {
      console.log("Serviço não encontrado");
      return;
    }
    if (servico.status !== "pendente") {
      console.log(`Não dá pra aceitar, status atual: ${servico.status}`);
      return;
    }
    servico.status = "aceito";
    console.log(`Serviço ${idServico} aceito! Pode buscar o pedido.`);
  }

  // 3. FAZER: muda de "aceito" para "em andamento"
  fazerServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico);
    if (!servico) return console.log("Serviço não encontrado");
    if (servico.status !== "aceito") return console.log(`Precisa aceitar antes. Status: ${servico.status}`);

    servico.status = "em andamento";
    console.log(`Entregando ${servico.pedido} para ${servico.endereco}...`);
  }

  // 4. FINALIZAR: muda de "em andamento" para "finalizado" e já chama o pagamento
  finalizarServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico);
    if (!servico) return console.log("Serviço não encontrado");
    if (servico.status !== "em andamento") return console.log(`Precisa estar fazendo. Status: ${servico.status}`);

    servico.status = "finalizado";
    console.log(`Serviço ${idServico} finalizado!`);
    this.receberPorServico(servico.valor);
  }

  // 5. RECEBER: soma o valor no saldo do entregador
  receberPorServico(valor) {
    this.saldo = this.saldo + valor;
    console.log(`Você recebeu R$${valor}. Saldo atual: R$${this.saldo}`);
  }

  // DESVIO: RECUSAR: tira da lista se ainda estiver pendente
  recusarServico(idServico) {
    const indice = this.#_servicosEmAndamento.findIndex(s => s.id === idServico);
    if (indice === -1) return console.log("Serviço não encontrado");

    const servico = this.#_servicosEmAndamento[indice];
    if (servico.status !== "pendente") {
      console.log(`Não dá pra recusar, já está ${servico.status}`);
      return;
    }

    this.#_servicosEmAndamento.splice(indice, 1);
    console.log(`Serviço ${idServico} recusado e removido da sua lista.`);
  }
}

// ============ EMPRESARIO ============
class Empresario extends Usuario {
  #_saldoDaEmpresa;
  #_servicosFornecidos;
  #_cnpj;
  #_num_funcionarios;
  #_caminhoArquivo;
  #_funcionarios;
  #_servicosAprovados

  constructor(nome, senha, profissao = undefined, saldo = 0, saldoDaEmpresa, cnpj, funcionarios = 0) {
    super(nome, senha, profissao, saldo);
    this.#_saldoDaEmpresa = saldoDaEmpresa;
    this.#_servicosFornecidos = []; // só nomes, começa vazio
    this.#_cnpj = cnpj;
    this.#_num_funcionarios = funcionarios;
    // corrigido: sem utf-8 no join
    this.#_caminhoArquivo = path.join(__dirname, "servicos.json");
    this.#_funcionarios = [];
    this.#_servicosAprovados = [];
    this.carregar();
  }

  get saldoDaEmpresa() { return this.#_saldoDaEmpresa; }
  get servicosFornecidos() { return this.#_servicosFornecidos; }
  get cnpj() { return this.#_cnpj; }
  get num_funcionarios() { return this.#_num_funcionarios; }

  carregar() {
    if (fs.existsSync(this.#_caminhoArquivo)) {
      // corrigido: JSON.parse + readFileSync, não fs.JSON.parse
      const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8");
      this.#_servicosFornecidos = JSON.parse(conteudo);
    }
  }

  salvarServico() {
    const novoServico = JSON.stringify(this.#_servicosFornecidos, null, 2);
    fs.writeFileSync(this.#_caminhoArquivo, novoServico, "utf-8");
    console.log("Servicos salvos em servidor");
  }

  adicionarNovoServico(servico) {
    this.#_servicosFornecidos.push(servico);
    console.log("Novo servico adicionado a empresa");
    this.salvarServico();
  }

  adicionarVagas(qtd) { return qtd; }

  divulgarServicos(servico, vagas, remuneracao) {
    // agora faz sentido: só adiciona o nome no array
    this.adicionarNovoServico(servico);
    console.log(`Divulgado: ${servico} - ${vagas} vagas - R$${remuneracao}`);
  }

  // 1. CONTRATAR ENTREGADOR: só contrata se o serviço existir e ele ainda não for funcionário
  contratarEntregador(entregador) {
    // entregador aqui pode ser string "Carlos" ou objeto Entregador
    const nome = typeof entregador === "string" ? entregador : entregador.nome;

    if (!this.#_servicosFornecidos.includes("Entregador")) {
      console.log("Não dá pra contratar, você nem divulga serviço de Entregador ainda");
      return;
    }

    const jaContratado = this.#_funcionarios.find(f => f.nome === nome);
    if (jaContratado) {
      console.log(`${nome} já é funcionário`);
      return;
    }

    this.#_funcionarios.push({ nome: nome, cargo: "entregador" });
    this.#_num_funcionarios += 1;
    console.log(`${nome} contratado como Entregador! Total: ${this.#_num_funcionarios}`);
    this.salvarServico();
  }






  // 2. CONTRATAR VENDEDOR: igual, só muda o cargo
  contratarVendedor(vendedor) {
    const nome = typeof vendedor === "string" ? vendedor : vendedor.nome;

    if (!this.#_servicosFornecidos.includes("Vendedor")) {
      console.log("Não dá pra contratar, você nem divulga serviço de Vendedor ainda");
      return;
    }

    const jaContratado = this.#_funcionarios.find(f => f.nome === nome);
    if (jaContratado) {
      console.log(`${nome} já é funcionário`);
      return;
    }

    this.#_funcionarios.push({ nome: nome, cargo: "vendedor" });
    this.#_num_funcionarios += 1;
    console.log(`${nome} contratado como Vendedor! Total: ${this.#_num_funcionarios}`);
    this.salvarServico();
  }

  // 3. APROVAR: tira o serviço da lista de "só divulgado" e coloca na de "aprovado, pode trabalhar"
  aprovarServico(servico) {
    if (!this.#_servicosFornecidos.includes(servico)) {
      console.log(`Serviço ${servico} nem existe pra aprovar`);
      return;
    }

    if (this.#_servicosAprovados.includes(servico)) {
      console.log(`Serviço ${servico} já estava aprovado`);
      return;
    }

    this.#_servicosAprovados.push(servico);
    console.log(`Serviço ${servico} aprovado! Agora pode ser contratado.`);
  }

  // 4. PAGAR: tira do saldo da empresa e joga no saldo de quem fez
  pagarPorServico(servico, valor, quemRecebe) {
    // quemRecebe pode ser o objeto Entregador/Vendedor, pra cair no saldo dele
    if (!this.#_servicosAprovados.includes(servico)) {
      console.log(`Não dá pra pagar, ${servico} ainda não foi aprovado`);
      return;
    }

    if (this.#_saldoDaEmpresa < valor) {
      console.log(`Saldo da empresa insuficiente! Tem R$${this.#_saldoDaEmpresa}, precisa R$${valor}`);
      return;
    }

    this.#_saldoDaEmpresa -= valor;

    if (quemRecebe && typeof quemRecebe.saldo !== "undefined") {
      quemRecebe.saldo = quemRecebe.saldo + valor;
      console.log(`Pago R$${valor} por ${servico} para ${quemRecebe.nome}. Saldo da empresa: R$${this.#_saldoDaEmpresa}`);
    } else {
      console.log(`Pago R$${valor} por ${servico}. Saldo da empresa: R$${this.#_saldoDaEmpresa}`);
    }
  }
}

// ============ VENDEDOR ============
class Vendedor extends Usuario {
  #_VendasEmAndamento;
  #_saldoVendas;
  #_produtos;
  #_comercios; // novo: onde ele vende
  #_servicosDivulgados; // novo: serviços que ele oferece
  #_entregadoresContratados; // novo: quem ele contratou
  #_caminhoArquivo;

  constructor(nome, senha, profissao = "vendedor", saldo = 0, saldoVendas = 0) {
    super(nome, senha, profissao, saldo);
    this.#_VendasEmAndamento = []; // [{ id, produto, valor, status }]
    this.#_saldoVendas = saldoVendas;
    this.#_produtos = []; // [{ nome, preco, estoque }]
    this.#_comercios = []; // ["Loja do João"]
    this.#_servicosDivulgados = []; // ["Entrega"]
    this.#_entregadoresContratados = []; // [{ nome }]
    this.#_caminhoArquivo = path.join(__dirname, "vendedor.json");
  }

  // ============ GETTERS / SETTERS ============
  get vendasEmAndamento() { return this.#_VendasEmAndamento; }
  get saldoVendas() { return this.#_saldoVendas; }
  set saldoVendas(valor) { this.#_saldoVendas = valor; }

  get produtos() { return this.#_produtos; }
  get comercios() { return this.#_comercios; }
  get servicosDivulgados() { return this.#_servicosDivulgados; }
  get entregadoresContratados() { return this.#_entregadoresContratados; }

  // Derivado: total de produtos em estoque
  get totalProdutos() {
    return this.#_produtos.reduce((total, p) => total + p.estoque, 0);
  }

  // Derivado: total de vendas pendentes
  get totalVendasPendentes() {
    return this.#_VendasEmAndamento.filter(v => v.status === "pendente").length;
  }

  // ============ REQUISITO 1: DIVULGAR PRODUTO ============
  divulgarProduto(nomeProduto, preco, estoque = 1) {
    const jaExiste = this.#_produtos.find(p => p.nome === nomeProduto);
    if (jaExiste) {
      jaExiste.estoque += estoque;
      console.log(`${nomeProduto} já existia, estoque atualizado para ${jaExiste.estoque}`);
      return;
    }
    this.#_produtos.push({ nome: nomeProduto, preco: preco, estoque: estoque });
    console.log(`Produto divulgado: ${nomeProduto} - R$${preco} - estoque: ${estoque}`);
    this.salvar();
  }

  
  divulgarComercio(nomeComercio, endereco = "") {
    if (this.#_comercios.includes(nomeComercio)) {
      console.log(`Comércio ${nomeComercio} já divulgado`);
      return;
    }
    this.#_comercios.push(nomeComercio);
    console.log(`Comércio divulgado: ${nomeComercio} - ${endereco}`);
    this.salvar();
  }

  
  divulgarServicos(servico) {
    if (this.#_servicosDivulgados.includes(servico)) {
      console.log(`Serviço ${servico} já divulgado`);
      return;
    }
    this.#_servicosDivulgados.push(servico);
    console.log(`Serviço divulgado pelo vendedor: ${servico}`);
    this.salvar();
  }

  
  contratarEntregador(entregador) {
    const nome = typeof entregador === "string" ? entregador : entregador.nome;

    if (!this.#_servicosDivulgados.includes("Entrega")) {
      console.log("Precisa divulgar o serviço 'Entrega' antes de contratar");
      return;
    }

    const jaContratado = this.#_entregadoresContratados.find(e => e.nome === nome);
    if (jaContratado) {
      console.log(`${nome} já é seu entregador`);
      return;
    }

    this.#_entregadoresContratados.push({ nome: nome });
    console.log(`${nome} contratado como entregador do vendedor ${this.nome}`);
    this.salvar();
  }


  pagarEntregador(nomeEntregador, valor, entregadorObjeto = null) {
    const contratado = this.#_entregadoresContratados.find(e => e.nome === nomeEntregador);
    if (!contratado) {
      console.log(`${nomeEntregador} não é seu entregador, não dá pra pagar`);
      return;
    }

    if (this.#_saldoVendas < valor) {
      console.log(`Saldo de vendas insuficiente! Tem R$${this.#_saldoVendas}, precisa R$${valor}`);
      return;
    }

    this.#_saldoVendas -= valor;
    if (entregadorObjeto) {
      entregadorObjeto.saldo = entregadorObjeto.saldo + valor;
    }
    console.log(`Pago R$${valor} para entregador ${nomeEntregador}. Saldo vendas: R$${this.#_saldoVendas}`);
  }

  // ============ REQUISITO 6: PAGAR PELOS SERVIÇOS ============
  pagarPorServico(servico, valor) {
    if (!this.#_servicosDivulgados.includes(servico)) {
      console.log(`Serviço ${servico} nem foi divulgado, não dá pra pagar`);
      return;
    }
    if (this.#_saldoVendas < valor) {
      console.log(`Saldo de vendas insuficiente para pagar ${servico}`);
      return;
    }
    this.#_saldoVendas -= valor;
    console.log(`Pago R$${valor} pelo serviço ${servico}. Saldo vendas: R$${this.#_saldoVendas}`);
  }

  // Extra pra fechar o ciclo: vender um produto que ele divulgou
  venderProduto(nomeProduto) {
    const produto = this.#_produtos.find(p => p.nome === nomeProduto);
    if (!produto) return console.log("Produto não encontrado");
    if (produto.estoque <= 0) return console.log("Sem estoque");

    produto.estoque -= 1;
    this.#_saldoVendas += produto.preco;
    this.#_VendasEmAndamento.push({ produto: nomeProduto, valor: produto.preco, status: "pendente" });
    console.log(`Vendido: ${nomeProduto} por R$${produto.preco}`);
  }

  salvar() {
    const dados = {
      produtos: this.#_produtos,
      comercios: this.#_comercios,
      servicos: this.#_servicosDivulgados,
      entregadores: this.#_entregadoresContratados,
      saldoVendas: this.#_saldoVendas
    };
    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
  }
}

console.log("===================================================================================");
console.log(" SEJA BEM-VINDO AO PROJETO FLACHS ");
console.log("=====================================================================================");
console.log("\n");

// Teste rápido:
const emp = new Empresario("Joao", "123", "empresario", 0, 10000, "123456");
emp.divulgarServicos("Entregador", 2, 1800);
console.log(emp.servicosFornecidos);

rl.close();