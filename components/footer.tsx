"use client"

import { motion } from "framer-motion"
import { Instagram, Code } from "lucide-react"

export default function Footer() {
  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/joaopedrocosso/", "_blank")
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-16 pt-8 border-t border-blue-500/20"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400 hover:text-blue-300 transition-colors">
          <Code className="h-4 w-4" />
          <span className="text-sm">Desenvolvido por</span>
          <button
            onClick={handleInstagramClick}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            <Instagram className="h-4 w-4" />
            @joaopedrocosso
          </button>
        </div>
      </div>
    </motion.footer>
  )
}
