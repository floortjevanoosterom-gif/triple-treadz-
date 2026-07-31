export const PRICE = (v: number) => '€' + v.toFixed(2).replace('.', ',');

const ALL_SIZES = ['36', '36.5', '37', '38', '38.5', '39', '39.5', '40', '40.5', '41', '41.5', '42', '43', '44'];

export const PRODUCTS = [
  {
    id: 'denim',
    ph: 'ph-denim',
    img: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80',
    name: { nl: 'Custom Denim Adidas Superstar', en: 'Custom Denim Adidas Superstar' },
    price: 146.99,
    limited: false,
    sizes: { '36': 1, '36.5': 1, '37': 1, '38': 1, '38.5': 1, '39': 1, '39.5': 1, '40': 1, '40.5': 1, '41': 1, '41.5': 0, '42': 1, '43': 0, '44': 0 }
  },
  {
    id: 'camo',
    ph: 'ph-camo',
    img: '/hero-camo.jpg',
    name: { nl: 'Custom Camo Adidas Superstar', en: 'Custom Camo Adidas Superstar' },
    price: 171.99,
    limited: false,
    sizes: { '36': 1, '36.5': 1, '37': 1, '38': 1, '38.5': 1, '39': 1, '39.5': 1, '40': 1, '40.5': 1, '41': 0, '41.5': 1, '42': 1, '43': 1, '44': 0 }
  },
  {
    id: 'yellow',
    ph: 'ph-yellow',
    img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
    name: { nl: 'Custom Yellow Adidas Superstar', en: 'Custom Yellow Adidas Superstar' },
    price: 146.99,
    limited: false,
    sizes: { '36': 1, '36.5': 1, '37': 1, '38': 1, '38.5': 1, '39': 1, '39.5': 1, '40': 1, '40.5': 1, '41': 0, '41.5': 0, '42': 0, '43': 0, '44': 0 }
  },
  {
    id: 'denim-yellow-le',
    ph: 'ph-yellowdenim',
    img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    name: { nl: 'Custom Denim Yellow Adidas Superstar — Limited Edition', en: 'Custom Denim Yellow Adidas Superstar — Limited Edition' },
    price: 171.99,
    limited: true,
    sizes: { '36': 2, '36.5': 0, '37': 1, '38': 2, '38.5': 2, '39': 2, '39.5': 0, '40': 1, '40.5': 0, '41': 0, '41.5': 1, '42': 0, '43': 0, '44': 1 }
  },
  {
    id: 'denim-black-red-le',
    ph: 'ph-blackred',
    img: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80',
    name: { nl: 'Custom Denim Black Red Adidas Superstar — Limited Edition', en: 'Custom Denim Black Red Adidas Superstar — Limited Edition' },
    price: 171.99,
    limited: true,
    sizes: { '36': 0, '36.5': 0, '37': 0, '37.5': 2, '38': 3, '38.5': 2, '39': 1, '39.5': 1, '40': 1, '40.5': 0, '41': 1, '41.5': 0, '42': 2, '43': 1, '44': 0 }
  }
];

// Sort sizes in PRODUCTS ascending
PRODUCTS.forEach(p => {
  const sortedSizes: Record<string, number> = {};
  Object.keys(p.sizes)
    .sort((a, b) => parseFloat(a) - parseFloat(b))
    .forEach(k => {
      sortedSizes[k] = p.sizes[k as keyof typeof p.sizes];
    });
  p.sizes = sortedSizes as any;
});

export const LACES = [
  { id: 'fluffy-white', color: { nl: 'Fluffy White', en: 'Fluffy White' }, c1: '#efece2', c2: '#c9c3ae' },
  { id: 'fluffy-pink', color: { nl: 'Fluffy Pink', en: 'Fluffy Pink' }, c1: '#e9a9bb', c2: '#c97e93' },
  { id: 'fluffy-black', color: { nl: 'Fluffy Black', en: 'Fluffy Black' }, c1: '#2b2a28', c2: '#111' },
  { id: 'white', color: { nl: 'White', en: 'White' }, c1: '#f4f2ec', c2: '#cfcabf' },
  { id: 'black', color: { nl: 'Black', en: 'Black' }, c1: '#232220', c2: '#0c0c0b' },
  { id: 'yellow', color: { nl: 'Yellow', en: 'Yellow' }, c1: '#dcb63a', c2: '#a5810f' },
  { id: 'light-pink', color: { nl: 'Light Pink', en: 'Light Pink' }, c1: '#f0c9d4', c2: '#d79bad' },
  { id: 'army-green', color: { nl: 'Army Green', en: 'Army Green' }, c1: '#5a5f42', c2: '#383b28' }
];

