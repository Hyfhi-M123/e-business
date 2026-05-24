import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

type QuickAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAdd: (cartItem: any) => void;
};

export default function QuickAddModal({ isOpen, onClose, product, onAdd }: QuickAddModalProps) {
  const [activeSize, setActiveSize] = useState("M");
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Derive available sizes and colors
  const hasVariants = product?.variants && product.variants.length > 0;
  const availableSizes = hasVariants ? Array.from(new Set(product.variants.map((v: any) => v.size))) : ["S", "M", "L", "XL"];
  
  // If product.colors is missing, provide fallback array to prevent errors
  const fallbackColors = product?.colors || [{ name: "Hitam", hex: "#1a1a1a" }, { name: "Putih", hex: "#e8e8e8" }];
  const availableColors = hasVariants ? Array.from(new Set(product.variants.map((v: any) => v.colorName))) : fallbackColors.map((c: any) => c.name);
  const availableHex = fallbackColors.map((c: any) => c.hex || "#ccc");

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      if (hasVariants && !availableSizes.includes(activeSize)) {
        setActiveSize(availableSizes[0] as string);
      }
      if (hasVariants && activeColor >= availableColors.length) {
        setActiveColor(0);
      }
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const selectedVariant = hasVariants ? product.variants.find((v: any) => v.size === activeSize && v.colorName === availableColors[activeColor]) : null;

  const basePrice = parseFloat(product.price);
  const baseOriginalPrice = parseFloat(product.original_price || product.originalPrice || product.price);

  const currentPrice = selectedVariant && selectedVariant.price ? parseFloat(selectedVariant.price) : basePrice + (activeSize === "L" ? 50000 : activeSize === "XL" ? 100000 : 0);
  const currentOriginalPrice = selectedVariant && selectedVariant.originalPrice ? parseFloat(selectedVariant.originalPrice) : baseOriginalPrice + (activeSize === "L" ? 50000 : activeSize === "XL" ? 100000 : 0);

  const discount = currentOriginalPrice > currentPrice ? Math.round((1 - currentPrice / currentOriginalPrice) * 100) : 0;

  const handleConfirm = () => {
    onAdd({
      id: product.id,
      name: `${product.name} - ${activeSize} - ${availableColors[activeColor]}`,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: product.image,
      category: product.category,
      quantity: quantity
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-[#121212] w-full max-w-md shadow-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-black/10 dark:border-white/10">
              <h3 className="text-xl font-black uppercase tracking-tighter text-[#212529] dark:text-white">Quick Add</h3>
              <button onClick={onClose} className="text-neutral-500 hover:text-red-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content (Scrollable if needed) */}
            <div className="p-6 overflow-y-auto">
              
              {/* Product Info */}
              <div className="flex gap-4 mb-8 pb-8 border-b border-black/10 dark:border-white/10">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover border border-black/10 dark:border-white/10" />
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F77F00]">{product.category}</span>
                    <h4 className="font-bold text-[#212529] dark:text-white mt-1 line-clamp-2">{product.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {discount > 0 && <span className="text-xs text-neutral-500 line-through">{formatRupiah(currentOriginalPrice)}</span>}
                    <span className="text-lg font-black text-[#212529] dark:text-white">{formatRupiah(currentPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Ukuran */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Pilih Ukuran</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#212529] dark:text-white">{activeSize}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((size: any) => (
                    <button
                      key={size} onClick={() => setActiveSize(size)}
                      className={`h-12 border flex items-center justify-center text-sm font-black uppercase transition-all ${activeSize === size ? "bg-[#212529] text-white dark:bg-white dark:text-black border-[#212529] dark:border-white" : "border-black/20 dark:border-white/20 text-[#212529] dark:text-white hover:border-[#F77F00]"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warna */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Pilih Warna</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#212529] dark:text-white">{availableColors[activeColor] || "Custom"}</span>
                </div>
                <div className="flex gap-4">
                  {availableColors.map((_, idx) => (
                    <button
                      key={idx} onClick={() => setActiveColor(idx)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${activeColor === idx ? "border-[#F77F00] p-1" : "border-transparent"}`}
                    >
                      <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: availableHex[idx] || "#ccc" }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Kuantitas */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 mb-4 block">Kuantitas</span>
                <div className="flex items-center w-full h-12 border border-black/20 dark:border-white/20">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#212529] dark:text-white">
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 h-full flex items-center justify-center text-base font-black border-x border-black/20 dark:border-white/20 text-[#212529] dark:text-white">
                    {quantity}
                  </div>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#212529] dark:text-white">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-black/10 dark:border-white/10 mt-auto">
              <button 
                onClick={handleConfirm}
                className="w-full h-14 bg-[#F77F00] text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-orange-600 hover:text-white transition-colors"
              >
                <ShoppingBag className="w-5 h-5" /> Tambah ke Keranjang
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
