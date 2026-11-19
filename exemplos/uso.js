#!/usr/bin/env node
// Exemplo de uso da biblioteca pela porta de entrada do pacote.
//
//   node exemplos/uso.js 2413 9
//
// Conta as permutacoes que evitam o padrao, de 1 ate n, e mostra as imagens dele
// pelas simetrias do quadrado (que dao todas a mesma contagem).

import { lePadrao, evitadoras, imagens, contem } from '../src/index.js'

const padrao = process.argv[2] || '2413'
const ate = Number(process.argv[3] || 9)

const r = evitadoras(lePadrao(padrao), ate)
console.log(`evitam ${padrao}, de 1 a ${ate}: ${r.contagens.join(', ')}`)
console.log(`imagens pelas simetrias: ${imagens(lePadrao(padrao)).join(' ')}`)
console.log(`31524 contem ${padrao}? ${contem([2, 0, 4, 1, 3], lePadrao(padrao))}`)
