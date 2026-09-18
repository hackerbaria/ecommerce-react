/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, ProductGrid, ProductList } from '@/components/product';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectFilter } from '@/selectors/selector';

const Shop = () => {
  useDocumentTitle('Shop | Salinaka');
  useScrollTop();

  const store = useSelector((state) => ({
    filter: state.filter,
    products: state.products,
    requestStatus: state.app.requestStatus,
    isLoading: state.app.loading
  }), shallowEqual);
  const filteredProducts = useMemo(
    () => selectFilter(store.products.items, store.filter),
    [store.products.items, store.filter]
  );
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef(null);
  const hasMore = visibleCount < filteredProducts.length;

  useEffect(() => {
    setVisibleCount(12);
  }, [filteredProducts]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!hasMore || !target || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        setVisibleCount((count) => count + 12);
      }
    }, { rootMargin: '200px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, visibleCount, filteredProducts]);

  return (
    <main className="content shop-page">
      <section className="product-list-wrapper">
        <AppliedFilters filteredProductsCount={filteredProducts.length} />
        <ProductList {...store} filteredProducts={filteredProducts}>
          <ProductGrid products={filteredProducts.slice(0, visibleCount)} />
          {hasMore && (
            <div className="d-flex-center padding-l" ref={loadMoreRef}>
              <button
                className="button button-small"
                onClick={() => setVisibleCount((count) => count + 12)}
                type="button"
              >
                Show more products
              </button>
            </div>
          )}
        </ProductList>
      </section>
    </main>
  );
};

export default Shop;
