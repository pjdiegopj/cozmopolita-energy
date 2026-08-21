# Cozmopolita Energy

Projeto simples de visualização de preços de energia elétrica por cidade no Brasil usando Leaflet.

## Visão geral

- Página única em `index.html` com mapa interativo.
- Lista de cidades pesquisável e marcadores no mapa.
- Cada marcador exibe o preço do kWh e o custo estimado para carregar um carro (consumo fixo de 60 kWh).
- Estilos em `style.css`.

## Tecnologias usadas

- HTML
- CSS
- JavaScript puro
- Leaflet.js para mapa interativo
- OpenStreetMap como camada de mapa

## Como usar

1. Abra `index.html` em um navegador.
2. Use a lista de cidades para localizar um município no mapa.
3. Clique em uma cidade para abrir o pop-up com o preço do kWh e o custo estimado.
4. No celular, use o botão de busca para abrir/fechar o painel de cidades.

## Estrutura do projeto

- `index.html` - marcação, dados das cidades e lógica do mapa
- `style.css` - estilos da interface
- `scripts/fetch-tarifas.js` - busca e consolida as tarifas residenciais B1 da ANEEL
- `mapa/dados-tarifas.json` - dados gerados automaticamente no build

## Observações

- `mapa/precos.json` continua sendo a fonte das cidades e coordenadas.
- As tarifas são atualizadas por distribuidora/município a partir dos dados abertos da ANEEL; o valor anterior é usado como fallback se uma distribuidora não for encontrada.

## Requisitos

- Acesso à internet para carregar a biblioteca Leaflet (`unpkg.com`) e os tiles do OpenStreetMap.

## Melhorias possíveis

- Carregar os preços de um arquivo JSON ou API externa.
- Atualizar os dados de preços dinamicamente.
- Adicionar filtros por estado ou faixa de preço.
- Exibir informações adicionais de energia limpa ou consumo médio.
- Adicionar possibilidade de deslocamento via GPS para locais com energia mais barata.
