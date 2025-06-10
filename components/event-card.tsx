"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Ticket, Instagram, ExternalLink, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import type { Event } from "@/lib/types"

interface EventCardProps {
  event: Event
  index: number
}

export default function EventCard({ event, index }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    window.open(event.ticketLink, "_blank")
  }

  const isEventSoldOut = event.price.includes("ESGOTADO")

  // Parse ticket types
  const parseTicketTypes = () => {
    if (!event.price || isEventSoldOut) return []

    return event.price.split("|").map((ticket) => ticket.trim())
  }

  const ticketTypes = parseTicketTypes()
  const hasMultipleTickets = ticketTypes.length > 1

  // Get a summary for collapsed view
  const ticketSummary = () => {
    if (isEventSoldOut) return "ESGOTADO"
    if (!event.price) return "Preço a definir"
    if (!hasMultipleTickets) return event.price

    // Find the lowest price for summary
    const lowestPrice = ticketTypes.reduce((lowest, current) => {
      const match = current.match(/R\$\s*(\d+)/)
      if (!match) return lowest
      const price = Number.parseInt(match[1])
      return price < lowest || lowest === 0 ? price : lowest
    }, 0)

    return lowestPrice > 0 ? `A partir de R$${lowestPrice}` : ticketTypes[0]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-blue-500/20 group hover:border-blue-400/50 transition-all duration-300 glow-blue"
    >
      {/* Date badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-3 py-1 rounded-full border border-blue-500/30">
        <p className="text-xs font-medium text-blue-300">{event.date}</p>
      </div>

      {/* Card header with artist and venue */}
      <div className="p-6 pb-3">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300 text-white pr-16">
          {event.artists}
        </h3>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
          <MapPin className="h-4 w-4 text-purple-400" />
          <span>{event.venue}</span>
        </div>
      </div>

      {/* Highlighted time and price section */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-y border-blue-500/20">
        <div className="flex justify-between items-center">
          {/* Time section */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Horário</p>
              <p className="text-lg font-semibold text-white">{event.time || "A definir"}</p>
            </div>
          </div>

          {/* Price section */}
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Ticket className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Preço</p>
              <p className={`text-lg font-semibold ${isEventSoldOut ? "text-red-400" : "text-green-400"}`}>
                {isEventSoldOut ? "ESGOTADO" : ticketSummary().includes("R$") ? ticketSummary() : "A definir"}
              </p>
            </div>
          </div>
        </div>

        {/* Multiple ticket types */}
        {hasMultipleTickets && (
          <div className="mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors w-full justify-center"
            >
              <span>{isExpanded ? "Ocultar opções" : "Ver todas opções"}</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-3"
                >
                  <div className="space-y-2 border-l-2 border-blue-500/30 pl-3">
                    {ticketTypes.map((ticket, i) => (
                      <div key={i} className="text-sm text-gray-300">
                        {ticket}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Card footer with Instagram and buy button */}
      <div className="p-6 pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Instagram className="h-4 w-4" />
          <span>{event.instagram}</span>
        </div>

        <button
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          <span>{isEventSoldOut ? "Ver Disponibilidade" : "Comprar Ingressos"}</span>
        </button>
      </div>
    </motion.div>
  )
}
