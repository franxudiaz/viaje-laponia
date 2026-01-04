const itinerary = [
  {
    id: 1,
    date: '2026-01-07',
    dayInfo: 'Miércoles 7 Enero',
    title: 'Llegada a Laponia',
    icon: 'assets/reindeer_custom.png',
    activities: [
      { time: 'TBD', desc: 'Llegada al aeropuerto' },
      { time: '19:00', desc: 'Excursión Auroras Boreales' },
      { time: 'Noche', desc: 'Alojamiento: Winter Arctic Apartment' }
    ],
    location: {
      name: 'Winter Arctic Apartment',
      url: 'https://www.google.com/maps/search/?api=1&query=Korkalonkatu+34-36,+96200+Rovaniemi'
    },
    locationImage: 'assets/ounasvaara.png' // Generic winter view for arrival
  },
  {
    id: 2,
    date: '2026-01-08',
    dayInfo: 'Jueves 8 Enero',
    title: 'Magia en Santa Park',
    icon: 'assets/santa_custom.png',
    activities: [
      { time: 'Todo el día', desc: 'Santa Park (Talleres de galletas, Elfos, etc.)' }
    ],
    location: {
      name: 'Santa Park',
      url: 'https://www.google.com/maps/search/?api=1&query=Santa+Park+Rovaniemi'
    },
    locationImage: 'assets/santa_park.png'
  },
  {
    id: 3,
    date: '2026-01-09',
    dayInfo: 'Viernes 9 Enero',
    title: 'Naturaleza y Cultura',
    icon: 'assets/reindeer_custom.png',
    activities: [
      { time: 'Mañana', desc: 'Excursión Ounasvaara' },
      { time: 'Tarde', desc: 'Museo Arktikum' }
    ],
    location: {
      name: 'Arktikum',
      url: 'https://www.google.com/maps/search/?api=1&query=Arktikum+Rovaniemi'
    },
    locationImage: 'assets/arktikum.png'
  },
  {
    id: 4,
    date: '2026-01-10',
    dayInfo: 'Sábado 10 Enero',
    title: 'Huskies y Santa Village',
    icon: 'assets/husky_custom.png',
    activities: [
      { time: 'Mañana', desc: 'Safari con Huskies (2h)' },
      { time: 'Resto del día', desc: 'Santa Claus Village' }
    ],
    location: {
      name: 'Santa Claus Village',
      url: 'https://www.google.com/maps/search/?api=1&query=Santa+Claus+Village+Rovaniemi'
    },
    locationImage: 'assets/huskies.png'
  },
  {
    id: 5,
    date: '2026-01-11',
    dayInfo: 'Domingo 11 Enero',
    title: 'Santa Claus Village',
    icon: 'assets/santa_custom.png',
    activities: [
      { time: 'Todo el día', desc: 'Disfrutar de Santa Claus Village' }
    ],
    location: {
      name: 'Santa Claus Village',
      url: 'https://www.google.com/maps/search/?api=1&query=Santa+Claus+Village+Rovaniemi'
    },
    locationImage: 'assets/santa_village.png'
  },
  {
    id: 6,
    date: '2026-01-12',
    dayInfo: 'Lunes 12 Enero',
    title: 'Compras y Visitas',
    icon: 'assets/santa_custom.png',
    activities: [
      { time: 'Todo el día', desc: 'Santa Claus Village (Compras y Visitas)' }
    ],
    location: {
      name: 'Santa Claus Village',
      url: 'https://www.google.com/maps/search/?api=1&query=Santa+Claus+Village+Rovaniemi'
    },
    locationImage: 'assets/santa_village.png'
  },
  {
    id: 7,
    date: '2026-01-13',
    dayInfo: 'Martes 13 Enero',
    title: 'Vuelta a Casa',
    icon: 'assets/reindeer_custom.png',
    activities: [
      { time: 'TBD', desc: 'Traslado al aeropuerto' },
      { time: 'TBD', desc: 'Vuelo de vuelta a España' }
    ],
    location: {
      name: 'Aeropuerto Rovaniemi',
      url: 'https://www.google.com/maps/search/?api=1&query=Rovaniemi+Airport'
    },
    locationImage: 'assets/ounasvaara.png' // Departure view
  }
];
