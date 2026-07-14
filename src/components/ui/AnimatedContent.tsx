"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedContentProps {
  children: React.ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: any;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  className?: string;
}

export const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 50,
  direction = "vertical",
  reverse = false,
  duration = 0.6,
  ease = [0.21, 0.47, 0.32, 0.98], // Cozy premium cubic-bezier ease
  initialOpacity = 0,
  animateOpacity = true,
  scale = 0.97,
  threshold = 0.1,
  delay = 0,
  className = "",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });

  const getDirectionOffset = () => {
    const offset = reverse ? -distance : distance;
    return direction === "vertical"
      ? { y: offset, x: 0 }
      : { x: offset, y: 0 };
  };

  const offset = getDirectionOffset();

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: animateOpacity ? initialOpacity : 1,
        scale: scale,
        x: offset.x,
        y: offset.y,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: duration,
        delay: delay,
        ease: ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContent;
