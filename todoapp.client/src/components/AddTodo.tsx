import React, { useState } from 'react'
import '../AddToDo.css'

interface AddTodoPopupProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (title: string, isUrgent: boolean) => void
}

const AddTodo: React.FC<AddTodoPopupProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [error, setError] = useState('') 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('You must have a title')
      return
    }

    if (title.trim()) {
      onAdd(title, isUrgent)
      setTitle('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <h2>Add New Todo</h2>

        <form className="add-todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Todo title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}

          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <label>
              Urgent?{' '}
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={e => setIsUrgent(e.target.checked)}
                style={{ margin: '0px' }}
              />
            </label>
          </div>

          <div>
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTodo
