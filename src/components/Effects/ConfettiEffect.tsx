import React from 'react'
import confetti from 'canvas-confetti'
import { TriggerProps } from '../Shop/Checkout';

const ConfettiEffect = ({ handleTrigger }: {
  handleTrigger: React.Dispatch<React.SetStateAction<TriggerProps>>
}) => {

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {

    if (canvasRef.current) {
      const confettiEffect = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true
      });
      confettiEffect({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.53,
        }
      })
      // dismount component
      setTimeout(() => {
        handleTrigger((prev) => ({
          ...prev,
          confetti: false
        }))
      }, 2500)
    }

  }, []);

  return (
    <canvas ref={canvasRef} className='absolute w-full h-full' />
  )
}

export default ConfettiEffect