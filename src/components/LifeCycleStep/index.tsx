import React from 'react'
import { FaRegHandshake } from 'react-icons/fa'

const index = () => {
  return (
    <div className="main-container">
    <div className="steps-container">
        <div className="step completed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
            <div className="label completed">
                Prospecção
            </div>
            <div className="icon completed">
                <FaRegHandshake />
            </div>
        </div>
        <div className="line completed"></div>
        <div className="step completed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
            <div className="label completed">
                Tour
            </div>
            <div className="icon completed">
                <i className="far fa-map"></i>
            </div>
        </div>
        <div className="line next-step-in-progress">
        </div>
        <div className="step in-progress">
            <div className="preloader"></div>
            <div className="label loading">
                Proposta
            </div>
            <div className="icon in-progress">
                <i className="far fa-money-bill-alt"></i>
            </div>
        </div>
        <div className="line prev-step-in-progress"></div>
        <div className="step">
            <div className="label">
                Due Diligence
            </div>
            <div className="icon">
                <i className="far fa-newspaper"></i>
            </div>
        </div>
        <div className="line"></div>
        <div className="step">
            <div className="label">
                Concluído
            </div>
            <div className="icon">
                <i className="fas fa-home"></i>
            </div>
        </div>
    </div>
</div>
  )
}

export default index