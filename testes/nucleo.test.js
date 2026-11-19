import test from 'node:test'
import assert from 'node:assert/strict'

import {
  lePadrao, escrevePadrao, contem, contemUsando, evitadoras,
  reverso, complemento, inversa, imagens, permutacoes
} from '../src/padroes.js'

test('ler e escrever padrao sao inversos', () => {
  assert.deepEqual(lePadrao('1342'), [0, 2, 3, 1])
  assert.equal(escrevePadrao([0, 2, 3, 1]), '1342')
})

test('31524 contem 123 e nao contem 321', () => {
  const p = [2, 0, 4, 1, 3]
  assert.equal(contem(p, lePadrao('123')), true)
  assert.equal(contem(p, lePadrao('321')), false)
})

test('a identidade so contem padroes crescentes', () => {
  const id = [0, 1, 2, 3, 4, 5]
  assert.equal(contem(id, lePadrao('1234')), true)
  assert.equal(contem(id, lePadrao('21')), false)
})

test('contemUsando so olha ocorrencias que passam pela posicao', () => {
  // Em 1 2 3 0 (valores), o 123 aparece nas posicoes 0,1,2 e nao usa a 3.
  const p = [1, 2, 3, 0]
  assert.equal(contem(p, lePadrao('123')), true)
  assert.equal(contemUsando(p, lePadrao('123'), 3), false)
  assert.equal(contemUsando(p, lePadrao('123'), 1), true)
})

test('a geracao incremental concorda com a definicao ate n=7', () => {
  for (const s of ['132', '1342', '1324']) {
    const pad = lePadrao(s)
    const r = evitadoras(pad, 7, { guardar: true })
    for (let n = 1; n <= 7; n++) {
      let direto = 0
      for (const p of permutacoes(n)) if (!contem(p, pad)) direto++
      assert.equal(r.contagens[n - 1], direto, `${s} n=${n}`)
    }
  }
})

test('toda permutacao gerada evita mesmo o padrao', () => {
  const pad = lePadrao('2413')
  const r = evitadoras(pad, 7, { guardar: true })
  for (const p of r.listas[6]) assert.equal(contem(p, pad), false)
})

test('as permutacoes geradas sao distintas', () => {
  const r = evitadoras(lePadrao('123'), 7, { guardar: true })
  const chaves = new Set(r.listas[6].map((p) => p.join(',')))
  assert.equal(chaves.size, r.listas[6].length)
})

test('o gerador de permutacoes da n! copias distintas', () => {
  const lista = [...permutacoes(5)]
  assert.equal(lista.length, 120)
  assert.equal(new Set(lista.map((p) => p.join(''))).size, 120)
})

test('reverso, complemento e inversa', () => {
  const p = lePadrao('1342')
  assert.equal(escrevePadrao(reverso(p)), '2431')
  assert.equal(escrevePadrao(complemento(p)), '4213')
  assert.equal(escrevePadrao(inversa(p)), '1423')
})

test('1324 e 4231 formam sozinhos uma classe de simetria', () => {
  assert.deepEqual(imagens(lePadrao('1324')), ['1324', '4231'])
})

test('1234 tem 2 imagens e 1342 tem 8', () => {
  assert.deepEqual(imagens(lePadrao('1234')), ['1234', '4321'])
  assert.equal(imagens(lePadrao('1342')).length, 8)
})

test('as simetrias preservam a contagem', () => {
  for (const s of ['1342', '1243', '2413']) {
    const base = evitadoras(lePadrao(s), 8).contagens.join(',')
    for (const t of imagens(lePadrao(s))) {
      assert.equal(evitadoras(lePadrao(t), 8).contagens.join(','), base, `${s} -> ${t}`)
    }
  }
})
