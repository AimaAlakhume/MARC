// Frontend settings. Override them with a .env file in this folder
// (see .env.example). Vite only exposes variables that start with VITE_.

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Which cart diagram to show: "layperson" or "rn".
// This should match the CUEBOT_CART setting on the backend.
export const CART = import.meta.env.VITE_CART || 'layperson';

// Cart diagrams: crash-cart.png is the default view, and crash-cart-d{N}.png
// outlines drawer N.
const cartImages = import.meta.glob('./assets/cart-*/*.png', { eager: true, import: 'default' });

export const getCartImage = (drawer) => {
    const name = drawer ? `crash-cart-d${drawer}.png` : 'crash-cart.png';
    return cartImages[`./assets/cart-${CART}/${name}`] || cartImages[`./assets/cart-${CART}/crash-cart.png`];
};
