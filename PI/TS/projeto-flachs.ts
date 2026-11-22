import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const rl = readline.createInterface({ input, output });

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'flachs-db.json');

// ================= INTERFACES =================

interface Usuario {
  nome: string;
  idade: number;
  cpf: string;
  perfil: string;
  email: string;
  senha: string;
  saldoInicial: number;
}

interface Banco {
  nome: string;
  formaPagamento: string;
  chave: string;
}

interface Endereco {
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: number;
  sn: boolean;
  complemento: string;
}

interface Produto {
  nomeProduto: string;
  precoProduto: number;
  statusProduto: string;
}

interface Pedido {
  nomePedido: string;
  descricaoPedido: string;
  precoPedido: number;
  statusPedido: string;
}

interface Entregador {
  nomeEntregador: string;
  cpfEntregador: string;
}

interface ServicoEntrega {
  tituloServico: string;
  descricaoServico: string;
  autorServico: string;
}

interface EntregaRealizada {
  nomePedido: string;
  nomeEntregador: string;
  statusEntrega: string;
}

interface BancoDeDadosJSON {
  emailCadastrado: string;
  senhaCadastrada: string;
  nomeCadastrado: string;
  perfilCadastrado: string;
  usuarioLogado: Usuario | null;
  listaUsuarios: Usuario[];
  enderecoCadastrado: Endereco[];
  bancoCadastrado: Banco[];
  listaProdutos: Produto[];
  listaPedidos: Pedido[];
  listaEntregadores: Entregador[];
  listaServicosEntrega: ServicoEntrega[];
  listaEntregas: EntregaRealizada[];
}

// ================= ESTADO GLOBAL =================

let emailCadastrado = '';
let senhaCadastrada = '';
let nomeCadastrado = '';
let perfilCadastrado = '';
let usuarioLogado: Usuario | null = null;

const listaUsuarios: Usuario[] = [];
const enderecoCadastrado: Endereco[] = [];
const bancoCadastrado: Banco[] = [];
const listaProdutos: Produto[] = [];
const listaPedidos: Pedido[] = [];
const listaEntregadores: Entregador[] = [];
const listaServicosEntrega: ServicoEntrega[] = [];
const listaEntregas: EntregaRealizada[] = [];

// ================= PERSISTÊNCIA JSON (fs + path) =================

function criarEstadoAtual(): BancoDeDadosJSON {
  return {
    emailCadastrado,
    senhaCadastrada,
    nomeCadastrado,
    perfilCadastrado,
    usuarioLogado,
    listaUsuarios,
    enderecoCadastrado,
    bancoCadastrado,
    listaProdutos,
    listaPedidos,
    listaEntregadores,
    listaServicosEntrega,
    listaEntregas,
  };
}

async function salvarDados(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const payload = JSON.stringify(criarEstadoAtual(), null, 2);
  await fs.writeFile(DB_FILE, payload, 'utf-8');
}

async function carregarDados(): Promise<void> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    const dados = JSON.parse(raw) as Partial<BancoDeDadosJSON>;

    emailCadastrado = dados.emailCadastrado ?? '';
    senhaCadastrada = dados.senhaCadastrada ?? '';
    nomeCadastrado = dados.nomeCadastrado ?? '';
    perfilCadastrado = dados.perfilCadastrado ?? '';
    usuarioLogado = dados.usuarioLogado ?? null;

    listaUsuarios.splice(0, listaUsuarios.length, ...(dados.listaUsuarios ?? []));
    enderecoCadastrado.splice(0, enderecoCadastrado.length, ...(dados.enderecoCadastrado ?? []));
    bancoCadastrado.splice(0, bancoCadastrado.length, ...(dados.bancoCadastrado ?? []));
    listaProdutos.splice(0, listaProdutos.length, ...(dados.listaProdutos ?? []));
    listaPedidos.splice(0, listaPedidos.length, ...(dados.listaPedidos ?? []));
    listaEntregadores.splice(0, listaEntregadores.length, ...(dados.listaEntregadores ?? []));
    listaServicosEntrega.splice(0, listaServicosEntrega.length, ...(dados.listaServicosEntrega ?? []));
    listaEntregas.splice(0, listaEntregas.length, ...(dados.listaEntregas ?? []));
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code !== 'ENOENT') {
      console.error('Erro ao carregar dados JSON:', err);
    }
  }
}

