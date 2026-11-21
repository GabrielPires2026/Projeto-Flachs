#include<stdio.h>
#include<math.h>
#include<stdbool.h>
#include<stdlib.h>
#include<ctype.h>>








 char emailCadastrado[50];
 char senhaCadastrada[50];
 char nomeCadastrado[50];
 char perfilCadastrado;
 struct Banco{
    char nome[50],
    char formaPagamento[50],
    char chave[50]
} 

struct Endereco{
    char estado[2], 
    char cidade[50],
    char bairro[50], 
    char rua[50],
    int numero,
    bool SN = true,
    char complemento[100]
}

struct Endereco enderecoCadastrado;


 struct Banco bancoCadastrado;


FILE* salvarEmail;
FILE* salvarSenha;
FILE* salvarNome;
FILE* salvarPerfil;

void paginaInicial(){
    char opcao;
    printf("===================================== \n");
    printf("Seja bem vindo ao Projeto FLACHS \n");
    printf("========================================== \n ");
    printf("Como deseja acessar o sistema?");
    printf(" \n MENU DE OPCOES \n Cadastrar-se \n Fazer Login \n Sair \n");
    printf("\n ESCOLHA UMA OPCAO \n 0. Sair  \n 1. Pagina de cadastro \n 2. Pagina de login");
    scanf('%c', &opcao);
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
                printf("Nenhuma pagina escolhida \n saindo.");
        }
    }while(opcao !== 0)
}



void paginaCadastro(){

    char confirmador[10];

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
    scanf('%c', perfilCadastrado);
    printf("Digite o nome do banco que sera usado: \n");
    scanf("%s", bancoCadastrado.nome);
    printf("Digite uma forma de pagamento: \n");
    scanf("%s",bancoCadastrado.formaPagamento);
    printf("Digite a chave/codigo de pagamento: \n");
    scanf("%s", bancoCadastrado.chave);
    printf("Digite seu seu estado: \n");
    scanf("%2s", enderecoCadastrado.estado);
    printf("Digite a sua cidade: \n");
    scanf("%s", enderecoCadastrado.cidade);
    printf("Digite seu bairro: \n");
    scanf("%s", enderecoCadastrado.bairro);
    printf("Digite a rua onde voce mora: \n");
    scanf("%s", enderecoCadastrado.rua);
    printf("A sua casa possui um numero? \n");
    if(tolower(confirmador) == 's'){
        printf("Confirmado!");
        enderecoCadastrado.SN = true;
        printf("Digite o numero da sua casa");
        scanf("%d", &enderecoCadastrado.numero);
    }else{
        printf("A casa do usuario nao possui numero \n Cadastrando...");
    }
    do{
        switch(perfilCadastrado){
        case '0':
            system("cls");
            paginaCliente();
            break;
        case '1':
            system("cls");
            paginaEmpresario();
            break;
        case '2':
            system("cls");
            paginaEntregador();
            break;
        default:
            printf("Perfil nao encontrado!");
            system("cls");
            paginaCadastro();
    }
    }while(perfilCadastrado !== '0');
}




void paginaLogin(){
    char emailLogin[50];
    char senhaLogin[50];
    char perfilLogin[1];
    char opcao;
    printf("======================== \n");
    printf("Seja bem vindo de volta \n");
    printf("=========================== \n");

    printf("Digite o email cadastrado: \n");
    scanf("%s", &emailLogin);
    printf("Digite sua senha: \n");
    scanf("%s", &senhaLogin);
    printf("Digite o numero do  seu perfil de usuario (cliente(0), empresario(1) ou entregador(1) \n");
    scanf('%c', &opcao);
    if(emailLogin == salvarEmail){
        printf("E-mail encontrado! \n");
    }else{
        printf("E-mail nao foi encontrado! \n Digite um e-mail valido. \n");
        system("cls");
        paginaLogin();
    }
    if(senhaLogin == salvarSenha){
        printf("Senha correta!");
    }else{
        printf("A senha nao existe ou esta incorreta. Digite uma senha valida! \n");
        system("cls");
        paginaLogin();
    }

    switch(opcao){
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
        pprintf("Perfil nao encontrado!");
    }


    
}

void paginaCliente(){
    printf("===================================== \n");
    printf("Seja bem vindo(a) %s \n", nomeCadastrado);
    printf("======================================");
    printf("\n O que deseja fazer hoje? \n MENU DE OPÇÕES \n Ver perfil \n Ver histórico de pedidos \n Fazer novo pedido ");
}

void  paginaEmpresario(){
    printf("===================================== \n");
    printf("Seja bem vindo(a) %s \n", nomeCadastrado);
    printf("====================================== \n");
    printf("\n O que deseja fazer hoje? \n MENU DE OPÇÕES \n Ver perfil da empresa \n Ver histórico de pedidos \n Contratar entregadores \n postar produto \n ver meus produtos");
}

void paginaEntregador(){
    printf("===================================== \n");
    printf("Seja bem vindo(a) %s \n", nomeCadastrado);
    printf("====================================== \n");
    printf("\n O que deseja fazer hoje? \n MENU DE OPÇÕES \n Ver perfil  \n Ver histórico de pedidos  \n postar servico \n ver minhas entregas");
}


int main(){
    paginaInicial();
}