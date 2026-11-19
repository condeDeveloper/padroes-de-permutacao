#!/usr/bin/env node
// O medidor. Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js             todas
//   node ferramentas/medidor.js tres        os seis padroes de tamanho 3 contra Catalan
//   node ferramentas/medidor.js quatro      os 24 padroes de tamanho 4 em classes
//   node ferramentas/medidor.js separacao   onde as tres classes se separam
//   node ferramentas/medidor.js rsk         a contagem por quadros de Young
//   node ferramentas/medidor.js duelo       forca bruta contra geracao

import { tamanho3, classesDeTamanho4, separacao, rsk, duelo } from '../src/medidas.js'

const n = (x) => (typeof x === 'bigint' ? x : BigInt(x)).toLocaleString('pt-BR')

function tTres () {
  console.log('\n== os seis padroes de tamanho 3 ==')
  for (const l of tamanho3(11)) {
    const bate = l.contagens.every((v, i) => v === l.catalan[i])
    console.log(`   ${l.padrao}: ${l.contagens.join(', ')}   ${bate ? 'Catalan' : 'NAO e Catalan'}`)
  }
}

function tQuatro () {
  const r = classesDeTamanho4(8)
  console.log(`\n== os ${r.padroes} padroes de tamanho 4 ==`)
  console.log(`   ${r.classesDeSimetria} classes de simetria, ${r.classes.length} sequencias diferentes`)
  for (const c of r.classes) console.log(`\n   ${c.quantos} padroes: ${c.padroes.join(' ')}\n     ${c.contagens.join(', ')}`)
}

function tSeparacao () {
  const r = separacao(10)
  console.log('\n== onde as tres classes se separam ==')
  console.log(`   1342: ${r.s1342.join(', ')}`)
  console.log(`   1234: ${r.s1234.join(', ')}`)
  console.log(`   1324: ${r.s1324.join(', ')}`)
  console.log(`\n   1342 e 1234 se separam em n = ${r.separa1342de1234}`)
  console.log(`   1234 e 1324 se separam em n = ${r.separa1234de1324}`)
  console.log(`   1324 menos 1234, n a n: ${r.folgaEmN.join(', ')}`)
}

function tRsk () {
  const r = rsk(10, 14)
  console.log('\n== evitar 1234 contado por quadros de Young ==')
  console.log(`   geracao (ate 10): ${r.gerada.join(', ')}`)
  console.log(`   RSK     (ate 14): ${r.porRsk.map((v) => n(v)).join(', ')}`)
  console.log(`   RSK para 123:     ${r.rsk123.join(', ')}   (Catalan, por outro caminho)`)
}

function tDuelo () {
  console.log('\n== forca bruta sobre as 8! permutacoes contra a geracao ==')
  for (const l of duelo(8)) console.log(`   ${l.padrao}: bruta ${n(l.bruta)} de ${n(l.testadas)}   geracao ${n(l.geracao)}   ${l.bruta === l.geracao ? 'concordam' : 'DIVERGEM'}`)
}

const partes = { tres: tTres, quatro: tQuatro, separacao: tSeparacao, rsk: tRsk, duelo: tDuelo }
const pedido = process.argv[2]
if (!pedido) for (const f of Object.values(partes)) f()
else if (partes[pedido]) partes[pedido]()
else { console.error(`nao conheco "${pedido}". conheco: ${Object.keys(partes).join(', ')}`); process.exit(1) }
