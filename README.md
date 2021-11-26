# PA6-Web-grupo-kappa

## Guia de instalação do projeto
Para instalação do projeto, segue o guia. 
<br>
Caso não tenha Nodejs instale.
Link para download do Nodejs (instalar a versão LTS)
- ```https://nodejs.org/en/download/ ```

Clonar o repositorio do projeto.
- ```git clone https://github.com/josermca01/PA6-Web-grupo-kappa.git ```

Tendo feito a clonagem abra o Vscode na pasta PA6-Web-grupo-kappa

Com a pasta aberta no Vscode abrir um novo terminal e executar o seguinte comando
- ```npm run dev```

Feito isso o servidor do jogo irá abrir na porta localhost:3000
<br>


## Acessando o multiplayer 

Após entrar em localhost:3000 existirá 2 modos de jogo:

- SinglePlayer
- Multiplayer

O modo SinglePlayer é possivel jogar contra o computador que jogar de forma aleatória

O modo Multiplayer é possivel jogar contra outro jogador, o qual possue capacidade maxima de 2 jogadores, assim fazendo com que um terceiro jogador tenha que esperar algum dos 2 sair da sala


## Descrição do projeto

Ao todo o jogo dispõe de quatro grades quadriculadas, duas para cada jogador. Em uma
grade deverá ser registrado os tiros que o jogador dá ao adversário (grade de ataque) e em
outra deverá posicionar sua frota de navios e os tiros que recebe do oponente (grade de
defesa).


Antes de cada combate o jogador deverá organizar secretamente sua frota na grade de
defesa e mantê-la em segredo até que o jogo se encerre; os navios não podem se sobrepor
e deverão estar dispostos somente na horizontal ou vertical, de forma que os navios não se
toquem. A quantidade de navios e espaços que cada um ocupa varia de versão para versão,
e a ser utilizada neste projeto será:


- 1 Porta-aviões com 5 quadrados
- 1 Navio de combate com 4 quadrados
- 1 Cruzador com 3 quadrados
- 1 Submarino com 3 quadrados
- 1 Destroyer com 2 quadrados


Depois de posicionado os navios de ambos jogadores, começará o jogo em uma sequência
de rodadas, com cada jogador revezando para anunciar seu ataque em coordenadas da grade
de seu oponente. Após anunciar um ataque, o jogador que o recebeu deverá responder como
"Fogo"caso o ataque acerte um de seus navios, marcando na grade de defesa onde está situado
seus navios um "X"acima do quadrado atacado assim como o atacante deverá marcar na grade
de ataque; ou "Água"para um acerto em um quadrado vazio, fazendo um risco na grade de
ataque do atacante e um risco na grade de defesa do defensor. Quando todos os quadrados
de um navio forem atingidos, o jogador que teve seu navio afundado deverá anunciar qual
deles foi abatido; o jogo termina com o último navio de um dos jogadores sendo afundado,
sendo vitorioso o jogador que conseguir afundar toda a frota de seu oponente primeiro.


## Tecnologias utilizadas


Para o desenvolvimento de uma aplicação com multi-telas e multi-usuários em uma única
instância, será utilizado uma biblioteca de JavaScript para gerenciar sessões bidirecionais
chamada Sockets.IO. Esta é utilizada para aplicações Web em tempo real e com ela iremos
garantir uma comunicação entre cliente-servidor/servidor-cliente.
Para o lado do cliente estaremos utilizando tecnologias como:


- HTML, HiperText Markup Language, uma linguagem de marcação responsável por
estruturar textos, documentos eletrônicos e páginas Web
- CSS, Cascading Style Sheets, uma outra lingaguem de marcação que dá forma, formato
e cor às páginas Web, criada pela World Wide Web Consortium em 1996 como um padrão e
funcionando em conjunto com o HTML (alicerce), o CSS é como uma estética para o site.
- JS, JavaScript, uma lingaguem de programação de alto-nível que permite em uma página
Web o controle de animações e dados com a intenção de deixar o site mais interativo e
dinâmico.


Para o lado do servidor utilizaremos:


- Node.js, um ambiente de execução em JavaScript voltada ao lado de servidor.


### Tecnologias ainda não implementadas:

- Node.js

- Sockts.io
