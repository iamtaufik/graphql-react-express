import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { GET_TODOS } from './query/todoQuery';
import { CREATE_TODO, DELETE_TODO, UPDATE_TODO } from './mutation/todoMutation';

enum Status {
  Done = 'done',
  NotDone = 'not_done',
}

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

function App() {
  const { loading, error, data } = useQuery<{ todos: Todo[] }>(GET_TODOS);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [createTodo] = useMutation(CREATE_TODO);
  const [statusMap, setStatusMap] = useState<{ [key: string]: Status }>({});
  const [title, setTitle] = useState('');

  if (loading) return <p className="text-red-800">Loading...</p>;
  if (error || !data) return <p className="text-red-800">Error: {JSON.stringify(error)}</p>;

  const todos = data.todos;

  const handleStatusChange = (id: string, value: Status) => {
    const completed = value === Status.Done;

    setStatusMap((prevStatusMap) => ({
      ...prevStatusMap,
      [id]: value,
    }));

    updateTodo({
      variables: { id, completed },
      optimisticResponse: {
        updateTodo: {
          __typename: 'Todo',
          id,
          title: todos.find((todo) => todo.id === id)?.title || '',
          completed,
        },
      },
      update(cache, { data: { updateTodo } }) {
        // Update the cache with the new todo status
        const existingTodos = cache.readQuery({ query: GET_TODOS });
        if (existingTodos) {
          const newTodos = (existingTodos as any).todos.map((todo: any) => (todo.id === id ? { ...todo, completed } : todo));
          cache.writeQuery({
            query: GET_TODOS,
            data: { todos: newTodos },
          });
        }
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteTodo({
      variables: { id },
      update(cache) {
        // Update the cache by removing the deleted todo
        const existingTodos = cache.readQuery({ query: GET_TODOS });
        if (existingTodos) {
          const newTodos = (existingTodos as any).todos.filter((todo: any) => todo.id !== id);
          cache.writeQuery({
            query: GET_TODOS,
            data: { todos: newTodos },
          });
        }
      },
    });
  };

  const handleCreate = () => {
    if (!title) {
      return;
    }

    createTodo({
      variables: { title },
      optimisticResponse: {
        createTodo: {
          __typename: 'Todo',
          title,
        },
      },
      update(cache, { data: { createTodo } }) {
        // Update the cache with the new todo
        const existingTodos = cache.readQuery({ query: GET_TODOS });
        if (existingTodos) {
          const newTodos = [...(existingTodos as any).todos, createTodo];
          cache.writeQuery({
            query: GET_TODOS,
            data: { todos: newTodos },
          });
        }
      },
    });

    setTitle('');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-zinc-800">
      <div className="w-full max-w-2xl p-10 bg-white rounded-xl">
        <h1 className="mb-4 text-2xl font-bold">Todos</h1>
        <div className="flex justify-between mb-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full max-w-md p-2 rounded-md " placeholder="Enter a new todo" />
          <div>
            <button type="button" onClick={handleCreate} className="w-full p-2 text-white bg-blue-500 rounded-lg max-w ">
              Add Todo
            </button>
          </div>
        </div>
        <ul>
          {
            todos.length === 0 && <li className="py-2">No todos found</li>
          }
          {todos.map((todo) => {
            const status = statusMap[todo.id] || (todo.completed ? Status.Done : Status.NotDone);

            return (
              <li key={todo.id} className="flex items-center justify-between py-2">
                <span>{todo.title}</span>
                <div className="space-x-4">
                  <select className={`${status === 'done' ? 'bg-green-500 ' : 'bg-yellow-500'} p-2 rounded-md`} value={status} onChange={(e) => handleStatusChange(todo.id, e.target.value as Status)}>
                    <option value={Status.Done}>Done</option>
                    <option value={Status.NotDone}>Not Done</option>
                  </select>
                  <button type="button" onClick={() => handleDelete(todo.id)} className="p-2 text-white bg-red-500 rounded-lg">
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

export default App;
