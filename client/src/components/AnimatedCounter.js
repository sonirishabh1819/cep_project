'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  // If the value isn't a number (e.g. '∞'), just display it directly
  const numericValue = parseFloat(value);
  const isNumeric = !isNaN(numericValue);

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    let start = 0;
    const steps = 60;
    const increment = numericValue / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [isInView, numericValue, isNumeric, duration]);

  return (
    <span ref={ref}>
      {isNumeric ? count : value}
      <span className="text-[#d4a853]">{suffix}</span>
    </span>
  );
}
