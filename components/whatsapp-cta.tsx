"use client"

import { motion } from "framer-motion"
import { MessageCircle, Zap, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppCTA() {
  const handleWhatsAppClick = () => {
    window.open("https://chat.whatsapp.com/GMnQVb4ZjABBK83LghhKqh", "_blank")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="my-8"
    >
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 glow-blue">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-full">
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Grupo VIP de Ingressos
              </h3>
              <p className="text-gray-300 text-sm md:text-base">
                Ingresso esgotado ou muito caro? Entre no nosso grupo do WhatsApp para encontrar ingressos com preços
                especiais!
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <DollarSign className="h-4 w-4" />
              <span>Melhores preços</span>
            </div>
            <Button
              onClick={handleWhatsAppClick}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="h-5 w-5" />
              Entrar no Grupo
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
