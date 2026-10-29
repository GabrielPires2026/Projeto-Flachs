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

const formaDeAcesso = await rl.question("Por favor, escolha uma forma de entrat na plataforma:  ");










rl.close()


