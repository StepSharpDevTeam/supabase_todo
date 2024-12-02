"use client"
import supabase from '@/config/supabseClient';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type Props = {};

export default function CreateTodo(props: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Low");
    const [status, setStatus] = useState("In Progress");
    const [assigned_to, setAssignee] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate form fields
        if (!title || !description || !priority || !status || !assigned_to) {
            setFormError("Please fill all fields.");
            return;
        }

        // Insert the data into the todos table
        const { data, error } = await supabase
            .from('todos')
            .insert([{ title, description, priority, status, assigned_to }])
            .select();

        if (error) {
            setFormError("Form error");
            console.log(error);
        }

        if (data) {
            setFormError(null);
            console.log('Inserted data:', data);
            router.push("/")
        }
    };

    return (
        <div className="flex justify-center py-20">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Create New Todo</h2>

                <form onSubmit={handleSubmit}>
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
                            Create Todo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
