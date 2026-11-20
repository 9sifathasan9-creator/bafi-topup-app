import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep = 1 }) => {
  const steps = [1, 2, 3];

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isPassed = step < currentStep;
        const isCurrent = step === currentStep;
        
        // পাস করা ধাপ (পার্পল + টিক)
        let circleClass = "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ";
        if (isPassed) {
          circleClass += "bg-purple-600 text-white shadow-md shadow-purple-500/30";
        } 
        // বর্তমান ধাপ (কমলা + নাম্বার)
        else if (isCurrent) {
          circleClass += "bg-orange-500 text-white shadow-md shadow-orange-500/30";
        } 
        // ভবিষ্যৎ ধাপ (ধূসর + নাম্বার)
        else {
          circleClass += "bg-transparent border border-gray-400 dark:border-gray-600 text-gray-400 dark:text-gray-500";
        }

        // সংযোগকারী লাইন (Line)
        let lineClass = "w-4 h-[1px] transition-all duration-300 ";
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
            {index < steps.length - 1 && (
              <div className={lineClass} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
