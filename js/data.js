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
    locationImage: 'assets/ounasvaara.png' // Arrival view (original nice view)
  },
  {
    id: 2,
    date: '2026-01-08',
    dayInfo: 'Jueves 8 Enero',
    title: 'Magia en Santa Park',
    icon: 'assets/santa_custom.png',
    activities: [
      { time: 'Todo el día', desc: 'Santa Park (Talleres, Elfos, Tren mágico...)' }
    ],
    location: {
      name: 'Santa Park',
      url: 'https://www.google.com/maps/search/?api=1&query=Santa+Park+Rovaniemi'
    },
    locationImage: 'assets/photo_santa_park.png' // NEW IMAGE
  },
  {
    id: 3,
    date: '2026-01-09',
    dayInfo: 'Viernes 9 Enero',
    title: 'Naturaleza y Cultura',
    icon: 'assets/reindeer_custom.png',
    activities: [
      { time: 'Mañana', desc: 'Excursión Ounasvaara (Vistas Panorámicas de ensueño)' },
      { time: 'Tarde', desc: 'Museo Arktikum (Túnel de cristal y ciencia ártica)' }
    ],
    location: {
      name: 'Arktikum',
      url: 'https://www.google.com/maps/search/?api=1&query=Arktikum+Rovaniemi'
    },
    locationImage: 'assets/photo_arktikum.png' // NEW IMAGE
  },
  {
    id: 4,
    date: '2026-01-10',
    dayInfo: 'Sábado 10 Enero',
    title: 'Huskies y Santa Village',
    icon: 'assets/husky_custom.png',
    activities: [
      { time: 'Mañana', desc: 'Safari con Huskies (2h) - ¡A correr por el bosque!' },
      { time: 'Resto del día', desc: 'Santa Claus Village' }
    ],
    location: {
      name: 'Santa Claus Village',
      url: 'https://www.google.com/maps/search/?api=1&query=Santa+Claus+Village+Rovaniemi'
    },
    locationImage: 'assets/photo_huskies.png' // NEW IMAGE
  },
  {
    id: 5,
    date: '2026-01-11',
    dayInfo: 'Domingo 11 Enero',
    title: 'Visita Oficial a Santa',
    icon: 'assets/santa_custom.png',
    activities: [
      { time: 'Todo el día', desc: 'Conocer a Santa Claus en su Oficina Principal' },
      { time: 'Tarde', desc: 'Paseo por el Círculo Polar Ártico' }
    ],
    location: {
      name: 'Santa Claus Village',
      url: 'https://www.google.com/maps/search/?api=1&query=Santa+Claus+Office+Rovaniemi'
    },
    locationImage: 'assets/photo_santa_village.png' // NEW IMAGE
  },
  {
    id: 6,
    date: '2026-01-12',
    dayInfo: 'Lunes 12 Enero',
    title: 'Vuelta a Casa',
    icon: 'assets/reindeer_custom.png',
    activities: [
      { time: 'TBD', desc: 'Traslado al aeropuerto con la maleta llena de magia' },
      { time: 'TBD', desc: 'Vuelo de vuelta a España' }
    ],
    location: {
      name: 'Aeropuerto Rovaniemi',
      url: 'https://www.google.com/maps/search/?api=1&query=Rovaniemi+Airport'
    },
    locationImage: 'assets/ounasvaara.png' // Departure view
  }
];
