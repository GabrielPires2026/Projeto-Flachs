// Scripts para o fluxo de Cadastro - Projeto FLACHS

const frn = document.querySelector("form");
const nome = document.getElementById("inNome");
const email = document.getElementById("inEmail");
const cpf = document.getElementById("inCpf");
const senha = document.getElementById("inSenha");
const confirmaSenha = document.getElementById("inConfirmarSenha");
//Variáveis que irão guardar as informações de localização dos usuários
const estado = document.getElementById("inEstado");
const cidade = document.getElementById("inCidade");
const bairro = document.getElementById("inBairro");
const rua = document.getElementById("inRua");
const semNumero = document.getElementById("inSN").checked;
const numeroDaCasa = document.getElementById("inNumero");
const complemento = document.getElementById("inComplemento");
//Variáveis que irão guardar os valores das formas de cadastro
const cliente = document.getElementById("inCliente").checked;
const entregador = document.getElementById("inEntregador").checked;
const empresario = document.getElementById("inEmpresario").checked;
const vendedor = document.getElementById("inVendedor").checked;
//Variável que guardam o valor do botão
const btnEnviar = document.getElementById("btnEnviar");

nome.addEventListener("blur", (e) =>{
    e.preventDefault()
    const valorNome = nome.value;
    const novoParagrafo = document.createElement("p");
    novoParagrafo.className = "nome-erro";
    const erro = document.querySelector(".nome-erro");

    if(valorNome == ""){
        console.error("O campo de nome está vazio!");
        novoParagrafo.textContent = "O campo  está vazio! Por favor, preencha-o com seu nome."
        novoParagrafo.style.color = "red";
        nome.before(novoParagrafo);
        nome.style.borderColor = "red";

        nome.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            nome.style.borderColor = "green";
            
        })
    }else{
        console.log("Campo preenchido");
    }
})

email.addEventListener("blur", (e) => {
    e.preventDefault();
    const valorEmail = email.value;
    const novoParagrafo = document.createElement("p");
    novoParagrafo.className = "erro-email";
    const erro = document.querySelector(".erro-email");
    
    if(valorEmail == ""){
        console.error("O campo de email está vazio");
        novoParagrafo.textContent = "O campo está vazio. Por favor, preencha com seu e-mail";
        novoParagrafo.style.Color = "red"
        email.style.borderColor = "red";
        email.before(novoParagrafo);

        email.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            email.style.borderColor = "Black";
        })
        
    }
    if(valorEmail.includes("@gmail.com")){
        console.log("Email V[alido");
    }else if(!valorEmail.includes("@gmail.com")){
        console.error("Email inválido");
        novoParagrafo.textContent = "O e-mail digitado não é válido! Por favor, preencha o campo com um e-mail válido"
        novoParagrafo.style.color = "red";
        email.style.borderColor = "red";
        email.before(novoParagrafo);

        email.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            email.style.borderColor = "black";
        })
    }

})

cpf.addEventListener("blur", (e) => {
    e.preventDefault();
    const valorCpf = cpf.value;
    const novoParagrafo = document.createElement("p");
    novoParagrafo.className = "erro-email";
    const erro = document.querySelector(".erro-email");
    
    if(valorCpf == ""){
        console.error("O campo de cpf está vazio");
        novoParagrafo.textContent = "O campo está vazio. Por favor, preencha com seeu cpf";
        novoParagrafo.style.Color = "red"
        cpf.style.borderColor = "red";
        cpf.before(novoParagrafo);

        cpf.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            cpf.style.borderColor = "Black";
        })
        
    }
    

})

senha.addEventListener("blur", (e) => {
    e.preventDefault();
    const valorSenha = senha.value;
    const novoParagrafo = document.createElement("p");
    novoParagrafo.className = "erro-email";
    const erro = document.querySelector(".erro-email");
    
    if(valorSenha == ""){
        console.error("O campo de senha está vazio");
        novoParagrafo.textContent = "O campo está vazio. Por favor, preencha com uma senha forte!";
        novoParagrafo.style.Color = "red"
        senha.style.borderColor = "red";
        senha.before(novoParagrafo);

        email.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            senha.style.borderColor = "Black";
        })
        
    }

})

confirmaSenha.addEventListener("blur", (e) => {
    const valorConfirmador = confirmaSenha.value;
    const valorSenha =  senha.value;
    const novoParagrafo = document.createElement("p");
    novoParagrafo.className = "erro-confirmador";
    const erro = document.querySelector(".erro-confirmador");
    if(valorConfirmador == ""){
        console.error("Campo de confirmar senha está vazio!");
        novoParagrafo.textContent = "O campo está vazio. Por favor, preenccha com a mesma senha do campo de senha!"
        novoParagrafo.style.color = "red";
        confirmaSenha.style.borderColor = "red"
        confirmaSenha.before(novoParagrafo);
        confirmaSenha.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            confirmaSenha.style.borderColor = "black";
        })
    }
    if(valorConfirmador == valorSenha){
        console.log("As senhas são iguais");
        senha.style.borderColor = "green";
        confirmaSenha.style.borderColor = "green";
    }else if(valorConfirmador !== valorSenha){
        console.error("As duas senhas são diferentes");
        senha.style.borderColor = "red";
        confirmaSenha.style.borderColor = "red";
        novoParagrafo.textContent = "Ambos os campos são diferentes. Preencha-os corretamente!";
        novoParagrafo.style.color = "red";
        senha.before();
        confirmaSenha.before();
        senha.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            senha.style.borderColor = "black";
        })
        confirmaSenha.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            confirmaSenha.style.borderColor = "black"
        })
    }
})

