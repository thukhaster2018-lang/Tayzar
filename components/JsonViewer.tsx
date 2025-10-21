
import React, { useState } from 'react';
import type { PatientDataSchema } from '../types';

interface JsonViewerProps {
  data: PatientDataSchema;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 border border-gray-200 rounded-lg bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
      >
        <span>View Logging Data (JSON)</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="p-3 border-t border-gray-200">
          <pre className="text-xs bg-white p-4 rounded-md overflow-x-auto text-gray-800">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default JsonViewer;
