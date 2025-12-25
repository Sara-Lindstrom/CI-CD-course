import { useEffect, useState } from "react";
import type ITodo from "../assets/models/ITodo";

const useGetAll = () => {
  const [todos, setTodos] = useState<ITodo[]>([])

  useEffect(() => {
    let cancelled = false;

    const loadTodos = async () => {
      const response = await fetch("/todo");
      const data: ITodo[] = await response.json();

      if (!cancelled) {
        setTodos(data);
      }
    };

    loadTodos();

    return () => {
      cancelled = true;
    };
  }, []);

  const reload = async () => {
    const response = await fetch("/todo");
    const data: ITodo[] = await response.json();
    setTodos(data);
  };

  return { todos, setTodos, reload };
};

export default useGetAll;