// ================= FUNÇÕES AUXILIARES E VALIDAÇÕES =================

function limparTela(): void {
  console.clear();
}

async function perguntar(texto: string): Promise<string> {
  const resposta = await rl.question(texto);
  return resposta.trim();
}

async function pausar(mensagem = '\nPressione ENTER para continuar...'): Promise<void> {
  await perguntar(mensagem);
}

async function perguntarObrigatorio(texto: string): Promise<string> {
  while (true) {
    const valor = await perguntar(texto);
    if (valor.length > 0) {
      return valor;
    }
    console.log('Este campo é obrigatório. Digite um valor válido.');
  }
}

async function perguntarNumeroNaoNegativo(
  texto: string,
  permitirZero = true,
  inteiro = false
): Promise<number> {
  while (true) {
    const raw = await perguntar(texto);
    const normalizado = raw.replace(',', '.');
    const valor = inteiro ? Number(normalizado) : parseFloat(normalizado);
    const inteiroOk = !inteiro || Number.isInteger(valor);
    const limiteOk = permitirZero ? valor >= 0 : valor > 0;

    if (!Number.isNaN(valor) && Number.isFinite(valor) && inteiroOk && limiteOk) {
      return valor;
    }
    console.log(
      permitirZero
        ? 'Digite um número válido maior ou igual a zero.'
        : 'Digite um número válido maior que zero.'
    );
  }
}

function obterPerfilAtivo(): string {
  return usuarioLogado?.perfil || perfilCadastrado || '';
}

function obterNomeAtivo(): string {
  return usuarioLogado?.nome || nomeCadastrado || 'Usuário';
}

function rotuloPerfil(perfil: string): string {
  switch (perfil) {
    case '0':
      return 'Cliente (0)';
    case '1':
      return 'Empresário (1)';
    case '2':
      return 'Entregador (2)';
    default:
      return perfil || 'Não informado';
  }
}

// ================= VISUALIZAÇÃO E AÇÕES DO SISTEMA =================

function imprimePaginaPrincipal(): void {
  console.log('=====================================');
  console.log("PAGINA PRINCIPAL FLACH'S");
  console.log('=======================================');
}

async function perfilUsuario(usuario?: Usuario): Promise<void> {
  const alvo = usuario ?? usuarioLogado ?? listaUsuarios[0];
  console.log('\n--- MEU CADASTRO / PERFIL ---');
  console.log(`Nome: ${alvo?.nome || nomeCadastrado || 'Não informado'}`);
  console.log(`Idade: ${alvo?.idade ?? 'Não informado'}`);
  console.log(`CPF: ${alvo?.cpf || 'Não informado'}`);
  console.log(`E-mail: ${alvo?.email || emailCadastrado || 'Não informado'}`);
  console.log(`Perfil: ${rotuloPerfil(alvo?.perfil || perfilCadastrado)}`);

  if (enderecoCadastrado[0]) {
    const end = enderecoCadastrado[0];
    const numTexto = end.sn ? String(end.numero) : 'S/N';
    console.log(`Endereço: ${end.rua}, ${numTexto} - ${end.bairro}, ${end.cidade}/${end.estado}`);
  }

  if (bancoCadastrado[0]) {
    const bco = bancoCadastrado[0];
    console.log(`Banco: ${bco.nome} (${bco.formaPagamento}) - Chave: ${bco.chave}`);
  }

  await pausar('\nPressione ENTER para voltar...');
}

async function perfilEmpresa(): Promise<void> {
  console.log('\n--- PERFIL DA EMPRESA ---');
  console.log(`Responsável: ${obterNomeAtivo()}`);
  console.log(`Banco: ${bancoCadastrado[0]?.nome ?? 'Não informado'}`);
  await pausar('\nPressione ENTER para voltar...');
}

