"use client"
import React, { useEffect, useState } from 'react';
import supabase from '@/config/supabseClient';
import { Edit, Trash } from 'lucide-react'; 
import Link from 'next/link';

export default function Tasks() {
  const [todos, setTodos] = useState<any[] | null>(null);
  const [fetchError, setfetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*');

    if (error) {
      setfetchError('Could not fetch data');
      setTodos(null);
    }

    if (data) {
      setTodos(data);
      setfetchError(null);
    }
  };

  useEffect(() => {
    fetchTodos();

    const todosChannel = supabase
      .channel('todos_channel') 
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'todos',
      }, (payload) => {
        setTodos((prevTodos) => {
          if (prevTodos === null) return [payload.new]; 
          return [payload.new, ...prevTodos]; 
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'todos',
      }, (payload) => {
        setTodos((prevTodos) => {
          if (prevTodos === null) return []; 
          return prevTodos.map(todo =>
            todo.id === payload.new.id ? payload.new : todo
          );
        });
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'todos',
      }, (payload) => {
        setTodos((prevTodos) => {
          if (prevTodos === null) return []; 
          return prevTodos.filter(todo => todo.id !== payload.old.id);
        });
      })
      .subscribe();
       // Set loading to false once todos are fetched
    setLoading(false);

    return () => {
      supabase.removeChannel(todosChannel);
    };
  }, []);
  const handleDelete = async (todoId: number) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId); 

    if (error) {
      setfetchError('Failed to delete todo');
    } else {
      setTodos((prevTodos) => {
        if (!prevTodos) return [];
        return prevTodos.filter(todo => todo.id !== todoId);
      });
    }
  };


  return (
    <div className="flex justify-center py-20 w-full flex-wrap">
      <h1 className="text-2xl">All Todos</h1>

      <nav className="w-full flex justify-center">
        <ul>
          <li className="cursor-pointer bg-blue-700 text-white rounded-md shadow-sm p-2 mt-2">
            <Link href="/create">
              Create Todo
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-10 w-full">
        {fetchError && (<p>{fetchError}</p>)}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
              </div>
            ))}
          </div>
        ) : todos && todos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {todos.map((todo) => (
              <div key={todo.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{todo.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{todo.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded ${todo.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {todo.status}
                  </span>

                  <span className={`px-3 py-1 text-xs font-medium rounded ${todo.priority === 'High' ? 'bg-red-100 text-red-800' : todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                    {todo.priority}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Assigned to: {todo.assigned_to}</span>
                </div>

                <div className="flex justify-between mt-4">
                  <Link href={`/update/${todo.id}`} className="text-blue-500 hover:text-blue-700">
                    <Edit size={20} />
                  </Link>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(todo.id)} 
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No todos available</p>
        )}
      </div>
    </div>
  );
}
