import type ITodo from '../assets/models/ITodo'
import '../TodoCard.css'
import '../App.css'
import UseUpdate from '../hooks/UseUpdate'
import UseDelete from '../hooks/UseDelete'

interface TodoCardProps {
  todoItem: ITodo
  onToggleComplete?: (id: number) => void
  reload: () => Promise<void>
  showMessage: (text: string, error?: boolean) => void
}

const TodoCard: React.FC<TodoCardProps> = ({ todoItem, onToggleComplete, reload, showMessage}) => {
  const handleCheckboxChange = async (todoItem: ITodo) => {
    const updateTodo: ITodo = {
      id:todoItem.id,
      title: todoItem.title,
      isDone: !todoItem.isDone,
      isUrgent: todoItem.isUrgent,
      createdDate: todoItem.createdDate
    }

    try {
      const status = await UseUpdate(updateTodo);

      if (status === 200) {
        await reload();
        showMessage("Todo updated successfully");

        if (onToggleComplete) {
          onToggleComplete(todoItem.id)
        }
      } else {
        showMessage("Failed to update todo", true);
      }
    } catch {
      showMessage("Failed to update todo", true);
    }
  };

  const handleDelete = async (id:number) => {
    try {
      const status = await UseDelete(id);

      if (status === 204) {
        await reload();
        showMessage("Todo deleted");
      } else {
        showMessage("Failed to delete todo", true);
      }
    } catch {
      showMessage("Failed to delete todo", true);
    }
  };

  return (
    <div className={`card-container ${todoItem.isDone ? 'completed' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={todoItem.isDone}
            onChange={() => handleCheckboxChange(todoItem)}
          />
          <h3>
            {todoItem.title}
          </h3>
          {todoItem.isUrgent && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#050505ff" viewBox="0 0 256 256">
              <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Z"></path>
            </svg>
          )}
        </div>
        <button
          onClick={() => handleDelete(todoItem.id)}
          className='btn'
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TodoCard
