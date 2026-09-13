import React, { useRef, useState, useEffect } from 'react';

const FadeIn = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const dirStyles = {
    up: 'translate-y-6',
    down: '-translate-y-6',
    left: 'translate-x-6',
    right: '-translate-x-6',
    none: '',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${dirStyles[direction]}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
