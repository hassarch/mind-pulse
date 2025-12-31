import * as React from 'react';

export interface SliderProps {
  value: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider: React.FC<SliderProps> = ({ value, onValueChange, min = 0, max = 100, step = 1 }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    onValueChange?.([next]);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      className="w-full h-2 rounded-lg bg-secondary/40 accent-primary"
    />
  );
};

export default Slider;
