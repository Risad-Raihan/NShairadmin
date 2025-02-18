'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold">
            <span className="floating-text inline-block bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              NS Hair Admin
            </span>
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-gray-600"
        >
          Welcome to your production management dashboard
        </motion.p>
      </motion.div>
    </div>
  );
}
