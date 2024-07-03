import React, { FormEvent } from "react";

const useHandleSteps =  (steps: number) => {
    const [currentStep, setCurrentStep] = React.useState<number>(1);

    function changeStep (i: number, e?: FormEvent) {
        if (e) e?.preventDefault();
        if (i < 0 || i >= steps) return;
        setCurrentStep(i);
    }

    return {
        currentStep,
        changeStep,
        // isLastStep: currentStep + 1 === steps.length ? true : false,
        // currentComponent: steps[currentStep],
    }
}

export default useHandleSteps;
