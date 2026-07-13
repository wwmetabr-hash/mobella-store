'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

type Product = {
  id: string; name: string; cat: string; price: number; unit: string | null
  photos: string[]; desc: string; colors: string[]; specs: [string,string][]
  story: string[]; active: boolean
}

type Category = { id: string; label: string; slug: string; order: number }

type View = 'dashboard' | 'produtos' | 'categorias'

const PRODUCT_EMPTY: Product = {
  id: '', name: '', cat: '', price: 0, unit: null,
  photos: [], desc: '', colors: [''], specs: [['Medidas',''],['Fabricação','Curitiba, PR']], story: [''], active: true
}

function fmt(n: number) {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

/* ─── Login screen ─── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]   = useState('')
  const [err, setErr] = useState('')
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
    if (r.ok) onLogin()
    else setErr('Senha incorreta. Tente novamente.')
  }
  return (
    <div className="admin-login">
      <div className="admin-login__box">
        <div className="admin-login__logo">mo<em>bella</em><span className="admin-login__logo-dot">.</span></div>
        <h2>Painel de controle</h2>
        <p>Entre com sua senha para gerenciar a loja Mobella.</p>
        <form onSubmit={submit}>
          <div className="admin-field">
            <label>Senha</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} autoFocus placeholder="••••••••" />
          </div>
          {err && <div className="admin-msg-err" style={{ marginBottom: 16 }}>{err}</div>}
          <button type="submit" className="admin-btn-primary" style={{ width: '100%', padding: '13px' }}>Entrar</button>
        </form>
        <p style={{ marginTop: 20, fontSize: 12, color: '#bbb', textAlign: 'center' }}>Senha padrão: <code>mobella2024</code></p>
      </div>
    </div>
  )
}

/* ─── Product modal ─── */
function ProductModal({ product, categories, onSave, onClose }: {
  product: Product
  categories: Category[]
  onSave: (p: Product) => Promise<void>
  onClose: () => void
}) {
  const [p, setP]     = useState<Product>({ ...product })
  const [saving, setSaving] = useState(false)

  function field<K extends keyof Product>(key: K, val: Product[K]) {
    setP(prev => ({ ...prev, [key]: val }))
  }

  async function handleSave() {
    if (!p.id) return alert('Preencha o ID do produto.')
    if (!p.name) return alert('Preencha o nome do produto.')
    if (!p.cat) return alert('Selecione uma categoria.')
    setSaving(true)
    await onSave(p)
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <h3>{product.id ? `Editar — ${product.name}` : 'Novo produto'}</h3>

        <div className="form-2col">
          <div className="admin-field">
            <label>ID / Slug <span style={{ color: '#c00' }}>*</span></label>
            <input value={p.id} onChange={e => field('id', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} placeholder="ex: bella-cinza" />
            <p className="admin-field-hint">Único, sem espaços. Aparece na URL do produto.</p>
          </div>
          <div className="admin-field">
            <label>Nome do produto <span style={{ color: '#c00' }}>*</span></label>
            <input value={p.name} onChange={e => field('name', e.target.value)} placeholder="Bella" />
          </div>
          <div className="admin-field">
            <label>Categoria <span style={{ color: '#c00' }}>*</span></label>
            <select value={p.cat} onChange={e => field('cat', e.target.value)}>
              <option value="">— Selecione —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.label} ({c.id})</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Preço (R$) <span style={{ color: '#c00' }}>*</span></label>
            <input type="number" step="0.01" min="0" value={p.price} onChange={e => field('price', parseFloat(e.target.value) || 0)} />
          </div>
        </div>

        <div className="admin-field">
          <label>Sufixo de preço (ex: "/ par" — deixe vazio se não usar)</label>
          <input value={p.unit || ''} onChange={e => field('unit', e.target.value || null)} placeholder="/ par" />
        </div>

        <div className="admin-field">
          <label>Descrição curta (aparece na página do produto)</label>
          <textarea value={p.desc} onChange={e => field('desc', e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Fotos — um nome de arquivo por linha (ex: bella-1.jpg)</label>
          <textarea
            value={p.photos.join('\n')}
            onChange={e => field('photos', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
            style={{ minHeight: 72 }}
            placeholder={'bella-1.jpg\nbella-2.jpg\nbella-3.jpg'}
          />
          <p className="admin-field-hint">Os arquivos devem estar na pasta <code>public/products/</code> do projeto.</p>
        </div>

        <div className="admin-field">
          <label>Cores disponíveis — uma por linha</label>
          <textarea
            value={p.colors.join('\n')}
            onChange={e => field('colors', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
            style={{ minHeight: 72 }}
            placeholder={'Chenille bege\nChenille cinza\nVeludo verde'}
          />
        </div>

        <div className="admin-field">
          <label>Especificações — formato "Chave|Valor", uma por linha</label>
          <textarea
            value={p.specs.map(([k, v]) => `${k}|${v}`).join('\n')}
            onChange={e => field('specs',
              e.target.value.split('\n')
                .map(l => { const [k, ...vs] = l.split('|'); return [k?.trim() ?? '', vs.join('|').trim()] as [string, string] })
                .filter(([k]) => k)
            )}
            style={{ minHeight: 100 }}
            placeholder={'Medidas|A 80 · L 68 · P 80 cm\nRevestimento|Chenille / veludo\nFabricação|Curitiba, PR'}
          />
        </div>

        <div className="admin-field">
          <label>História do produto — parágrafos, um por linha (pode usar &lt;strong&gt; e &lt;em&gt;)</label>
          <textarea
            value={p.story.join('\n')}
            onChange={e => field('story', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
            style={{ minHeight: 80 }}
            placeholder={'A <strong>Bella</strong> é a poltrona <em>coringa</em>.\nQuatro revestimentos e um formato que combina com qualquer sala.'}
          />
        </div>

        <div className="admin-field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textTransform: 'none', letterSpacing: 0, fontSize: 13, color: 'var(--ink)' }}>
            <input type="checkbox" checked={p.active} onChange={e => field('active', e.target.checked)} style={{ width: 17, height: 17, accentColor: 'var(--olive)' }} />
            Produto ativo — visível na loja
          </label>
        </div>

        <div className="modal-actions">
          <button className="admin-btn admin-btn-edit" onClick={onClose}>Cancelar</button>
          <button className="admin-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando…' : '✓ Salvar produto'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Category modal ─── */
function CategoryModal({ cat, maxOrder, onSave, onClose }: {
  cat: Partial<Category>
  maxOrder: number
  onSave: (c: Category) => Promise<void>
  onClose: () => void
}) {
  const [c, setC]     = useState<Category>({ id: cat.id || '', label: cat.label || '', slug: cat.slug || '', order: cat.order ?? maxOrder + 1 })
  const [saving, setSaving] = useState(false)

  function autoSlug(label: string) {
    setC(prev => ({ ...prev, label, slug: slugify(label) }))
  }

  async function handleSave() {
    if (!c.id) return alert('Preencha o ID da categoria.')
    if (!c.label) return alert('Preencha o nome da categoria.')
    setSaving(true)
    await onSave(c)
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth: 480 }}>
        <h3>{cat.id ? `Editar — ${cat.label}` : 'Nova categoria'}</h3>

        <div className="admin-field">
          <label>ID da categoria (como aparece nos produtos)</label>
          <input value={c.id} onChange={e => setC(prev => ({ ...prev, id: e.target.value }))} placeholder="Poltrona" disabled={!!cat.id} />
          <p className="admin-field-hint">Não pode ser alterado depois de criado. Use exatamente como vai aparecer no campo "Categoria" dos produtos.</p>
        </div>
        <div className="admin-field">
          <label>Nome para exibição (plural)</label>
          <input value={c.label} onChange={e => autoSlug(e.target.value)} placeholder="Poltronas" />
        </div>
        <div className="admin-field">
          <label>Slug (URL)</label>
          <input value={c.slug} onChange={e => setC(prev => ({ ...prev, slug: e.target.value }))} placeholder="poltronas" />
          <p className="admin-field-hint">Aparece na âncora da home: /#{c.slug || 'poltronas'}</p>
        </div>
        <div className="admin-field">
          <label>Ordem na home (1 = primeira)</label>
          <input type="number" min="1" value={c.order} onChange={e => setC(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))} />
        </div>

        <div className="modal-actions">
          <button className="admin-btn admin-btn-edit" onClick={onClose}>Cancelar</button>
          <button className="admin-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando…' : '✓ Salvar categoria'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Admin ─── */
export default function AdminPage() {
  const [authed, setAuthed]       = useState<boolean | null>(null)
  const [products, setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [view, setView]           = useState<View>('dashboard')
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [editCat, setEditCat]     = useState<Partial<Category> | null>(null)
  const [msg, setMsg]             = useState<{ text: string; type: 'ok' | 'err' } | null>(null)
  const [catFilter, setCatFilter] = useState<string>('todas')
  const [search, setSearch]       = useState('')

  const showMsg = (text: string, type: 'ok' | 'err' = 'ok') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 4000)
  }

  const loadAll = useCallback(async () => {
    const [pr, cr] = await Promise.all([
      fetch('/api/admin/products'),
      fetch('/api/admin/categories'),
    ])
    if (pr.ok) setProducts(await pr.json())
    if (cr.ok) setCategories(await cr.json())
  }, [])

  useEffect(() => {
    fetch('/api/admin/products').then(r => {
      setAuthed(r.ok)
      if (r.ok) { r.json().then(setProducts); fetch('/api/admin/categories').then(r2 => { if (r2.ok) r2.json().then(setCategories) }) }
    }).catch(() => setAuthed(false))
  }, [])

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    setAuthed(false)
  }

  async function saveProduct(p: Product) {
    const r = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
    if (r.ok) { await loadAll(); setEditProduct(null); showMsg(`Produto "${p.name}" salvo com sucesso.`) }
    else showMsg('Erro ao salvar produto.', 'err')
  }

  async function toggleActive(p: Product) {
    await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...p, active: !p.active }) })
    await loadAll()
    showMsg(`"${p.name}" ${p.active ? 'desativado' : 'ativado'}.`)
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Excluir "${name}" permanentemente?`)) return
    await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    await loadAll()
    showMsg(`"${name}" excluído.`)
  }

  async function saveCategory(c: Category) {
    const r = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) })
    if (r.ok) { await loadAll(); setEditCat(null); showMsg(`Categoria "${c.label}" salva.`) }
    else showMsg('Erro ao salvar categoria.', 'err')
  }

  async function deleteCategory(id: string, label: string) {
    const count = products.filter(p => p.cat === id).length
    if (count > 0) return showMsg(`Não é possível excluir "${label}": há ${count} produto(s) nesta categoria.`, 'err')
    if (!confirm(`Excluir a categoria "${label}"?`)) return
    await fetch('/api/admin/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    await loadAll()
    showMsg(`Categoria "${label}" excluída.`)
  }

  if (authed === null) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'var(--font-sans)', color: 'var(--muted)' }}>Carregando…</div>
  if (!authed) return <LoginScreen onLogin={() => { setAuthed(true); loadAll() }} />

  const filteredProducts = products
    .filter(p => catFilter === 'todas' || p.cat === catFilter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))

  const activeCount = products.filter(p => p.active).length
  const total = products.reduce((s, p) => s + p.price, 0)

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>mo<em>bella</em><span>.</span> <span style={{ opacity: 0.45, fontSize: 13, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', fontWeight: 400, textTransform: 'uppercase', marginLeft: 10 }}>Painel Admin</span></h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="/" target="_blank" style={{ color: 'var(--sand)', opacity: 0.55, fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>↗ Ver loja</a>
          <button onClick={logout} style={{ color: 'var(--sand)', opacity: 0.55, fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sair</button>
        </div>
      </div>

      <div className="admin-body">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          <span className="sect">Visão geral</span>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>📊 Dashboard</button>
          <span className="sect">Catálogo</span>
          <button className={view === 'produtos' ? 'active' : ''} onClick={() => setView('produtos')}>🛋 Produtos</button>
          <button className={view === 'categorias' ? 'active' : ''} onClick={() => setView('categorias')}>🏷 Categorias</button>
          <span className="sect">Site</span>
          <a href="/" target="_blank">↗ Ver loja</a>
        </nav>

        {/* Content */}
        <div className="admin-content">
          {msg && <div className={msg.type === 'ok' ? 'admin-msg-ok' : 'admin-msg-err'}>{msg.text}</div>}

          {/* ── Dashboard ── */}
          {view === 'dashboard' && (
            <>
              <h2>Dashboard</h2>
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="stat-card__label">Total de produtos</div>
                  <div className="stat-card__value">{products.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__label">Produtos ativos</div>
                  <div className="stat-card__value">{activeCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__label">Categorias</div>
                  <div className="stat-card__value">{categories.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__label">Ticket médio</div>
                  <div className="stat-card__value" style={{ fontSize: 22 }}>{products.length ? fmt(total / products.length) : '—'}</div>
                </div>
              </div>

              {/* por categoria */}
              <div style={{ background: 'white', borderRadius: 4, border: '1px solid #eee', padding: 28, marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 20 }}>Produtos por categoria</h3>
                {categories.map(cat => {
                  const count = products.filter(p => p.cat === cat.id).length
                  const pct   = products.length ? Math.round(count / products.length * 100) : 0
                  return (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                      <div style={{ width: 100, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cat.label}</div>
                      <div style={{ flex: 1, height: 6, background: '#f0f0ee', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--olive)', borderRadius: 3 }} />
                      </div>
                      <div style={{ width: 40, textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{count}</div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="admin-btn-primary" onClick={() => { setEditProduct({ ...PRODUCT_EMPTY, cat: categories[0]?.id || '' }); setView('produtos') }}>+ Novo produto</button>
                <button className="admin-btn admin-btn-edit" style={{ padding: '11px 22px', fontSize: 13 }} onClick={() => setView('categorias')}>Gerenciar categorias</button>
              </div>
            </>
          )}

          {/* ── Produtos ── */}
          {view === 'produtos' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
                <h2 style={{ marginBottom: 0 }}>Produtos</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    placeholder="Buscar produto…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: 3, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: 200 }}
                  />
                  <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                    style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: 3, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }}>
                    <option value="todas">Todas as categorias</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <button className="admin-btn-primary" onClick={() => setEditProduct({ ...PRODUCT_EMPTY, cat: categories[0]?.id || '' })}>+ Novo produto</button>
                </div>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>Nenhum produto encontrado.</td></tr>
                  )}
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        {p.photos[0]
                          ? <Image src={`/products/${p.photos[0]}`} alt={p.name} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 2 }} />
                          : <div style={{ width: 48, height: 48, background: 'var(--sand)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--muted)' }}>foto</div>
                        }
                      </td>
                      <td>
                        <strong style={{ display: 'block', marginBottom: 2 }}>{p.name}</strong>
                        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>{p.id}</span>
                      </td>
                      <td>{p.cat}</td>
                      <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}>
                        {fmt(p.price)}{p.unit && <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginLeft: 4 }}>{p.unit}</span>}
                      </td>
                      <td><span className={p.active ? 'badge-on' : 'badge-off'}>{p.active ? 'Ativo' : 'Inativo'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="admin-btn admin-btn-edit" onClick={() => setEditProduct({ ...p })}>Editar</button>
                          <button className="admin-btn" style={{ background: p.active ? '#fff3e0' : '#e8f5e9', color: p.active ? '#e65100' : '#2e7d32' }} onClick={() => toggleActive(p)}>
                            {p.active ? 'Desativar' : 'Ativar'}
                          </button>
                          <button className="admin-btn admin-btn-danger" onClick={() => deleteProduct(p.id, p.name)}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ── Categorias ── */}
          {view === 'categorias' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h2 style={{ marginBottom: 6 }}>Categorias</h2>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>Crie novas categorias (ex: Mesas, Aparadores) e os produtos associados aparecem automaticamente na loja.</p>
                </div>
                <button className="admin-btn-primary" onClick={() => setEditCat({})}>+ Nova categoria</button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ordem</th>
                    <th>ID (interno)</th>
                    <th>Nome na loja</th>
                    <th>Slug (URL)</th>
                    <th>Qtd. produtos</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.sort((a, b) => a.order - b.order).map(cat => {
                    const count = products.filter(p => p.cat === cat.id).length
                    return (
                      <tr key={cat.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>{cat.order}</td>
                        <td><code style={{ background: '#f4f4f2', padding: '2px 7px', borderRadius: 3, fontSize: 12 }}>{cat.id}</code></td>
                        <td style={{ fontWeight: 600 }}>{cat.label}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>#{cat.slug}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontWeight: 600 }}>{count}</span>
                          {count === 0 && <span style={{ fontSize: 11, color: '#c00', marginLeft: 6 }}>(sem produtos)</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="admin-btn admin-btn-edit" onClick={() => setEditCat({ ...cat })}>Editar</button>
                            <button className="admin-btn admin-btn-danger" onClick={() => deleteCategory(cat.id, cat.label)}>Excluir</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {categories.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>Nenhuma categoria criada ainda.</td></tr>
                  )}
                </tbody>
              </table>

              <div style={{ marginTop: 28, background: 'white', border: '1px solid #eee', borderRadius: 4, padding: 24 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 10 }}>Como funciona</h4>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>
                  Crie uma nova categoria (ex: <strong>Mesa</strong>, ID: <code>Mesa</code>). Em seguida, ao cadastrar ou editar produtos, selecione essa categoria.
                  A loja automaticamente cria um bloco "<strong>Mesas</strong>" na página inicial com todos os produtos dessa categoria.
                  A ordem dos blocos segue o campo "Ordem" de cada categoria.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modais */}
      {editProduct && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onSave={saveProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
      {editCat !== null && (
        <CategoryModal
          cat={editCat}
          maxOrder={Math.max(0, ...categories.map(c => c.order))}
          onSave={saveCategory}
          onClose={() => setEditCat(null)}
        />
      )}
    </div>
  )
}
