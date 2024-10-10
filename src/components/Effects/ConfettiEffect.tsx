import React from 'react'
import confetti from 'canvas-confetti'
import { TriggerProps } from '../Shop/Checkout';

const ConfettiEffect = ({ handleTrigger }: {
  handleTrigger: React.Dispatch<React.SetStateAction<any>>
}) => {

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const totalScreenWith = window.innerWidth

  React.useEffect(() => {

    if (canvasRef.current) {
      const confettiEffect = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true
      });
      confettiEffect({
        particleCount: 300,
        spread: totalScreenWith / 10,
        origin: {
          y: 0.53,
        }
      })
      // dismount component
      setTimeout(() => {
        handleTrigger(false)
      }, 3500)
    }

  }, []);

  return (
    <canvas ref={canvasRef} className='absolute w-full h-full top-0 left-0' />
  )
}

export default ConfettiEffect