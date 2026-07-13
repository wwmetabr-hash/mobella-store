'use client'

export default function NewsletterForm() {
  return (
    <form className="newsletter__form" onSubmit={e => e.preventDefault()}>
      <input type="email" placeholder="seu@email.com" />
      <button type="submit" className="newsletter__btn">Entrar</button>
    </form>
  )
}
