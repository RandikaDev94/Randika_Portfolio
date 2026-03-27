"use client";

import { motion, Variants } from "framer-motion";
import React from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  elementType?: "h1" | "h2" | "h3" | "div";
}

export function SplitText({ text, className = "", delay = 0, elementType = "h2" }: SplitTextProps) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
      rotateZ: 4,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 100,
      },
    },
  };

  const renderWords = () =>
    words.map((word, index) => (
      <span key={index} className="inline-block overflow-hidden pb-1 pr-[0.3em] -mb-1">
        <motion.span variants={child} className="inline-block origin-bottom-left">
          {word}
        </motion.span>
      </span>
    ));

  if (elementType === "h1") {
    return (
      <motion.h1 variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={className}>
        {renderWords()}
      </motion.h1>
    );
  }

  if (elementType === "h3") {
    return (
      <motion.h3 variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={className}>
        {renderWords()}
      </motion.h3>
    );
  }

  if (elementType === "div") {
    return (
      <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={className}>
        {renderWords()}
      </motion.div>
    );
  }

  return (
    <motion.h2 variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={className}>
      {renderWords()}
    </motion.h2>
  );
}
