import { useState } from 'react';
import './App.css'
import TodoCard from './components/TodoCard'
import useGetAll from './hooks/UseGetAll'
import AddTodo from './components/AddTodo';
import type INewTodo from './assets/models/INewTodo';
import UseAdd from './hooks/UseAdd';

function App() {
  const { todos, reload } = useGetAll();
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const openPopup = () => setShowPopup(true);

  const handleAddTodo = async (title: string, isUrgent: boolean) => {
    const newTodo: INewTodo = { title, isUrgent };

    try {
      const status = await UseAdd(newTodo);
      
      if (status === 201 || status === 204) {
        showMessage("Todo added successfully");
        await reload();
      } else {
        throw new Error("Add failed");
      }
    } catch {
      showMessage("Failed to add todo", true);
    }
  };

  const showMessage = (text: string, error?: boolean) => {
    setIsError(!!error);
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
  <div className='root'>
    <div className='container'>
    <h1>Todo</h1>
    <button className='btn' onClick={openPopup}>Add Todo</button>


    <AddTodo
      isOpen={showPopup}
      onClose={() => setShowPopup(false)}
      onAdd={handleAddTodo}
    />

    {message && (
      <div className={`message ${isError ? 'error' : 'success'}`}>
        {message}
      </div>
    )}
      <div className="todo-list">
        {(!todos || todos.length === 0) ? (
          <p>You don't have any todos!</p>
        ) : (
          todos.map((todo, index) => (
            <div
              key={index}
              className={`todo-card ${index % 2 !== 0 ? 'alt' : ''}`}
            >
              <TodoCard todoItem={todo} key={todo.id} reload={reload} showMessage={showMessage}/>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
  );
}

export default App