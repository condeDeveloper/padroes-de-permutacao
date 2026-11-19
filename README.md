# Padrões de permutação

Permutações que evitam padrões, contadas por geração incremental, em Node puro, sem dependência nenhuma.

Uma permutação **contém** o padrão `σ` quando alguma subsequência dela está na mesma ordem relativa que `σ`. A permutação 31524 contém 123 — os valores 1, 2, 4 aparecem nessa ordem — e não contém 321, porque nenhum trio dela decresce. Ela **evita** `σ` quando não contém.

A pergunta clássica é quantas permutações de tamanho n evitam um padrão. O surpreendente é que padrões bem diferentes dão exatamente a mesma contagem — e o projeto mede **quais**.

---

## Os quatro achados

**1. Os 24 padrões de tamanho 4 dão só 3 sequências.** As simetrias do quadrado (reverso, complemento, inversa) partem os 24 em **7 classes**, e cada classe dá a mesma contagem por motivo óbvio. Mas as 7 classes colapsam em **3** sequências: 10 padrões na do 1342, 12 na do 1234 e só 2 na do 1324. Quatro colapsos não são explicados por simetria nenhuma.

**2. As três classes empatam até n=5 e se separam por um fio.** A do 1342 descola em n=6 (512 contra 513). A do 1234 e a do 1324 empatam até n=6 e se separam em **n=7 por uma permutação só**: 2.761 contra 2.762. Depois a folga cresce rápido — 26, 417, 5.360.

**3. Os seis padrões de tamanho 3 dão Catalan.** Inclusive 123 e 132, que não são imagem um do outro por simetria nenhuma. Conferido até n=11: 58.786.

**4. Quadros de Young contam o 1234 sem montar permutação.** Pela correspondência de Robinson-Schensted, evitar 1234 é ter a primeira linha do quadro com no máximo 3 caixas, e a contagem vira uma soma de quadrados de `f^λ` pela fórmula dos ganchos. Esse caminho reproduz a geração até n=10 e segue sozinho até **n=14: 1.148.208.090**, onde a geração não chega.

---

## Como a geração funciona

Evitar é **hereditário**: apagando o maior elemento de uma permutação que evita `σ`, sobra outra que evita `σ`. Então toda evitadora de tamanho n+1 nasce de uma de tamanho n com o novo maior elemento inserido em alguma posição — e só as ocorrências do padrão que **usam esse elemento** precisam ser conferidas. Tudo o mais já estava na permutação menor.

---

## As tabelas

Todos os números saem de `node ferramentas/medidor.js` e estão presos em `testes/`.

### Tamanho 4: as três sequências

| n | 1342 (10 padrões) | 1234 (12 padrões) | 1324 (2 padrões) | 1324 − 1234 |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 0 |
| 2 | 2 | 2 | 2 | 0 |
| 3 | 6 | 6 | 6 | 0 |
| 4 | 23 | 23 | 23 | 0 |
| 5 | 103 | 103 | 103 | 0 |
| 6 | **512** | 513 | 513 | 0 |
| 7 | 2.740 | **2.761** | **2.762** | **1** |
| 8 | 15.485 | 15.767 | 15.793 | 26 |
| 9 | 91.245 | 94.359 | 94.776 | 417 |
| 10 | 555.662 | 586.590 | 591.950 | 5.360 |

Classe do 1342: 1342 1423 2314 2413 2431 3124 3142 3241 4132 4213.
Classe do 1234: 1234 1243 1432 2134 2143 2341 3214 3412 3421 4123 4312 4321.
Classe do 1324: 1324 4231.

### Tamanho 3

Os seis — 123, 132, 213, 231, 312, 321 — dão 1, 2, 5, 14, 42, 132, 429, 1.430, 4.862, 16.796, 58.786.

### Evitar 1234 por quadros de Young

| n | 11 | 12 | 13 | 14 |
| --- | --- | --- | --- | --- |
| evitam 1234 | 3.763.290 | 24.792.705 | 167.078.577 | 1.148.208.090 |

---

## Os juízes

**Catalan** confere os seis padrões de tamanho 3, sem buscar nada.

**Robinson-Schensted** conta o 1234 e o 123 por um caminho que não toca em permutação nenhuma: partições, fórmula dos ganchos, soma de quadrados. E o juiz se confere a si mesmo: sem restrição de linhas, a soma de `(f^λ)²` tem de dar `n!` — e dá, de 1 a 8.

**A força bruta** testa todas as 8! = 40.320 permutações pela definição, para os quatro representantes, e concorda com a geração.

**As simetrias** dão um teste estrutural: cada padrão e suas imagens têm de dar a mesma sequência, e dão.

---

## O que as medidas me corrigiram

**Esperava sete sequências, uma por classe de simetria.** Simetria explica por que dois padrões empatam quando um é imagem do outro. Ela não explica por que 1342 e 2413 empatam, nem 1234 e 2143. Montei a tabela agrupando por classe de simetria e tive de refazer agrupando pela sequência — que é o que estava sendo perguntado.

**Achei que 1234 e 1324, tendo o mesmo tamanho e a mesma "forma crescente", fossem da mesma classe.** Empatam por seis termos. Em n=7 o 1324 passa na frente por **uma** permutação, e daí não para mais de abrir distância.

**Agrupar os 24 até n=10 levou 198 segundos.** A primeira versão da tabela fazia isso, e a suíte ficava lenta sem motivo: as três classes já se separam em n=7. O agrupamento dos 24 vai até n=8, e só as três representantes vão até 10.

**Escrevi o juiz de RSK com colunas onde eram linhas.** Evitar 1234 é ter a maior subsequência *crescente* com menos de 4 — e isso é o comprimento da primeira **linha**. A primeira versão restringia o número de linhas e contava evitar 4321 por engano. Como 1234 e 4321 estão na mesma classe, o número batia — e eu só vi o erro ao escrever o comentário explicando o porquê.

---

## Como usar

Node 20 ou mais novo. Sem dependência.

```bash
npm test
npm run medir
node ferramentas/medidor.js separacao
node exemplos/uso.js 2413 9
```

```js
import { lePadrao, evitadoras, porRSK } from 'padroes-de-permutacao'

evitadoras(lePadrao('1324'), 8).contagens  // [1, 2, 6, 23, 103, 513, 2762, 15793]
porRSK(14, 4)                              // 1148208090n
```

## Os arquivos

- `src/padroes.js` — conter, evitar, a geração incremental e as simetrias.
- `src/juiz.js` — Catalan, Robinson-Schensted pelos ganchos e a força bruta.
- `src/medidas.js` — as tabelas do README, cada uma calculada uma vez só.
- `src/index.js` — a porta de entrada do pacote.
- `exemplos/uso.js` — o pacote em uso.
- `ferramentas/medidor.js` — imprime as tabelas.
- `testes/` — 28 testes, com os números do README presos.

## Licença

MIT.
