import readline from 'node:readline/promises';
import {stdin as input, stdout as output} from 'process';
import fs from 'node:fs';

const rl = readline.createInterface({input, output});






class Usuario{
    #_nome;
    #_senha;
    #_profissao;

    constructor(nome, senha, profissao){
        this.#_nome = nome;
        this.#_senha = senha;
        this.#_profissao = profissao;
    }


    get nome(){
        return this.#_nome;
    }
    get senha(){
        return this.#_senha;
    }
    get profissao(){
        return this.#_profissao;
    }

}


class Login{


}










class Cadastro{



}























console.log("===================================================================================");
console.log("                   SEJA BEM-VINDO AO PROJETO FLACHS                                             ");
console.log("=====================================================================================");
console.log("\n");

















































































rl.close();