async function historicoPedidos(pedidos: Pedido[]): Promise<void> {
  console.log('\n--- HISTÓRICO DE PEDIDOS ---');
  if (pedidos.length === 0) {
    console.log('Nenhum pedido registrado ainda.');
  } else {
    pedidos.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.nomePedido} - R$ ${p.precoPedido.toFixed(2)} [${p.statusPedido}]`);
    });
  }
  await pausar('\nPressione ENTER para voltar...');
}

async function historicoEntregas(): Promise<void> {
  console.log('\n--- HISTÓRICO DE ENTREGAS ---');
  if (listaEntregas.length === 0) {
    console.log('Nenhuma entrega concluída no momento.');
  } else {
    listaEntregas.forEach((ent, idx) => {
      console.log(
        `${idx + 1}. Pedido: ${ent.nomePedido} | Entregador: ${ent.nomeEntregador} [${ent.statusEntrega}]`
      );
    });
  }
  await pausar('\nPressione ENTER para voltar...');
}

async function fazerPedido(nomeCliente: string): Promise<void> {
  console.log('\n--- FAZER PEDIDO ---');
  const nomePedido = await perguntarObrigatorio(`Olá ${nomeCliente}, o que deseja pedir hoje? `);
  const descricaoPedido = await perguntar('Alguma observação ou descrição? ');

  listaPedidos.push({
    nomePedido,
    descricaoPedido,
    precoPedido: 25.0,
    statusPedido: 'Em andamento',
  });

  await salvarDados();
  console.log('Pedido realizado e salvo na página principal!');
  await pausar();
}

async function contratarEntregador(): Promise<void> {
  console.log('\n--- CONTRATAR ENTREGADOR ---');
  const nomeEntregador = await perguntarObrigatorio('Nome do entregador: ');
  const cpfEntregador = await perguntarObrigatorio('CPF do entregador: ');

  listaEntregadores.push({ nomeEntregador, cpfEntregador });
  await salvarDados();
  console.log('Entregador cadastrado/contratado e salvo!');
  await pausar('\nPressione ENTER para voltar...');
}

async function postarProduto(): Promise<void> {
  console.log('\n--- POSTAR PRODUTO (PÁGINA PRINCIPAL) ---');
  const nomeProduto = await perguntarObrigatorio('Nome do produto: ');
  const precoProduto = await perguntarNumeroNaoNegativo('Preço do produto (R$): ', false, false);

  listaProdutos.push({
    nomeProduto,
    precoProduto,
    statusProduto: 'D',
  });

  await salvarDados();
  console.log('Produto postado na página principal!');
  await pausar('\nPressione ENTER para voltar...');
}

async function postarEntrega(entregaBase?: string): Promise<void> {
  console.log('\n--- POSTAR SERVIÇO DE ENTREGA (PÁGINA PRINCIPAL) ---');
  const tituloServico =
    (await perguntar(
      `Título do serviço de entrega${entregaBase ? ` (ref: ${entregaBase})` : ''}: `
    )) || (entregaBase ? `Entrega: ${entregaBase}` : 'Entrega Avulsa');
  const descricaoServico = await perguntarObrigatorio('Detalhes/região do serviço de entrega: ');

  listaServicosEntrega.push({
    tituloServico,
    descricaoServico,
    autorServico: obterNomeAtivo(),
  });

  await salvarDados();
  console.log(`Serviço de entrega "${tituloServico}" postado na página principal!`);
  await pausar('\nPressione ENTER para voltar...');
}

async function fazerEntrega(nomeEntregadorAtual?: string): Promise<void> {
  console.log('\n--- FAZER ENTREGA ---');

  const pedidosPendentes = listaPedidos.filter((p) => p.statusPedido !== 'Entregue');

  if (pedidosPendentes.length === 0) {
    console.log('Não há pedidos pendentes disponíveis para entrega no momento.');
    await pausar('\nPressione ENTER para voltar...');
    return;
  }

  pedidosPendentes.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.nomePedido} - R$ ${p.precoPedido.toFixed(2)} [${p.statusPedido}]`);
  });

  const escolhaStr = await perguntar('\nDigite o número do pedido pendente para entregar (ou 0 para cancelar): ');
  const indice = (parseInt(escolhaStr, 10) || 0) - 1;

  if (indice < 0 || indice >= pedidosPendentes.length) {
    console.log('Operação cancelada ou pedido inválido.');
    await pausar('\nPressione ENTER para voltar...');
    return;
  }

  const pedidoEscolhido = pedidosPendentes[indice];
  if (pedidoEscolhido.statusPedido === 'Entregue') {
    console.log('Este pedido já foi entregue e não pode ser entregue novamente.');
    await pausar('\nPressione ENTER para voltar...');
    return;
  }

  pedidoEscolhido.statusPedido = 'Entregue';

  const entregadorResponsavel = nomeEntregadorAtual || obterNomeAtivo();
  listaEntregas.push({
    nomePedido: pedidoEscolhido.nomePedido,
    nomeEntregador: entregadorResponsavel,
    statusEntrega: 'Concluída',
  });

  await salvarDados();
  console.log(`Entrega do pedido "${pedidoEscolhido.nomePedido}" concluída e salva!`);
  await pausar('\nPressione ENTER para voltar...');
}

