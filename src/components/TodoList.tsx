'use client';

import { useState, useRef } from 'react';
import { Todo } from '@/types/journal';

interface TodoListProps {
  todos: Todo[];
  onAddTodo: (todo: Todo) => void;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

export function TodoList({ todos, onAddTodo, onToggleTodo, onDeleteTodo }: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('');
  const [animateIndex, setAnimateIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false
      };
      onAddTodo(newTodo);
      setNewTodoText('');
      
      // Focus back on input after adding
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  // Set animation for newly toggled task
  const handleToggle = (id: number) => {
    setAnimateIndex(id);
    onToggleTodo(id);
    setTimeout(() => setAnimateIndex(null), 1000);
  };

  // Add delete animation
  const handleDelete = (id: number) => {
    setAnimateIndex(id);
    setTimeout(() => onDeleteTodo(id), 300);
  };

  return (
    <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 shadow-md">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-[#6c54f8] flex items-center">
        <svg 
          className="w-5 h-5 md:w-6 md:h-6 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        Today&apos;s Builder Tasks
      </h3>
      
      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border text-violet-500 border-[#6c54f8]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6c54f8] text-sm md:text-base"
        />
        <button
          onClick={handleAddTodo}
          className="px-3 md:px-4 py-2 bg-[#6c54f8] text-white rounded-full hover:bg-[#5643d6] focus:outline-none focus:ring-2 focus:ring-[#6c54f8] transition-all duration-200 transform hover:scale-105 text-sm md:text-base shadow-md"
        >
          <span className="flex items-center">
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add
          </span>
        </button>
      </div>
      
      <ul  className={`space-y-2 md:space-y-3 ${todos.length > 0 ? 'overflow-y-auto' : ''} max-h-64 md:max-h-80 pr-1`}>
        {todos.length === 0 ? (
          <li className="text-gray-500 text-center py-6 animate-pulse">
            <div className="flex flex-col items-center">
              <svg 
                className="w-10 h-10 text-[#6c54f8]/50 mb-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Add your builder tasks for the day...
            </div>
          </li>
        ) : (
          todos.map((todo) => (
            <li 
              key={todo.id} 
              className={`flex items-center justify-between p-3 md:p-4 rounded-xl transition-all duration-300 ${
                animateIndex === todo.id && todo.completed 
                  ? 'bg-green-100 scale-100' 
                  : animateIndex === todo.id 
                    ? 'scale-95 opacity-50' 
                    : 'bg-[#6c54f8]/10'
              } ${todo.completed ? 'bg-[#6c54f8]/5' : ''}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                    className="h-5 w-5 md:h-6 md:w-6 rounded-full border-2 border-[#6c54f8] text-[#6c54f8] focus:ring-[#6c54f8] cursor-pointer appearance-none"
                  />
                  {todo.completed && (
                    <svg 
                      className="absolute top-0 left-0 h-5 w-5 md:h-6 md:w-6 text-[#6c54f8] pointer-events-none animate-appear" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="3" 
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className={`truncate text-sm md:text-base ${
                  todo.completed 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-800'
                }`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-400 hover:text-red-600 focus:outline-none ml-2 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                aria-label="Delete task"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 md:h-5 md:w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>
      
      {todos.length > 0 && (
        <div className="mt-4 text-xs md:text-sm text-gray-500 flex justify-between items-center pt-2 border-t border-gray-100">
          <div>
            {todos.filter(todo => todo.completed).length} of {todos.length} completed
          </div>
          <div className="flex items-center">
            <div className="bg-[#6c54f8] h-2 rounded-full" style={{ 
              width: `${(todos.filter(todo => todo.completed).length / todos.length) * 100}px`,
              maxWidth: '100px'
            }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

