"use client";

import React from "react";
import { motion } from "framer-motion";
import { Coffee, Award, Target, Star, Eye } from "lucide-react";

interface TimelineItem {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const timelineData: TimelineItem[] = [
  {
    label: "2021",
    title: "Our Story",
    description: "Cozy Beans Café was founded in Chennai with a simple dream: to create a warm, inviting space where people could escape the rush of daily life and connect over a premium cup of hand-crafted artisan coffee.",
    icon: <Coffee className="w-5 h-5" />,
  },
  {
    label: "Mission",
    title: "Nourish & Warm Hearts",
    description: "Our mission is to serve meticulously crafted coffee, wholesome comfort food, and warm hospitality, creating an uplifting sanctuary that sparks conversations, creativity, and comfort.",
    icon: <Target className="w-5 h-5" />,
  },
  {
    label: "Vision",
    title: "The Ultimate 'Third Place'",
    description: "We strive to become the beloved 'third place' in every neighborhood, bridging home and work with aromatic brews, sustainable local sourcing, and warm smiles.",
    icon: <Eye className="w-5 h-5" />,
  },
  {
    label: "Expertise",
    title: "Meet Chef Kabir Singh",
    description: "With over 12 years of culinary experience in Parisian bakeries and Indian bistros, Chef Kabir curates our signature snacks and artisanal pastries, baking happiness from scratch daily.",
    icon: <Star className="w-5 h-5" />,
  },
  {
    label: "Milestones",
    title: "Top 10 Themed Cafés Award",
    description: "Ranked as one of Chennai's top themed cafés in 2024, celebrated for our eco-friendly woodcraft design, rich house blends, and premium barista training workshops.",
    icon: <Award className="w-5 h-5" />,
  },
];

export default function Timeline() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 20 } },
  } as const;

  return (
    <div className="relative py-12 max-w-5xl mx-auto px-4">
      {/* Central Vertical Line */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-borderColor/60 dark:bg-border/20 -translate-x-1/2" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-12"
      >
        {timelineData.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                isEven ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline dot / icon */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-primary dark:bg-accent text-white dark:text-[#1B100E] border-4 border-background z-20 shadow-md transition-transform duration-300 hover:scale-110">
                {item.icon}
              </div>

              {/* Empty Spacer Column (to align grid) */}
              <div className="hidden sm:block w-1/2 px-8" />

              {/* Story Content Card (Glassmorphism) */}
              <div className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-8 group">
                <div className="p-6 rounded-2xl glass border border-borderColor/40 shadow-sm hover:shadow-md transition-all duration-300 hover:border-accent/40 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent bg-[#FFF8E7] dark:bg-[#1F1210] border border-borderColor/35 px-2.5 py-1 rounded-full">
                      {item.label}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-textMuted dark:text-neutral-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
