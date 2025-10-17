// src/components/common/ColorPicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({ color, onChange }) => {
  const [open, setOpen] = useState(false);
  const popover = useRef();

  // Cierra al click fuera
  useEffect(() => {
    const handleOutside = (e) => {
      if (popover.current && !popover.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <div
        className="w-8 h-8 border rounded cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => setOpen((o) => !o)}
      />
      {open && (
        <div ref={popover} className="absolute z-10 mt-2">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
