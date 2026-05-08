import React from 'react';
import { motion } from 'framer-motion';

export function TriDino({ isJumping = false }: { isJumping?: boolean }) {
  return (
    <motion.div
      animate={isJumping ? { y: [-20, -60, 0], rotate: [0, -10, 10, 0] } : { y: [0, -10, 0] }}
      transition={isJumping ? { duration: 0.5 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-48 h-48 mx-auto"
    >
      <div className="absolute inset-0 bg-green-500 rounded-3xl rounded-tl-[64px] rounded-br-[64px] shadow-lg border-4 border-green-700">
        {/* Face */}
        <div className="absolute top-4 left-4 flex gap-4">
          <div className="w-4 h-6 bg-black rounded-full" />
          <div className="w-4 h-6 bg-black rounded-full" />
        </div>
        <div className="absolute top-12 left-6 w-8 h-4 border-b-4 border-black rounded-b-full" />
        
        {/* Horns */}
        <div className="absolute -top-6 left-2 w-4 h-8 bg-white border-2 border-gray-300 rounded-t-full rotate-[-20deg]" />
        <div className="absolute -top-6 left-12 w-4 h-8 bg-white border-2 border-gray-300 rounded-t-full rotate-[20deg]" />
        <div className="absolute top-8 -left-4 w-4 h-6 bg-white border-2 border-gray-300 rounded-l-full rotate-[-90deg]" />
        
        {/* Crest */}
        <div className="absolute -right-8 top-0 w-16 h-32 bg-green-600 rounded-r-full border-4 border-green-800 -z-10" />
      </div>
    </motion.div>
  );
}
