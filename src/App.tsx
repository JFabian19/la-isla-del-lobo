import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, ChevronRight, X, Trash2, Anchor, Facebook, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSheetData, SheetDish, SheetCategory } from './services/googleSheets';

const WHATSAPP_NUMBER = "51923494953";

// Mapa de imágenes locales por defecto para platos conocidos
const LOCAL_IMAGES: Record<string, string> = {
  "Leche de tigre de pescado": "Leche de tigre.jpg",
  "Leche de tigre mixto": "leche de tigre mixta.png",
  "Leche de pantera": "leche de pantera.jpeg",
  "Causa pulpa de langostinos": "Causa pulpa de langostinos.jpeg",
  "Causa acevichada": "Causa acevichada.jpeg",
  "Ceviche carretillero": "Ceviche carretillero.jpeg",
  "Ceviche de pescado del día": "Ceviche de pescado del día.jpeg",
  "Ceviche mixto": "Ceviche mixto.jpg",
  "Ceviche afrodisíaco": "Ceviche afrodisíaco.jpeg",
  "Ceviche de conchas negras": "Ceviche de conchas negras.jpeg",
  "Tiradito en salsa de ají amarillo": "Tiradito en salsa de ají amarillo.jpg",
  "Tiradito en dos tiempos": "Tiradito en dos tiempos.jpeg",
  "Combinado norteño": "Combinado norteño.webp",
  "Sudado de filete": "Sudado de filete.jpg",
  "Sudado de cabrilla": "Sudado de cabrilla.jpeg",
  "Parihuela mixta especial": "Parihuela mixta especial.webp",
  "Parihuela de cabrilla": "Parihuela de cabrilla.jpeg",
  "Parihuela de filete": "Parihuela de filete.jpeg",
  "Chilcano especial": "Chilcano especial.webp",
  "Chupe de pescado": "Chupe de pescado.webp",
  "Chupe de cangrejo": "Chupe de cangrejo.jpeg",
  "Chupe de langostino": "Chupe de langostino.jpeg",
  "Trilogía N° 1": "trilogia 1.webp",
  "Trilogía N° 2": "trilogia 2.jpg",
  "Trilogía N° 3": "trilogia 3.jpeg",
  "Trilogía N° 4": "trilogia 4.jpg",
  "Trilogía N° 5": "trilogia 5.jpeg",
  "Trilogía N° 6": "trilogia 6.jpeg",
  "Trilogía N° 7": "trologia 7.png",
  "Trilogía N° 8": "trilogia 8.jpg",
  "Duo Marino 1": "Duo Marino 1.jpeg",
  "Duo Marino 2": "Duo Marino 2.jpeg",
  "Duo Marino 3": "Duo Marino 3.jpeg",
  "Duo Marino 4": "Duo Marino 4.jpeg",
  "Duo Marino 5": "Duo Marino 5.webp",
  "Duo Marino 6": "duo marino 6.png",
  "Duo Marino 7": "Duo Marino 7.jpeg",
  "Duo Marino 8": "Duo Marino 8.jpeg",
  "Duo Marino 9": "Duo Marino 9.jpeg",
  "Duo Marino 10": "Duo Marino 10.jpeg",
  "Duo Marino 11": "Duo Marino 11.jpeg",
  "Chicharrón de pota": "Chicharrón de pota.jpeg",
  "Chicharrón de pescado": "Chicharrón de pescado.jpeg",
  "Jalea de pescado": "Jalea de pescado.jpeg",
  "Chicharrón de calamar": "Chicharrón de calamar.webp",
  "Chicharrón de pescado con calamar": "Chicharrón de pescado con calamar.webp",
  "Chicharrón mixto": "Chicharrón mixto.webp",
  "Jalea mixta": "Jalea mixta.jpeg",
  "Jaleón norteño": "Jaleón norteño.jpeg",
  "Arroz con conchas negras": "Arroz con conchas negras.webp",
  "Arroz con mariscos": "Arroz con mariscos.jpg",
  "Chaufa de mariscos": "Chaufa de mariscos.webp",
  "Chaufa de pescado": "Chaufa de pescado.jpeg",
  "Chaufa amazónico": "Chaufa amazónico.jpeg",
  "Chaufa de langostinos": "Chaufa de langostinos.jpg",
  "Arroz verde en aroma de pato con filete de pescado": "Arroz verde en aroma de pato con filete de pescado.jpeg",
  "Chaufa de carne": "Chaufa de carne.jpeg",
  "Chaufa de pollo": "Chaufa de pollo.webp",
  "Ronda marina para 4 personas": "Ronda marina para 4 personas.webp",
  "Fetuccini a la huancaína con lomo saltado": "Fetuccini a la huancaína con lomo saltado.jpeg",
  "Fetuccini a la huancaína con pollo a la parrilla": "Fetuccini a la huancaína con pollo a la parrilla.jpeg",
  "Fetuccini a la huancaína con saltado de pollo": "Fetuccini a la huancaína con saltado de pollo.jpeg",
  "Fetuccini a la huancaína con filete de pescado": "Fetuccini a la huancaína con filete de pescado.jpeg",
  "Fetuccini a la huancaína con salsa de mariscos": "Fetuccini a la huancaína con salsa de mariscos.jpeg",
  "Arroz con pato": "Arroz con pato.webp",
  "Seco de pato con frijoles": "Seco de pato con frijoles.webp",
  "Tacu-tacu con lomo saltado": "Tacu-tacu con lomo saltado.jpeg",
  "Tacu-tacu saltado de pollo": "Tacu-tacu saltado de pollo.webp",
  "Tacu-tacu en salsa de mariscos": "Tacu-tacu en salsa de mariscos.jpeg",
  "Lomo saltado": "Lomo saltado.jpg",
  "Saltado de pollo": "Saltado de pollo.webp",
  "Tallarín saltado de carne": "Tallarín saltado de carne.jpeg",
  "Tallarín saltado de pollo": "Tallarín saltado de pollo.jpeg",
  "Cabrilla frita con yucas, arroz y ensalada": "Cabrilla frita con yucas, arroz y ensalada.webp",
  "Filete de pescado frito con yucas, arroz y ensalada": "Filete de pescado frito con yucas, arroz y ensalada.jpeg",
};

interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
}

interface Category {
  id: string;
  nombre: string;
  items: Dish[];
}

interface CartItem {
  nombre: string;
  precio: string;
  cantidad: number;
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, dishes] = await Promise.all([
          fetchSheetData<SheetCategory>('Categorías'),
          fetchSheetData<SheetDish>('Platos')
        ]);

        const formattedCategories: Category[] = cats.map(c => ({
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'),
          nombre: c.nombre,
          items: dishes
            .filter(d => d.categoría === c.nombre)
            .map(d => ({
              nombre: d['nombre del plato'],
              descripcion: d.descripción,
              precio: d.precio,
              imagen: d['URL de imagen'] || LOCAL_IMAGES[d['nombre del plato']] || null
            }))
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      const cleanPrice = item.precio.replace(/^[^\d]*/, '');
      const num = parseFloat(cleanPrice) || 0;
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-12 h-12 text-isla-teal animate-spin mb-4" />
        <p className="font-slogan text-isla-teal font-bold tracking-widest uppercase text-xs">Cargando delicias...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col font-sans">
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-50 px-5 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex flex-col items-start">
          <h1 className="font-title text-[28px] text-isla-teal leading-none tracking-wide">La Isla del Lobo</h1>
          <span className="font-slogan text-[11px] text-isla-orange font-bold tracking-wider mt-0.5">Sabor que atrapa</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.a
            href="https://www.facebook.com/LAISLADELOBO"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 bg-isla-teal/10 rounded-full flex items-center justify-center text-isla-teal cursor-pointer"
          >
            <Facebook size={22} />
          </motion.a>
          <motion.a
            href="https://maps.app.goo.gl/Cebnnt1QLt2iVW6f9"
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

      <div className="w-full bg-isla-teal py-2 overflow-hidden flex items-center">
        <div className="animate-marquee flex gap-6 text-white font-slogan font-bold text-[11px] tracking-widest uppercase whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i}>🐺 LA ISLA DEL LOBO • SABOR DEL MAR • FRESCURA GARANTIZADA • </span>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 pb-3">
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl aspect-[2/1] bg-gray-100">
          <img 
            src="/banner.png" 
            alt="La Isla del Lobo" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="px-5 py-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max">
          {categories.map(cat => (
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

      <main className="flex-1 overflow-y-auto pb-32 px-5">
        {categories.map(cat => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-28">
            <div className="mb-5 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Anchor className="text-isla-teal wave-icon" size={22} />
                <h3 className="font-title text-isla-teal text-[26px] leading-none tracking-wide category-underline">
                  {cat.nombre}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {cat.items.map((dish, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-sm border border-gray-100 hover:border-isla-teal/30 hover:shadow-md transition-all duration-200"
                >
                  <div 
                    className="bg-white aspect-square flex items-center justify-center relative overflow-hidden cursor-pointer group"
                    onClick={() => dish.imagen && setSelectedImage(dish.imagen.startsWith('http') ? dish.imagen : `/${dish.imagen}`)}
                  >
                    {dish.imagen ? (
                      <img 
                        src={dish.imagen.startsWith('http') ? dish.imagen : `/${dish.imagen}`} 
                        alt={dish.nombre} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                      />
                    ) : (
                      <span className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold">Acá va imagen</span>
                    )}
                  </div>
                  
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
                      <span className="font-bold text-isla-dark text-[16px] whitespace-nowrap">
                        {dish.precio}
                      </span>
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
          </section>
        ))}

        <footer className="mt-8 pt-8 pb-10 border-t border-gray-200 flex flex-col items-center justify-center">

          <p className="font-title text-2xl text-isla-teal mb-4">La Isla del Lobo</p>
          <img src="/footer.jpeg" alt="Logo La Isla del Lobo" className="w-32 h-32 object-contain mb-6 rounded-2xl shadow-sm border border-gray-100" />
          <p className="text-[11px] text-gray-400 font-medium">© 2026 Todos los derechos reservados.</p>
        </footer>

        <div className="bg-isla-dark py-6 flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1 opacity-50 text-white/50">Digital Menu Experience</p>
          <motion.a 
            href="https://tymasolutions.lat/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-bold text-sm tracking-tight group cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white group-hover:text-[#00BFFF] transition-colors duration-200">Hecho por Tyma</span>
            <span className="text-[#00BFFF] group-hover:text-white transition-colors duration-200">Solutions</span>
          </motion.a>
        </div>
      </main>

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

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Plato ampliado"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