estado.addEventListener("blur", (e) => {
    e.preventDefault();
    const valorEstado = estado.value;
    const novoParagrafo = document.createElement("p");
    novoParagrafo.className = "erro-email";
    const erro = document.querySelector(".erro-email");
    
    if(valorEstado == ""){
        console.error("O campo de email está vazio");
        novoParagrafo.textContent = "O campo está vazio. Por favor, preencha com o nome do estado onde mora!";
        novoParagrafo.style.Color = "red"
        estado.style.borderColor = "red";
        estado.before(novoParagrafo);

        email.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            estado.style.borderColor = "Black";
        })
        
    }

})

cidade.addEventListener("blur", (e) => {
    e.preventDefault();
    const valorCidade = cidade.value;
    const novoParagrafo = document.createElement("p");
    novoParagrafo.className = "erro-email";
    const erro = document.querySelector(".erro-email");
    
    if(valorCidade == ""){
        console.error("O campo de email está vazio");
        novoParagrafo.textContent = "O campo está vazio. Por favor, preencha com o nome da sua cidade";
        novoParagrafo.style.Color = "red"
        cidade.style.borderColor = "red";
        cidade.before(novoParagrafo);

        email.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            cidade.style.borderColor = "Black";
        })
        
    }

})

bairro.addEventListener("blur", (e) => {
    e.preventDefault();
    const valorBairro = bairro.value;
    const novoParagrafo = document.createElement("p");
    novoParagrafo.className = "erro-email";
    const erro = document.querySelector(".erro-email");
    
    if(valorBairro == ""){
        console.error("O campo de email está vazio");
        novoParagrafo.textContent = "O campo está vazio. Por favor, preencha com o nome do seu bairro";
        novoParagrafo.style.Color = "red"
        bairro.style.borderColor = "red";
        bairro.before(novoParagrafo);

        email.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            bairro.style.borderColor = "Black";
        })
        
    }

})

rua.addEventListener("blur", (e) => {
    e.preventDefault();
    const valorRua = rua.value;
    const novoParagrafo = document.createElement("p");
    novoParagrafo.className = "erro-email";
    const erro = document.querySelector(".erro-email");
    
    if(valorRua == ""){
        console.error("O campo de email está vazio");
        novoParagrafo.textContent = "O campo está vazio. Por favor, preencha com o nome da sua rua";
        novoParagrafo.style.Color = "red"
        rua.style.borderColor = "red";
        rua.before(novoParagrafo);

        email.addEventListener("input", () => {
            erro.textContent = "";
            erro.remove();
            rua.style.borderColor = "Black";
        })
        
    }

})

if(!semNumero){
    numeroDaCasa.style.display = "none";
}else{
    numeroDaCasa.style.display = "block";
    numeroDaCasa.addEventListener("blur", (e) => {
        e.preventDefault();
        const valorNumeroDaCasa = numeroDaCasa.value;
        const novoParagrafo = document.createElement("p");
        novoParagrafo.className = "erro-email";
        const erro = document.querySelector(".erro-email");
        
        if(valorRua == ""){
            console.error("O campo de email está vazio");
            novoParagrafo.textContent = "O campo está vazio. Por favor, preencha com o número da sua casa!";
            novoParagrafo.style.Color = "red"
            numeroDaCasa.style.borderColor = "red";
            numeroDaCasa.before(novoParagrafo);
    
            email.addEventListener("input", () => {
                erro.textContent = "";
                erro.remove();
                numeroDaCasa.style.borderColor = "Black";
            })
            
        }
    
    })
}

btnEnviar.addEventListener("click", (e) => {
    const valorNome = nome.value;
    const valorEmail =  email.value;
    const valorCpf = cpf.value;
    const valorSenha = senha.value;
    const valorConfirmador = confirmaSenha.value;
    const valorEstado = estado.value;
    const valorCidade = cidade.value;
    const valorBairro = bairro.value;
    const valorRua = rua.value;
    if(
        valorNome !== "" &&
        valorEmail !== "" &&
        valorCpf !== "" &&
        valorSenha !== "" &&
        valorConfirmador !== "" &&
        valorEstado !== "" &&
        valorCidade !== "" &&
        valorBairro !== "" &&
        valorRua !== "" 
    ){
        if(cliente){
            window.location.href = "../Cliente/Cadastro-cliente.html";
        }
        if(empresario){
            window.location.href = "../Empresario/Cadastro-empresario.html";
        }
        if(entregador){
            window.location.href = "../Entregador/Cadastro-entregador.html";
        }
        if(vendedor){
            window.location.href = "../Vendedor/Cadastro-vendedor.html"
        }
    }
})