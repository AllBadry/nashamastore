export function extractImage(product) {
  const media = product?.media;
  if (!media) return null;
  if (media.cover && Array.isArray(media.cover) && media.cover.length > 0) {
    return media.cover[0].preview || media.cover[0].src;
  }
  if (media.gallery && Array.isArray(media.gallery) && media.gallery.length > 0) {
    return media.gallery[0].preview || media.gallery[0].src;
  }
  if (typeof media === 'string') return media;
  if (product.imageCover && typeof product.imageCover === 'string') return product.imageCover;
  return null;
}

export function extractGallery(product) {
  const media = product?.media;
  if (!media) return [];
  const images = media.gallery || media.cover;
  if (Array.isArray(images)) return images.map((img) => img.preview || img.src).filter(Boolean);
  return [];
}

export function extractPrice(priceData) {
  if (!priceData) return null;
  if (typeof priceData === 'number' || typeof priceData === 'string') return priceData;
  if (typeof priceData === 'object') {
    if (priceData.value !== undefined && priceData.value !== null) return priceData.value;
    return priceData.amount || priceData.price || priceData.value || null;
  }
  return null;
}

export function getProductPrice(product) {
  return (
    extractPrice(product.price) ||
    extractPrice(product.variance?.stock?.price) ||
    extractPrice(product.variance?.price) ||
    null
  );
}

export function getOldPrice(product) {
  return (
    extractPrice(product.oldPrice) ||
    extractPrice(product.variance?.stock?.priceBeforeOffer) ||
    extractPrice(product.variance?.oldPrice) ||
    null
  );
}

export function formatPrice(value) {
  if (value === null || value === undefined) return 'N/A';
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 2 })} JD`;
}

export function isProductOnSale(product) {
  return Boolean(product.variance?.stock?.isOffer);
}