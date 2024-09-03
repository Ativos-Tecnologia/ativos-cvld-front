import numberFormat from '@/functions/formaters/numberFormat';
import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  isNotCurrency?: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, isNotCurrency = false }) => {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = isNotCurrency ? Math.floor(progress * value) : progress * value
      setDisplayedValue(parseFloat(currentValue.toFixed(2)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  if (isNotCurrency) {
    return displayedValue;
  }

  return numberFormat(displayedValue || 0);
};

export default AnimatedNumber;