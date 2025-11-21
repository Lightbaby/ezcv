import React, { useState, useEffect, useRef } from 'react';

interface EditableProps {
  value: string | number;
  isEditing: boolean;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  label?: string;
}

export const Editable: React.FC<EditableProps> = ({ 
  value, 
  isEditing, 
  onChange, 
  multiline = false,
  className = "",
  label
}) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const inputRef = useRef<any>(null);

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    onChange(localValue);
  };

  if (!isEditing) {
    return <span className={className}>{value}</span>;
  }

  const baseStyles = "bg-black/50 border-b-2 border-hud-accent/50 text-white focus:outline-none focus:border-hud-accent w-full transition-all px-1 py-0.5";

  return (
    <div className="w-full relative group">
      {label && <span className="absolute -top-3 left-0 text-[10px] text-hud-accent uppercase opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>}
      {multiline ? (
        <textarea
          ref={inputRef}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          className={`${baseStyles} resize-none h-auto min-h-[100px] ${className}`}
        />
      ) : (
        <input
          ref={inputRef}
          type={typeof value === 'number' ? 'number' : 'text'}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          className={`${baseStyles} ${className}`}
        />
      )}
    </div>
  );
};