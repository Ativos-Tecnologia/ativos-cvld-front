import React, { FormEvent } from 'react'
import { BiX } from 'react-icons/bi';
import PricingModal from './PricingModal';
import useHandleSteps from '@/hooks/useHandleSteps';
import Steps from './Steps';
import FormModal, { ShopFormProps } from './FormModal';
import ReviewModal from './ReviewModal';
import Checkout from './Checkout';

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

export type ShopProps = {
    plan: PlanProps;
    user_info: ShopFormProps;
}

const ShopModal = ({ state, setState }: {
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

    const [data, setData] = React.useState<ShopProps | undefined>();
    const STEPS: number = 4;

    const { currentStep, changeStep } = useHandleSteps(STEPS);

    // send data to LocalStorage
    React.useEffect(() => {
        if (!data) return;

        const saveShopInfoToLocalStorage = () => {
            if (!localStorage.getItem('shop_info')) {
                localStorage.setItem('shop_info', JSON.stringify(data));
            } else {
                localStorage.setItem('shop_info', JSON.stringify(data));
            }
        }
        saveShopInfoToLocalStorage();
    }, [data]);

    React.useEffect(() => {

        const shopInfo = localStorage.getItem('shop_info');
        if (shopInfo !== null) {
            const parsedData: ShopProps = JSON.parse(shopInfo);
            setData(parsedData);
        }

    }, [])

    // change data values
    // const handleValue = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    //     setData(prevState => ({
    //         ...prevState,
    //         user_info: {
    //             ...prevState.user_info,
    //             [field]: e.target.value
    //         }
    //     }))
    // }

    return (
        <div>
            <div className={`fixed top-0 left-0 flex items-center justify-center min-w-full max-w-screen h-screen z-999 bg-black/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 transition-all duration-300 ease-in-out`}>
                {/* modal div */}
                <div className='relative 2xsm:w-11/12 sm:w-150 md:w-180 lg:w-[700px] xl:w-[1100px] 2xl:w-[1200px] h-fit rounded-lg bg-snow py-10 px-5 border border-stroke dark:border-strokedark dark:bg-boxdark'>
                    <span className='absolute top-4 right-4 cursor-pointer'>
                        <BiX style={{ width: '26px', height: '26px', fill: '#BAC1CB' }} onClick={() => setState(false)} />
                    </span>
                    <Steps currentStep={currentStep} />
                    {/* {currentComponent} */}
                    {currentStep === 1 && <PricingModal key={0} setData={setData} changeStep={changeStep} currentStep={currentStep} />}
                    {currentStep === 2 && <FormModal data={data} currentStep={currentStep} setData={setData} changeStep={changeStep} />}
                    {currentStep === 3 && <ReviewModal data={data} currentStep={currentStep} changeStep={changeStep} />}
                    {currentStep === 4 && <Checkout data={data} setState={setState} />}
                </div>
                {/* end modal div */}
            </div>
        </div>
    )
}

export default ShopModal