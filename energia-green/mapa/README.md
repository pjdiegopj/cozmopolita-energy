# Energia Green

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

## Observações

- Os preços são definidos diretamente no objeto `precos` dentro de `index.html`.
- A maioria dos valores está atualmente em `R$ 0.00`; apenas alguns têm valores preenchidos.
- Para atualizar preços ou adicionar cidades, envie e-mail para `dgojdm@gmail.com`.

## Requisitos

- Acesso à internet para carregar a biblioteca Leaflet (`unpkg.com`) e os tiles do OpenStreetMap.

## Melhorias possíveis

- Carregar os preços de um arquivo JSON ou API externa.
- Atualizar os dados de preços dinamicamente.
- Adicionar filtros por estado ou faixa de preço.
- Exibir informações adicionais de energia limpa ou consumo médio.
- Adicionar possibilidade de deslocamento via GPS para locais com energia mais barata.
