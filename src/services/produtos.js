import { get } from './api'

function normalizarPreco(valor) {
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : null
}

function normalizarProduto(produto) {
  const candidatos = [
    produto?.price,
    produto?.precoOriginal,
    produto?.valor,
    produto?.valorUnitario,
    produto?.preco,
    produto?.unitPrice,
  ]

  const precoCorreto = candidatos.map(normalizarPreco).find((valor) => valor !== null)

  if (precoCorreto !== undefined) {
    return {
      ...produto,
      price: precoCorreto,
    }
  }

  return produto
}

// Formato dos produtos documentado em docs/api.md
export function buscarProdutos() {
  return get('/products.json').then((produtos) => produtos.map(normalizarProduto))
}
