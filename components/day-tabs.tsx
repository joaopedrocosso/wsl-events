"use client"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayTabsProps {
  selectedDates: string[]
  activeDay: string | null
  onDayChange: (day: string | null) => void
}

export default function DayTabs({ selectedDates, activeDay, onDayChange }: DayTabsProps) {
  // Sort dates numerically
  const sortedDates = [...selectedDates].sort((a, b) => Number.parseInt(a) - Number.parseInt(b))

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Filtrar por dia</h3>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onDayChange(null)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
            activeDay === null
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
              : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-blue-500/30",
          )}
        >
          Todos os dias
        </motion.button>

        {sortedDates.map((date) => (
          <motion.button
            key={date}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDayChange(date)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
              activeDay === date
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-blue-500/30",
            )}
          >
            {date} Jun
          </motion.button>
        ))}
      </div>
    </div>
  )
}
