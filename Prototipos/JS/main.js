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

  // usuario.json: só guarda o básico, cada filho guarda o resto no arquivo dele
  salvarUsuario() {
    const caminho = path.join(__dirname, "usuario.json");
    const dados = { nome: this.#_nome, profissao: this.#_profissao, saldo: this.#_saldo };
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
  }
}

// ============ CLIENTE ============
class Cliente extends Usuario {
  #_pedido; #_statusDaCompra; #_produto; #_caminhoArquivo;
  constructor(nome, senha, profissao, saldo, pedido, statusDaCompra = undefined, produto) {
    super(nome, senha, profissao, saldo);
    this.#_pedido = pedido; this.#_statusDaCompra = statusDaCompra; this.#_produto = produto;
    this.#_caminhoArquivo = path.join(__dirname, "cliente.json");
    this.carregar();
  }
  get pedido() { if (this.saldo >= 1) return this.#_pedido; }
  get statusDaCompra() { return this.#_statusDaCompra; }
  get produto() { return this.#_produto; }

  //Metodo de carregamento de arquivos
  carregar() {
    //Se os arquivos não existe, executa o codigo
    if (!fs.existsSync(this.#_caminhoArquivo)) { this.salvar(); return; } //chama metodo responsavel por salvar arquivo
    const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8"); //Lê arquivo previamente escrito na propriedade #_caminhoArquivo
    if (!conteudo.trim()) return;  //Se não existe o conteudo no arquivo, retorna
    const dados = JSON.parse(conteudo);  //Lê o arquivo do empresario.json como texto
    this.#_pedido = dados.pedidos?.[0] ?? this.#_pedido;
    this.#_produto = dados.produto ?? this.#_produto;
    this.#_statusDaCompra = dados.statusDaCompra ?? this.#_statusDaCompra;
  }


  salvar() {
    //Executa se pedido existir
    const dados = { pedidos: this.#_pedido ? [this.#_pedido] : [], produto: this.#_produto, statusDaCompra: this.#_statusDaCompra };
    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8"); //escreve o pedido no arquivo .json
  }
  efetuarCompra(valor, produto) {
    //Executa o codigo somente se tiver saldo suficiente
    if (this.saldo >= valor) {
      this.saldo = this.saldo - valor; //Subtrai do saldo o valor da compra
       this.#_produto = produto; //Propriedade #_produto recebe o parametro do objeto
       this.#_pedido = produto; //Propriedade #_pedido recebe o parametro produto
        this.#_statusDaCompra = "comprado"; //Altera o status da compra para "Cumprido"
      this.salvar(); //Salva as informacoes da compra
       return this.saldo; //Exibe o saldo atual
    } else console.log("Saldo insuficiente!");
  }
  receberCompra() {
    //Executa o codigo, se o status for "recebido"
    if (this.statusDaCompra) console.log("A compra foi recebida com sucesso!");
    //Executa o codigo quando a compra não for recebida ainda
    else console.log("Nenhuma compra recebida ainda!");
  }
  devolverCompra(valor, produto) { 
    this.saldo = this.saldo + valor; //Soma ao saldo o vslor do produto
    this.#_statusDaCompra = "devolvido"; //Muda o status da compra para devolvido
     this.salvar(); //salva a informação
    console.log("Devolução concedida com sucesso!"); 

  }
}

// ============ ENTREGADOR ============
class Entregador extends Usuario {
  //Propriedades da classe Entregador
  #_prazoEntrega; #_servicosEmAndamento; #_enderecoPedido; #_caminhoArquivo;
  //construtor da classe Entregador
  constructor(nome, senha, saldo = 0, prazoEntrega, enderecoPedido = {}) {
    super(nome, senha, 'entregador', saldo); //Indicador de que a classe herdade Usuario, o extends por si so diz, mas a função super() indica que essa e as outras são subclasses 
    this.#_prazoEntrega = prazoEntrega; 
     this.#_servicosEmAndamento = []; //Prpriedade recebe uma lista de nomes de servicos em andamento
      this.#_enderecoPedido = enderecoPedido;
    this.#_caminhoArquivo = path.join(__dirname, "entregador.json"); //Recebe o arquivo do arquivo entregador.json
    this.carregar();
  }
  //getters

  get prazoEntrega() { return this.#_prazoEntrega; }
  get servicosEmAndamento() { return this.#_servicosEmAndamento; }
  get enderecoPedido() { return this.#_enderecoPedido; }

//metodo para carregar arquivo
  carregar() {
    if (!fs.existsSync(this.#_caminhoArquivo)) { this.salvar(); return; }
    const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8");
    if (!conteudo.trim()) return;
    const dados = JSON.parse(conteudo);
    this.#_servicosEmAndamento = dados.servicosEmAndamento || [];
  }


//metodo para salvar arquivo
  salvar() {
    const dados = { servicosEmAndamento: this.#_servicosEmAndamento };
    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
  }


  escolherServicos(idServico, pedido, endereco, valor, statusDoServico = "pendente") {
    const servico = { id: idServico, pedido, endereco, valor, status: statusDoServico }; //Objeto serviço e suas propriedades
    this.#_servicosEmAndamento.push(servico); //Adiciona novo servico a propriedade
    console.log(`Serviço ${idServico} - ${pedido} escolhido. Aguardando aceitar.`); 
    this.salvar(); //salva as alterações
     return servico; //Retorna o serviço
  }



  aceitarServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico); //Encontra o a propriedade do serviço
    if (!servico) return console.log("Serviço não encontrado"); //Codigo executado, se os servicos não forem encontrados
    //Executa codigo se status for pendente
    if (servico.status !== "pendente") return console.log(`O servico não pode ser aceito no momento, status do serviço: ${servico.status}`);
    //Aceita o serviço
    servico.status = "aceito"; console.log(`Serviço ${idServico} aceito! Pode buscar o pedido.`);
     this.salvar(); //Salva as alterações
  }



  fazerServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico); //Encontra o id do servico e compara com o id do parametro
    if (!servico) return console.log("Serviço não encontrado"); //Executa codigo quando não há serviços
    if (servico.status !== "aceito") return console.log(`Precisa aceitar antes. Status: ${servico.status}`); //Executa serviço quando o status não for aceito
    servico.status = "em andamento"; console.log(`Entregando ${servico.pedido} para ${servico.endereco}...`); //Altera o status do serviço para "Em andamento" e executa a entrega
     this.salvar(); //Salva as alterações
  }



  finalizarServico(idServico) {
    const servico = this.#_servicosEmAndamento.find(s => s.id === idServico); //FEncontra a propriedade id e compara com o parametro
    if (!servico) return console.log("Serviço não encontrado"); //Executa codigo quando não houver serviço
    if (servico.status !== "em andamento") return console.log(`Precisa estar fazendo. Status: ${servico.status}`); //Executa codigo quando serviçoestá em andamento
    servico.status = "finalizado"; console.log(`Serviço ${idServico} finalizado!`); //muda o status do serviço para "Finalizado"
     this.salvar(); //Salva as alterações 
     this.receberPorServico(servico.valor); //chama o metodo que irá alteraro valod do saldo.
  }


  receberPorServico(valor) {
     this.saldo = this.saldo + valor; //Soma o valor do serviço ao saldo
     console.log(`Você recebeu R$${valor}. Saldo atual: R$${this.saldo}`);
      this.salvar(); //Salva as alterações

}
  recusarServico(idServico) {
    const indice = this.#_servicosEmAndamento.findIndex(s => s.id === idServico); //encontra o indice do id e compara com o parametro
    if (indice === -1) return console.log("Serviço não encontrado"); //Se não existe serviço na lista, executa o codigo
    const servico = this.#_servicosEmAndamento[indice]; //A variavel servico recebe esse indice
    if (servico.status !== "pendente") return console.log(`Não dá pra recusar, já está ${servico.status}`); //executa codigo quando status for pendente
    this.#_servicosEmAndamento.splice(indice, 1); console.log(`Serviço ${idServico} recusado.`); //Recusa/ deleta um serviço da lista
    this.salvar();
  }




}

// ============ EMPRESARIO ============
class Empresario extends Usuario {
  #_saldoDaEmpresa; #_servicosFornecidos; #_cnpj; #_num_funcionarios; #_caminhoArquivo; #_funcionarios; #_servicosAprovados; //propriedades da classe
  //Construtor da classe
  constructor(nome, senha, profissao = undefined, saldo = 0, saldoDaEmpresa, cnpj, funcionarios = 0) {
    super(nome, senha, profissao, saldo);
    this.#_saldoDaEmpresa = saldoDaEmpresa;
     this.#_servicosFornecidos = []; //A propriedade recebe uma lista de serviços fornecidos
    this.#_cnpj = cnpj;
    this.#_num_funcionarios = funcionarios;
    // MUDANÇA: era servicos.json, agora empresario.json
    this.#_caminhoArquivo = path.join(__dirname, "empresario.json");
    this.#_funcionarios = []; //A propriedade recebe uma lista de funcionarios
    this.#_servicosAprovados = []; //A propriedade recebe uma lista de serviços aprovados para serem divulgados
    this.carregar();
  }
  //getters
  get saldoDaEmpresa() { return this.#_saldoDaEmpresa; }
  get servicosFornecidos() { return this.#_servicosFornecidos; }
  get cnpj() { return this.#_cnpj; }
  get num_funcionarios() { return this.#_num_funcionarios; }
  get funcionarios() { return this.#_funcionarios; }
  get servicosAprovados() { return this.#_servicosAprovados; }

  carregar() {
    if (!fs.existsSync(this.#_caminhoArquivo)) { this.salvarServico(); return; }
    const conteudo = fs.readFileSync(this.#_caminhoArquivo, "utf-8");
    if (!conteudo.trim()) return;
    const dados = JSON.parse(conteudo);
    if (Array.isArray(dados)) { this.#_servicosFornecidos = dados; return; }
    this.#_servicosFornecidos = dados.servicosFornecidos || [];
    this.#_servicosAprovados = dados.servicosAprovados || [];
    this.#_funcionarios = dados.funcionarios || [];
    this.#_saldoDaEmpresa = dados.saldoDaEmpresa ?? this.#_saldoDaEmpresa;
    this.#_num_funcionarios = this.#_funcionarios.length;
  }


  salvarServico() {
    const dados = { servicosFornecidos: this.#_servicosFornecidos, servicosAprovados: this.#_servicosAprovados, funcionarios: this.#_funcionarios, saldoDaEmpresa: this.#_saldoDaEmpresa };
    fs.writeFileSync(this.#_caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
    console.log("Servicos salvos em empresario.json");
  }




  adicionarNovoServico(servico) {
    if (this.#_servicosFornecidos.includes(servico)) { console.log("Serviço já existe"); return; } //executa codigo quando o servico já existe no array
    this.#_servicosFornecidos.push(servico); console.log("Novo servico adicionado a empresa"); //Adiciona novo serviço à lista
    this.salvarServico(); //Salva o serviço
  }

  adicionarVagas(qtd) { return qtd; } //Deifine/exibe uma quantidade de vagas


  divulgarServicos(servico, vagas, remuneracao) {
    this.adicionarNovoServico(servico); 
    console.log(`Divulgado: ${servico} - ${vagas} vagas - R$${remuneracao}`);
  }

  contratarEntregador(entregador) {
    const nome = typeof entregador === "string" ? entregador : entregador.nome; //A constante nome compara se o dado do parâmetro é uma string. Se for, recebe o nome do entregador, se não for, recebe um objeto com o nome
    if (!this.#_servicosFornecidos.includes("entregador")) return console.log("Não dá pra contratar, você nem divulga serviço de Entregador ainda"); //Executa código quando não há divulgação de serviço cabivel ao entregador
    if (this.#_funcionarios.find(f => f.nome === nome)) return console.log(`${nome} já é funcionário`); //Executa codigo quando o funcionário já existe
    this.#_funcionarios.push({ nome, cargo: "entregador" }); this.#_num_funcionarios += 1; //Adiciona o funcionário à lista
    console.log(`${nome} contratado como Entregador! Total: ${this.#_num_funcionarios}`); 
    this.salvarServico();
  }


  contratarVendedor(vendedor) {
    const nome = typeof vendedor === "string" ? vendedor : vendedor.nome; //Compara se o nome do parametro é uma string
    if (!this.#_servicosFornecidos.includes("Vendedor")) return console.log("Não dá pra contratar, você nem divulga serviço de Vendedor ainda"); //Executa codigo quando não é divulgado uma vaga cabivel ao vendedor
    if (this.#_funcionarios.find(f => f.nome === nome)) return console.log(`${nome} já é funcionário`);
    this.#_funcionarios.push({ nome, cargo: "vendedor" }); this.#_num_funcionarios += 1; //Adiciona novo funcionário à lista
    console.log(`${nome} contratado como Vendedor! Total: ${this.#_num_funcionarios}`); 
    this.salvarServico(); //Salva as informações
  }

  aprovarServico(servico) {
    if (!this.#_servicosFornecidos.includes(servico)) return console.log(`Serviço ${servico} nem existe pra aprovar`); //Executa codigo quando não existe um serviço
    if (this.#_servicosAprovados.includes(servico)) return console.log(`Serviço ${servico} já estava aprovado`); //Executa código quando já existe um serviço aprovado
    this.#_servicosAprovados.push(servico); console.log(`Serviço ${servico} aprovado!`); //Adiciona serviço a lista de serviços aprovado 
    this.salvarServico(); //Salva alterações
  }

  pagarPorServico(servico, valor, quemRecebe) {
    if (!this.#_servicosAprovados.includes(servico)) return console.log(`Não dá pra pagar, ${servico} ainda não foi aprovado`); //Executa codigo quando o serviço não é aprovado
    if (this.#_saldoDaEmpresa < valor) return console.log(`Saldo insuficiente! Tem R$${this.#_saldoDaEmpresa}`); //Executa código quando o saldo não for o suficiente para efetuar pagamentod
    this.#_saldoDaEmpresa -= valor; //Deduz o valor a ser pago do saldo
    if (quemRecebe) quemRecebe.saldo = quemRecebe.saldo + valor; //Adiciona o valor do serviço ao saldo de quem recebe
    console.log(`Pago R$${valor} por ${servico} para ${quemRecebe?.nome || "funcionário"}. Saldo empresa: R$${this.#_saldoDaEmpresa}`);
    this.salvarServico(); //salva alterações
  }

}

// ============ VENDEDOR ============
class Vendedor extends Usuario {
  #_VendasEmAndamento; #_saldoVendas; #_produtos; #_comercios; #_servicosDivulgados; #_entregadoresContratados; #_caminhoArquivo; //propriedades do objeto
  //Construtor do objeto
  constructor(nome, senha, profissao = "vendedor", saldo = 0, saldoVendas = 0) {
    super(nome, senha, profissao, saldo);
    this.#_VendasEmAndamento = []; //Propriedade recebe uma lista de vendas em andamento
     this.#_saldoVendas = saldoVendas; 
     this.#_produtos = []; //Propriedade recebe uma lista de produtos
    this.#_comercios = []; //Propriedade recebe uma lista de comércios
     this.#_servicosDivulgados = []; //Propriedade recebe uma lista de servicos divulgados
      this.#_entregadoresContratados = []; //Propriedade recebe uma lista de entregadores contratados
    this.#_caminhoArquivo = path.join(__dirname, "vendedor.json"); //Recebe o caminho do arquivo .json respectivo à classe
     this.carregar();
  } //getters e setters
  get vendasEmAndamento() { return this.#_VendasEmAndamento; }
  get saldoVendas() { return this.#_saldoVendas; }
  set saldoVendas(valor) { this.#_saldoVendas = valor; }
  get produtos() { return this.#_produtos; }
  get comercios() { return this.#_comercios; }
  get servicosDivulgados() { return this.#_servicosDivulgados; }
  get entregadoresContratados() { return this.#_entregadoresContratados; }
  get totalProdutos() { return this.#_produtos.reduce((t, p) => t + p.estoque, 0); }
  get totalVendasPendentes() { return this.#_VendasEmAndamento.filter(v => v.status === "pendente").length; }

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
    const jaExiste = this.#_produtos.find(p => p.nome === nomeProduto); //Procura o nome de um produto e compara com o parametro do nome do produto
    if (jaExiste) { jaExiste.estoque += estoque; console.log(`${nomeProduto} já existia, estoque: ${jaExiste.estoque}`); this.salvar(); return; } //Executa quando a comparação anterior é verdadeira, o que faz com que o produto já exista
    this.#_produtos.push({ nome: nomeProduto, preco, estoque }); console.log(`Produto divulgado: ${nomeProduto} - R$${preco}`); this.salvar(); //Adiciona novo produto à divulgação
  }

  divulgarComercio(nomeComercio, endereco = "") {
    if (this.#_comercios.includes(nomeComercio)) return console.log(`Comércio ${nomeComercio} já divulgado`); //Executa codigo quando a informação do parâmetro já existe na divulgação
    this.#_comercios.push(nomeComercio); console.log(`Comércio divulgado: ${nomeComercio} - ${endereco}`); this.salvar(); //Adiciona o comércio para a divulgação
  }

  divulgarServicos(servico) {
    if (this.#_servicosDivulgados.includes(servico)) return console.log(`Serviço ${servico} já divulgado`); //Executa codigo se a informação do parametro já existe
    this.#_servicosDivulgados.push(servico); console.log(`Serviço divulgado: ${servico}`); this.salvar(); //Adiciona serviço para ser divulgado
  }


  contratarEntregador(entregador) {
    const nome = typeof entregador === "string" ? entregador : entregador.nome; //Verifica se o parametro é uma string, caso seja, usa o nome diretamente, caso não seja, usa um objeto com propriedade nome
    if (!this.#_servicosDivulgados.includes("entrega")) return console.log("Precisa divulgar 'Entrega' antes"); //executa codigo quando não há divulgação de serviço
    if (this.#_entregadoresContratados.find(e => e.nome === nome)) return console.log(`${nome} já é seu entregador`); //Procura uma propriedade e compara com o parametro, se for igual, já existe 
    this.#_entregadoresContratados.push({ nome }); console.log(`${nome} contratado`); this.salvar(); //Adiciona um novo entregador à lista
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
    const produto = this.#_produtos.find(p => p.nome === nomeProduto); //Procura um produto do parametro no objeto
    if (!produto) return console.log("Produto não encontrado"); //Executa codigo se o produto não for encontrado
    if (produto.estoque <= 0) return console.log("Sem estoque"); //Executa codigo quando não há estoque
    produto.estoque -= 1; this.#_saldoVendas += produto.preco; //Se existe estoque, então, um produto do estoque será subtraido em virtude  de sua venda
    this.#_VendasEmAndamento.push({ produto: nomeProduto, valor: produto.preco, status: "pendente" }); // Adiciona o produto à propriedade de produtos em andamento e define status da venda como pendente
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