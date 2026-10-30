import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
      >
        <span className="text-sm font-semibold text-gray-800 dark:text-white pr-2">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-3 whitespace-pre-wrap">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
