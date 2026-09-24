/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { SIGNIN } from '@/constants/routes';
import { usesKeycloak } from '@/services/keycloak';

// The gateway protects catalog reads. Wait for login before mounting API consumers.
const CatalogRoute = ({ component: Component, ...rest }) => {
  const authenticated = useSelector(({ auth }) => Boolean(auth));
  return (
    <Route
      {...rest}
      render={(props) => (usesKeycloak && !authenticated ? (
        <Redirect to={{ pathname: SIGNIN, state: { from: props.location } }} />
      ) : <Component {...props} />)}
    />
  );
};

CatalogRoute.propTypes = { component: PropTypes.elementType.isRequired };

export default CatalogRoute;
