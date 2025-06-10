"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, Clock, MapPin, DollarSign, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Event, FilterOptions } from "@/lib/types"

interface EventFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  availableEvents: Event[]
}

export default function EventFilters({ filters, onFiltersChange, availableEvents }: EventFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Get unique artists from available events
  const availableArtists = [...new Set(availableEvents.map((event) => event.artists))].sort()

  // Get unique venues and time categories from available events
  const venues = [...new Set(availableEvents.map((event) => event.venue))].sort()
  const timeCategories = [...new Set(availableEvents.map((event) => event.timeCategory))].sort()

  // Find max price in available events for slider
  const maxPrice = availableEvents.reduce((max, event) => {
    return Math.max(max, event.minPrice)
  }, 2500)

  const handleSearchChange = (value: string | undefined) => {
    onFiltersChange({ ...filters, search: value || "" })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: value })
  }

  const handleTimeOfDayToggle = (timeCategory: string) => {
    const newTimeOfDay = filters.timeOfDay.includes(timeCategory)
      ? filters.timeOfDay.filter((t) => t !== timeCategory)
      : [...filters.timeOfDay, timeCategory]
    onFiltersChange({ ...filters, timeOfDay: newTimeOfDay })
  }

  const handleEventTypeToggle = (venue: string) => {
    const newEventType = filters.eventType.includes(venue)
      ? filters.eventType.filter((t) => t !== venue)
      : [...filters.eventType, venue]
    onFiltersChange({ ...filters, eventType: newEventType })
  }

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      priceRange: [0, maxPrice],
      timeOfDay: [],
      eventType: [],
      sortBy: "time",
    })
  }

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    filters.timeOfDay.length +
    filters.eventType.length

  return (
    <motion.div
      className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-blue-500/20 overflow-hidden glow-blue"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Artist Selector - Always Visible */}
      <div className="p-6 border-b border-blue-500/20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Artista</h3>
          </div>
          <Select value={filters.search || undefined} onValueChange={handleSearchChange}>
            <SelectTrigger className="w-full bg-gray-800/50 border-blue-500/30 text-white hover:border-blue-400/50 transition-colors">
              <SelectValue placeholder="Selecione um artista..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-blue-500/30 max-h-60">
              {availableArtists.map((artist) => (
                <SelectItem
                  key={artist}
                  value={artist}
                  className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20"
                >
                  {artist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="p-6 border-b border-blue-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-300 hover:text-white hover:bg-blue-500/20 w-full sm:w-auto justify-start transition-all duration-300"
        >
          <SlidersHorizontal className="h-5 w-5 mr-3" />
          Filtros Avançados
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-3 bg-blue-600 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-44 bg-gray-800/50 border-blue-500/30 text-white hover:border-blue-400/50 transition-colors">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-blue-500/30">
              <SelectItem value="time" className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20">
                Por Horário
              </SelectItem>
              <SelectItem value="price" className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20">
                Por Preço
              </SelectItem>
              <SelectItem value="artist" className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20">
                Por Artista
              </SelectItem>
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 whitespace-nowrap transition-all duration-300"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters - Expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-8">
              {/* Price Range Filter */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Faixa de Preço</h3>
                </div>
                <div className="px-3">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={handlePriceRangeChange}
                    max={maxPrice}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-blue-300 mt-3">
                    <span>R$ {filters.priceRange[0]}</span>
                    <span>R$ {filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Time of Day Filter */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Horário</h3>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                  {timeCategories.map((timeCategory) => (
                    <Badge
                      key={timeCategory}
                      variant={filters.timeOfDay.includes(timeCategory) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-300 text-center justify-center py-2 px-4 ${
                        filters.timeOfDay.includes(timeCategory)
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg"
                          : "border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400"
                      }`}
                      onClick={() => handleTimeOfDayToggle(timeCategory)}
                    >
                      {timeCategory}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Event Type Filter */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Local/Tipo</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
                  {venues.map((venue) => (
                    <Badge
                      key={venue}
                      variant={filters.eventType.includes(venue) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-300 text-center justify-center text-sm py-2 px-4 ${
                        filters.eventType.includes(venue)
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg"
                          : "border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400"
                      }`}
                      onClick={() => handleEventTypeToggle(venue)}
                    >
                      {venue}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
