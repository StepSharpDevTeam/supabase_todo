"use client"
import Link from 'next/link'
import React from 'react'
import supabase from "../../config/supabseClient"
import { useEffect, useState } from 'react'
import { Edit, Trash } from 'lucide-react' // Importing icons from lucide-react

export default function Tasks() {
  const [todos, setTodos] = useState<any[] | null>(null);
  const [fetchError, setfetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')

      if (error) {
        setfetchError('could not fetch data')
        setTodos(null)
      }

      if (data) {
        setTodos(data)
        setfetchError(null)
      }
    }
    fetchTodos()
  }, [])

  // Delete Todo function
  const handleDelete = async (id: string) => {
    const confirmation = window.confirm("Are you sure you want to delete this Todo?");

    if (confirmation) {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error deleting Todo');
        return;
      }

      setTodos((prevTodos) => prevTodos?.filter(todo => todo.id !== id) || []);
    }
  }

  return (
    <div className='flex justify-center py-20 w-full flex-wrap'>
      <h1 className='text-2xl'>All Todo</h1>

      <nav className='w-full flex justify-center'>
        <ul>
          <li className='cursor-pointer bg-blue-700 text-white rounded-md shadow-sm p-2 mt-2'>
            <Link href="/create">
              Create todo</Link>
          </li>
        </ul>
      </nav>

      <div className='p-10 w-full'>
        {fetchError && (<p>{fetchError}</p>)}
        {todos === null ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8'>
            {/* Skeleton loaders */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
              </div>
            ))}
          </div>
        ) : todos && todos.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8'>
            {todos.map((todo) => (
              <div key={todo.id} className='bg-white p-6 rounded-lg shadow-md flex flex-col'>
                <h2 className='text-xl font-semibold mb-2'>{todo.title}</h2>
                <p className='text-gray-600 text-sm mb-4'>{todo.description}</p>

                <div className='flex justify-between items-center mb-4'>
                  <span className={`px-3 py-1 text-xs font-medium rounded ${todo.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {todo.status}
                  </span>

                  <span className={`px-3 py-1 text-xs font-medium rounded ${todo.priority === 'High' ? 'bg-red-100 text-red-800' : todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                    {todo.priority}
                  </span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-gray-700'>Assigned to: {todo.assigned_to}</span>
                </div>

                <div className="flex justify-between mt-4">
                  <Link href={"/update/" + todo.id} className="text-blue-500 hover:text-blue-700">
                    <Edit size={20} />
                  </Link>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(todo.id)} // Call delete function on click
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
  )
}
