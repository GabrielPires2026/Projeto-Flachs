## Início do repositório - Projeto FLACH'S

## 24 de outubro de 2026:

### O que foi feito:
    Hoje, foi criado um repositório vazio com o nome Projeto-Flachs, no Github, com a proposta inicial de guardar o código-fonte do nosso Projeto Interdisciplinar.
    O que inclui um arquivo [README.md](https://github.com/GabrielPires2026/Projeto-Flachs/blob/main/README.md) e o .gitignore: o primeiro, para explicar o objetivo
    e os padrões do projeto e; o segundo, para garantir que  arquivos sensiveis de configuração não sejam enviados ao repositório.
    **O primeiro commit** foi no próprio site do Github após terminar de escrever o README.md. Foi feito um commit de teste após escrever dois tópicos iniciais de forma 
    genérica, os quais seriam abordados em um momento posterior. O foco inicial, nesse dia, era apenas a criação do repositório vazio.
## 29 de outubro de 2026:

### O que foi feito:
    Hoje foi adicionado um arquivo [.gitignore](https://github.com/GabrielPires2026/Projeto-Flachs/blob/main/.gitignore) ao repositório para que fossem inseridas algumas
    regras gerais para impedir que o Git/Github informasse esses arquivos no status. De innício, as primeiras regras que foram postas serviam para ignorar os arquivos biná-
    rios **.exe**, da pasta **.vscode**, da pasta **node_modules** e arquivos **.env**. Depois, foi criada a pasta [Prototipos](https://github.com/GabrielPires2026/Projeto-Flachs/tree/main/Prototipos) que contém o arquivo **main.js** onde serão escritos codigos respectívos ao funcionamento do software e o arquivo **package.json*
    que permite ao Node.js enxergar a subpasta do projeto.
    Deu-se início ao código, fazendo as primeiras importações de bibliotecas necessárisas para o funcionamento do código. Dentre essas, a biblioteca "readline" era responsá-
    vel pela entrada e saida de dados no codigo, permitindo ao usuario interagir com o sistema e, ao mesmo tempo, permitindo ao sistema tratar as informações de acordo com 
    regras premeditadas. 


    ```js
    import readline from 'node:readline/promises';
    import { stdin as input, stdout as output } from 'node:process';
    ```

    Após importarmos essa biblioteca, definimos uma variavel `js const rl` que recebe a interface de entrada/saída da biblioteca:

    ```js
    const rl = readline.createInterface({input, output});
    ```

    Depois de feitas as primeiras definicoes, o código começou a ser escrito de maneira a criar as primeiras exibições no terminal. Nesse caso, a sintáxe de Node.js para Javascript não muda em nada. Para imprimirmos na tela, simplesmente usamos `js console.log()`
    (o parâmetro recebe uma string) e `js console.clear()`para limpar a tela do terminal:

    ```js
    console.log("==================================");
    console.log("SEJA BEM VINDO AO PROJETO FLACH'S");
    console.log("===================================");
    console.log("Por favor escolha entre as opções disponiveis para prosseguir!");
    console.log("\n");
    console.log("Obs: para escolher uma opção, digite um dos nomes a seguir: ");
    console.log("Digite: 'Cadastro' para cadastrar um novo usuário ou digite: 'login' para acessar um usuário ja existente");
    const formaDeAcesso = rl.question("Por favor, escolha uma forma de entrat na plataform");
    ```

    É nesse momento que nos deparamos com o primeiro erro, que acontece logo após as linhas de "console.log()", na primera constante 
    logo após a exibição. A variável `js const formaDeAcesso = rl.question("Por favor, escolha uma forma de entrat na plataform")` estava escrita  de modo sincrono, como qualquer metodo declarado nas primeiras linhas de codigo deveria ser escrito, mas o trecho em si, muito provavelmente, seria executado como uma função assincrona, causando um problema no código. A palávra reservada  `js await` não era do conhecimento geral e o uso desse termo fora negligenciado pela ausência desse conhecimento.
    Logo após esse trecho se seguiriam uma sequência de `js if...else` que validam o fluxo do código de acordo com a resposta do usuário. O que significa que a interface anterior desaparece e uma interface diferente é exibida de acordo com a opção escolhida pelo usuário.
    O condicional, que valida se o usuário digitou: "Login", foi escrito pela metade. E o seu oposto nem chegou a ser escrito, pois, antes mesmo de continuar a escrever essa parte, havia a necessidade de testar a exibição das primeiras linhas de código. Por se tratar de uma forma de escrever código diferente, fazer isso seria fundamental antes de qualquer coisa.
    A partir disso, nos deparamos com o primeiro problema: o instalador de pacotes "npm" exigia uma série de paços a serem seguidos antes mesmo de o código ser escrito. 
    
    
    ```ps
        npm init -y
    ```

    Esse comando cria um arquivo .json responsável por configuar o ambiente de módulos importados no código Javascript, esses módulos são armazenados na pasta node_modules, que precisa ser ignorada pelo Github por se tratar de um arquivo de configuração. Em contrapartida, a primeira versão do json precisa ir para o repositório para que, se um terceiro instalar o projeto, o mesmo projeto não venha incompleto.
    O arquivo gerado tem as seguintes especificações:

    ```json
        {
    "name": "meu-repositorio-socioeconomico",
    "version": "1.0.0",
    "type": "module",
    "description": "Registro socioeconomico com provas em audio",
    "main": "index.js",
    "scripts": {
        "start": "node index.js"
         }
    }
EOF
    ```

    O package.json foi gerado por IA. Como se pode ver, algumas especificações do json estão incorretas em relação ao arquivo javascript que hospeda o codigo fonte. Tirando a definição ``json "type": "module"``, o resto das propriedades apontava para o nome genérico de um arquivo Javascript inexistente no repositório e a palávra "EOF" estava ali sem nenhuma utilidade aparente.
    A correção dessas propriedades foi feita, pondo a destinação correta em cada definição:

    ```json
    {
    "name": "projeto-flachs",
    "version": "1.0.0",
    "type": "module",
    "description": "Registro socioeconomico com provas em audio",
    "main": "main.js",
    "scripts": {
        "start": "node main.js"
        }
    }
    ```

    Ainda faltava a descrição, mas esse detalhe era menos importante no momento. Em seguida, deveria se testar a fim de ver se o problema havia side resolvido. No terminal usufruimos do comando `ps npm start`. Dessa vez, outro problema aparece de modo a ter que reccorer, mais uma vez, à IA para tentar traduzir a seguinte linha:

    ```ps
    npm error code EJSONPARSE
    npm error JSON.parse Invalid package.json: JSONParseError: Unexpected non-whitespace character after JSON at position 10 (line 2 column 9) while parsing near "\r\n  \"name\": \"projeto-flachs\",\r..."
    npm error JSON.parse Failed to parse JSON data.
    npm error JSON.parse Note: package.json must be actual JSON, not just JavaScript.
    npm error A complete log of this run can be found in: C:\Users\Gabriel Pires\AppData\Local\npm-cache\_logs\2026-10-29T13_15_20_257Z-debug-0.log

    ```

    De acordo com a IA, esse erro tem alguma coisa haver com o encode do arquivo e sugeriu apagar o arquivo package.jsnon pelo terminal do Powershell:

    ```powershell
    Remove-Item package.json -Force
    ```

    Sugerindo, em seguida, a estrutura:


    ```json
    @'
{
  "name": "projeto-flachs",
  "version": "1.0.0",
  "type": "module",
  "description": "Registro socioeconomico com provas em audio",
  "main": "main.js",
  "scripts": {
    "start": "node main.js"
  }
}

    ```
    E, por fim, a criação de um novo arquivo usando o comando:

    ```powershell
    '@ | Set-Content -Path package.json -Encoding utf8
    ```

    Por fim, usamos, de novo, o comando `powershell npm start`e o erro foi resolvido. No entando, outro erro fora desencadeado pela sugestão da própria IA na estrutura do json, a mesma percebeu uma chave sobrando na estrutura do json e sugeriu a estrutura anterior

    ```json
    {
  "name": "projeto-flachs",
  "version": "1.0.0",
  "type": "module",
  "description": "Registro socioeconomico com provas em audio",
  "main": "main.js",
  "scripts": {
    "start": "node main.js"
  }
}

    ```

    Tentou-se compilar o código novamente no terminal do Powershell, mas outro erro fora exibido em seguida:

    ```ps
    npm error Missing script: "start"
    npm error
    npm error Did you mean one of these?
    npm error   npm star # Mark your favorite packages
    npm error   npm stars # View packages marked as favorites
    npm error
    npm error To see a list of scripts, run:
    npm error   npm run
    npm error A complete log of this run can be found in: C:\Users\Gabriel Pires\AppData\Local\npm-cache\_logs\2026-10-29T13_20_04_798Z-debug-0.log

    ```

    Porém, dessa o erro era apenas a persistência do erro anterior, visto que o arquivo não havia sido salvo depois das alterações sugeridas. Ainda sim, houve mais sugestões de passos a serem seguidos. Primeiro, deveriamos confirmar via linha de comando se estava tudo bem e se poderiamos prosseguir.

    ```powershell
    #alteram propriedades do json
    npm pkg set type="module"
    npm pkg set main="main.js"
    npm pkg set scripts.start="node main.js"
    npm pkg set name="projeto-flachs"
    #Execução dos arquivos
    npm run
    npm start

    ```

    Não houve necessidade de usar os comandos listados. Houve progresso. 

## 04 de novembro de 2026:

### O que foi feito:

    Olhando o estado atual do codigo, estava previsivel que aquilo poderia se tornar uma bagunça de ifs empilhados:
    Diante disso, supondo que o código ficaria menos legivel se continuasse a ser construido sobre uma pilha de if e else, resolve-se mudar o paradigma do programa. A ideia é construir os objetos para que, no final, apenas possam ser chamados em suas respectivas operações com o intuito de deixar o código mais limpo. Nesse momento também surge a ideia de construir um codigo que consiga manter a permanência das informações, o que permitiria que usuarios logados pudessem acessar o sistema sem perder as informações de que dispunham em compilações anteriores. Para isso, seria necessário usar a bibliotéca "fs" do Node.js. 
    Ainda havia a necessidade de construir as classes. Então, se definiu apenas a estrutura inicial das mesmas sem propriedades e sem construtores no primeiro momento, pois ainda era necessário pensar nas regras de negócio e nos requisitos do projeto em questão. Não demorou muito para isso acontecer. A classe de Usuario foi a primeira adicionada ao código.
    Isso se explica porque os objetos precisam compartilhar algo em comum, no sentido que todos os perfis são categorias de usuário, logo, todo perfil desde cliente a entregador herda as características de Usuário, o que a torna uma classe abstrata. No Javascript não existe uma  palavra reservada `ts abstract` para definir uma classe abstrata, portanto, podemos apenas não usá-la em detrimento de usar a classe do perfil de usuário.
    A construção da classe Usuario seria algo assim:

    ```js
    class Usuario{
        #_nome;
        #_idade;
        #_cpf;
        #_saldo;
        #_perfil;


        constructor(nome, idade, cpf, saldo, perfil){
            this.#_nome = nome;
            this.#_idade = idade;
            this.#_cpf = cpf;
            this.#_saldo =  saldo;
            this.#_perfil = perfil;
        }
    }
    ```

    *O código pode estar diferente do que o Github exibe em seu blame, mas o raciocínio não muda*
    Toda classe tem tres ou quatro coisas principais que devem existir na sua definição. A primeira delas é o encapsulamento das suas propriedades, a segunda são os construtores e a terceira são os métodos acessores. As propriedades da classe Usuario podem ser encapsuladas ou como privadas, ou como publicas; a diferença de um para o outro é que as propriedades publicas podem ser livremente modificadas por outras classes ou em outras situações, as propriedades privadas só podem ser midificadas prla propria classe e não existe exceção nem para as classes que herdam da classe Usuario. Nesse momento, os metodos acessores entram em ação, pois são responsáveis por retornar os valores de cada propriedade e ainda é por meio desses métodos que as propriedades podem ser modificadas quando necessário. O terceiro fator é o mais importante, são os construtores que permitem com que as informações sejam recebidas pela classe quando ela é instanciada. 
    Para que ocorra a instância de uma classe, usamos a palavra reservada `js new` seguida do nome da classe entre parênteses. Dentro desses parênteses vão os parâmetros da classe, e esses parâmetros são recebidos pelas propriedades da classe e é por meio disso que é possivel manipular as informações. O quarto fato já foi dito aqui e se refere a existência ou inexistência de herança entre uma classe e outra de modo que exista uma hierarquia etre a classe pai e a classe filho. 
    Usuario é pai das classes Cliente, Entregador, Vendedor e Empresario.
    Ou melhor, a superclasse Usuario possui as subclasses Cliente, Entregador, Vendedor e Empresário.
    Os metodos acessores são chamados de getters/setters e, no Javascript, esses metodos são sempre antecedidos da palávra chave `js get` ou `js set`. A diferença de um para outro, no código, fica ituitiva na palavra chave, mas, talvez, não na estrutura. Em primeiro lugar, todo get retorna algum valor que foi inicialmente definido na instãncia de uma classe ou retorna o mesmo valor quando for alterado por outro método. A estrutura do seu código fica assim:

    ```js
    class Usuario{
        get nome(){
            return this,#_nome;
        }
    }
    ```
    Os setters são o contrário de um getter. Eles possuem, por via de regra, um parâmetro ou vários que permitem a uma informação ser hospedada e manipulado pelo método, que irá retornar esse mesmo parâmetro após manipulá-lo. A estrutura do seu código fica assim:

    ```js
    class Usuario{
        set nome(novoNome){
            this.#_nome = novoNome;
            return this.#_nome;
        }
    }
    ```

    Todas as classes podem seguir esse raciocinio, mas isso não é obrigatório. Os setters podem ser substituidos por outros métodos, desde que isso faça sentido e esteja de acordo com as regras de negócio do projeto. Por exemplo, todas as subclasses de Usuario não necessitam de um gatter para alterar seu saldo, pois os valores iniciais podem ser definidos na instância da subclasse; para valores como nome, idade e cpf, isso fica mais evidente ainda.
    Portanto, o código ficaria assim:

    ```js
     class Usuario{
        #_nome;
        #_idade;
        #_cpf;
        #_saldo;
        #_perfil;


        constructor(nome, idade, cpf, saldo, perfil){
            this.#_nome = nome;
            this.#_idade = idade;
            this.#_cpf = cpf;
            this.#_saldo =  saldo;
            this.#_perfil = perfil;
        }
        get nome(){
            return this.#_nome;
        }
        get idade(){
            return this.#_idade;
        }
        get cpf(){
            return this.#_saldo;
        }
        get saldo(){
            return this.#_saldo;
        }
    }

    class Cliente extends Usuario{
        #_produtoRecebido;
        #_pedidos;

        constructor(nome, idade, cpf, saldo, perfil, produtosRecebidos = 0, pedidos = 0){
            super(nome, idade, cpf, saldo, "cliente");
            this.#_produtoRecebido = produtosRecebidos;
            this.#_pedidos = pedidos;
        }
        get produtoRecebido(){
            return this.produtoRecebido;
        }
        get pedido(){
            return this.#_pedido;
        }
    }
    class Entregador extends Usuario{
        #_pedidos;
        #_statusPedido;
        #_entregas;
        #_statusEntrega;

        constructor((nome, idade, cpf, saldo, perfil, pedido = 0, statusPedido = "Pedido nao encontrado", entregas = 0, statusEntrega = "sem entrega"){
            super(nome, idade, cpf, saldo, "Entregador");
            this.#_pedido = pedidos;
            this.#_statusPedido = statusPedido;
            this.#_entregas = entrega;
            this.#_statusEntrega = statusEntrega;
        }

        get pedido(){
            return this.#_pedido;
        }
        get statusPedido(){
            return this.#_statusPedido;
        }
        get entrega(){
            return this.#_entrega;
        }
        get statusEntrega(){
            return this.#_statusEntrega;
        }
    }

    class Empresario extends Usuario{
        #_cnpj;
        #_nomeEmpresa;
        #_saldoEmpresa;
        #_produtos;
        #_servicosFornecido;
        #_funcionarios;

        constructor(nome, idade, cpf, saldo, perfil, cnpj, nomeEmpresa, saldoEmpresa = 0){
            super(nome, idade, cpf, saldo, perfil);
            this.#_cnpj = cnpj;
            this.#_nomeEmpresa = nomeEmpresa;
            this.#_saldoEmpresa = saldoEmpresa;
            this.produtos = []
            this.#_servicosFornecidos = []
            this.#_funcionarios = []
        }
        get cnpj(){
            return this.#_cnpj;
        }
        get nomeEmpresa(){
            return this.#_nomeEmpresa;
        }
        get saldoEmpresa(){
            return this.#_saldoEmpresa.
        }
        get produutos(){
            return this.#_produtos;
        }
        get servicosFornecidos(){
            return this.#_servcosFornecidos;
        }
        get fncionarios(){
            return this.#_funcionarios;
        }
    }

    class vendedor extends Usuario{
        #_vendas;
        #_statusVendas;
        #_entregadoresContratados;
        constructor(nome, idade, cpf, saldo, perfil, vendas = 0, statusVendas = undefined, entregadoresContratados = 0){
            super(nome, idade, cpf, saldo, perfil);
            this.#_vendas = vendas;
            this.#_statusVendas = statusVendas;
            this.#_entregadoresContratados = entregadoresContratados;

        }

        get vendas(){
            return this.#_vendas;
        }
        get statusVendas(){
            return this.#_statusVendas;
        }
        get entregadoresContratados(){
            return this.#_entregadoresContratados;
        }
    }
    ```
    Cada classe tem uma característica em comum e várias características distintas. Como já foi dito aqui, todas herdam da classe Usuário, mas cada uma tem sua particularidade que depende de qual regra de negócio e requisitos o perfil vai seguir. O perfil de Cliente recebe esse nome porque ele é cliente da FLACH's e cliente dos entregadores e empresários (isso inclui vendedor); em suma, ele recebe os serviços/produtos desses dois perfils e pode solicitar a esses eles. individualmente ou em conjunto, os seus respectivos serviços de forma livre e de acordo com as necessidades dele. 
    As principais propriedades dessa classe são os produtos recebidos e o pedido. A primeira serve para indicar a conclusão de um determinado serviço ou da entrega de um determinado produto e pode ser usado para validar a ação das outras duas classes. Uma abordagem interessante para que isso aconteça poderia surgir do ato dessa propriedade receber um array de objetos contendo as características do produto/serviço. Assim, a classe pode manipular essa informação seguindo as regras de negócios propostas para o perfil de um cliente. Da mesma forma, um pedido pode ser tanto um array de objetos com as características do pedido assim como pode ser apenas um array com os nomes dos pedidos. Seja qual for a abordagem (um array simples apenas com os pedidos ou um array detalhado em que cada pedido é um objeto com suas particularidades), esse array precisa possuir um status inerente a ele para que sua situação possa ser validada
    *Isso é interessante*. As três classes também vão possuir uma propriedade em comum, a prorpiedade de pedido. Só que essa propriedade pode receber vários nomes e várias formas. Em alguns casos ela não seria diretamente uma propriedade da própria classe, mas um componente de um objeto recebido por ela. 
    É o caso da classe Empresário e Vendedor, ambas não precisariam ter um pedido como característica pricipal, pois esse pedido é apenas uma informação necessária ao gerenciamento das vendas e dos serviços. Quem tem que lhe dar diretamente com os pedidos são os entregadores, pois eles necessitam saber disso para prosseguir com os serviços que fornecem. 
    A classe Entregador possui as propriedades: pedido, status do pedido; entrega e status da entrega. Isso para fins de apresentação. Um entregador pode possuir mais que esssas propriedades e elas são inerentes à classe exceto se, hipotéticamente, tratarmos de propriedades de interação com as páginas, como divulgar serviços, aceitar serviços, recusar serviços, entre outros que fazem parte de uma categoria separada a qual todos os perfís precisam ter acesso para que exista uma interação entre eles assim como para que haja um funcionamento ou o cumprimento de uma regra de negócio.
    Além disso, os entregadores tem que compartilhar ativamente o status do pedido e o status da entrega para o cliente e para o empresário ou vendedor, isso faz com que haja a necessidade de essa propriedade estar dentro da classe Entregador para que não exista uma burocracia. Imaginando o cenário onde essapropriedade é inerente a duas classes distintas: Empresa ou Loja. Toda a vez que o entregador precisar fazer uma entrega, ele terá que requerer a uma dessas duas classes para que seja possivel fazer a entrega. Ao colocarmos essas propriedades na classe entregador, o contrário acoteceria. Os empresários e os vendedores precisariam requerer ao entregador para que ele apenas precise realizar o serviço.
    Claro que isso não impede que o cenário anterior exista, pois estamos falando de um cenário de entregadores autônomos e empresas buscando mão de obra. É essa relação que cria as interações entre eles, pois ao agir em comum dos seus interesses, acaba que, em algum momento, existirá interceção desses interesses. A partir disso todos agem em comum, pois seus interesses tem algo em comum.
    As classes Vendedor e Empresário são a mesma categoria sendo dividida ao meio. Enquanto os empresários — em geral, donos de grandes empresas — se submetem a controlar uma grande cadeia de processos, ocupando uma opção passiva, mas fundamental, de quem administra no papel; os vendedores são microempresas ambulantes que se submetem — não apenas a administrar processos — a fazer o processo acontecer, sendo ativos em sua execução.
    O empresário possui o cnpj, o nome da empresa, o saldo da empresa, os produtos, serviços fornecidos e os funcionários. A função de cada propriedade já é intuitiva nos nomes de propósito para que possa ser consolidado o raciocínio na construção do código de cada propriedáde. Dispensamos, então, as manipulações acerca do cnpj, pois ele é um cadástro físico. Enquanto o nome da empresa, o saldo da empresa, os peodutos, serviços fornecidos e a lista dos funcionários podem ser alterádos seguindo a mesma lógica de uma empresa.
    Porém, o saldo da empresa exige um pouco mais  de cuidado. O saldo da empresa é inerente apenas a receita e submisso às despesas e às operações da empresa, não compondo o saldo do empresário para que não hajam situações em que, diante de uma operação financeira, use-se o saldo do empresário para efetuar a operação e o inverso também acontece. 
     