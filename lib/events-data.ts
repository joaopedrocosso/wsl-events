import type { Event } from "./types"

// Helper function to extract minimum price from price string
function extractMinPrice(priceString: string): number {
  if (priceString.includes("ESGOTADO") || !priceString) return 0

  const matches = priceString.match(/R\$\s*(\d+)/g)
  if (!matches) return 0

  const prices = matches.map((match) => Number.parseInt(match.replace(/R\$\s*/, "")))
  return Math.min(...prices)
}

// Helper function to convert time to numeric value for sorting
function timeToValue(timeString: string): number {
  if (!timeString || timeString.includes("after")) return 1440 // End of day for "after" events

  const match = timeString.match(/(\d+)h/)
  if (!match) return 0

  return Number.parseInt(match[1])
}

// Helper function to categorize time of day
function categorizeTime(timeString: string): string {
  if (!timeString) return "Não informado"
  if (timeString.includes("after")) return "Madrugada"

  const match = timeString.match(/(\d+)h/)
  if (!match) return "Não informado"

  const hour = Number.parseInt(match[1])
  if (hour >= 6 && hour < 12) return "Manhã"
  if (hour >= 12 && hour < 18) return "Tarde"
  if (hour >= 18 && hour < 24) return "Noite"
  return "Madrugada"
}

// Helper function to extract venue from instagram handle
function extractVenue(instagram: string): string {
  if (instagram.includes("festivalsunset")) return "Festival Sunset"
  if (instagram.includes("casa.amare")) return "Casa Amare"
  if (instagram.includes("riosurfmusic")) return "Rio Surf Music"
  if (instagram.includes("brisa.casa")) return "Brisa Casa"
  if (instagram.includes("coronasurfskate")) return "Corona Surf Skate"
  if (instagram.includes("itaunasurfmusic")) return "Itaúna Surf Music"
  if (instagram.includes("viva.sessions")) return "Viva Sessions"
  if (instagram.includes("riomaisfestival")) return "Rio Mais Festival"
  if (instagram.includes("ondamaximaprod")) return "Onda Máxima"
  if (instagram.includes("saquaremasurfsounds")) return "Saquarema Surf Sounds"
  return "Outros"
}

const rawEventsData = [
  {
    instagram: "@festivalsunset_2025",
    date: "19/jun.",
    artists: "Maru2D + Dj Bertolossi",
    time: "22h",
    ticketLink: "https://www.guicheweb.com.br/pesquisa/festival-sunset",
    price: "Pista: R$35 | Lounge Deck (8 Pessoas): R$1500 | Camarote (10 Pessoas): R$2500",
  },
  {
    instagram: "@casa.amare.saquarema",
    date: "19/jun.",
    artists: "Festa fechada (50 ingressos)",
    time: "after 23h",
    ticketLink:
      "https://l.instagram.com/?u=https%3A%2F%2Fwww.ingresse.com%2Fcasa-amare-o-after-de-saquarema%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAaclh0FzzWOD2AmDRKE-7v6mGjj_450HQIS1n4EwAageFIpuoM4KgALfu-5e_g_aem_EHjJ0v_Km0lkIEGyKR0RTA&e=AT1lfkjYN7bOl3kZilzRER9MBQamADN8uNRbQFKL37rUF8mHaDHzYrlRGQ4gK6Ozt5HRMsCeL84mrSbCXzC8rh2rd0vhbxNUPTNiSQ",
    price: "R$100",
  },
  {
    instagram: "@riosurfmusicfestival",
    date: "20/jun.",
    artists: "orochi",
    time: "22h",
    ticketLink:
      "https://www.ingresse.com/rio-surf-music-festival-25/?fbclid=PAZXh0bgNhZW0CMTEAAadyFjt3Zlq97AK_DOUc0hEmLPlWAQblr4hmEqo-sfzNVxau6S05Zb2-8wHsGw_aem_v_V3qhQJxA1WFUJhHsdI8g",
    price: "Pista: R$160 | Área Premium: R$300",
  },
  {
    instagram: "@brisa.casa",
    date: "20/jun.",
    artists: "Luau com Bela",
    time: "18h",
    ticketLink: "https://zig.tickets/eventos/casa-brisa-luau-com-bela",
    price: "R$100",
  },
  {
    instagram: "@coronasurfskate",
    date: "20/jun.",
    artists: "Samba de Praia - Zuza e convidados",
    time: "14h",
    ticketLink:
      "https://www.pensanoevento.com.br/casacorona?fbclid=PAZXh0bgNhZW0CMTEAAaeDfoKwnQ-JiQX0tK4irxfku8ierABXY_lUHJ773sJLTzpbTZBuKAg2n0LoQA_aem_zNQto5rSQ37sMxt1qMYdhA",
    price: "R$400",
  },
  {
    instagram: "@festivalsunset_2025",
    date: "20/jun.",
    artists: "Thiago Martins",
    time: "22h",
    ticketLink: "https://www.guicheweb.com.br/pesquisa/festival-sunset",
    price: "Pista: R$60 | Lounge Deck (8 Pessoas): R$1500 | Camarote (10 Pessoas): R$2500",
  },
  {
    instagram: "@itaunasurfmusic",
    date: "20/jun.",
    artists: "Teco Padaratz, Vitor iSense + João Co",
    time: "16h",
    ticketLink:
      "https://www.guicheweb.com.br/itauna-surf-music_43196?fbclid=PAZXh0bgNhZW0CMTEAAaeVMYXyms2YVqhnxslpFPI1_MhgXdYpQifwpkx6ObEkZMOBgjj97lC1yTkHrQ_aem_inww753LSP_gNA2B4qZQwg",
    price: "R$60",
  },
  {
    instagram: "@casa.amare.saquarema",
    date: "20/jun.",
    artists: "Banda Erva e Convidados",
    time: "",
    ticketLink:
      "https://l.instagram.com/?u=https%3A%2F%2Fwww.ingresse.com%2Fcasa-amare-o-after-de-saquarema%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAaclh0FzzWOD2AmDRKE-7v6mGjj_450HQIS1n4EwAageFIpuoM4KgALfu-5e_g_aem_EHjJ0v_Km0lkIEGyKR0RTA&e=AT1lfkjYN7bOl3kZilzRER9MBQamADN8uNRbQFKL37rUF8mHaDHzYrlRGQ4gK6Ozt5HRMsCeL84mrSbCXzC8rh2rd0vhbxNUPTNiSQ",
    price: "R$100",
  },
  {
    instagram: "@riosurfmusicfestival",
    date: "21/jun.",
    artists: "3030",
    time: "22h",
    ticketLink:
      "https://www.ingresse.com/rio-surf-music-festival-25/?fbclid=PAZXh0bgNhZW0CMTEAAadyFjt3Zlq97AK_DOUc0hEmLPlWAQblr4hmEqo-sfzNVxau6S05Zb2-8wHsGw_aem_v_V3qhQJxA1WFUJhHsdI8g",
    price: "Pista: R$100 | Área Premium: R$180",
  },
  {
    instagram: "@brisa.casa",
    date: "21/jun.",
    artists: "Fuze",
    time: "18h",
    ticketLink: "https://zig.tickets/eventos/casa-brisa-fuze",
    price: "R$100",
  },
  {
    instagram: "@coronasurfskate",
    date: "21/jun.",
    artists: "L7nnon",
    time: "12h",
    ticketLink:
      "https://www.pensanoevento.com.br/casacorona?fbclid=PAZXh0bgNhZW0CMTEAAaeDfoKwnQ-JiQX0tK4irxfku8ierABXY_lUHJ773sJLTzpbTZBuKAg2n0LoQA_aem_zNQto5rSQ37sMxt1qMYdhA",
    price: "ESGOTADO",
  },
  {
    instagram: "@festivalsunset_2025",
    date: "21/jun.",
    artists: "Dj Zullu + Vou Zuar",
    time: "22h",
    ticketLink: "https://www.guicheweb.com.br/pesquisa/festival-sunset",
    price: "Pista: R$60 | Lounge Deck (8 Pessoas): R$1500 | Camarote (10 Pessoas): R$2500",
  },
  {
    instagram: "@casa.amare.saquarema",
    date: "21/jun.",
    artists: "samba de praia com zuza + after Dj Micão",
    time: "after 23h",
    ticketLink:
      "https://l.instagram.com/?u=https%3A%2F%2Fwww.ingresse.com%2Fcasa-amare-o-after-de-saquarema%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAaclh0FzzWOD2AmDRKE-7v6mGjj_450HQIS1n4EwAageFIpuoM4KgALfu-5e_g_aem_EHjJ0v_Km0lkIEGyKR0RTA&e=AT1lfkjYN7bOl3kZilzRER9MBQamADN8uNRbQFKL37rUF8mHaDHzYrlRGQ4gK6Ozt5HRMsCeL84mrSbCXzC8rh2rd0vhbxNUPTNiSQ",
    price: "R$300",
  },
  {
    instagram: "@itaunasurfmusic",
    date: "21/jun.",
    artists: '"+5521"',
    time: "16h",
    ticketLink:
      "https://www.guicheweb.com.br/itauna-surf-music_43196?fbclid=PAZXh0bgNhZW0CMTEAAaeVMYXyms2YVqhnxslpFPI1_MhgXdYpQifwpkx6ObEkZMOBgjj97lC1yTkHrQ_aem_inww753LSP_gNA2B4qZQwg",
    price: "R$60",
  },
  {
    instagram: "@coronasurfskate",
    date: "22/jun.",
    artists: "Marcelo Falcão",
    time: "12h",
    ticketLink:
      "https://www.pensanoevento.com.br/casacorona?fbclid=PAZXh0bgNhZW0CMTEAAaeDfoKwnQ-JiQX0tK4irxfku8ierABXY_lUHJ773sJLTzpbTZBuKAg2n0LoQA_aem_zNQto5rSQ37sMxt1qMYdhA",
    price: "ESGOTADO",
  },
  {
    instagram: "@brisa.casa",
    date: "22/jun.",
    artists: "Montyvibe",
    time: "18h",
    ticketLink: "https://zig.tickets/eventos/casa-brisa-montyvibe",
    price: "R$100",
  },
  {
    instagram: "@viva.sessions",
    date: "22/jun.",
    artists: "viva.sessions",
    time: "19h",
    ticketLink:
      "https://chat.whatsapp.com/HX3QujdfwN64jYbrRl0X4w?fbclid=PAZXh0bgNhZW0CMTEAAafDR4EcEDshd6vc7DmTn4JhUXfSNPzszrks0Rfped3i7BTyJo_tpIy_d2PxUw_aem_8nZU5g6SnDFQDN2LmCikRQ",
    price: "",
  },
  {
    instagram: "@riomaisfestival",
    date: "22/jun.",
    artists: "matuê e vitin",
    time: "15h",
    ticketLink:
      "https://www.guicheweb.com.br/rio-mais-festival-matue_36908?fbclid=PAZXh0bgNhZW0CMTEAAaeif0sBMec8Jeq5RlV6TAIGrOCQ0K8ObEfwp1VoePuXWbecLq_w2mwViGIfUQ_aem_aVIkapTwbbOHz3OprEfCUA",
    price: "Setor Prata a partir de R$ 70,00",
  },
  {
    instagram: "@itaunasurfmusic",
    date: "22/jun.",
    artists: "Luccas Carlos",
    time: "16h",
    ticketLink:
      "https://www.guicheweb.com.br/itauna-surf-music_43196?fbclid=PAZXh0bgNhZW0CMTEAAaeVMYXyms2YVqhnxslpFPI1_MhgXdYpQifwpkx6ObEkZMOBgjj97lC1yTkHrQ_aem_inww753LSP_gNA2B4qZQwg",
    price: "R$60",
  },
  {
    instagram: "@ondamaximaprod",
    date: "22/jun.",
    artists: "D-nox",
    time: "10h",
    ticketLink:
      "https://www.sympla.com.br/evento/road-to-up-selo-universo-paralello-d-nox/2960670?fbclid=PAZXh0bgNhZW0CMTEAAadnzPH4W086YGE5JoNQ7ulG5OoFsHcbxy4bF0kD1DDn4AbrH6JiBLLD8tUMMw_aem_R83pt4MWj1DtY23BcPo8YQ&referrer=l.instagram.com",
    price: "R$110 | Consumação: R$ 300",
  },
  {
    instagram: "@itaunasurfmusic",
    date: "23/jun.",
    artists: "Yan",
    time: "16h",
    ticketLink:
      "https://www.guicheweb.com.br/itauna-surf-music_43196?fbclid=PAZXh0bgNhZW0CMTEAAaeVMYXyms2YVqhnxslpFPI1_MhgXdYpQifwpkx6ObEkZMOBgjj97lC1yTkHrQ_aem_inww753LSP_gNA2B4qZQwg",
    price: "R$60",
  },
  {
    instagram: "@brisa.casa",
    date: "23/jun.",
    artists: "Surf City Band",
    time: "18h",
    ticketLink: "https://zig.tickets/eventos/casa-brisa-surf-city-band",
    price: "R$100",
  },
  {
    instagram: "@coronasurfskate",
    date: "23/jun.",
    artists: "Oriente",
    time: "12h",
    ticketLink:
      "https://www.pensanoevento.com.br/casacorona?fbclid=PAZXh0bgNhZW0CMTEAAaeDfoKwnQ-JiQX0tK4irxfku8ierABXY_lUHJ773sJLTzpbTZBuKAg2n0LoQA_aem_zNQto5rSQ37sMxt1qMYdhA",
    price: "ESGOTADO",
  },
  {
    instagram: "@casa.amare.saquarema",
    date: "23/jun.",
    artists: "Tsunami do BOB",
    time: "after 23h",
    ticketLink:
      "https://l.instagram.com/?u=https%3A%2F%2Fwww.ingresse.com%2Fcasa-amare-o-after-de-saquarema%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAaclh0FzzWOD2AmDRKE-7v6mGjj_450HQIS1n4EwAageFIpuoM4KgALfu-5e_g_aem_EHjJ0v_Km0lkIEGyKR0RTA&e=AT1lfkjYN7bOl3kZilzRER9MBQamADN8uNRbQFKL37rUF8mHaDHzYrlRGQ4gK6Ozt5HRMsCeL84mrSbCXzC8rh2rd0vhbxNUPTNiSQ",
    price: "R$60",
  },
  {
    instagram: "@itaunasurfmusic",
    date: "24/jun.",
    artists: "Evento Fechado",
    time: "16h",
    ticketLink:
      "https://www.guicheweb.com.br/itauna-surf-music_43196?fbclid=PAZXh0bgNhZW0CMTEAAaeVMYXyms2YVqhnxslpFPI1_MhgXdYpQifwpkx6ObEkZMOBgjj97lC1yTkHrQ_aem_inww753LSP_gNA2B4qZQwg",
    price: "R$60",
  },
  {
    instagram: "@brisa.casa",
    date: "24/jun.",
    artists: "Forró com Sambaqui",
    time: "18h",
    ticketLink: "https://zig.tickets/eventos/casa-brisa-forro-do-sambaqui",
    price: "R$100",
  },
  {
    instagram: "@itaunasurfmusic",
    date: "25/jun.",
    artists: "PK Freestyle + Igor Adamovich",
    time: "16h",
    ticketLink:
      "https://www.guicheweb.com.br/itauna-surf-music_43196?fbclid=PAZXh0bgNhZW0CMTEAAaeVMYXyms2YVqhnxslpFPI1_MhgXdYpQifwpkx6ObEkZMOBgjj97lC1yTkHrQ_aem_inww753LSP_gNA2B4qZQwg",
    price: "R$60",
  },
  {
    instagram: "@casa.amare.saquarema",
    date: "25/jun.",
    artists: "Jambo Sessions",
    time: "after 23h",
    ticketLink:
      "https://l.instagram.com/?u=https%3A%2F%2Fwww.ingresse.com%2Fcasa-amare-o-after-de-saquarema%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAaclh0FzzWOD2AmDRKE-7v6mGjj_450HQIS1n4EwAageFIpuoM4KgALfu-5e_g_aem_EHjJ0v_Km0lkIEGyKR0RTA&e=AT1lfkjYN7bOl3kZilzRER9MBQamADN8uNRbQFKL37rUF8mHaDHzYrlRGQ4gK6Ozt5HRMsCeL84mrSbCXzC8rh2rd0vhbxNUPTNiSQ",
    price: "R$80",
  },
  {
    instagram: "@brisa.casa",
    date: "25/jun.",
    artists: "Sibc",
    time: "18h",
    ticketLink: "https://zig.tickets/eventos/casa-brisa-sibc",
    price: "R$100",
  },
  {
    instagram: "@itaunasurfmusic",
    date: "26/jun.",
    artists: "Chefin",
    time: "16h",
    ticketLink:
      "https://www.guicheweb.com.br/itauna-surf-music_43196?fbclid=PAZXh0bgNhZW0CMTEAAaeVMYXyms2YVqhnxslpFPI1_MhgXdYpQifwpkx6ObEkZMOBgjj97lC1yTkHrQ_aem_inww753LSP_gNA2B4qZQwg",
    price: "R$60",
  },
  {
    instagram: "@saquaremasurfsounds",
    date: "26/jun.",
    artists: "Hip Hop Exp by HHR",
    time: "19h",
    ticketLink:
      "https://zig.tickets/organizacoes/saquarema-surf-sounds?fbclid=PAZXh0bgNhZW0CMTEAAafSej2WFsh-ILxGRk0cVJQc_l55iBizeMxXd5vOh7CNAl3A_p-FVf_3jzcTnw_aem_nLbDSNkuQ4ukeu-_KPlB3g",
    price: "R$60",
  },
  {
    instagram: "@brisa.casa",
    date: "26/jun.",
    artists: "Rodrigo Loiro",
    time: "18h",
    ticketLink: "https://zig.tickets/eventos/casa-brisa-rodrigo-lorio",
    price: "R$100",
  },
  {
    instagram: "@saquaremasurfsounds",
    date: "27/jun.",
    artists: "festacarnedecaju",
    time: "19h",
    ticketLink:
      "https://zig.tickets/organizacoes/saquarema-surf-sounds?fbclid=PAZXh0bgNhZW0CMTEAAafSej2WFsh-ILxGRk0cVJQc_l55iBizeMxXd5vOh7CNAl3A_p-FVf_3jzcTnw_aem_nLbDSNkuQ4ukeu-_KPlB3g",
    price: "R$60",
  },
  {
    instagram: "@riosurfmusicfestival",
    date: "27/jun.",
    artists: "conecrew",
    time: "22h",
    ticketLink:
      "https://www.ingresse.com/rio-surf-music-festival-25/?fbclid=PAZXh0bgNhZW0CMTEAAadyFjt3Zlq97AK_DOUc0hEmLPlWAQblr4hmEqo-sfzNVxau6S05Zb2-8wHsGw_aem_v_V3qhQJxA1WFUJhHsdI8g",
    price: "Pista: R$100 | Área Premium: R$180",
  },
  {
    instagram: "@itaunasurfmusic",
    date: "27/jun.",
    artists: "BK",
    time: "16h",
    ticketLink:
      "https://www.guicheweb.com.br/itauna-surf-music_43196?fbclid=PAZXh0bgNhZW0CMTEAAaeVMYXyms2YVqhnxslpFPI1_MhgXdYpQifwpkx6ObEkZMOBgjj97lC1yTkHrQ_aem_inww753LSP_gNA2B4qZQwg",
    price: "R$120",
  },
  {
    instagram: "@casa.amare.saquarema",
    date: "27/jun.",
    artists: "Dagema",
    time: "after 23h",
    ticketLink:
      "https://l.instagram.com/?u=https%3A%2F%2Fwww.ingresse.com%2Fcasa-amare-o-after-de-saquarema%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAaclh0FzzWOD2AmDRKE-7v6mGjj_450HQIS1n4EwAageFIpuoM4KgALfu-5e_g_aem_EHjJ0v_Km0lkIEGyKR0RTA&e=AT1lfkjYN7bOl3kZilzRER9MBQamADN8uNRbQFKL37rUF8mHaDHzYrlRGQ4gK6Ozt5HRMsCeL84mrSbCXzC8rh2rd0vhbxNUPTNiSQ",
    price: "R$110",
  },
  {
    instagram: "@saquaremasurfsounds",
    date: "28/jun.",
    artists: "osgarotin",
    time: "19h",
    ticketLink:
      "https://zig.tickets/organizacoes/saquarema-surf-sounds?fbclid=PAZXh0bgNhZW0CMTEAAafSej2WFsh-ILxGRk0cVJQc_l55iBizeMxXd5vOh7CNAl3A_p-FVf_3jzcTnw_aem_nLbDSNkuQ4ukeu-_KPlB3g",
    price: "",
  },
  {
    instagram: "@riosurfmusicfestival",
    date: "28/jun.",
    artists: "cabelinho",
    time: "22h",
    ticketLink:
      "https://www.ingresse.com/rio-surf-music-festival-25/?fbclid=PAZXh0bgNhZW0CMTEAAadyFjt3Zlq97AK_DOUc0hEmLPlWAQblr4hmEqo-sfzNVxau6S05Zb2-8wHsGw_aem_v_V3qhQJxA1WFUJhHsdI8g",
    price: "Pista: R$100 | Área Premium: R$180",
  },
  {
    instagram: "@itaunasurfmusic",
    date: "28/jun.",
    artists: "Oriente",
    time: "16h",
    ticketLink:
      "https://www.guicheweb.com.br/itauna-surf-music_43196?fbclid=PAZXh0bgNhZW0CMTEAAaeVMYXyms2YVqhnxslpFPI1_MhgXdYpQifwpkx6ObEkZMOBgjj97lC1yTkHrQ_aem_inww753LSP_gNA2B4qZQwg",
    price: "R$60",
  },
]

export const eventsData: Event[] = rawEventsData.map((event) => ({
  ...event,
  minPrice: extractMinPrice(event.price),
  timeValue: timeToValue(event.time),
  timeCategory: categorizeTime(event.time),
  venue: extractVenue(event.instagram),
}))
