import { Basket } from '@/components/basket';
import { Footer, Navigation } from '@/components/common';
import * as ROUTES from '@/constants/routes';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import * as view from '@/views';
import GatewayAuth from '@/views/auth/GatewayAuth';
import AdminRoute from './AdminRoute';
import ClientRoute from './ClientRoute';
import CatalogRoute from './CatalogRoute';
import PublicRoute from './PublicRoute';

// Revert back to history v4.10.0 because
// v5.0 breaks navigation
export const history = createBrowserHistory();

const ProductWritesUnavailable = () => <p role="status">Product changes are currently unavailable.</p>;

const AppRouter = () => (
  <Router history={history}>
    <>
      <Navigation />
      <Basket />
      <Switch>
        <CatalogRoute
          component={view.Search}
          exact
          path={ROUTES.SEARCH}
        />
        <Route
          component={view.Home}
          exact
          path={ROUTES.HOME}
        />
        <CatalogRoute
          component={view.Shop}
          exact
          path={ROUTES.SHOP}
        />
        <CatalogRoute
          component={view.FeaturedProducts}
          exact
          path={ROUTES.FEATURED_PRODUCTS}
        />
        <CatalogRoute
          component={view.RecommendedProducts}
          exact
          path={ROUTES.RECOMMENDED_PRODUCTS}
        />
        <PublicRoute
          component={GatewayAuth}
          path={ROUTES.SIGNUP}
        />
        <PublicRoute
          component={GatewayAuth}
          exact
          path={ROUTES.SIGNIN}
        />
        <PublicRoute
          component={GatewayAuth}
          path={ROUTES.FORGOT_PASSWORD}
        />
        <CatalogRoute
          component={view.ViewProduct}
          path={ROUTES.VIEW_PRODUCT}
        />
        <ClientRoute
          component={view.UserAccount}
          exact
          path={ROUTES.ACCOUNT}
        />
        <ClientRoute
          component={GatewayAuth}
          exact
          path={ROUTES.ACCOUNT_EDIT}
        />
        <ClientRoute
          component={view.CheckOutStep1}
          path={ROUTES.CHECKOUT_STEP_1}
        />
        <ClientRoute
          component={view.CheckOutStep2}
          path={ROUTES.CHECKOUT_STEP_2}
        />
        <ClientRoute
          component={view.CheckOutStep3}
          path={ROUTES.CHECKOUT_STEP_3}
        />
        <AdminRoute
          component={view.Dashboard}
          exact
          path={ROUTES.ADMIN_DASHBOARD}
        />
        <AdminRoute
          component={view.Products}
          path={ROUTES.ADMIN_PRODUCTS}
        />
        <AdminRoute
          component={ProductWritesUnavailable}
          path={ROUTES.ADD_PRODUCT}
        />
        <AdminRoute
          component={ProductWritesUnavailable}
          path={`${ROUTES.EDIT_PRODUCT}/:id`}
        />
        <PublicRoute component={view.PageNotFound} />
      </Switch>
      <Footer />
    </>
  </Router>
);

export default AppRouter;