async function verProdutos(): Promise<void> {
  console.log('\n--- PRODUTOS POSTADOS ---');
  if (listaProdutos.length === 0) {
    console.log('Nenhum produto cadastrado.');
  } else {
    listaProdutos.forEach((prod, i) => {
      console.log(
        `${i + 1}. ${prod.nomeProduto} - R$ ${prod.precoProduto.toFixed(2)} [${prod.statusProduto}]`
      );
    });
  }
  await pausar('\nPressione ENTER para voltar...');
}

function exibirMuralPostagens(): void {
  console.log('\n[ PRODUTOS POSTADOS ]');
  if (listaProdutos.length === 0) {
    console.log('  Nenhum produto postado no momento.');
  } else {
    listaProdutos.forEach((prod, idx) => {
      console.log(
        `  ${idx + 1}. ${prod.nomeProduto} — R$ ${prod.precoProduto.toFixed(2)} (${prod.statusProduto})`
      );
    });
  }

  console.log('\n[ SERVIÇOS E ENTREGAS POSTADOS ]');
  if (listaServicosEntrega.length === 0) {
    console.log('  Nenhum serviço de entrega postado no momento.');
  } else {
    listaServicosEntrega.forEach((srv, idx) => {
      console.log(
        `  ${idx + 1}. ${srv.tituloServico} — ${srv.descricaoServico || 'Sem descrição'} (por ${srv.autorServico})`
      );
    });
  }

  console.log('\n[ PEDIDOS ATIVOS ]');
  if (listaPedidos.length === 0) {
    console.log('  Nenhum pedido registrado no momento.');
  } else {
    listaPedidos.forEach((ped, idx) => {
      console.log(
        `  ${idx + 1}. ${ped.nomePedido} — R$ ${ped.precoPedido.toFixed(2)} [${ped.statusPedido}]`
      );
    });
  }
}

// ================= PÁGINA PRINCIPAL (INTERAÇÃO COM POSTAGENS) =================

async function paginaPrincipalFlachs(): Promise<void> {
  const perfil = obterPerfilAtivo();
  const nome = obterNomeAtivo();
  let opcao = '';

  do {
    limparTela();
    imprimePaginaPrincipal();
    console.log(`Usuário: ${nome} | Perfil: ${rotuloPerfil(perfil)}`);
    exibirMuralPostagens();

    console.log('\n--- INTERAÇÕES NA PÁGINA PRINCIPAL ---');
    if (perfil === '0') {
      console.log('1. Ver produtos detalhados');
      console.log('2. Fazer novo pedido');
      console.log('3. Ver meu histórico de pedidos');
    } else if (perfil === '1') {
      console.log('1. Postar produto');
      console.log('2. Ver meus produtos');
      console.log('3. Contratar entregador');
      console.log('4. Ver histórico de pedidos');
    } else if (perfil === '2') {
      console.log('1. Postar serviço de entrega');
      console.log('2. Fazer entrega de um pedido');
      console.log('3. Ver entregas realizadas');
      console.log('4. Ver histórico de pedidos');
    } else {
      console.log('1. Ver produtos detalhados');
    }
    console.log('0. Voltar');

    opcao = await perguntar('Opção: ');

    if (perfil === '0') {
      switch (opcao) {
        case '1':
          await verProdutos();
          break;
        case '2':
          await fazerPedido(nome);
          break;
        case '3':
          await historicoPedidos(listaPedidos);
          break;
        case '0':
          return;
        default:
          console.log('Opção inválida para o perfil de Cliente.');
          await pausar();
          break;
      }
    } else if (perfil === '1') {
      switch (opcao) {
        case '1':
          await postarProduto();
          break;
        case '2':
          await verProdutos();
          break;
        case '3':
          await contratarEntregador();
          break;
        case '4':
          await historicoPedidos(listaPedidos);
          break;
        case '0':
          return;
        default:
          console.log('Opção inválida para o perfil de Empresário.');
          await pausar();
          break;
      }
    } else if (perfil === '2') {
      switch (opcao) {
        case '1':
          await postarEntrega(listaPedidos.find((p) => p.statusPedido !== 'Entregue')?.nomePedido);
          break;
        case '2':
          await fazerEntrega(nome);
          break;
        case '3':
          await historicoEntregas();
          break;
        case '4':
          await historicoPedidos(listaPedidos);
          break;
        case '0':
          return;
        default:
          console.log('Opção inválida para o perfil de Entregador.');
          await pausar();
          break;
      }
    } else {
      switch (opcao) {
        case '1':
          await verProdutos();
          break;
        case '0':
          return;
        default:
          console.log('Opção inválida.');
          await pausar();
          break;
      }
    }
  } while (opcao !== '0');
}

