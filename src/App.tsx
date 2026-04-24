import React, { useState, useMemo } from 'react';
import { ShoppingBag, Plus, Minus, ChevronRight, X, Trash2, Anchor, Facebook, Instagram, Twitter, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WHATSAPP_NUMBER = "51923494953";

/* ═══════════════════════════════════════════
   MENU DATA — La Isla del Lobo
   ═══════════════════════════════════════════ */

interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
}

interface Category {
  id: string;
  nombre: string;
  slogan?: string;
  items: Dish[];
}

const menuCategories: Category[] = [
  {
    id: "entradas",
    nombre: "Entradas",
    slogan: "Frescura que conquista",
    items: [
      { nombre: "Leche de tigre de pescado", imagen: "Leche de tigre.jpg", precio: "S/.18.00" },
      { nombre: "Leche de tigre mixto", descripcion: "Pescado y mariscos", imagen: "leche de tigre mixta.png", precio: "S/.22.00" },
      { nombre: "Leche de pantera", imagen: "leche de pantera.jpeg", precio: "S/.22.00" },
      { nombre: "Causa pulpa de langostinos", imagen: "Causa pulpa de langostinos.jpeg", precio: "S/.22.00" },
      { nombre: "Causa acevichada", imagen: "Causa acevichada.jpeg", precio: "S/.25.00" },
    ]
  },
  {
    id: "ceviches",
    nombre: "Ceviches",
    slogan: "El que no pica, no enamora",
    items: [
      { nombre: "Ceviche carretillero", imagen: "Ceviche carretillero.jpeg", precio: "S/.28.00" },
      { nombre: "Ceviche de pescado del día", imagen: "Ceviche de pescado del día.jpeg", precio: "S/.27.00" },
      { nombre: "Ceviche mixto", imagen: "Ceviche mixto.jpg", precio: "S/.34.00" },
      { nombre: "Ceviche afrodisíaco", imagen: "Ceviche afrodisíaco.jpeg", precio: "S/.35.00" },
      { nombre: "Ceviche de conchas negras", imagen: "Ceviche de conchas negras.jpeg", precio: "S/.35.00" },
    ]
  },
  {
    id: "tiraditos",
    nombre: "Tiraditos",
    slogan: "Sabor que se desliza",
    items: [
      { nombre: "Tiradito en salsa de ají amarillo", imagen: "Tiradito en salsa de ají amarillo.jpg", precio: "S/.28.00" },
      { nombre: "Tiradito en dos tiempos", imagen: "Tiradito en dos tiempos.jpeg", precio: "S/.32.00" },
    ]
  },
  {
    id: "combinado-norteno",
    nombre: "Combinado Norteño",
    slogan: "Lo mejor del norte",
    items: [
      { nombre: "Combinado norteño", descripcion: "Ceviche de pescado del día + arroz con mariscos o chaufa de mariscos o jalea mixta", imagen: "Combinado norteño.webp", precio: "S/.35.00" },
    ]
  },
  {
    id: "sudados-parihuelas",
    nombre: "Sudados y Parihuelas",
    slogan: "El caldito que cura penas",
    items: [
      { nombre: "Sudado de filete", imagen: "Sudado de filete.jpg", precio: "S/.30.00" },
      { nombre: "Sudado de cabrilla", imagen: "Sudado de cabrilla.jpeg", precio: "S/.32.00" },
      { nombre: "Parihuela mixta especial", imagen: "Parihuela mixta especial.webp", precio: "S/.35.00" },
      { nombre: "Parihuela de cabrilla", imagen: "Parihuela de cabrilla.jpeg", precio: "S/.32.00" },
      { nombre: "Parihuela de filete", imagen: "Parihuela de filete.jpeg", precio: "S/.30.00" },
      { nombre: "Chilcano especial", imagen: "Chilcano especial.webp", precio: "S/.20.00" },
    ]
  },
  {
    id: "chupes",
    nombre: "Chupes",
    slogan: "Tradición en cada cucharada",
    items: [
      { nombre: "Chupe de pescado", imagen: "Chupe de pescado.webp", precio: "S/.30.00" },
      { nombre: "Chupe de cangrejo", imagen: "Chupe de cangrejo.jpeg", precio: "S/.30.00" },
      { nombre: "Chupe de langostino", imagen: "Chupe de langostino.jpeg", precio: "S/.30.00" },
    ]
  },
  {
    id: "trilogias",
    nombre: "Trilogías Marinas",
    slogan: "Tres sabores, una experiencia",
    items: [
      { nombre: "Trilogía N° 1", descripcion: "Ceviche de pescado + arroz con mariscos + chicharrón mixto", imagen: "trilogia 1.webp", precio: "S/.38.00" },
      { nombre: "Trilogía N° 2", descripcion: "Ceviche de pescado + causa de langostinos + chicharrón mixto", imagen: "trilogia 2.jpg", precio: "S/.38.00" },
      { nombre: "Trilogía N° 3", descripcion: "Causa de langostinos + chicharrón de pescado + arroz con mariscos", imagen: "trilogia 3.jpeg", precio: "S/.43.00" },
      { nombre: "Trilogía N° 4", descripcion: "Ceviche de pescado + chicharrón de calamar + arroz con mariscos", imagen: "trilogia 4.jpg", precio: "S/.45.00" },
      { nombre: "Trilogía N° 5", descripcion: "Causa de langostinos + ceviche de pescado + arroz con mariscos", imagen: "trilogia 5.jpeg", precio: "S/.40.00" },
      { nombre: "Trilogía N° 6", descripcion: "Causa de langostinos + chaufa de mariscos + chicharrón de pescado", imagen: "trilogia 6.jpeg", precio: "S/.43.00" },
      { nombre: "Trilogía N° 7", descripcion: "Ceviche de pescado + chaufa de mariscos + chicharrón mixto", imagen: "trologia 7.png", precio: "S/.38.00" },
      { nombre: "Trilogía N° 8", descripcion: "Ceviche de pescado + papa a la huancaína + arroz con pato", imagen: "trilogia 8.jpg", precio: "S/.45.00" },
    ]
  },
  {
    id: "duos",
    nombre: "Duos Marinos",
    slogan: "La pareja perfecta del mar",
    items: [
      { nombre: "Duo Marino 1", descripcion: "Ceviche de pescado del día + causa de pulpa de langostino", imagen: "Duo Marino 1.jpeg", precio: "S/.30.00" },
      { nombre: "Duo Marino 2", descripcion: "Causa de pulpa de langostino + arroz con mariscos", imagen: "Duo Marino 2.jpeg", precio: "S/.32.00" },
      { nombre: "Duo Marino 3", descripcion: "Causa de pulpa de langostino + chicharrón de pescado", imagen: "Duo Marino 3.jpeg", precio: "S/.32.00" },
      { nombre: "Duo Marino 4", descripcion: "Ceviche de pescado + chicharrón de calamar", imagen: "Duo Marino 4.jpeg", precio: "S/.35.00" },
      { nombre: "Duo Marino 5", descripcion: "Causa de pulpa de langostino + chaufa de mariscos", imagen: "Duo Marino 5.webp", precio: "S/.32.00" },
      { nombre: "Duo Marino 6", descripcion: "Ceviche de pescado del día + arroz con mariscos", imagen: "duo marino 6.png", precio: "S/.30.00" },
      { nombre: "Duo Marino 7", descripcion: "Ceviche de pescado del día + chicharrón mixto", imagen: "Duo Marino 7.jpeg", precio: "S/.30.00" },
      { nombre: "Duo Marino 8", descripcion: "Chicharrón de pescado + arroz con mariscos", imagen: "Duo Marino 8.jpeg", precio: "S/.32.00" },
      { nombre: "Duo Marino 9", descripcion: "Chicharrón de pescado + chaufa de mariscos", imagen: "Duo Marino 9.jpeg", precio: "S/.32.00" },
      { nombre: "Duo Marino 10", descripcion: "Ceviche de pescado del día + chaufa de mariscos", imagen: "Duo Marino 10.jpeg", precio: "S/.30.00" },
      { nombre: "Duo Marino 11", descripcion: "Ceviche de pescado del día + arroz con pato", imagen: "Duo Marino 11.jpeg", precio: "S/.35.00" },
    ]
  },
  {
    id: "chicharrones-jaleas",
    nombre: "Chicharrones y Jaleas",
    slogan: "Crujientes del océano",
    items: [
      { nombre: "Chicharrón de pota", imagen: "Chicharrón de pota.jpeg", precio: "S/.30.00" },
      { nombre: "Chicharrón de pescado", imagen: "Chicharrón de pescado.jpeg", precio: "S/.30.00" },
      { nombre: "Jalea de pescado", imagen: "Jalea de pescado.jpeg", precio: "S/.32.00" },
      { nombre: "Chicharrón de calamar", imagen: "Chicharrón de calamar.webp", precio: "S/.40.00" },
      { nombre: "Chicharrón de pescado con calamar", imagen: "Chicharrón de pescado con calamar.webp", precio: "S/.40.00" },
      { nombre: "Chicharrón mixto", imagen: "Chicharrón mixto.webp", precio: "S/.34.00" },
      { nombre: "Jalea mixta", imagen: "Jalea mixta.jpeg", precio: "S/.34.00" },
      { nombre: "Jaleón norteño", descripcion: "Cabrilla frita, mariscos fritos, yuca frita, leche de tigre", imagen: "Jaleón norteño.jpeg", precio: "S/.45.00" },
    ]
  },
  {
    id: "arroces",
    nombre: "Arroces",
    slogan: "El grano que enamora",
    items: [
      { nombre: "Arroz con conchas negras", imagen: "Arroz con conchas negras.webp", precio: "S/.35.00" },
      { nombre: "Arroz con mariscos", imagen: "Arroz con mariscos.jpg", precio: "S/.32.00" },
      { nombre: "Chaufa de mariscos", imagen: "Chaufa de mariscos.webp", precio: "S/.32.00" },
      { nombre: "Chaufa de pescado", imagen: "Chaufa de pescado.jpeg", precio: "S/.28.00" },
      { nombre: "Chaufa amazónico", imagen: "Chaufa amazónico.jpeg", precio: "S/.28.00" },
      { nombre: "Chaufa de langostinos", imagen: "Chaufa de langostinos.jpg", precio: "S/.30.00" },
      { nombre: "Arroz verde en aroma de pato con filete de pescado", imagen: "Arroz verde en aroma de pato con filete de pescado.jpeg", precio: "S/.27.00" },
      { nombre: "Chaufa de carne", imagen: "Chaufa de carne.jpeg", precio: "S/.24.00" },
      { nombre: "Chaufa de pollo", imagen: "Chaufa de pollo.webp", precio: "S/.22.00" },
    ]
  },
  {
    id: "ronda-marina",
    nombre: "Ronda Marina para 4 Personas",
    slogan: "Para compartir en familia",
    items: [
      { nombre: "Ronda marina para 4 personas", descripcion: "Ceviche de pescado + arroz con mariscos + chaufa de mariscos + chicharrón mixto + leche de tigre o causa de pulpa de langostino", imagen: "Ronda marina para 4 personas.webp", precio: "S/.73.00" },
    ]
  },
  {
    id: "fetuccinis",
    nombre: "Fetuccinis",
    slogan: "Pastas con alma marina",
    items: [
      { nombre: "Fetuccini a la huancaína con lomo saltado", imagen: "Fetuccini a la huancaína con lomo saltado.jpeg", precio: "S/.30.00" },
      { nombre: "Fetuccini a la huancaína con pollo a la parrilla", imagen: "Fetuccini a la huancaína con pollo a la parrilla.jpeg", precio: "S/.26.00" },
      { nombre: "Fetuccini a la huancaína con saltado de pollo", imagen: "Fetuccini a la huancaína con saltado de pollo.jpeg", precio: "S/.26.00" },
      { nombre: "Fetuccini a la huancaína con filete de pescado", imagen: "Fetuccini a la huancaína con filete de pescado.jpeg", precio: "S/.27.00" },
      { nombre: "Fetuccini a la huancaína con salsa de mariscos", imagen: "Fetuccini a la huancaína con salsa de mariscos.jpeg", precio: "S/.35.00" },
    ]
  },
  {
    id: "criollos",
    nombre: "Criollos y Norteños",
    slogan: "Sazón de la tierra",
    items: [
      { nombre: "Arroz con pato", imagen: "Arroz con pato.webp", precio: "S/.27.00" },
      { nombre: "Seco de pato con frijoles", imagen: "Seco de pato con frijoles.webp", precio: "S/.28.00" },
      { nombre: "Tacu-tacu con lomo saltado", imagen: "Tacu-tacu con lomo saltado.jpeg", precio: "S/.33.00" },
      { nombre: "Tacu-tacu saltado de pollo", imagen: "Tacu-tacu saltado de pollo.webp", precio: "S/.30.00" },
      { nombre: "Tacu-tacu en salsa de mariscos", imagen: "Tacu-tacu en salsa de mariscos.jpeg", precio: "S/.35.00" },
      { nombre: "Lomo saltado", imagen: "Lomo saltado.jpg", precio: "S/.25.00" },
      { nombre: "Saltado de pollo", imagen: "Saltado de pollo.webp", precio: "S/.23.00" },
      { nombre: "Tallarín saltado de carne", imagen: "Tallarín saltado de carne.jpeg", precio: "S/.25.00" },
      { nombre: "Tallarín saltado de pollo", imagen: "Tallarín saltado de pollo.jpeg", precio: "S/.23.00" },
    ]
  },
  {
    id: "pescado-frito",
    nombre: "Pescado Frito y Filete",
    slogan: "Directo del mar a tu mesa",
    items: [
      { nombre: "Cabrilla frita con yucas, arroz y ensalada", imagen: "Cabrilla frita con yucas, arroz y ensalada.webp", precio: "S/.32.00" },
      { nombre: "Filete de pescado frito con yucas, arroz y ensalada", imagen: "Filete de pescado frito con yucas, arroz y ensalada.jpeg", precio: "S/.27.00" },
    ]
  },
];

