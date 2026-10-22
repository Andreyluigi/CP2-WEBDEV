export function formatarPreco(valor, fallback = 'Preço indisponível') {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    return fallback
  }

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
