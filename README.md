# OndeGastei

  Controle de Gastos feito usando-se MEAN - MongoDB, Express, Angular e NodeJS, a construção do app surgiu da minha 
necessidade de controlar o dinheiro que eu sacava do banco, nunca sabia para onde este dinheiro estava indo, e sempre achei chato
as app's de controle de finanças disponíveis no mercado poís achava o processo de lançar gastos muito demorado, eu queria algo que
fosse bem rápido pra lançar, hoje venho usando essa app no meu dia a dia e está sendo bem utíl pra ter uma visualisação de onde meu dinheiro
está sendo gasto.

Por ser um aplicativo sem grandes complexibilidades creio que seja um ótimo ponto de partida para quem esteja querendo utilizar estas tecnologias, tenho
uma arquitetura simples mas com tudo nescessário para iniciar um app, desde um API Rest feito com NodeJS, persistindo em uma database MongoDB, até o uso de
autenticação por json web token usando AngularJS. Então se estiver estudando ou querendo controlar seus gastos vale a pena dar uma olhada

build and run

$ docker-compose up -d


## Arquitetura
 
 - API\ - Serviço NodeJS para a API REST de comunicação com o banco de 
	 - Database.js - Schema do banco de dados, utilizando o plugin Mongoose.
	 -  Repositorie.js - Arquivo que configura as rotas da API REST e faz a persistência com o banco de dados.
	 - SrvOndeGastei.js - Arquivo principal do Serviço em NodeJS.
 - APP\ -  Aplicação Single Page feita com AngularJS
	 - app.js - arquivo principal do AngularJS com a configuração dos controles 
	 -  controllers\ - Controles javascript
 - assets\ - Conteúdo de js e css
 - templates\ - Templates HTML (View), para uso combinado com os controles
 - Index.html - Arquivo principal do WebSite/APP


enjoy :-)
