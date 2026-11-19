// Os numeros do README, presos.

import test from 'node:test'
import assert from 'node:assert/strict'

import { tamanho3, classesDeTamanho4, rsk, duelo } from '../src/medidas.js'

test('os seis padroes de tamanho 3 dao Catalan ate n=11', () => {
  const linhas = tamanho3(11)
  assert.equal(linhas.length, 6)
  for (const l of linhas) assert.deepEqual(l.contagens, l.catalan, l.padrao)
  assert.equal(linhas[0].contagens[10], 58786)
})

test('24 padroes de tamanho 4: 7 classes de simetria e so 3 sequencias', () => {
  const r = classesDeTamanho4(8)
  assert.equal(r.padroes, 24)
  assert.equal(r.classesDeSimetria, 7)
  assert.equal(r.classes.length, 3)
  assert.deepEqual(r.classes.map((c) => c.quantos), [10, 12, 2])
  assert.equal(r.classes.reduce((s, c) => s + c.quantos, 0), 24)
})

test('quem esta em cada classe', () => {
  const [a, b, c] = classesDeTamanho4(8).classes
  assert.ok(a.padroes.includes('1342') && a.padroes.includes('2413'))
  assert.ok(b.padroes.includes('1234') && b.padroes.includes('2143') && b.padroes.includes('3412'))
  assert.deepEqual(c.padroes, ['1324', '4231'])
})

test('as tres sequencias ate n=8', () => {
  const [a, b, c] = classesDeTamanho4(8).classes
  assert.deepEqual(a.contagens, [1, 2, 6, 23, 103, 512, 2740, 15485])
  assert.deepEqual(b.contagens, [1, 2, 6, 23, 103, 513, 2761, 15767])
  assert.deepEqual(c.contagens, [1, 2, 6, 23, 103, 513, 2762, 15793])
})

test('RSK vai ate n=14 sem montar permutacao nenhuma', () => {
  const r = rsk(10, 14)
  for (let i = 0; i < 10; i++) assert.equal(r.porRsk[i], BigInt(r.gerada[i]))
  assert.equal(r.porRsk[13], 1148208090n)
  assert.equal(r.porRsk[10], 3763290n)
})

test('a forca bruta sobre 40.320 permutacoes concorda com a geracao', () => {
  for (const l of duelo(8)) {
    assert.equal(l.testadas, 40320)
    assert.equal(l.bruta, l.geracao, l.padrao)
  }
  assert.deepEqual(duelo(8).map((l) => l.bruta), [1430, 15485, 15767, 15793])
})
