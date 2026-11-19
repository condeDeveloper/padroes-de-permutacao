// As tabelas do README. Calculadas aqui, e em lugar nenhum mais.

import { lePadrao, escrevePadrao, evitadoras, permutacoes, imagens } from './padroes.js'
import { catalan, porRSK, forcaBruta } from './juiz.js'

const guardadas = new Map()
function umaVez (k, fn) {
  if (!guardadas.has(k)) guardadas.set(k, fn())
  return guardadas.get(k)
}

export function sequencia (texto, ate) {
  return umaVez(`seq:${texto}:${ate}`, () => evitadoras(lePadrao(texto), ate).contagens)
}

/** Os seis padroes de tamanho 3, contra Catalan. */
export function tamanho3 (ate = 11) {
  return umaVez(`t3:${ate}`, () => {
    const cat = []
    for (let n = 1; n <= ate; n++) cat.push(Number(catalan(n)))
    return ['123', '132', '213', '231', '312', '321'].map((s) => ({ padrao: s, contagens: sequencia(s, ate), catalan: cat }))
  })
}

/**
 * Os 24 padroes de tamanho 4, agrupados pela sequencia e pela simetria.
 *
 * Ate n = 8 ja separa as tres classes (a separacao acontece em n = 6 e n = 7).
 */
export function classesDeTamanho4 (ate = 8) {
  return umaVez(`t4:${ate}`, () => {
    const porSequencia = new Map()
    const simetria = new Set()
    for (const p of permutacoes(4)) {
      const s = escrevePadrao(p)
      const c = evitadoras(p, ate).contagens.join(',')
      if (!porSequencia.has(c)) porSequencia.set(c, [])
      porSequencia.get(c).push(s)
      simetria.add(imagens(p).join('/'))
    }
    const classes = [...porSequencia.entries()]
      .map(([c, l]) => ({ contagens: c.split(',').map(Number), padroes: l.sort(), quantos: l.length }))
      .sort((a, b) => a.contagens[a.contagens.length - 1] - b.contagens[b.contagens.length - 1])
    return { classes, classesDeSimetria: simetria.size, padroes: 24 }
  })
}

/** As tres representantes ate n = 10, e onde cada par se separa. */
export function separacao (ate = 10) {
  return umaVez(`sep:${ate}`, () => {
    const s1342 = sequencia('1342', ate)
    const s1234 = sequencia('1234', ate)
    const s1324 = sequencia('1324', ate)
    const primeiraDiferenca = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return i + 1; return null }
    return {
      s1342, s1234, s1324,
      separa1342de1234: primeiraDiferenca(s1342, s1234),
      separa1234de1324: primeiraDiferenca(s1234, s1324),
      folgaEmN: s1324.map((v, i) => v - s1234[i])
    }
  })
}

/** RSK contra a geracao, e ate onde o RSK vai sozinho. */
export function rsk (ateGeracao = 10, ateRSK = 14) {
  return umaVez(`rsk:${ateGeracao}:${ateRSK}`, () => {
    const gerada = sequencia('1234', ateGeracao)
    const porRsk = []
    for (let n = 1; n <= ateRSK; n++) porRsk.push(porRSK(n, 4))
    const tres = []
    for (let n = 1; n <= ateGeracao; n++) tres.push(porRSK(n, 3))
    return { gerada, porRsk, rsk123: tres }
  })
}

/** A forca bruta contra a geracao, em n = 8. */
export function duelo (n = 8) {
  return umaVez(`duelo:${n}`, () =>
    ['123', '1342', '1234', '1324'].map((s) => {
      const b = forcaBruta(lePadrao(s), n)
      return { padrao: s, bruta: b.evitam, testadas: b.testadas, geracao: sequencia(s, n)[n - 1] }
    })
  )
}