export const LACE_PRICE = 10;
export const FREE_FROM = 3;

export function getShippingCost(country: string): number {
  if (country === 'Nederland') return 8;
  if (['België', 'Duitsland', 'Frankrijk', 'Italië', 'Luxemburg', 'Oostenrijk', 'Spanje', 'Denemarken', 'Zweden'].includes(country)) return 14.50;
  if (['Verenigde Staten', 'Verenigd Koninkrijk'].includes(country)) return 33;
  return 20;
}

export const COUNTRIES = [
  "Nederland", "België", "Duitsland", "Frankrijk", "Verenigd Koninkrijk", 
  "Spanje", "Italië", "Verenigde Staten", "Canada", "Australië",
  "Afghanistan", "Albanië", "Algerije", "Andorra", "Angola", "Antigua en Barbuda", "Argentinië", "Armenië", "Azerbeidzjan",
  "Bahama's", "Bahrein", "Bangladesh", "Barbados", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnië en Herzegovina", "Botswana", "Brazilië", "Brunei", "Bulgarije", "Burkina Faso", "Burundi",
  "Cambodja", "Centraal-Afrikaanse Republiek", "Chili", "China", "Colombia", "Comoren", "Congo-Brazzaville", "Congo-Kinshasa", "Costa Rica", "Cuba", "Cyprus",
  "Denemarken", "Djibouti", "Dominica", "Dominicaanse Republiek", "Ecuador", "Egypte", "El Salvador", "Equatoriaal-Guinea", "Eritrea", "Estland", "Eswatini", "Ethiopië",
  "Fiji", "Filipijnen", "Finland", "Gabon", "Gambia", "Georgië", "Ghana", "Grenada", "Griekenland", "Guatemala", "Guinee", "Guinee-Bissau", "Guyana",
  "Haïti", "Honduras", "Hongarije", "Ierland", "IJsland", "India", "Indonesië", "Irak", "Iran", "Israël", "Ivoorkust",
  "Jamaica", "Japan", "Jemen", "Jordanië", "Kaapverdië", "Kameroen", "Kazachstan", "Kenia", "Kirgizië", "Kiribati", "Koeweit", "Kroatië",
  "Laos", "Lesotho", "Letland", "Libanon", "Liberia", "Libië", "Liechtenstein", "Litouwen", "Luxemburg",
  "Madagaskar", "Malawi", "Malediven", "Maleisië", "Mali", "Malta", "Marokko", "Marshalleilanden", "Mauritanië", "Mauritius", "Mexico", "Micronesië", "Moldavië", "Monaco", "Mongolië", "Montenegro", "Mozambique", "Myanmar",
  "Namibië", "Nauru", "Nepal", "Nicaragua", "Nieuw-Zeeland", "Niger", "Nigeria", "Noord-Korea", "Noord-Macedonië", "Noorwegen",
  "Oeganda", "Oekraïne", "Oezbekistan", "Oman", "Oostenrijk", "Oost-Timor", "Pakistan", "Palau", "Panama", "Papoea-Nieuw-Guinea", "Paraguay", "Peru", "Polen", "Portugal",
  "Qatar", "Roemenië", "Rusland", "Rwanda", "Saint Kitts en Nevis", "Saint Lucia", "Saint Vincent en de Grenadines", "Salomonseilanden", "Samoa", "San Marino", "Sao Tomé en Principe", "Saoedi-Arabië", "Senegal", "Servië", "Seychellen", "Sierra Leone", "Singapore", "Slovenië", "Slowakije", "Soedan", "Somalië", "Sri Lanka", "Suriname", "Syrië",
  "Tadzjikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad en Tobago", "Tsjaad", "Tsjechië", "Tunesië", "Turkije", "Turkmenistan", "Tuvalu",
  "Uruguay", "Vanuatu", "Vaticaanstad", "Venezuela", "Verenigde Arabische Emiraten", "Vietnam",
  "Wit-Rusland", "Zambia", "Zimbabwe", "Zuid-Afrika", "Zuid-Korea", "Zuid-Soedan", "Zweden", "Zwitserland"
];
export const WA_NUMBER = '31639741576';
export const EMAIL = 'floortjevanoosterom@hotmail.com';
export const PHONE_DISPLAY = '+31 6 39741576';
export const IBAN = 'NL05 INGB 0792 9909 35';
export const PAYPAL_EMAIL = 'dvennmedia@gmail.com';
