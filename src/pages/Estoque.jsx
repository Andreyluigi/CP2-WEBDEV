import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = ['roupas', 'eletronicos', 'acessorios', 'casa']

export default function Estoque({ produtos, listaEspera = [] }) {
  const ordenados = produtos.slice().sort((a, b) => Number(a.estoque ?? 0) - Number(b.estoque ?? 0))

  const categoriaResumo = CATEGORIAS.map((categoria) => {
    const itens = produtos.filter((produto) => produto.category === categoria)

    const valorEmEstoque = itens.reduce((total, produto) => {
      const preco = Number(produto.price)
      const estoque = Number(produto.estoque ?? 0)
      return Number.isFinite(preco) ? total + preco * estoque : total
    }, 0)

    const lucroPotencial = itens.reduce((total, produto) => {
      const preco = Number(produto.price)
      const precoOriginal = Number(produto.precoOriginal ?? produto.price ?? 0)
      const estoque = Number(produto.estoque ?? 0)

      if (!Number.isFinite(preco) || !Number.isFinite(precoOriginal) || estoque <= 0) {
        return total
      }

      return total + Math.max(precoOriginal - preco, 0) * estoque
    }, 0)

    return {
      categoria,
      valorEmEstoque,
      lucroPotencial,
      qtdProdutos: itens.length,
      unidades: itens.reduce((total, produto) => total + Number(produto.estoque ?? 0), 0),
      esperandoPreco: itens.filter((produto) => !Number.isFinite(Number(produto.price))).length,
      esgotados: itens.filter((produto) => Number(produto.estoque ?? 0) === 0).length,
    }
  })

  const valorTotalEmEstoque = categoriaResumo.reduce((total, categoria) => total + categoria.valorEmEstoque, 0)
  const lucroTotal = categoriaResumo.reduce((total, categoria) => total + categoria.lucroPotencial, 0)
  const itensEsperandoPreco = produtos.filter(
    (produto) => !Number.isFinite(Number(produto.price)) || Number(produto.price ?? 0) <= 0
  )

  const esperas = listaEspera.reduce((acumulador, registro) => {
    const chave = String(registro.produtoId)
    if (!acumulador[chave]) {
      acumulador[chave] = []
    }

    acumulador[chave].push({ nome: registro.nome, email: registro.email })
    return acumulador
  }, {})

  const filas = Object.entries(esperas).flatMap(([produtoId, pessoas]) =>
    pessoas.map((pessoa) => ({
      produtoId,
      produto: produtos.find((produto) => String(produto.id) === String(produtoId)),
      nome: pessoa.nome,
      email: pessoa.email,
    }))
  )

  return (
    <section className="painel-lojista">
      <p className="sobretitulo">Painel do lojista</p>
      <h1>Resumo da loja</h1>

      <div className="painel-resumo">
        <div className="cartao-resumo">
          <span>Valor em estoque</span>
          <strong>{formatarPreco(valorTotalEmEstoque)}</strong>
          <small>Se tudo fosse vendido hoje</small>
        </div>

        <div className="cartao-resumo">
          <span>Lucro potencial</span>
          <strong>{formatarPreco(lucroTotal)}</strong>
          <small>Baseado na diferença entre preço atual e oferta</small>
        </div>

        <div className="cartao-resumo">
          <span>Esperando preço</span>
          <strong>{itensEsperandoPreco.length}</strong>
          <small>Produtos bloqueados no suprimentos</small>
        </div>

        <div className="cartao-resumo">
          <span>Clientes na fila</span>
          <strong>{listaEspera.length}</strong>
          <small>Quem está esperando volta do produto</small>
        </div>
      </div>

      <div className="painel-grid">
        <div className="tabela-moldura">
          <h2>Resumo por categoria</h2>
          <table className="tabela">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Valor</th>
                <th>Lucro</th>
              </tr>
            </thead>
            <tbody>
              {categoriaResumo.map((categoria) => (
                <tr key={categoria.categoria}>
                  <td>{categoria.categoria}</td>
                  <td>{categoria.unidades} un.</td>
                  <td>{formatarPreco(categoria.valorEmEstoque)}</td>
                  <td>{formatarPreco(categoria.lucroPotencial)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tabela-moldura">
          <h2>Produtos esperando preço</h2>
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Estoque</th>
              </tr>
            </thead>
            <tbody>
              {itensEsperandoPreco.length === 0 && (
                <tr>
                  <td colSpan="3">Nenhum produto aguardando preço.</td>
                </tr>
              )}

              {itensEsperandoPreco.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="painel-grid painel-grid-completo">
        <div className="tabela-moldura">
          <h2>Estoque em tempo real</h2>
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Unidades</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    {Number(produto.estoque ?? 0) === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                    {Number(produto.estoque ?? 0) > 0 && Number(produto.estoque ?? 0) < 5 && (
                      <span className="selo selo-alerta">Repor</span>
                    )}
                    {Number(produto.estoque ?? 0) >= 5 && <span className="selo selo-ok">OK</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tabela-moldura">
          <h2>Lista de espera</h2>
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Nome</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {filas.length === 0 && (
                <tr>
                  <td colSpan="3">Nenhum cliente aguardando retorno.</td>
                </tr>
              )}

              {filas.map((fila) => (
                <tr key={`${fila.produtoId}-${fila.nome}-${fila.email}`}>
                  <td>{fila.produto ? fila.produto.title : 'Produto removido'}</td>
                  <td>{fila.nome}</td>
                  <td>{fila.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
