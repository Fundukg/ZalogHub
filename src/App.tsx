import { useState, useEffect } from "react";
import type { Todo, FilterType } from "./types/types";
import "./App.css";

export default function App() {
  // Ленивая инициализация для чтения из localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("zaloghub");
    return saved ? JSON.parse(saved) : [];
  });
  console.log(localStorage.getItem("zaloghub"));
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Сохранение при любом изменении массива задач
  useEffect(() => {
    localStorage.setItem("zaloghub", JSON.stringify(todos));
  }, [todos]);



  // 1. Добавление задачи (с защитой от пустых строк)
  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(), // Нативный генератор уникальных ID
      text: inputValue.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  // 2. Переключение статуса
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // 3. Удаление
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 4. Логика фильтрации
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Список задач</h1>

      <form onSubmit={addTodo} className="input-group">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Что нужно сделать?"
        />
        <button type="submit">Добавить</button>
      </form>

      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Все
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Активные
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Выполненные
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="text">{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
