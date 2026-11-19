import test from 'node:test'
import assert from 'node:assert/strict'

import { lePadrao, evitadoras } from '../src/padroes.js'
import { catalan, particoes, porGanchos, porRSK, forcaBruta } from '../src/juiz.js'

test('Catalan: 1, 2, 5, 14, 42, 132', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(catalan), [1n, 2n, 5n, 14n, 42n, 132n])
})

test('particoes de 5 com partes ate 2: 221, 2111, 11111', () => {
  assert.deepEqual(particoes(5, 2), [[2, 2, 1], [2, 1, 1, 1], [1, 1, 1, 1, 1]])
})

test('formula dos ganchos: f^(2,1) = 2, f^(3,2) = 5, f^(n) = 1', () => {
  assert.equal(porGanchos([2, 1]), 2n)
  assert.equal(porGanchos([3, 2]), 5n)
  assert.equal(porGanchos([4]), 1n)
})

test('a soma de (f^lambda)^2 sobre TODAS as particoes e n!', () => {
  // E a identidade de RSK sem restricao: cada permutacao vira um par de quadros.
  for (let n = 1; n <= 8; n++) {
    let soma = 0n
    for (const l of particoes(n, n)) soma += porGanchos(l) ** 2n
    let fat = 1n
    for (let i = 2n; i <= BigInt(n); i++) fat *= i
    assert.equal(soma, fat, `n=${n}`)
  }
})

test('RSK para 12...k bate com a geracao, em 123 e 1234', () => {
  const g3 = evitadoras(lePadrao('123'), 10).contagens
  const g4 = evitadoras(lePadrao('1234'), 9).contagens
  for (let n = 1; n <= 10; n++) assert.equal(porRSK(n, 3), BigInt(g3[n - 1]), `123 n=${n}`)
  for (let n = 1; n <= 9; n++) assert.equal(porRSK(n, 4), BigInt(g4[n - 1]), `1234 n=${n}`)
})

test('RSK para 123 da Catalan', () => {
  for (let n = 1; n <= 12; n++) assert.equal(porRSK(n, 3), catalan(n), `n=${n}`)
})

test('a forca bruta concorda com a geracao em n=7', () => {
  for (const s of ['123', '1342', '1324']) {
    const b = forcaBruta(lePadrao(s), 7)
    assert.equal(b.testadas, 5040)
    assert.equal(b.evitam, evitadoras(lePadrao(s), 7).contagens[6], s)
  }
})
