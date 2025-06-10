"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, PartyPopper, Waves, MapPin } from "lucide-react"
import { eventsData } from "@/lib/events-data"
import DateSelector from "@/components/date-selector"
import EventCard from "@/components/event-card"
import EventFilters from "@/components/event-filters"
import WhatsAppCTA from "@/components/whatsapp-cta"
import Footer from "@/components/footer"
import DayTabs from "@/components/day-tabs"
import { Button } from "@/components/ui/button"
import type { Event, FilterOptions } from "@/lib/types"

export default function Home() {
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [dateFilteredEvents, setDateFilteredEvents] = useState<Event[]>([])
  const [step, setStep] = useState(1)
  const [activeDay, setActiveDay] = useState<string | null>(null)

  // Find max price in all events for slider
  const maxPrice = eventsData.reduce((max, event) => {
    return Math.max(max, event.minPrice)
  }, 2500)

  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    priceRange: [0, maxPrice],
    timeOfDay: [],
    eventType: [],
    sortBy: "time",
  })

  // Filter events by selected dates
  useEffect(() => {
    if (selectedDates.length > 0) {
      const filtered = eventsData.filter((event) => selectedDates.includes(event.date.split("/")[0]))
      setDateFilteredEvents(filtered)
      // Reset active day when dates change
      setActiveDay(null)
    } else {
      setDateFilteredEvents([])
    }
  }, [selectedDates])

  // Apply advanced filters and day filter
  useEffect(() => {
    let filtered = [...dateFilteredEvents]

    // Filter by specific day if selected
    if (activeDay) {
      filtered = filtered.filter((event) => event.date.split("/")[0] === activeDay)
    }

    // Artist filter (now works with exact match)
    if (filters.search) {
      filtered = filtered.filter((event) => event.artists === filters.search)
    }

    // Price range filter
    filtered = filtered.filter((event) => {
      const price = event.minPrice
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Time of day filter
    if (filters.timeOfDay.length > 0) {
      filtered = filtered.filter((event) => filters.timeOfDay.includes(event.timeCategory))
    }

    // Event type filter
    if (filters.eventType.length > 0) {
      filtered = filtered.filter((event) => filters.eventType.includes(event.venue))
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return a.minPrice - b.minPrice
        case "time":
          return a.timeValue - b.timeValue
        case "artist":
          return a.artists.localeCompare(b.artists)
        default:
          return 0
      }
    })

    setFilteredEvents(filtered)
  }, [dateFilteredEvents, filters, activeDay])

  const handleDateToggle = (date: string) => {
    setSelectedDates((prev) => (prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]))
  }

  const handleContinue = () => {
    if (selectedDates.length > 0) {
      setStep(2)
    }
  }

  const handleReset = () => {
    setSelectedDates([])
    setFilters({
      search: "",
      priceRange: [0, maxPrice],
      timeOfDay: [],
      eventType: [],
      sortBy: "time",
    })
    setActiveDay(null)
    setStep(1)
  }

  const handleDayChange = (day: string | null) => {
    setActiveDay(day)
  }

  return (
    <div className="min-h-screen animated-bg text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl float-animation"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Compact Header */}
      <header className="container mx-auto py-6 md:py-8 px-4 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Waves className="h-6 w-6 md:h-8 md:w-8 text-cyan-400" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
              WSL 2025
            </h1>
            <motion.div
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <Waves className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-2 text-blue-300 mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-lg md:text-xl font-semibold">Saquarema</span>
          </div>

          <motion.p
            className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Descubra os eventos mais incríveis durante o campeonato mundial de surf
          </motion.p>
        </motion.div>
      </header>

      <main className="container mx-auto px-4 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-blue-500/20 glow-blue">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-center justify-center">
                  <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                    Quais dias você ficará em Saquarema?
                  </span>
                </h2>
                <DateSelector selectedDates={selectedDates} onToggle={handleDateToggle} />
                <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-gray-400 text-center sm:text-left">
                    {selectedDates.length === 0
                      ? "Selecione pelo menos um dia para continuar"
                      : `${selectedDates.length} ${selectedDates.length === 1 ? "dia selecionado" : "dias selecionados"}`}
                  </p>
                  <Button
                    onClick={handleContinue}
                    disabled={selectedDates.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 md:px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 glow-blue-intense w-full sm:w-auto"
                  >
                    Ver Eventos
                  </Button>
                </div>
              </div>

              {/* WhatsApp CTA for first screen */}
              <div className="mt-8">
                <WhatsAppCTA />
              </div>

              {/* Footer with credits */}
              <Footer />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <PartyPopper className="h-6 w-6 md:h-8 md:w-8 text-cyan-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                    Eventos disponíveis ({filteredEvents.length})
                  </span>
                </h2>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 w-full sm:w-auto"
                >
                  Alterar datas
                </Button>
              </div>

              {/* Day tabs for filtering by day */}
              {selectedDates.length > 1 && (
                <DayTabs selectedDates={selectedDates} activeDay={activeDay} onDayChange={handleDayChange} />
              )}

              <EventFilters filters={filters} onFiltersChange={setFilters} availableEvents={dateFilteredEvents} />

              <WhatsAppCTA />

              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
                  {filteredEvents.map((event, index) => (
                    <EventCard key={`${event.instagram}-${index}`} event={event} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-blue-500/20"
                  >
                    <PartyPopper className="h-12 w-12 md:h-16 md:w-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg md:text-xl mb-6">
                      {dateFilteredEvents.length === 0
                        ? "Nenhum evento encontrado para as datas selecionadas."
                        : "Nenhum evento encontrado com os filtros aplicados."}
                    </p>
                    {dateFilteredEvents.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFilters({
                            search: "",
                            priceRange: [0, maxPrice],
                            timeOfDay: [],
                            eventType: [],
                            sortBy: "time",
                          })
                          setActiveDay(null)
                        }}
                        className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400"
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </motion.div>
                </div>
              )}

              {/* Footer with credits for second screen */}
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
