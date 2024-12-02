"use client"
import supabase from '@/config/supabseClient';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type UpdateTodoProps = {
    id: string;
}

function UpdateTodo({ id }: UpdateTodoProps) {
    console.log("id",id);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Low");
    const [status, setStatus] = useState("In Progress");
    const [assigned_to, setAssignee] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTodo = async () => {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                router.push("/")
                return
            }

            if (data) {
                setTitle(data.title)
                setDescription(data.description)
                setPriority(data.priority)
                setStatus(data.status)
                setAssignee(data.assigned_to)
                console.log(data);
            }
        }
        fetchTodo()
    }, [id])

    // Handle form submission
    const handleUpdateTodo = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form fields (optional)
        if (!title || !description || !assigned_to) {
            setFormError("Please fill in all fields.");
            return;
        }

        const { data, error } = await supabase
            .from('todos')
            .update({ title, description, priority, status, assigned_to })
            .eq('id', id);

        if (error) {
            setFormError("Error updating todo.");
        } else {
            router.push("/");  // Redirect to the home page after successful update
        }
    }

    return (
        <div className="flex justify-center py-20">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Update Todo</h2>

                {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}

                <form onSubmit={handleUpdateTodo}>
                    {/* Title Input */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter title"
                            required
                        />
                    </div>

                    {/* Description Textarea */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter description"
                            rows={4}
                            required
                        />
                    </div>

                    {/* Priority Dropdown */}
                    <div className="mb-4">
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {/* Status Dropdown */}
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        >
                            <option value="In Progress">In Progress</option>
                            <option value="Open">Open</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Assignee Input */}
                    <div className="mb-6">
                        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
                            Assigned To
                        </label>
                        <input
                            type="text"
                            id="assignee"
                            value={assigned_to}
                            onChange={(e) => setAssignee(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter assignee's name"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Update Todo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateTodo
