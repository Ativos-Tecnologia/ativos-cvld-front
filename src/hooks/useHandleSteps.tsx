import React, { FormEvent } from "react";

const useHandleSteps =  (steps: React.JSX.Element[]) => {
    const [currentStep, setCurrentStep] = React.useState<number>(0);

    function changeStep (i: number, e?: FormEvent) {
        if (e) e?.preventDefault();
        if (i < 0 || i >= steps.length) return;
        setCurrentStep(i);
    }

    return {
        currentStep,
        changeStep,
        isLastStep: currentStep + 1 === steps.length ? true : false,
        currentComponent: steps[currentStep],
    }
}

export default useHandleSteps;
