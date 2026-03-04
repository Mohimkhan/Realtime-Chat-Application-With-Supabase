"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const TiltCard = ({
  children,
  className,
  initialRotate = 0,
}: {
  children: React.ReactNode;
  className?: string;
  initialRotate?: number;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(50px)" }}>{children}</div>
    </motion.div>
  );
};

export default function Hero() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center overflow-hidden py-2 mt-16 md:py-4">
      <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center gap-11 sm:gap-0 justify-center h-full max-h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 mb-6 md:mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-balance"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400">
              Chat From Anywhere
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              with your friends
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-[550px] text-neutral-500 text-sm md:text-base dark:text-neutral-400"
          >
            Experience seamless, realtime communication with RapidChat. Connect
            and share moments across the globe in a premium interface.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/rooms">
              <Button
                size="lg"
                className="rounded-full px-8 h-10 md:h-11 text-sm md:text-base font-medium shadow-lg hover:shadow-primary/25 transition-all"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <div className="relative w-full max-w-4xl perspective-2000 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative w-full aspect-[16/10]"
          >
            {/* Dark Mode Screenshot with Tilt */}
            <TiltCard className="absolute top-0 right-0 w-full md:w-[85%] z-20">
              <div className="rounded-xl border border-neutral-200 bg-white p-1 shadow-2xl dark:border-neutral-800 dark:bg-black/50 overflow-hidden transform md:-rotate-1">
                <Image
                  src="/screenshots/rooms_page_dark.png"
                  alt="RapidChat Dark Mode"
                  width={1200}
                  height={800}
                  className="rounded-lg object-contain w-full h-auto"
                  priority
                />
              </div>
            </TiltCard>

            {/* Light Mode Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute top-4 md:top-6 left-0 z-10 hidden md:block w-[75%] rounded-xl border border-neutral-200 bg-white p-1 shadow-xl dark:border-neutral-800 dark:bg-black/40 overflow-hidden transform -rotate-3 -translate-x-4 opacity-60"
            >
              <Image
                src="/screenshots/rooms_page_light.png"
                alt="RapidChat Light Mode"
                width={1000}
                height={667}
                className="rounded-lg object-contain w-full h-auto"
              />
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl opacity-30 -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
