// Padroes em permutacoes.
//
// Uma permutacao p CONTEM o padrao s quando alguma subsequencia de p esta na
// mesma ordem relativa que s. A permutacao 31524 contem 123 (os valores 1, 2, 4
// aparecem nessa ordem) e contem 321? Nao: nenhum trio dela decresce.
//
// p EVITA s quando nao contem. A pergunta classica e quantas permutacoes de
// tamanho n evitam s — e o surpreendente e que padroes que parecem bem
// diferentes dao exatamente a mesma contagem.
//
// Permutacoes sao vetores de 0 a n-1. O padrao 1342 e escrito [0, 2, 3, 1].

/** O padrao em texto (1342) vira vetor (0,2,3,1). */
export function lePadrao (texto) {
  return [...String(texto)].map((c) => Number(c) - 1)
}

export function escrevePadrao (p) {
  return p.map((v) => v + 1).join('')
}

/** Os valores `vals` estao na mesma ordem relativa que o padrao? */
function mesmaOrdem (vals, padrao) {
  for (let i = 0; i < vals.length; i++) {
    for (let j = i + 1; j < vals.length; j++) {
      if ((vals[i] < vals[j]) !== (padrao[i] < padrao[j])) return false
    }
  }
  return true
}

/**
 * p contem o padrao? Testa todas as subsequencias do tamanho do padrao.
 *
 * E a definicao literal, cara: C(n, k) subsequencias. A busca rapida nao usa
 * isto para tudo — so para o que envolve o elemento recem-inserido.
 */
export function contem (p, padrao) {
  const k = padrao.length
  const n = p.length
  if (k > n) return false
  const idx = new Array(k)
  for (let i = 0; i < k; i++) idx[i] = i
  const vals = new Array(k)
  while (true) {
    for (let i = 0; i < k; i++) vals[i] = p[idx[i]]
    if (mesmaOrdem(vals, padrao)) return true
    let i = k - 1
    while (i >= 0 && idx[i] === n - k + i) i--
    if (i < 0) return false
    idx[i]++
    for (let j = i + 1; j < k; j++) idx[j] = idx[j - 1] + 1
  }
}

/**
 * Alguma ocorrencia do padrao usa a posicao `pos`? So isso precisa ser
 * conferido depois de inserir um elemento, porque tudo o que nao o usa ja
 * estava na permutacao menor — que evitava o padrao.
 */
export function contemUsando (p, padrao, pos) {
  const k = padrao.length
  const n = p.length
  const outros = []
  for (let i = 0; i < n; i++) if (i !== pos) outros.push(i)
  const m = outros.length
  const escolha = new Array(k - 1)
  for (let i = 0; i < k - 1; i++) escolha[i] = i
  const posicoes = new Array(k)
  const vals = new Array(k)
  if (k - 1 > m) return false
  while (true) {
    // Junta pos com os k-1 escolhidos, em ordem de posicao.
    let a = 0
    let colocou = false
    for (let i = 0; i < k; i++) {
      if (!colocou && (a >= k - 1 || outros[escolha[a]] > pos)) { posicoes[i] = pos; colocou = true } else { posicoes[i] = outros[escolha[a++]] }
    }
    for (let i = 0; i < k; i++) vals[i] = p[posicoes[i]]
    if (mesmaOrdem(vals, padrao)) return true
    let i = k - 2
    while (i >= 0 && escolha[i] === m - (k - 1) + i) i--
    if (i < 0) return false
    escolha[i]++
    for (let j = i + 1; j < k - 1; j++) escolha[j] = escolha[j - 1] + 1
  }
}

/**
 * As permutacoes que evitam o padrao, tamanho a tamanho, por geracao.
 *
 * Evitar e HEREDITARIO: apagar o maior elemento de uma permutacao que evita s
 * da outra que evita s. Entao toda evitadora de tamanho n+1 nasce de uma de
 * tamanho n com o novo maior elemento inserido em alguma posicao — e so as
 * ocorrencias que usam esse elemento precisam ser conferidas.
 *
 * Devolve as contagens de 1 a `ate`. Com `guardar`, devolve tambem as listas.
 */
export function evitadoras (padrao, ate, opcoes = {}) {
  let atual = [[0]]
  const contagens = [1]
  const listas = opcoes.guardar ? [atual] : null
  let testes = 0
  for (let n = 2; n <= ate; n++) {
    const proximo = []
    for (const p of atual) {
      for (let pos = 0; pos <= p.length; pos++) {
        const q = [...p.slice(0, pos), n - 1, ...p.slice(pos)]
        testes++
        if (!contemUsando(q, padrao, pos)) proximo.push(q)
      }
    }
    atual = proximo
    contagens.push(atual.length)
    if (listas) listas.push(atual)
  }
  return { padrao: escrevePadrao(padrao), contagens, testes, listas }
}

// ---------------------------------------------------------------------------
// As oito simetrias do quadrado agem sobre os padroes e preservam a contagem.
// ---------------------------------------------------------------------------

export function reverso (p) { return [...p].reverse() }
export function complemento (p) { const n = p.length; return p.map((v) => n - 1 - v) }
export function inversa (p) { const q = new Array(p.length); p.forEach((v, i) => { q[v] = i }); return q }

/** As ate oito imagens de um padrao pelas simetrias. */
export function imagens (p) {
  const saida = new Set()
  let atual = p
  const fila = [p]
  const vistos = new Set([escrevePadrao(p)])
  while (fila.length) {
    atual = fila.shift()
    saida.add(escrevePadrao(atual))
    for (const f of [reverso, complemento, inversa]) {
      const q = f(atual)
      const k = escrevePadrao(q)
      if (!vistos.has(k)) { vistos.add(k); fila.push(q) }
    }
  }
  return [...saida].sort()
}

/** Todas as permutacoes de 0..n-1, como copias. */
export function * permutacoes (n) {
  const a = []
  for (let i = 0; i < n; i++) a.push(i)
  yield [...a]
  // Algoritmo de Heap, iterativo.
  const c = new Array(n).fill(0)
  let i = 0
  while (i < n) {
    if (c[i] < i) {
      const j = i % 2 === 0 ? 0 : c[i]
      const t = a[j]; a[j] = a[i]; a[i] = t
      yield [...a]
      c[i]++
      i = 0
    } else {
      c[i] = 0
      i++
    }
  }
}
