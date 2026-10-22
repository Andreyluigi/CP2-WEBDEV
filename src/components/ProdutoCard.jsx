import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = produto.estoque === 0
  const precoValido = Number.isFinite(Number(produto.price))
  const precoOriginalValido = Number.isFinite(Number(produto.precoOriginal))
  const precoExibido = precoValido ? Number(produto.price) : precoOriginalValido ? Number(produto.precoOriginal) : null

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {precoOriginalValido && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">
          {precoExibido !== null ? formatarPreco(precoExibido) : 'Preço indisponível'}
        </span>
      </div>

      <div className="card-selos">
        {precoExibido !== null && Number(precoExibido) > 100 && (
          <span className="selo selo-frete">Frete grátis</span>
        )}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={esgotado || precoExibido === null}>
        {precoExibido === null ? 'Indisponível' : 'Adicionar ao carrinho'}
      </button>
    </article>
  )
}
