import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { FiltersToggle, SearchBar } from '@/components/common';
import PropType from 'prop-types';
import React from 'react';

const ProductsNavbar = (props) => {
  const { productsCount, totalProductsCount } = props;

  return (
    <div className="product-admin-header">
      <h3 className="product-admin-header-title">
        Products &nbsp;
        (
        {`${productsCount} / ${totalProductsCount}`}
        )
      </h3>
      <SearchBar />
            &nbsp;
      <FiltersToggle>
        <button className="button-muted button-small" type="button">
          <FilterOutlined />
          &nbsp;More Filters
        </button>
      </FiltersToggle>
      <button
        className="button button-small"
        disabled
        title="Product changes are currently unavailable."
        type="button"
      >
        <PlusOutlined />
        &nbsp; Add New Product
      </button>
    </div>
  );
};

ProductsNavbar.propTypes = {
  productsCount: PropType.number.isRequired,
  totalProductsCount: PropType.number.isRequired
};

export default ProductsNavbar;
