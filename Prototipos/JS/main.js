import readline from 'node:readline/promises';
import {stdin as input, stdout as output} from 'process';
import fs from 'node:fs';

const rl = readline.createInterface({input, output});

console.log("===================================================================================");
console.log("                   SEJA BEM-VINDO AO PROJETO FLACHS                                             ");
console.log("=====================================================================================");
console.log("\n");

console.log("Por favor escolha entre as opções disponiveis para prosseguir!");
console.log("\n");
console.log("Obs: para escolher uma opção, digite um dos nomes a seguir: ");

console.log("Digite: 'Cadastro' para cadastrar um novo usuário ou digite: 'login' para acessar um usuario ja existente!")

const formaDeAcesso = await rl.question("Por favor, escolha uma forma de entrar na plataforma:  ");

if(formaDeAcesso == "Login"){
    console.clear();
    console.log("=========================================== Pagina de Login ==========================================");
    console.log("Por favor, forneça as informações de login a seguir!");

    const usuario = await  rl.question("Digite seu usuario:  ");
    const senha = await  rl.question("Digite sua senha:   ");

    setTimeout(console.log(`Logando com o usuario ${usuario}...`), 5000);
    

    if(usuario){
        console.log("Usuario aceito!");
        setTimeout(console.clear(), 5000);

        console.log(`===================================== Seja bem vindo! ${usuario}!  ================================== `);

        console.log("\n");

        console.log("Por favor, digite um valor de 0 a 10 para escolher um serviço!");

        const servicos = ["pizzaria", "hamburgueria", "farmacia", "supermercado", "mercearia", "Loja de roupas"];


          console.log("======================================= Opcoes disponiveis ========================================== ");

        for(let i = 0; i<servicos.length; i++){
            console.log(`Opcao ${i}: ${servicos[i]}`);
        }

        const escolhaServico = rl.question("Digite um numero:  ");

    }

}








rl.close()


