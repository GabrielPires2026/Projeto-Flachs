//Bibliotecas necessárias à implementação de soluções que facilitam o desenvolvimento do código. O stdio.h é responsavel pela entrade e saída de dados
#include<stdio.h>
//msth.h implementa cálculos que normalmente sção executados por calculadoras cientiíficas
#include<math.h>
//stdbool implementa o tipo booleano, que vai facilitar a validação de algumas regras de negócio presentes no código;
#include<stdbool.h>
//stdlib 
#include<stdlib.h>
//ctype
#include<ctype.h>
//string
#include<string.h>







 char emailCadastrado[50];
 char senhaCadastrada[50];
 char nomeCadastrado[50];
 char perfilCadastrado;





















typedef struct Usuario{
    char nome[50];
    int idade;
    char cpf[17];
    char perfil[30];
    char email[50];
    char senha[50];
    double saldoInicial;
};
struct Usuario listaUsuarios[100];













typedef struct ValidaUsuario{
    bool cpfCadastrado;
    bool perfilCadastrado;
    bool emailCadastrado;
    bool isAdulto;
    bool saldoInicialExiste;
}








 struct Banco{
    char nome[50];
    char formaPagamento[50];
    char chave[50];
};








struct Endereco{
    char estado[2];
    char cidade[50];
    char bairro[50]; 
    char rua[50];
    int numero;
    bool SN;
    char complemento[100];
};






struct Endereco enderecoCadastrado[100];


 struct Banco bancoCadastrado[100];










 struct Produto{
    char nomeProduto[50];
    double precoProduto;
    char statusProduto;
 };

 struct Produto listaProdutos[100];

 






 struct Pedido{
    char nomePedido[50];
    char descricaoPedido[100];
    double precoPedido;
    char statusPedido[50];
 };

 

 struct Pedido listaPedidos[100];








 struct Entregador{
    char nomeEntregador[50];
    char cpfEntregador[17];

 };

 struct Entregador listaEntregadores[100];


FILE* salvarEmail;
FILE* salvarSenha;
FILE* salvarNome;
FILE* salvarPerfil;









char usuario[30];













void paginaInicial();
void paginaCadastro();
void paginaLogin();
void paginaCliente();
void paginaEmpresario();
void paginaEntregador();
void perfilUsuario(Usuario usuario);
void perfilEmpresa();
void historicoPedidos( char pedido[]);
void historicoEntregas();
void fazerPedido(char usuario, *login);
void contratarEntregador();
void postarProduto();
void postarEntrega(char entrega[]);
void verEntregas();
void verProdutos();
void imprimePaginaPrincipal();




int main(){
    paginaInicial();
    
    



}


















void imprimePaginaPrincipal(){
    printf("=====================================");
    printf("PAGINA PRINCIPAL FLACH'S");
    printf("=======================================");

}

void perfilUsuario(){

}
















void paginaInicial(){
    char opcao;
    printf("===================================== \n");
    printf("Seja bem vindo ao Projeto FLACHS \n");
    printf("========================================== \n ");
    printf("Como deseja acessar o sistema?");
    printf(" \n MENU DE OPCOES \n Cadastrar-se \n Fazer Login \n Sair \n");
    printf("\n ESCOLHA UMA OPCAO \n 0. Sair  \n 1. Pagina de cadastro \n 2. Pagina de login");
    scanf("%c", &opcao);
    do{
        switch(opcao){
            case '1':
                system("cls");
                paginaCadastro();
                break;
            case '2':
                system("cls");
                paginaLogin();
            default:
                system("cls");
                printf("Nenhuma pagina escolhida \n saindo.");
                paginaInicial();
        }
    }while(opcao != 0);
}

















