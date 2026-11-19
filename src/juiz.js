// O juiz. Caminhos que nao passam pela geracao incremental.
//
// 1. `catalan` — todo padrao de tamanho 3 e evitado por exatamente C(n)
//    permutacoes. Uma conta fechada.
//
// 2. `porRSK` — a correspondencia de Robinson-Schensted leva cada permutacao a
//    um par de quadros de Young de mesmo formato, e o tamanho da maior
//    subsequencia crescente e o comprimento da primeira linha do formato. Evitar
//    1234 e nao ter subsequencia crescente de tamanho 4, ou seja, formato com
//    no maximo 3 colunas... mais exatamente: primeira linha com no maximo 3
//    caixas. Entao a contagem e a soma de (f^lambda)^2 sobre as particoes de n
//    com partes de no maximo 3 — e f^lambda sai da formula dos ganchos. Nao ha
//    busca nem permutacao nenhuma nesse caminho.
//
// 3. `forcaBruta` — todas as n! permutacoes, cada uma testada pela definicao.
//    Ate n = 8.

import { contem, permutacoes } from './padroes.js'

/** Os numeros de Catalan, C(0) = 1. */
export function catalan (n) {
  let c = 1n
  for (let i = 0; i < n; i++) c = c * 2n * (2n * BigInt(i) + 1n) / (BigInt(i) + 2n)
  return c
}

function fatorial (k) {
  let r = 1n
  for (let i = 2n; i <= BigInt(k); i++) r *= i
  return r
}

/** As particoes de n com partes de tamanho no maximo `teto`, como vetores. */
export function particoes (n, teto) {
  const saida = []
  const anda = (resto, maximo, atual) => {
    if (resto === 0) { saida.push([...atual]); return }
    for (let p = Math.min(resto, maximo); p >= 1; p--) {
      atual.push(p)
      anda(resto - p, p, atual)
      atual.pop()
    }
  }
  anda(n, teto, [])
  return saida
}

/** f^lambda pela formula dos ganchos: n! dividido pelo produto dos ganchos. */
export function porGanchos (lambda) {
  const n = lambda.reduce((s, v) => s + v, 0)
  const colunas = []
  for (let j = 0; j < lambda[0]; j++) colunas.push(lambda.filter((v) => v > j).length)
  let produto = 1n
  for (let i = 0; i < lambda.length; i++) {
    for (let j = 0; j < lambda[i]; j++) {
      const braco = lambda[i] - j - 1
      const perna = colunas[j] - i - 1
      produto *= BigInt(braco + perna + 1)
    }
  }
  return fatorial(n) / produto
}

/**
 * Quantas permutacoes de tamanho n evitam 12...k, por RSK.
 *
 * A maior subsequencia crescente tem tamanho = primeira linha do formato. Evitar
 * 12...k e ter a primeira linha com menos de k caixas: particoes com partes de
 * tamanho no maximo k-1, lidas como LINHAS.
 */
export function porRSK (n, k) {
  let total = 0n
  for (const lambda of particoes(n, k - 1)) {
    const f = porGanchos(lambda)
    total += f * f
  }
  return total
}

/** Todas as n! permutacoes, testadas uma a uma pela definicao. */
export function forcaBruta (padrao, n) {
  let evitam = 0
  let testadas = 0
  for (const p of permutacoes(n)) {
    testadas++
    if (!contem(p, padrao)) evitam++
  }
  return { evitam, testadas }
}
