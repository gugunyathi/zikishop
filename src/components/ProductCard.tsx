import React, { useState, useEffect } from 'react';
import { Heart, Check, Tag, RotateCcw } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency?: Currency;
  selectedMemberId?: string;
  lowDataMode?: boolean;
  previouslyBoughtMeta?: {
    lastPurchased: string;
    timesBought: number;
    frequentRecipient: string;
  };
  onAddToCart: (productId: string, memberId: string, note?: string, quantity?: number) => void;
}

const getSpecificFallback = (prod: Product): string => {
  const nameLower = prod.name.toLowerCase();
  const catLower = prod.category.toLowerCase();

  if (nameLower.includes('rice')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('maize') || nameLower.includes('meal')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('fruit') || nameLower.includes('veg')) return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('oil')) return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('sugar')) return 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('orange') || nameLower.includes('mazoe') || nameLower.includes('crush') || nameLower.includes('syrup')) return 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('tea')) return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('solar') || nameLower.includes('light')) return 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('milk')) return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('soap')) return 'https://images.unsplash.com/photo-1607006482602-76ca9bd4a946?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('beef') || nameLower.includes('meat')) return 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80';
  if (nameLower.includes('pampers') || nameLower.includes('diaper') || nameLower.includes('pants')) return 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80';

  if (catLower.includes('beverage')) return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80';
  if (catLower.includes('dairy')) return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80';

  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency = 'USD' as Currency,
  selectedMemberId = 'mem-2',
  lowDataMode = false,
  previouslyBoughtMeta,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const handleAddToCartClick = () => {
    onAddToCart(product.id, selectedMemberId, undefined, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  // Format price string matching TM Pick n Pay standard e.g. "USD 2.90"
  const formattedPriceDisplay = currency === 'USD' 
    ? `USD ${product.priceUSD.toFixed(2)}`
    : formatPrice(product.priceUSD, currency);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-md h-full group relative">
      {/* Product Image Area */}
      <div className="relative bg-white rounded-xl w-full h-40 sm:h-52 flex items-center justify-center p-2 mb-2 overflow-hidden">
        {!lowDataMode ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = getSpecificFallback(product);
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#002D62] rounded-xl flex flex-col items-center justify-center p-2 text-center text-white">
            <span className="font-bold text-xs">{product.brand}</span>
            <span className="text-[10px] text-blue-200 mt-0.5">{product.unit}</span>
          </div>
        )}
      </div>

      {/* Main Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Product Title */}
          <h3 className="font-bold text-stone-900 text-xs sm:text-base leading-snug line-clamp-2 min-h-[2.2rem] sm:min-h-[2.6rem]">
            {product.name}
          </h3>

          {/* Native Name Tag if present */}
          {product.nativeName && (
            <div className="text-[10px] sm:text-xs font-semibold text-[#0082C8] mt-1 flex items-center gap-1 truncate">
              <Tag className="w-3 h-3 text-[#D0021B] flex-shrink-0" />
              <span className="truncate">{product.nativeName}</span>
            </div>
          )}

          {/* Previously Bought Pill */}
          {previouslyBoughtMeta && (
            <div className="bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg p-1.5 text-[10px] font-bold flex items-center justify-between gap-1 mt-1.5">
              <span className="flex items-center gap-1 text-amber-800 truncate">
                <RotateCcw className="w-3 h-3 text-amber-600 flex-shrink-0" />
                <span>Bought {previouslyBoughtMeta.timesBought}x</span>
              </span>
              <span className="text-amber-800/80 font-normal whitespace-nowrap text-[9px]">
                {previouslyBoughtMeta.lastPurchased}
              </span>
            </div>
          )}
        </div>

        {/* Price Display */}
        <div className="font-semibold text-stone-900 text-sm sm:text-lg mt-3 mb-3">
          {formattedPriceDisplay}
        </div>
      </div>

      {/* Bottom Action Controls: Quantity Input, Add To Cart Button, Wishlist Button */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-auto pt-1">
        {/* Quantity Box */}
        <input
          type="number"
          min="1"
          max="99"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-10 sm:w-14 h-10 border border-stone-300 rounded-md bg-white text-center font-semibold text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#C51D4A] transition-colors flex-shrink-0"
        />

        {/* Add To Cart Button */}
        <button
          type="button"
          onClick={handleAddToCartClick}
          className={`flex-1 h-10 px-2 sm:px-3 font-bold text-xs sm:text-sm rounded-md shadow-2xs flex items-center justify-center gap-1 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[#C51D4A] hover:bg-[#a8143a] text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Added</span>
            </>
          ) : (
            <span>Add To Cart</span>
          )}
        </button>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label="Add to wishlist"
          className="w-10 h-10 bg-[#002D62] hover:bg-[#001D42] text-white rounded-md flex items-center justify-center transition-all cursor-pointer shadow-2xs flex-shrink-0"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </button>
      </div>
    </div>
  );
};
