import readline from 'node:readline/promises'; 
import {stdin as input, stdout as output} from 'process'; 
import fs from 'node:fs'; 

const rl = readline.createInterface({input, output}); 

// Objeto de Usuario
class Usuario { 
    // Propriedades do objeto usuario privadas
    #_nome; 
    #_senha; 
    #_profissao; 
    #_saldo; 

    constructor(nome, senha, profissao = undefined, saldo = 0){ 
        this.#_nome = nome; 
        this.#_senha = senha; 
        this.#_profissao = profissao; 
        this.#_saldo = saldo; 
    } 

    // METODOS ACESSORES
    get nome(){ return this.#_nome; } 
    get senha(){ return this.#_senha; } 
    get profissao(){ return this.#_profissao; } 
    
    get saldo(){ 
        if(this.#_saldo >= 1 && this.#_saldo !== 0 ){ 
            return this.#_saldo; 
        }
        return 0;
    } 

    // Método para atualizar o saldo internamente
    set saldo(novoSaldo) {
        this.#_saldo = novoSaldo;
    }

    definirTipoDeUsuario(){ 
        switch(this.#_profissao){ 
            // Implementação futura
        } 
    } 
} 

// Classe Cliente herdando corretamente de Usuario
class Cliente extends Usuario { 
    #_pedido; 
    #_statusDaCompra; 
    #_produto

    // O construtor recebe os dados dele e os do Pai (Usuario)
    constructor(nome, senha, profissao, saldo, pedido, statusDaCompra = undefined, produto){ 
        // Invoca o construtor da classe pai primeiro
        super(nome, senha, profissao, saldo); 
        this.#_pedido = pedido; 
        this.#_statusDaCompra = statusDaCompra; 
        this.#_produto = produto;
    } 

    // Getter  utilizando o getter público do pai através de 'this'
    get pedido(){ 
        if(this.saldo >= 1){ 
            return this.#_pedido; 
        } 
    } 

    get statusDaCompra(){ 
        return this.#_statusDaCompra; 
    } 

    efetuarCompra(valor, produto){ 
        if(this.saldo >= valor){ 
            // Atualiza o saldo usando o 'this' através do set/get público
            this.saldo = this.saldo - valor;
            this.#_produto = produto; 
            const nomeDoProduto = this.#_produto;
            return this.saldo; 
        } else {
            console.log("Saldo insuficiente!");
        }
    } 



    receberCompra(){ 
        if(this.statusDaCompra){ 
            console.log("A compra foi recebida com sucesso!"); 
        }else{ 
            console.log("Nenhuma compra recebida ainda!"); 
        } 
    } 

    devolverCompra(valor, produto){ 
        this.saldo = this.saldo + valor;
        console.log("Devolução concedida com sucesso!");
    } 
} // Chave de fechamento da classe Cliente no lugar correto!





class Entregador extends usuario{

    #_prazoEntrega;
    #_servicosEmAndamento;
    #_enderecoPedido
    

    constructor(nome, senha,  saldo = 0, prazoEntrega, ){
        super(nome, senha, 'entregador', saldo);

        this.#_prazoEntrega = prazoEntrega;
        this.#_servicosEmAndamento = [];
        this.#_enderecoPedido = {
            cidade, bairro, rua, complemento, numero
        }
    }

    get prazoEntrega(){
        return this.#_prazoEntrega;
    }
    get servicosEmAndamento(){
        return this.#_servicosEmAndamento;
    }
    get enderecoPedido(){
        return this.#_enderecoPedido
    }

    escolherServicos(idServico, pedido, endereco, valor, statusDoServico){
        //Alteracoes futuras
    }
    aceitarServico(statusDoServico){
        //Alteracoes futuras
    }
    fazerServico(statusDoServico){
        //Alteracoes futuras
    }
    finalizarServico(StatusDoServico){
        //Alteracoes futuras
    }
    receberPorServico(valor){
        //Alteracoes futuras
    }
    recusarServico(statusDoServico){
        //Alteracoes futuras
    }


 } 
class Empresario{

 } 
class Vendedor { } 

console.log("==================================================================================="); 
console.log(" SEJA BEM-VINDO AO PROJETO FLACHS "); 
console.log("====================================================================================="); 
console.log("\n"); 

rl.close();
