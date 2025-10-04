'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { analyzeTask, generateProductivityTips } from '@/lib/openai'

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Ошибка загрузки задач:', error)
    }
  }

  const addTask = async () => {
    if (!newTask.trim()) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Нужно войти в систему')
        return
      }

      const aiAnalysis = await analyzeTask(newTask, 'Добавление новой задачи')
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: newTask,
          user_id: user.id,
          priority: aiAnalysis.toLowerCase().includes('высокий') ? 'high' : 
                   aiAnalysis.toLowerCase().includes('средний') ? 'medium' : 'low'
        })
        .select()

      if (error) throw error
      
      setTasks([data[0], ...tasks])
      setNewTask('')
      setAiSuggestion(aiAnalysis)
    } catch (error) {
      console.error('Ошибка добавления задачи:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', id)

      if (error) throw error
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !completed } : task
      ))
    } catch (error) {
      console.error('Ошибка обновления задачи:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          🤖 ИИ-ассистент продуктивности
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Добавь новую задачу..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button
              onClick={addTask}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Добавляю...' : 'Добавить'}
            </button>
          </div>

          {aiSuggestion && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">🤖 ИИ-рекомендация:</h3>
              <p className="text-blue-700">{aiSuggestion}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Мои задачи ({tasks.filter(t => !t.completed).length} активных)
          </h2>
          
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Пока нет задач. Добавь первую!
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    task.completed 
                      ? 'bg-gray-50 border-gray-300' 
                      : task.priority === 'high'
                        ? 'bg-red-50 border-red-400'
                        : task.priority === 'medium'
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-green-50 border-green-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id, task.completed)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority === 'high' ? 'Высокий' :
                       task.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
