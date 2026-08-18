"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function FadeIn({
  children,
  delay = 0,
  className,
}:FadeInProps){

  return(
    <motion.div
    className={className}
    initial={{opacity:0, scale:0.96}}
    whileInView={{opacity:1, scale:1}}
    viewport={{once:true, amount:0.2}}
    transition={{duration:0.6, delay, ease:"easeInOut"}}
    >
      {children}
    </motion.div>
  )
}