void paginaCadastro(){

    char confirmador;

    printf("=========== \n");
    printf("Seja membro \n ");
    printf("=============== \n");

    printf("Digite seu nome: \n");
    scanf("%s", nomeCadastrado);
    printf("Digite seu e-mail: \n");
    scanf("%s", emailCadastrado);
    printf("Digite uma senha forte \n");
    scanf("%s", senhaCadastrada);
    printf("Digite o numero de um dos perfis \n (Cliente(0), empresario(1), entregador(2)): ");
    scanf("%s", perfilCadastrado);
    printf("Digite o nome do banco que sera usado: \n");
    scanf("%s", bancoCadastrado->nome);
    printf("Digite uma forma de pagamento: \n");
    scanf("%s",bancoCadastrado->formaPagamento);
    printf("Digite a chave/codigo de pagamento: \n");
    scanf("%s", bancoCadastrado->chave);
    printf("Digite seu seu estado: \n");
    scanf("%2s", enderecoCadastrado->estado);
    printf("Digite a sua cidade: \n");
    scanf("%s", enderecoCadastrado->cidade);
    printf("Digite seu bairro: \n");
    scanf("%s", enderecoCadastrado->bairro);
    printf("Digite a rua onde voce mora: \n");
    scanf("%s", enderecoCadastrado->rua);
    printf("A sua casa possui um numero? \n");
    printf("Apeas responde: 'sim' ou 'nao': ")
    scanf("%c", &confirmador)
    if(tolower(confirmador) == 's'){
        printf("Confirmado!");
        enderecoCadastrado->SN = true;
        printf("Digite o numero da sua casa");
        scanf("%d", &enderecoCadastrado->numero);
    }else{
        printf("A casa do usuario nao possui numero \n Cadastrando...");
    }
    do{
        switch(perfilCadastrado){
            case '1': 
                system("cls");
                paginaCliente();
                break;
            case '2':
                system("cls");
                paginaEmpresario();
            case '3':
                system("cls");
                paginaEntregador();
            default:
                printf("Perfil nao encontrado!");
                system("cls");
                paginaCadastro();
     }
    }while(perfilCadastrado != '0');
}






















void paginaLogin() {
    char emailLogin[50];
    char senhaLogin[50];
    char opcao;

    printf("======================== \n");
    printf("Seja bem vindo de volta \n");
    printf("=========================== \n");

    printf("Digite o email cadastrado: \n");
    scanf("%s", emailLogin);
    printf("Digite sua senha: \n");
    scanf("%s", senhaLogin);
    printf("Digite o seu perfil (0-Cliente, 1-Empresario, 2-Entregador): \n");
    scanf(" %c", &opcao);

    if(strcmp(emailLogin, emailCadastrado) == 0) {
        printf("E-mail encontrado! \n");
    } else {
        printf("E-mail nao foi encontrado! \n");
        system("cls");
        paginaLogin();
        return;
    }

    if(strcmp(senhaLogin, senhaCadastrada) == 0) {
        printf("Senha correta!");
    } else {
        printf("Senha incorreta! \n");
        system("cls");
        paginaLogin();
        return;
    }

   do{
     switch(opcao) {
        case '0':
            paginaCliente();
            break;
        case '1':
            paginaEmpresario();
            break;
        case '2':
            paginaEntregador();
            break;
        default:
            printf("Perfil nao encontrado!");
            break;
    }
   }while(opcao != '0');
}











/*
    Essa função → void paginaCliente é responsável por carregar as informações iniciais da página do cliente, que incluem um
    menu de opções numeradas de 0 a 3 para que os usuarios possam navegar entre as funções disponiveis. 
*/









