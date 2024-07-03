import React, { FormEvent } from 'react'
import { BiX } from 'react-icons/bi';
import PricingModal from './PricingModal';
import useHandleSteps from '@/hooks/useHandleSteps';
import Steps from './Steps';

type PlanProps = {
    type: string;
    title: string;
    price: string;
    offer: {
        state: boolean;
        text: string;
    };
    features: string[];
}

type ShopProps = {
    plan: PlanProps;
}

const ShopModal = ({ state, setState }: {
    state: boolean;
    setState: (state: boolean) => void;
}) => {

    const [data, setData] = React.useState<ShopProps[]>();

    const steps: React.JSX.Element[] = [
        <PricingModal key={0} setData={setData} />
    ];

    const { currentStep, changeStep, isLastStep, currentComponent } = useHandleSteps(steps);

    return (
        <div>
            <div className={`fixed top-0 left-0 flex items-center justify-center min-w-full max-w-screen h-screen z-999 bg-black/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 transition-all duration-300 ease-in-out`}>
                {/* modal div */}
                <div className='relative w-11/12 xsm:w-100 sm:w-150 md:w-180 lg:w-[700px] xl:w-[1100px] 2xl:w-[1200px] h-fit rounded-lg bg-[#f1f1f1] py-10 px-5 border border-stroke dark:border-strokedark dark:bg-boxdark'>
                    <span className='absolute top-4 right-4 cursor-pointer'>
                        <BiX style={{ width: '26px', height: '26px', fill: '#BAC1CB' }} onClick={() => setState(false)} />
                    </span>
                    <Steps currentStep={currentStep} />
                    {currentComponent}
                </div>
                {/* end modal div */}
            </div>
        </div>
    )
}

export default ShopModal