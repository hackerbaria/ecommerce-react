import { getAuthorizationHeaders } from './keycloak';

const productUrl = import.meta.env.VITE_PRODUCT_API_URL || '/api/product';

const fetchProducts = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(productUrl, {
      headers: { Accept: 'application/json', ...await getAuthorizationHeaders() },
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch products (${response.status}).`);
    }
    const body = await response.json();
    const products = Array.isArray(body) ? body : body?.products;
    if (!Array.isArray(products)) {
      throw new Error('Expected a product array or an object containing products.');
    }
    return products.map((product) => {
      if (product?.id === undefined || product?.id === null) {
        throw new Error('Each product must have an id.');
      }
      return { ...product, id: String(product.id) };
    });
  } finally {
    clearTimeout(timeout);
  }
};

const getProducts = async () => {
  const products = await fetchProducts();
  return { products, total: products.length, lastKey: null };
};

const getSingleProduct = async (id) => {
  const products = await fetchProducts();
  return products.find((product) => product.id === String(id));
};

const searchProducts = async (searchKey) => {
  const products = await fetchProducts();
  const query = searchKey.trim().toLowerCase();
  const matches = products.filter((product) => (
    (product.name || '').toLowerCase().includes(query)
    || (product.keywords || []).some((keyword) => query.split(/\s+/).includes(keyword.toLowerCase()))
  ));
  return { products: matches, total: matches.length, lastKey: null };
};

const getShowcaseProducts = async (flag, count) => {
  const products = await fetchProducts();
  const hasFlags = products.some((product) => typeof product[flag] === 'boolean');
  const selected = hasFlags
    ? products.filter((product) => product[flag] === true)
    : products;
  return selected.slice(0, count);
};

const getFeaturedProducts = (count = 12) => getShowcaseProducts('isFeatured', count);

const getRecommendedProducts = (count = 12) => getShowcaseProducts('isRecommended', count);

export default {
  getProducts, getSingleProduct, searchProducts, getFeaturedProducts, getRecommendedProducts
};
