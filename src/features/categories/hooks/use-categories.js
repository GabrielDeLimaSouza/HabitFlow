import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import * as categoryService from '../services/category-service'

/**
 * Gerencia o estado e as ações de CRUD + reordenação de categorias.
 * @returns {{ categories, loading, error, create, update, remove, moveUp, moveDown }}
 */
export function useCategories() {
  const { user } = useAuthStore()
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      setCategories(await categoryService.list(user.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  const create = async (data) => {
    const position = categories.length
    const category = await categoryService.create(user.id, { ...data, position })
    setCategories((prev) => [...prev, category])
    return category
  }

  const update = async (categoryId, data) => {
    const category = await categoryService.update(categoryId, data)
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? category : c)))
    return category
  }

  const remove = async (categoryId) => {
    await categoryService.remove(categoryId)
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
  }

  const applyReorder = async (newOrder) => {
    const updates = newOrder.map((cat, i) => ({ id: cat.id, position: i }))
    setCategories(newOrder.map((cat, i) => ({ ...cat, position: i })))
    await categoryService.reorder(updates)
  }

  const moveUp = (categoryId) => {
    const index = categories.findIndex((c) => c.id === categoryId)
    if (index <= 0) return
    const next = [...categories]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    applyReorder(next)
  }

  const moveDown = (categoryId) => {
    const index = categories.findIndex((c) => c.id === categoryId)
    if (index >= categories.length - 1) return
    const next = [...categories]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    applyReorder(next)
  }

  return { categories, loading, error, create, update, remove, moveUp, moveDown }
}
