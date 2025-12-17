Solution
The useStep hook can be implemented by storing the step number in a useState state and defining the utility methods to manipulate the step number in terms of the state's setter function. We bound the step updates between 1 and maxStep to ensure the step number does not go out of bounds.

Remember to wrap the utility methods in useCallback to prevent unnecessary re-renders of the calling component.


Open files in workspace

import { Dispatch, SetStateAction, useCallback, useState } from 'react';

interface UseStepReturn {
  step: number;
  next: () => void;
  previous: () => void;
  reset: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  setStep: Dispatch<SetStateAction<number>>;
}

export default function useStep(maxStep: number): UseStepReturn {
  const [currentStep, setCurrentStep] = useState(1);

  const setStep: UseStepReturn['setStep'] = useCallback(
    (step) => {
      const newStep = typeof step === 'function' ? step(currentStep) : step;
      if (newStep < 1 || newStep > maxStep) return;

      setCurrentStep(newStep);
    },
    [maxStep, currentStep],
  );

  const next: UseStepReturn['next'] = useCallback(() => {
    setCurrentStep((step) => Math.min(step + 1, maxStep));
  }, [maxStep]);

  const previous: UseStepReturn['previous'] = useCallback(() => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  }, []);

  const reset: UseStepReturn['reset'] = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return {
    step: currentStep,
    next,
    previous,
    hasNext: currentStep < maxStep,
    hasPrevious: currentStep > 1,
    setStep,
    reset,
  };
}