void paginaCliente(){
    char opcao;
    int qtdPedidos;
    printf("===================================== \n");
    printf("Seja bem vindo(a) %s \n", nomeCadastrado);
    printf("======================================");
    printf("\n O que deseja fazer hoje? \n MENU DE OPÇÕES \n Ver perfil \n Ver histórico de pedidos \n Fazer novo pedido \n ");
    printf("Digite 1. para acessar o perfil. \n Digite 2. para  vr o historico de pedidos. \n Digite 3. para fazer um novo pedido");
    scanf("%c", &opcao);
    do{
        switch(opcao){
        case '1':
            system("cls");
            perfilUsuario();
            break;
        case '2':
            system("cls");
            historicoPedidos(listaPedidos->nomePedido);
        case '3':
            system("cls");
            fazerPedido(listaPedidos[0].nomePedido);
        default:
        printf("Opcao nao encontrada");

    }
    }while(opcao != '0');
    paginaInicial();
}
















void fazerPedido(const usuario, *logado){
    char nomePedido[100];
    printf("============================ \n");
    printf("PAINEL DE PEDIDOS \n");
    printf("=============================== \n");

    peintf("O que deseja pedir hoje?");
}



















/*
    Essa função → void paginaInicial() é responsável por imprimir as informações iniciais da página do entregador, que irão permitir 
    com que os usuários com perfil de entregadores possam navegar entre as funções do perfil. Isso será feito através de um menu de 
    opções, cada uma numerada de 0 à 5 sendo o zero responsável apenas pela navegação para uma página antes (geralmente, página inicial), o que é possivel
    devido a chamada de sua função respectíva.
*/









void  paginaEmpresario(){
    char opcao;
    int qtdPedidos;
    printf("===================================== \n");
    printf("Seja bem vindo(a) %s \n", nomeCadastrado);
    printf("====================================== \n");
    printf("\n O que deseja fazer hoje? \n MENU DE OPÇÕES \n Ver perfil da empresa \n Ver histórico de pedidos \n Contratar entregadores  \n postar produto \n ver meus produtos \n Voltar para a pagina inicial \n");
    printf("Digite 1. para ver perfil da empresa. 2. Para ver o historico de pedidos. 3. Para contratar um entregador. 4. Para postar um produto. 5. Para ver seus produtos \n 0. Voltar a pagina inicial");
    scanf(" %c", &opcao);
   do{
     switch(opcao){
        case '1':
            system("cls");
            perfilEmpresa();
        case '2':
            system("cls");
            historicoPedidos(listaPedidos->nomePedido);
        case '3':
            system("cls");
            contratarEntregador();
        case '4':
            system("cls");
            postarProduto();
        case '5':
            system("cls");
            verProdutos();
    }
   }while(opcao = '0');
   paginaInicial();
}




















/*
    Essa função → void paginaEntregadoe é responsável por imprimir as informações da página do entregador, pelo menos as iniciais,
    que ajudem o usuário a navegar para a função desejado por ele. Isso será feito através da exibição de um menu de opções, cada uma nu-
    merada de 1 à 4, sendo o zero responsável apenas pela navegação para uma página antes (geralmente, página inicial), o que é possivel
    devido a chamada de sua função respectíva.
*/





void paginaEntregador(){
    char opcao;
    int qtdPedidos;
    printf("===================================== \n");
    printf("Seja bem vindo(a) %s \n", nomeCadastrado);
    printf("====================================== \n");
    printf("\n O que deseja fazer hoje? \n MENU DE OPÇÕES \n Ver perfil  \n Ver histórico de pedidos  \n postar servico \n ver minhas entregas \n Voltar a pagina inicial \n");
    printf("Digite 1. Para ver o perfil. 2. para ver o historico de pedidos. 3. para adicionar um novo servico. 4. para ver as entregas realizadas \n 0. Voltar a pagina inicial");
    scanf(" %c", &opcao);
    do{
        switch(opcao){
            case '1':
                system("cls");
                perfilUsuario();
                break;
            case '2':
                system("cls");
                historicoPedidos(listaPedidos->nomePedido );
                break;
            case '3':
                system("cls");
                postarEntrega(listaPedidos[0].nomePedido);
                break;
            case '4':
                system("cls");
                historicoEntregas();
            default:
            printf("Opcao nao encontrada");
        }
    }while(opcao != '0');
    paginaInicial();
}