// ================= TELAS DE CADASTRO, LOGIN E SESSÃO =================

async function menuSessaoRestrita(): Promise<void> {
  let opcao = '';
  do {
    limparTela();
    console.log('=====================================');
    console.log(`SESSÃO ATIVA: ${obterNomeAtivo()}`);
    console.log('Você já está logado: acesso restrito ao seu cadastro e à página principal.');
    console.log('======================================');
    console.log('1. Ver meu cadastro');
    console.log('2. Ir para a página principal (postagens e interações)');
    console.log('9. Encerrar sessão (logout)');
    console.log('0. Sair do sistema');
    opcao = await perguntar('Opção: ');

    switch (opcao) {
      case '1':
        await perfilUsuario(usuarioLogado ?? undefined);
        break;
      case '2':
        await paginaPrincipalFlachs();
        break;
      case '9':
        usuarioLogado = null;
        await salvarDados();
        console.log('Sessão encerrada com sucesso.');
        await pausar();
        return;
      case '0':
        await salvarDados();
        console.log('Saindo do sistema...');
        rl.close();
        return;
      default:
        console.log(
          'Acesso bloqueado: enquanto estiver logado, use seu cadastro, a página principal, encerre a sessão (9) ou saia (0).'
        );
        await pausar();
        break;
    }
  } while (opcao !== '0');
}

async function paginaCadastro(): Promise<void> {
  if (usuarioLogado) {
    console.log('Usuário já logado. Acesso permitido apenas ao seu cadastro.');
    await pausar();
    await menuSessaoRestrita();
    return;
  }

  let perfilValido = false;

  while (!perfilValido) {
    limparTela();
    console.log('===========');
    console.log('Seja membro');
    console.log('===============');

    nomeCadastrado = await perguntarObrigatorio('Digite seu nome: ');
    const idade = await perguntarNumeroNaoNegativo('Digite sua idade: ', true, true);
    const cpf = await perguntarObrigatorio('Digite seu CPF: ');
    emailCadastrado = await perguntarObrigatorio('Digite seu e-mail: ');
    senhaCadastrada = await perguntarObrigatorio('Digite uma senha forte: ');
    perfilCadastrado = await perguntar(
      'Digite o numero de um dos perfis \n(Cliente(0), empresario(1), entregador(2)): '
    );

    if (!['0', '1', '2'].includes(perfilCadastrado)) {
      console.log('Perfil nao encontrado! Digite 0, 1 ou 2.');
      await pausar();
      continue;
    }

    const bancoNome = await perguntarObrigatorio('Digite o nome do banco que sera usado: ');
    const formaPagamento = await perguntarObrigatorio('Digite uma forma de pagamento: ');
    const chave = await perguntarObrigatorio('Digite a chave/codigo de pagamento: ');
    bancoCadastrado[0] = { nome: bancoNome, formaPagamento, chave };

    const estado = (await perguntarObrigatorio('Digite seu estado (UF): ')).slice(0, 2).toUpperCase();
    const cidade = await perguntarObrigatorio('Digite a sua cidade: ');
    const bairro = await perguntarObrigatorio('Digite seu bairro: ');
    const rua = await perguntarObrigatorio('Digite a rua onde voce mora: ');

    console.log('A sua casa possui um numero?');
    const confirmador = await perguntar("Apenas responda 'sim' ou 'nao': ");
    let numero = 0;
    let sn = false;

    if (confirmador.toLowerCase().startsWith('s')) {
      console.log('Confirmado!');
      sn = true;
      numero = await perguntarNumeroNaoNegativo('Digite o numero da sua casa: ', true, true);
    } else {
      console.log('A casa do usuario nao possui numero\nCadastrando...');
    }

    enderecoCadastrado[0] = { estado, cidade, bairro, rua, numero, sn, complemento: '' };

    const novoUsuario: Usuario = {
      nome: nomeCadastrado,
      idade,
      cpf,
      perfil: perfilCadastrado,
      email: emailCadastrado,
      senha: senhaCadastrada,
      saldoInicial: 0,
    };

    listaUsuarios.push(novoUsuario);
    usuarioLogado = novoUsuario;
    perfilValido = true;

    await salvarDados();
  }

  await paginaPrincipalFlachs();
}

