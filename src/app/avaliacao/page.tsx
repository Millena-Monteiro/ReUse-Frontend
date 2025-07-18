'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/api'

type Avaliacao = {
  id: string
  nota: number
  comentario: string
  userId: string
  user: {
    id: string
    nome: string
    email: string
  }
}

export default function AvaliacaoPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [form, setForm] = useState({
    nota: '',
    comentario: '',
    userId: '',
  })
  const [editId, setEditId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAvaliacoes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.data.get<Avaliacao[]>('/avaliacao')
      setAvaliacoes(response.data)
    } catch (err) {
      setError('Erro ao carregar avaliações.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvaliacoes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.nota || !form.comentario || !form.userId) {
      setError('Preencha todos os campos.')
      return
    }

    try {
      if (editId) {
        await api.data.put(`/avaliacao${editId}`, {
          ...form,
          nota: Number(form.nota),
        })
        setEditId(null)
      } else {
        await api.data.post('/avaliacao', {
          ...form,
          nota: Number(form.nota),
        })
      }
      setForm({ nota: '', comentario: '', userId: '' })
      fetchAvaliacoes()
    } catch (err) {
      setError('Erro ao salvar avaliação.')
    }
  }

  const handleEdit = (item: Avaliacao) => {
    setEditId(item.id)
    setForm({
      nota: item.nota.toString(),
      comentario: item.comentario,
      userId: item.userId,
    })
  }

  const handleDelete = async (id: string) => {
    try {
      await api.data.delete(`/avaliacao${id}`)
      fetchAvaliacoes()
    } catch (err) {
      setError('Erro ao deletar avaliação.')
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Gerenciar Avaliações</h1>
      {loading && <p className="text-blue-500 mb-2">Carregando avaliações...</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 bg-blue-50 p-4 rounded shadow">
        <input
          name="nota"
          value={form.nota}
          onChange={handleChange}
          placeholder="Nota (1 a 5)"
          type="number"
          className="w-full border rounded px-2 py-1 text-gray-800"
        />
        <textarea
          name="comentario"
          value={form.comentario}
          onChange={handleChange}
          placeholder="Comentário"
          className="w-full border rounded px-2 py-1 text-gray-800"
        />
        <input
          name="userId"
          value={form.userId}
          onChange={handleChange}
          placeholder="User ID"
          className="w-full border rounded px-2 py-1 text-gray-800"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? 'Atualizar Avaliação' : 'Criar Avaliação'}
        </button>
      </form>

      <ul className="space-y-3">
        {!loading && avaliacoes.length === 0 && (
          <p className="text-gray-800 dark:text-gray-200">Nenhuma avaliação encontrada.</p>
        )}

        {avaliacoes.map((item) => (
          <li key={item.id} className="bg-blue-100 p-4 rounded shadow hover:bg-blue-200 transition text-gray-800">
            <p><strong>Nota:</strong> {item.nota}</p>
            <p><strong>Comentário:</strong> {item.comentario}</p>
            <p><strong>Usuário:</strong> {item.user?.nome} ({item.user?.email})</p>

            <button onClick={() => handleEdit(item)} className="mr-2 mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Editar
            </button>
            <button onClick={() => handleDelete(item.id)} className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
