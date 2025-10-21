
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto py-4 px-5 flex items-center space-x-4">
        <div className="bg-teal-500 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
        </div>
        <div>
            <h1 className="text-xl font-bold text-gray-800">Thukha Patient Mini Chatbot</h1>
            <p className="text-sm text-gray-500">Powered by Gemini AI</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