async function paginaLogin(): Promise<void> {
  if (usuarioLogado) {
    console.log('Você já está logado! Acesso permitido apenas ao seu cadastro.');
    await pausar();
    await menuSessaoRestrita();
    return;
  }

  limparTela();
  console.log('========================');
  console.log('Seja bem vindo de volta');
  console.log('===========================');

  const emailLogin = await perguntarObrigatorio('Digite o email cadastrado: ');
  const senhaLogin = await perguntarObrigatorio('Digite sua senha: ');
  const opcao = await perguntar('Digite o seu perfil (0-Cliente, 1-Empresario, 2-Entregador): ');

  if (emailLogin !== emailCadastrado || emailLogin === '') {
    console.log('E-mail nao foi encontrado!');
    await pausar();
    return;
  }

  if (senhaLogin !== senhaCadastrada) {
    console.log('Senha incorreta!');
    await pausar();
    return;
  }

  if (!['0', '1', '2'].includes(opcao)) {
    console.log('Perfil nao encontrado!');
    await pausar();
    return;
  }

  const usuarioEncontrado = listaUsuarios.find((u) => u.email === emailLogin);
  const perfilEsperado = usuarioEncontrado?.perfil || perfilCadastrado;

  if (perfilEsperado && opcao !== perfilEsperado) {
    console.log(
      `Perfil incompatível com o cadastro! Seu perfil registrado é ${rotuloPerfil(perfilEsperado)}.`
    );
    await pausar();
    return;
  }

  perfilCadastrado = perfilEsperado || opcao;
  usuarioLogado = usuarioEncontrado ?? {
    nome: nomeCadastrado,
    idade: 0,
    cpf: '',
    perfil: perfilCadastrado,
    email: emailCadastrado,
    senha: senhaCadastrada,
    saldoInicial: 0,
  };
  usuarioLogado.perfil = perfilCadastrado;

  await salvarDados();
  console.log('Login realizado com sucesso!');
  await pausar();
  await paginaPrincipalFlachs();
}

async function paginaInicial(): Promise<void> {
  while (true) {
    if (usuarioLogado) {
      await menuSessaoRestrita();
      if (rl.closed) {
        return;
      }
      continue;
    }

    limparTela();
    imprimePaginaPrincipal();
    console.log('Seja bem vindo ao Projeto FLACHS');
    console.log('\nMENU DE OPCOES\n0. Sair\n1. Pagina de cadastro\n2. Pagina de login');
    const opcao = await perguntar('Opção: ');

    switch (opcao) {
      case '1':
        if (usuarioLogado) {
          await menuSessaoRestrita();
          break;
        }
        await paginaCadastro();
        break;
      case '2':
        if (usuarioLogado) {
          await menuSessaoRestrita();
          break;
        }
        await paginaLogin();
        break;
      case '0':
        await salvarDados();
        console.log('Saindo do sistema...');
        rl.close();
        return;
      default:
        console.log('Nenhuma pagina escolhida. Tente novamente.');
        await pausar();
        break;
    }
  }
}

// ================= INICIALIZAÇÃO =================

async function main(): Promise<void> {
  await carregarDados();
  await paginaInicial();
}

main();