/* ═══════════════════════════════════════════
   CART
   ═══════════════════════════════════════════ */

interface CartItem {
  nombre: string;
  precio: string;
  cantidad: number;
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.cantidad, 0), [cart]);

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.nombre === dish.nombre && i.precio === dish.precio);
      if (existing) {
        return prev.map(i =>
          (i.nombre === dish.nombre && i.precio === dish.precio)
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { nombre: dish.nombre, precio: dish.precio, cantidad: 1 }];
    });
  };

  const updateQuantity = (nombre: string, precio: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.nombre === nombre && i.precio === precio) {
            const newQty = i.cantidad + delta;
            return newQty > 0 ? { ...i, cantidad: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const num = parseFloat(item.precio.replace(/[^0-9.]/g, '')) || 0;
      return acc + num * item.cantidad;
    }, 0);
  };

  const sendToWhatsApp = () => {
    const total = calculateTotal();
    let message = `*Hola La Isla del Lobo, deseo realizar un pedido:*\n\n`;
    cart.forEach(item => {
      message += `• ${item.cantidad} x ${item.nombre} (${item.precio})\n`;
    });
    message += `\n*TOTAL: S/.${total.toFixed(2)}*`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col font-sans">

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-50 px-5 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex flex-col items-start">
          <h1 className="font-title text-[28px] text-isla-teal leading-none tracking-wide">La Isla del Lobo</h1>
          <span className="font-slogan text-[11px] text-isla-orange font-bold tracking-wider mt-0.5">Sabor que atrapa</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Location Button */}
          <motion.a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 bg-isla-teal/10 rounded-full flex items-center justify-center text-isla-teal cursor-pointer"
          >
            <MapPin size={22} />
          </motion.a>

          <motion.div
            onClick={() => cartCount > 0 && setShowSummary(true)}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 bg-isla-teal/10 rounded-full flex items-center justify-center relative cursor-pointer"
          >
            <ShoppingBag size={22} className="text-isla-teal" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-isla-orange text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </motion.div>
        </div>
      </header>

      {/* ─── MARQUEE ─── */}
      <div className="w-full bg-isla-teal py-2 overflow-hidden flex items-center">
        <div className="animate-marquee flex gap-6 text-white font-slogan font-bold text-[11px] tracking-widest uppercase whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i}>🐺 LA ISLA DEL LOBO • SABOR DEL MAR • FRESCURA GARANTIZADA • </span>
          ))}
        </div>
      </div>

      {/* ─── HERO ─── */}
      <div className="px-5 pt-5 pb-3">
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-isla-teal via-[#0e8d9b] to-[#0a6f7a] p-7 shadow-xl">
          <div className="absolute top-3 right-3 text-5xl opacity-20">🐺</div>
          <div className="absolute bottom-2 left-4 text-3xl opacity-10">🌊</div>
          <h2 className="font-title text-white text-5xl leading-[0.95] drop-shadow-lg mb-2">
            La Isla<br />del Lobo
          </h2>
          <p className="font-slogan text-isla-orange font-bold text-sm tracking-wide">
            El verdadero sabor a mar
          </p>
        </div>
      </div>

      {/* ─── CATEGORY NAV PILLS ─── */}
      <div className="px-5 py-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max">
          {menuCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border
                ${activeCategory === cat.id
                  ? 'bg-isla-teal text-white border-isla-teal shadow-md shadow-isla-teal/20'
                  : 'bg-white text-isla-dark border-gray-200 hover:border-isla-teal/40 hover:text-isla-teal'
                }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MENU ─── */}
      <main className="flex-1 overflow-y-auto pb-32 px-5">
        {menuCategories.map(cat => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-28">
            {/* Category heading */}
            <div className="mb-5 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Anchor className="text-isla-teal wave-icon" size={22} />
                <h3 className="font-title text-isla-teal text-[26px] leading-none tracking-wide category-underline">
                  {cat.nombre}
                </h3>
              </div>
              {cat.slogan && (
                <p className="font-slogan text-isla-orange text-[13px] font-bold ml-8 tracking-wide">
                  {cat.slogan}
                </p>
              )}
            </div>

            {/* Dish list (Grid Layout) */}
            <div className="grid grid-cols-2 gap-4">
              {cat.items.map((dish, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-sm border border-gray-100 hover:border-isla-teal/30 hover:shadow-md transition-all duration-200"
                >
                  {/* Dish Image */}
                  <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                    {dish.imagen ? (
                      <img src={`/${dish.imagen}`} alt={dish.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold">Acá va imagen</span>
                    )}
                  </div>
                  
                  {/* Dish info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-isla-dark text-[13px] leading-tight mb-1">
                      {dish.nombre}
                    </h4>
                    {dish.descripcion && (
                      <p className="text-[10px] text-gray-400 leading-tight mb-2">
                        {dish.descripcion}
                      </p>
                    )}
                    <div className="flex-1"></div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price */}
                      <span className="font-bold text-isla-dark text-[16px] whitespace-nowrap">
                        {dish.precio}
                      </span>

                      {/* Add button */}
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => addToCart(dish)}
                        className="w-8 h-8 bg-[#E6F7F8] rounded-full flex items-center justify-center text-isla-teal transition-colors duration-200 shrink-0"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 text-center italic mt-4">* Todas las imágenes son referenciales</p>
          </section>
        ))}

        {/* ─── FOOTER ─── */}
        <footer className="mt-8 pt-8 pb-10 border-t border-gray-200 flex flex-col items-center justify-center">
          <div className="flex gap-4 mb-4">
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-isla-teal shadow-sm border border-gray-100 hover:bg-isla-teal hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-isla-teal shadow-sm border border-gray-100 hover:bg-isla-teal hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-isla-teal shadow-sm border border-gray-100 hover:bg-isla-teal hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
          </div>
          <p className="font-title text-2xl text-isla-teal mb-1">La Isla del Lobo</p>
          <p className="text-[11px] text-gray-400 font-medium">© 2026 Todos los derechos reservados.</p>
        </footer>
      </main>

      {/* ─── FLOATING CART BAR ─── */}
      <AnimatePresence>
        {cartCount > 0 && !showSummary && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 w-full max-w-md p-5 z-40"
          >
            <div className="glass rounded-[2rem] p-4 flex items-center justify-between border border-white/50 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-isla-teal rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="shimmer absolute inset-0 opacity-20"></div>
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tu Pedido</p>
                  <p className="font-bold text-isla-dark text-lg">{cartCount} Artículos</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummary(true)}
                className="bg-isla-teal text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-isla-teal/30 font-bold text-sm"
              >
                Ver Pedido
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ORDER SUMMARY MODAL ─── */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 lg:p-0"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[3rem] p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-title text-2xl text-isla-teal">Mi Pedido</h2>
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                {cart.map(item => (
                  <div
                    key={`${item.nombre}-${item.precio}`}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-isla-dark text-sm truncate">{item.nombre}</h4>
                      <p className="text-xs text-isla-teal font-bold">{item.precio}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                      <button onClick={() => updateQuantity(item.nombre, item.precio, -1)} className="text-gray-400">
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.nombre, item.precio, 1)} className="text-isla-teal">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => updateQuantity(item.nombre, item.precio, -item.cantidad)}
                      className="text-red-300 ml-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-isla-dark">Total a pagar</h3>
                  <h3 className="text-xl font-bold text-isla-teal">S/.{calculateTotal().toFixed(2)}</h3>
                </div>
              </div>

              <button
                onClick={sendToWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:scale-[1.02] transition-transform font-bold"
              >
                Enviar Pedido a WhatsApp
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
