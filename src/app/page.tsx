'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WalletConnect } from '@/components/WalletConnect';
import { TodoList } from '@/components/TodoList';
import { Todo } from '@/types/journal';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // Load todos from localStorage on initial load
  useEffect(() => {
    const storedTodos = localStorage.getItem('builderTodos');
    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (e) {
        console.error('Error parsing todos from localStorage', e);
      }
    } else {
      // Sample todos for new users
      const sampleTodos: Todo[] = [
        { id: 1, text: 'Setup Monad development environment', completed: false },
        { id: 2, text: 'Write my first journal entry', completed: false },
        { id: 3, text: 'Explore Monad blockchain features', completed: false }
      ];
      setTodos(sampleTodos);
      localStorage.setItem('builderTodos', JSON.stringify(sampleTodos));
    }
  }, []);

  // Update localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('builderTodos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mb-8 md:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div className="order-2 md:order-1">
            <div className="animate-fadeIn">
              <h1 className="text-3xl md:text-4xl hidden sm:block font-bold text-[#6c54f8] mb-4 md:mb-6">
                Document Your <span className="text-[#6c54f8] relative">
                  Builder Journey
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-[#6c54f8]/20 rounded-full"></span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">
                Create daily journal entries, track your progress, and mint your builder journey as NFTs on the Monad blockchain.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link href="/journal">
                  <div className="px-5 py-2.5 bg-[#6c54f8] text-white font-medium rounded-full shadow-md hover:shadow-lg hover:bg-[#5643d6] transition-all duration-200 transform hover:scale-105 text-sm md:text-base flex items-center">
                    <svg 
                      className="w-4 h-4 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Start Writing
                  </div>
                </Link>
                <Link href="/gallery">
                  <div className="px-5 py-2.5 bg-[#6c54f8]/10 text-[#6c54f8] font-medium rounded-full hover:bg-[#6c54f8]/20 transition-all duration-200 text-sm md:text-base flex items-center">
                    <svg 
                      className="w-4 h-4 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    View Gallery
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
         
            {/* Todo List Component */}
            <TodoList 
              todos={todos}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-6xl mx-auto mb-10 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#6c54f8] mb-6 md:mb-8">
          How it Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              icon: (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                />
              ),
              title: "1. Write Daily Entries",
              description: "Document your progress, challenges, and insights as you build on the Monad blockchain."
            },
            {
              icon: (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              ),
              title: "2. Track Your Tasks",
              description: "Add and track tasks to monitor your daily progress and stay accountable to your builder goals."
            },
            {
              icon: (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" 
                />
              ),
              title: "3. Mint as NFTs",
              description: "Turn your daily journal entries into NFTs on Monad, creating a permanent record of your builder journey."
            }
          ].map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:translate-y-[-5px]">
              <div className="bg-[#6c54f8]/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-[#6c54f8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {item.icon}
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto mb-8 bg-[#6c54f8]/10 rounded-2xl p-5 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[#6c54f8] mb-2 md:mb-4">
              Ready to Document Your Builder Journey?
            </h2>
            <p className="text-gray-700 text-sm md:text-base">
              Connect your wallet and start writing your first builder journal entry.
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <WalletConnect />
            <Link href="/journal">
              <div className="text-center px-5 py-2.5 bg-[#6c54f8]/10 text-[#6c54f8] font-medium rounded-full hover:bg-[#6c54f8]/20 transition-all duration-200 text-sm md:text-base">
                Start Writing
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}