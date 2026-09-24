/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

// Catalog pages are available to guests as well as signed-in customers.
const CatalogRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => <Component {...props} />} />
);

CatalogRoute.propTypes = { component: PropTypes.elementType.isRequired };

export default CatalogRoute;
