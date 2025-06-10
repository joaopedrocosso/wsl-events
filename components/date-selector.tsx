"use client"

import { motion } from "framer-motion"

interface DateSelectorProps {
  selectedDates: string[]
  onToggle: (date: string) => void
}

export default function DateSelector({ selectedDates, onToggle }: DateSelectorProps) {
  // Available dates from 19 to 28
  const availableDates = Array.from({ length: 10 }, (_, i) => (i + 19).toString())

  return (
    <div className="grid grid-cols-5 gap-4">
      {availableDates.map((date, index) => (
        <motion.button
          key={date}
          onClick={() => onToggle(date)}
          className={`relative rounded-xl p-4 h-24 flex flex-col items-center justify-center transition-all duration-300 ${
            selectedDates.includes(date)
              ? "bg-gradient-to-br from-blue-600 to-cyan-600 shadow-xl glow-blue-intense"
              : "bg-gray-800/50 hover:bg-gray-700/50 border border-blue-500/30 hover:border-blue-400/50"
          }`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -3 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <span className="text-2xl font-bold text-white">{date}</span>
          <span className="text-xs text-blue-300 font-medium">JUN</span>
          {selectedDates.includes(date) && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-white/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}
