// O caro: as tres representantes de tamanho 4 ate n = 10.

import test from 'node:test'
import assert from 'node:assert/strict'

import { separacao } from '../src/medidas.js'

test('as tres classes ate n=10, e onde se separam', { timeout: 600000 }, () => {
  const r = separacao(10)
  assert.deepEqual(r.s1342, [1, 2, 6, 23, 103, 512, 2740, 15485, 91245, 555662])
  assert.deepEqual(r.s1234, [1, 2, 6, 23, 103, 513, 2761, 15767, 94359, 586590])
  assert.deepEqual(r.s1324, [1, 2, 6, 23, 103, 513, 2762, 15793, 94776, 591950])
  assert.equal(r.separa1342de1234, 6)
  assert.equal(r.separa1234de1324, 7)
})

test('1324 passa 1234 por uma permutacao em n=7, e a folga cresce', { timeout: 600000 }, () => {
  const r = separacao(10)
  assert.deepEqual(r.folgaEmN, [0, 0, 0, 0, 0, 0, 1, 26, 417, 5360])
  for (let i = 7; i < r.folgaEmN.length; i++) assert.ok(r.folgaEmN[i] > r.folgaEmN[i - 1])
})

test('de n=7 em diante a ordem e sempre 1342 < 1234 < 1324', { timeout: 600000 }, () => {
  const r = separacao(10)
  for (let i = 6; i < 10; i++) {
    assert.ok(r.s1342[i] < r.s1234[i], `n=${i + 1}`)
    assert.ok(r.s1234[i] < r.s1324[i], `n=${i + 1}`)
  }
})
