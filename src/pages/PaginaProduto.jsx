import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({ produtos, onAdicionar, listaEspera, onRegistrarEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemEspera, setMensagemEspera] = useState('')
  const precoValido = Number.isFinite(Number(produto?.price))
  const precoExibido = precoValido ? Number(produto.price) : Number.isFinite(Number(produto?.precoOriginal)) ? Number(produto.precoOriginal) : null

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        Number(item.estoque ?? 0) > 0 &&
        Number.isFinite(Number(item.price))
    )
    .slice(0, 4)

  function enviarAviso(evento) {
    evento.preventDefault()

    const nomeValidado = nome.trim()
    const emailValidado = email.trim()

    if (!nomeValidado || !emailValidado) {
      setMensagemEspera('Informe nome e e-mail para receber o aviso.')
      return
    }

    onRegistrarEspera(produto.id, nomeValidado, emailValidado)
    setNome('')
    setEmail('')
    setMensagemEspera('Você foi adicionado à lista de espera.')
  }

  if (produto.estoque === 0) {
    return (
      <section>
        <nav className="trilha" aria-label="Você está em">
          <Link to="/">Loja</Link>
          <span aria-hidden="true">/</span>
          <span>{produto.title}</span>
        </nav>

        <div className="estado-vazio">
          <p>Produto esgotado.</p>
          <p>Receba um aviso por e-mail quando ele voltar ao estoque.</p>
        </div>

        <form onSubmit={enviarAviso} style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          <label className="rotulo" htmlFor="nome-espera">
            Nome
          </label>
          <input
            id="nome-espera"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            placeholder="Seu nome"
            style={{ padding: '0.75rem', border: '1px solid #e6e3de', borderRadius: '6px' }}
          />

          <label className="rotulo" htmlFor="email-espera">
            E-mail
          </label>
          <input
            id="email-espera"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            placeholder="seu@email.com"
            style={{ padding: '0.75rem', border: '1px solid #e6e3de', borderRadius: '6px' }}
          />

          <button type="submit" className="botao botao-grande">
            Avise-me quando chegar
          </button>

          {mensagemEspera && <p className="mensagem-cupom">{mensagemEspera}</p>}
        </form>
      </section>
    )
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {precoExibido !== null ? `R$ ${Number(precoExibido).toFixed(2).replace('.', ',')}` : 'Preço indisponível'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={produto.estoque === 0 || precoExibido === null}
          >
            {precoExibido === null ? 'Produto indisponível' : 'Adicionar ao carrinho'}
          </button>

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">{Number.isFinite(Number(item.price)) ? `R$ ${Number(item.price).toFixed(2).replace('.', ',')}` : 'Preço indisponível'}</p>
            <button className="botao" onClick={() => onAdicionar(item)} disabled={!Number.isFinite(Number(item.price))}>
              {Number.isFinite(Number(item.price)) ? 'Adicionar ao carrinho' : 'Indisponível'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
