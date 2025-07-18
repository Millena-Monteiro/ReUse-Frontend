
'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/api'
import axios from 'axios'

// --- DEFINIÇÃO DO TIPO DE HISTÓRICO REAL ---
type Historico = {
  id: string
  item_id: string
  receptor_id: string
  doador_id: string
  data_transacao: string
  tipo: string
}

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<Historico[]>([])
  const [form, setForm] = useState({
    item_id: '',
    receptor_id: '',
    doador_id: '',
    data_transacao: '',
    tipo: '',
  })
  const [editId, setEditId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHistorico = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.data.get<Historico[]>('api/historicos')
      setHistorico(response.data)
    } catch (err) {
      setError('Erro ao carregar histórico. 😔')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistorico()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.item_id || !form.receptor_id || !form.doador_id || !form.data_transacao || !form.tipo) {
      setError('Preencha todos os campos. ⚠️')
      return
    }

    try {
      if (editId) {
        await api.data.put(`api/historicos/${editId}`, {
          ...form,
          data_transacao: new Date(form.data_transacao).toISOString(),
        })
        setEditId(null)
      } else {
        await api.data.post('api/historicos', {
          ...form,
          data_transacao: new Date(form.data_transacao).toISOString(),
        })
      }
      setForm({
        item_id: '',
        receptor_id: '',
        doador_id: '',
        data_transacao: '',
        tipo: '',
      })
      fetchHistorico()
    } catch (err) {
      setError('Erro ao salvar histórico. 😔')
    }
  }

  const handleEdit = (item: Historico) => {
    setEditId(item.id)
    setForm({
      item_id: item.item_id,
      receptor_id: item.receptor_id,
      doador_id: item.doador_id,
      data_transacao: item.data_transacao.slice(0, 10),
      tipo: item.tipo,
    })
  }

  const handleDelete = async (id: string) => {
    try {
      await api.data.delete(`api/historicos/${id}`)
      fetchHistorico()
    } catch (err) {
      setError('Erro ao deletar histórico. 😔')
    }
  }

  const isFormDisabled = !!error

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Gerenciar Histórico</h1>
      {loading && <p className="text-blue-500 mb-2">Carregando histórico... ⏳</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className={`mb-6 space-y-2 bg-blue-50 p-4 rounded shadow ${isFormDisabled ? 'opacity-50' : ''}`}
      >
        <input name="item_id" value={form.item_id} onChange={handleChange} placeholder="Item ID" className="w-full border rounded px-2 py-1 text-gray-800" />
        <input name="receptor_id" value={form.receptor_id} onChange={handleChange} placeholder="Receptor ID" className="w-full border rounded px-2 py-1 text-gray-800" />
        <input name="doador_id" value={form.doador_id} onChange={handleChange} placeholder="Doador ID" className="w-full border rounded px-2 py-1 text-gray-800" />
        <input type="date" name="data_transacao" value={form.data_transacao} onChange={handleChange} className="w-full border rounded px-2 py-1 text-gray-800" />
        <input name="tipo" value={form.tipo} onChange={handleChange} placeholder="Tipo" className="w-full border rounded px-2 py-1 text-gray-800" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? 'Atualizar Histórico' : 'Criar Histórico'}
        </button>
      </form>

      <ul className="space-y-3">
        {!loading && historico.length === 0 && (
          <p className="text-gray-800 dark:text-gray-200">Nenhum histórico encontrado.</p>
        )}

        {historico.map((item) => (
          <li key={item.id} className="bg-blue-100 p-4 rounded shadow hover:bg-blue-200 transition text-gray-800">
            <p><strong>Item ID:</strong> {item.item_id}</p>
            <p><strong>Receptor ID:</strong> {item.receptor_id}</p>
            <p><strong>Doador ID:</strong> {item.doador_id}</p>
            <p><strong>Data:</strong> {new Date(item.data_transacao).toLocaleDateString()}</p>
            <p><strong>Tipo:</strong> {item.tipo}</p>

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
