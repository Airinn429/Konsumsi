"use client";

import React from "react";
import { motion } from "framer-motion";

const ConfettiPiece: React.FC = () => {
    const colors = ['#8b5cf6', '#a78bfa', '#d946ef', '#f472b6', '#fb7185', '#ec4899', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomXStart = Math.random() * 100;
    const randomXEnd = randomXStart + (-20 + Math.random() * 40);
    const randomDelay = Math.random() * 4;
    const randomDuration = 2 + Math.random() * 3;
    const randomRotationStart = Math.random() * 360;
    const randomRotationEnd = randomRotationStart + (-360 + Math.random() * 720);

    return (
        <motion.div
            className="absolute top-0 w-2 h-4"
            style={{ left: `${randomXStart}vw`, background: randomColor, borderRadius: '4px' }}
            initial={{ y: '-10vh', rotate: randomRotationStart, opacity: 1 }}
            animate={{
                y: '110vh',
                x: [`${randomXStart}vw`, `${randomXEnd}vw`],
                rotate: randomRotationEnd,
            }}
            transition={{
                duration: randomDuration,
                delay: randomDelay,
                ease: "linear",
            }}
        />
    );
};

export const ConfettiCanvas = () => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
    }}>
        {Array.from({ length: 150 }).map((_, i) => <ConfettiPiece key={i} />)}
    </div>
);