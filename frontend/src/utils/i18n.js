export const translations = {
  'English (US)': {
    'Anywhere': 'Anywhere',
    'Any week': 'Any week',
    'Add guests': 'Add guests',
    'Filters': 'Filters',
    'night': 'night',
    'New': 'New',
    'Hosted by': 'Hosted by',
    'Trending': 'Trending',
    'Beachfront': 'Beachfront',
    'Cabins': 'Cabins',
    'OMG!': 'OMG!',
    'Castles': 'Castles',
    'Lakefront': 'Lakefront',
    'Tiny homes': 'Tiny homes',
    'Farms': 'Farms',
    'City': 'City',
    'Pools': 'Pools',
    'Stays': 'Stays',
    'Experiences': 'Experiences',
    'Online Experiences': 'Online Experiences',
    'Language and region': 'Language and region',
    'Currency': 'Currency',
    'WanderLodge your home': 'WanderLodge your home'
  },
  'Hindi (India)': {
    'Anywhere': 'कहीं भी',
    'Any week': 'कोई भी सप्ताह',
    'Add guests': 'मेहमान जोड़ें',
    'Filters': 'फ़िल्टर',
    'night': 'रात',
    'New': 'नया',
    'Hosted by': 'मेजबान:',
    'Trending': 'ट्रेंडिंग',
    'Beachfront': 'समुद्र तट',
    'Cabins': 'केबिन',
    'OMG!': 'ओएमजी!',
    'Castles': 'महल',
    'Lakefront': 'झील',
    'Tiny homes': 'छोटे घर',
    'Farms': 'खेत',
    'City': 'शहर',
    'Pools': 'पूल',
    'Stays': 'ठहरने के स्थान',
    'Experiences': 'अनुभव',
    'Online Experiences': 'ऑनलाइन अनुभव',
    'Language and region': 'भाषा और क्षेत्र',
    'Currency': 'मुद्रा',
    'WanderLodge your home': 'वंडर लॉज पर होस्ट करें'
  },
  'Spanish (Spain)': {
    'Anywhere': 'Cualquier lugar',
    'Any week': 'Cualquier semana',
    'Add guests': 'Añadir huéspedes',
    'Filters': 'Filtros',
    'night': 'noche',
    'New': 'Nuevo',
    'Hosted by': 'Anfitrión:',
    'Trending': 'Tendencias',
    'Beachfront': 'Frente a la playa',
    'Cabins': 'Cabañas',
    'OMG!': '¡Sorprendente!',
    'Castles': 'Castillos',
    'Lakefront': 'Frente al lago',
    'Tiny homes': 'Minicasas',
    'Farms': 'Granjas',
    'City': 'Ciudad',
    'Pools': 'Piscinas',
    'Stays': 'Estancias',
    'Experiences': 'Experiencias',
    'Online Experiences': 'Experiencias online',
    'Language and region': 'Idioma y región',
    'Currency': 'Moneda',
    'WanderLodge your home': 'Pon tu espacio en WanderLodge'
  }
};

/**
 * Translates a given key based on the selected language string.
 */
export const translate = (key, languageString) => {
  if (!languageString) return translations['English (US)'][key] || key;
  const langDict = translations[languageString];
  if (!langDict) return translations['English (US)'][key] || key; // fallback to English
  return langDict[key] || translations['English (US)'][key] || key;
};
