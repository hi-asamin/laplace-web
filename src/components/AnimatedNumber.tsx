import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedNumber({
  value,
  duration = 1500,
  className = '',
  prefix = '¥ ',
  suffix = '',
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value === displayValue) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    const valueDiff = endValue - startValue;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // イージング関数（easeOutExpo）
      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };

      const currentValue = Math.round(startValue + valueDiff * easeOutExpo(progress));
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatValue = (val: number) => {
    if (suffix === '%' || suffix === '年') {
      return val.toFixed(suffix === '%' ? 1 : 0);
    }
    return val.toLocaleString();
  };

  return (
    <span className={`${className} ${isAnimating ? 'animate-pulse' : ''}`}>
      {prefix}
      {formatValue(displayValue)}
      {suffix}
    </span>
  );
}
