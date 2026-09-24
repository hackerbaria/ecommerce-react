# Salinaka | E-commerce react app
JavaScript/React storefront with a SpringCommerce product API and gateway authentication.

### [Live demo](https://salinaka-ecommerce.web.app/)

![Salinaka screenshot](https://raw.githubusercontent.com/jgudo/ecommerce-react/master/static/screeny1.png)
![Salinaka screenshot](https://raw.githubusercontent.com/jgudo/ecommerce-react/master/static/screeny2.png)
![Salinaka screenshot](https://raw.githubusercontent.com/jgudo/ecommerce-react/master/static/screeny3.png)
![Salinaka screenshot](https://raw.githubusercontent.com/jgudo/ecommerce-react/master/static/screeny7.png)

## Run Locally
### 1. Install Dependencies
```sh
$ yarn install
```

### 2. Configure backend services
Run the product service on port 8080, gateway on port 9000, and Keycloak on port 8181.
The development proxy forwards product reads and login requests to these services.
See [PRODUCT_API.md](PRODUCT_API.md) and [KEYCLOAK.md](KEYCLOAK.md) for configuration.

### 3. Run development server
```sh 
$ yarn dev
```

---

## Build the project
```sh
$ yarn build
```

## Features

- Public catalog, search, and product details.
- Username/password login through the gateway.
- Hosted registration, password recovery, and identity account settings.
- Browser-local basket; account and checkout pages require sign-in.

Profile updates and admin product/image writes are disabled until backend APIs are integrated.
Production requires identity-server configuration and reverse proxy routes as described above.
