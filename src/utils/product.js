// تحويل منتج خام من الـ API إلى بنية مناسبة للعرض
export function mapProduct(product) {
  const stock = product?.variance?.stock;

  return {
    id: product?.productId,
    slug: product?.slug,
    name: product?.name,
    brand: product?.brand?.name || '',
    description: product?.description || '',
    image: product?.media?.cover?.[0]?.preview || product?.media?.gallery?.[0]?.preview || '',
    gallery: product?.media?.gallery || [],
    isOffer: stock?.isOffer === true,
    price: stock?.price?.value ?? 0,
    oldPrice: stock?.priceBeforeOffer?.value && stock.priceBeforeOffer.value > 0 ? stock.priceBeforeOffer.value : 0,
    avgRate: product?.avgRate || 0,
  };
}

// تنسيق السعر بالدينار الأردني
export function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} د.أ`;
}
