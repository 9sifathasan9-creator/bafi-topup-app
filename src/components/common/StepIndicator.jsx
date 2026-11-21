import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep = 1 }) => {
  const steps = [1, 2, 3, 4];

  return (
    <div className="flex items-center gap-1.5">
      {steps.map((step, index) => {
        const isPassed = step < currentStep;
        const isCurrent = step === currentStep;
        
        // আমাদের নিজেদের কালার থিম (পার্পল এবং ব্লু)
        let circleClass = "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ";
        if (isPassed) {
          circleClass += "bg-purple-600 text-white shadow-md shadow-purple-500/30";
        } 
        else if (isCurrent) {
          circleClass += "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-purple-300 dark:ring-purple-900";
        } 
        else {
          circleClass += "bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-300 dark:border-gray-600";
        }

        let lineClass = "w-4 h-[2px] transition-all duration-300 ";
        if (isPassed) {
          lineClass += "bg-purple-600";
        } else {
          lineClass += "bg-gray-300 dark:bg-gray-700";
        }

        return (
          <React.Fragment key={step}>
            <div className={circleClass}>
              {isPassed ? <Check className="w-3.5 h-3.5" /> : step}
            </div>
            {index < steps.length - 1 && <div className={lineClass} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default StepIndicator;
