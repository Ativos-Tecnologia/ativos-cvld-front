import React from 'react'
import { ShopProps } from '.'

const ReviewModal = ({ data, currentStep, changeStep }: {
    data: ShopProps | undefined,
    currentStep: number,
    changeStep: (step: number) => void
}) => {

    console.log(data)

    return (
        <div>
            <button onClick={() => changeStep(currentStep -1)}>voltar</button>
        </div>
    )
}

export default ReviewModal