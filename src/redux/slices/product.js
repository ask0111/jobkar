import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice, current } from '@reduxjs/toolkit';
import axios from 'axios';
// utils
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isProductsLoading: false,
  isProductDetailLoading: false,
  error: null,
  wishlistProducts: [],
  totalWishlistProductPage: 1,
  products: [],
  productVariation: null,
  totalProductPage: 1,
  currentProductPage: 1,
  totalProducts: 1,
  product: undefined,
  productCategories: [],
  productBrands: [],
  productColors: [],
  productDetail: undefined,
  recentViewsProduct: [],
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
    totalItems: 0,
  },
  userCart: {
    cart: [],
    tempCart: null,
    totalCartItem: 0,
    subtotal: 0,
    total: 0,
    discount: 0,
    billingAddress: null,
    deliveryAddress: null,
    paymentMethod: null,
    useWalletAmount: false,
    useBonusAmount: false,
    walletAmount: 0,
    bonusAmount: 0,
    couponCode: null,
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // START Product LOADING
    startProductsLoading(state) {
      state.isProductsLoading = true;
    },
    // START Product Details LOADING
    startProductDetailLoading(state) {
      state.isProductDetailLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET WISHLIST PRODUCTS
    getWishlistProductsSuccess(state, action) {
      state.isProductsLoading = false;
      state.wishlistProducts = action.payload.data;
      state.totalWishlistProductPage = action.payload.last_page;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isProductsLoading = false;
      state.products = action.payload.data;
      state.totalProductPage = action.payload.last_page;
      state.totalProducts = action.payload.total;
      state.currentProductPage = action.payload.current_page;
    },

    // INCREASE PAGINATION
    getProductPageIncreasedSuccess(state, action) {
      state.products = [...state.products, ...action.payload.data];
      state.currentProductPage = action.payload.current_page
    },

    // GET PRODUCTS DETAILS
    getProductDetailSuccess(state, action) {
      state.isProductDetailLoading = false;
      state.productDetail = action.payload;
    },

    // GET PRODUCTS VARIATION
    getProductVariationSuccess(state, action) {
      state.productVariation = action.payload;
    },
    // GET PRODUCT CATEGORIES
    getProductCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.productCategories = action.payload;
    },

    // GET PRODUCT CATEGORIES
    getProductBrandsSuccess(state, action) {
      state.productBrands = action.payload;
    },

    // GET PRODUCT CATEGORIES
    getProductColorsSuccess(state, action) {
      state.productColors = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    // GET PRODUCTS
    getRecentViewsProductsSuccess(state, action) {
      state.recentViewsProduct = action.payload.data;
    },

    // GET USER CART
    getUserCartSuccess(state, action) {
      state.userCart.cart = action.payload.data.data;
      state.userCart.totalCartItem = action.payload.data.data.length;
      state.userCart.subtotal = action.payload.total_amount;
      state.checkout.total = action.payload.total_amount - (state.checkout.discount || 0);
    },

    // ADD TEMP CART
    addTempCart(state, action) {
      state.userCart.tempCart = action.payload;
    },

    // SAVE DELIVERY ADDRESS
    saveDeliveryAddress(state, action) {
      state.userCart.deliveryAddress = action.payload;
    },

    // SAVE BILLING ADDRESS
    saveBillingAddress(state, action) {
      state.userCart.billingAddress = action.payload;
    },

    // SAVE PAYMENT METHOD
    savePaymentMethod(state, action) {
      state.userCart.paymentMethod = action.payload;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;
      const totalItems = sum(cart.map((product) => product.productQuantity));
      const subtotal = sum(
        cart.map((product) => product.customer_sale_price * product.productQuantity)
      );
      state.checkout.cart = cart;
      state.checkout.discount = state.checkout.discount || 0;
      state.checkout.shipping = state.checkout.shipping || 0;
      state.checkout.billing = state.checkout.billing || null;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - state.checkout.discount;
      state.checkout.totalItems = totalItems;
    },

    addToCart(state, action) {
      const newProduct = action.payload;
      const isEmptyCart = !state.checkout.cart.length;

      state.checkout.cart = [...state.checkout.cart, newProduct];
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((product) => product.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.cart = [];
      state.checkout.billing = null;
      state.checkout.activeStep = 0;
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.totalItems = 0;
    },

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.checkout.activeStep = step;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;

      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            productQuantity: product.productQuantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            productQuantity: product.productQuantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
      state.userCart.discount = discount;
      state.userCart.total = state.userCart.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },

    // checkbox state of wallet and Bonus
    handleWalletAmountState(state, action) {
      state.userCart.useWalletAmount = action.payload;
    },
    handleBonusAmountState(state, action) {
      state.userCart.useBonusAmount = action.payload;
    },

    // handle amount of wallet and Bonus
    updateWallet(state, action) {
      state.userCart.walletAmount = action.payload;
    },
    updateBonus(state, action) {
      state.userCart.bonusAmount = action.payload;
    },

    // Update coupon code
    updateCoupon(state, action) {
      state.userCart.couponCode = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addToCart,
  resetCart,
  gotoStep,
  backStep,
  nextStep,
  deleteCart,
  createBilling,
  saveBillingAddress,
  saveDeliveryAddress,
  savePaymentMethod,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
} = slice.actions;

// ----------------------------------------------------------------------

export function addTempCartProduct(product) {
  return async (dispatch) => {
    dispatch(slice.actions.addTempCart(product));
  };
}

export function getUserCart() {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(`/carts`);
      dispatch(slice.actions.getUserCartSuccess(response?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getRecentViewedProducts() {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(`/recent-views`);
      dispatch(slice.actions.getRecentViewsProductsSuccess(response?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductsWithoutAbort(query) {
  return async (dispatch) => {
    dispatch(slice.actions.startProductsLoading());
    try {
      const response = await axiosInstance.get(`/products${query ? `?${query}` : ''}`);
      dispatch(slice.actions.getProductsSuccess(response?.data?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

let abortControllerPagination = null;
export function getProductsWithIncreasedPage(query) {
  return async (dispatch) => {
    // Cancel the previous request if it exists
    if (abortControllerPagination) {
      abortControllerPagination.abort();
    }

    // Create a new AbortController for the current request
    abortControllerPagination = new AbortController();

    try {
      const response = await axiosInstance.get(`/products${query ? `?${query}` : ''}`, {
        signal: abortControllerPagination.signal,
      });

      console.log(response?.data?.data, 'pagination product response')

      dispatch(slice.actions.getProductPageIncreasedSuccess(response?.data?.data));
      // Clear the abortController after successful request
      abortControllerPagination = null;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else if (error.name === 'AbortError') {
        console.log('Request aborted:', error.message);
      } else {
        dispatch(slice.actions.hasError(error));
      }
    }
  };
}

let abortController = null;
export function getProducts(query) {
  return async (dispatch) => {
    // Cancel the previous request if it exists
    if (abortController) {
      abortController.abort();
    }

    // Create a new AbortController for the current request
    abortController = new AbortController();

    dispatch(slice.actions.startProductsLoading());

    try {
      const response = await axiosInstance.get(`/products${query ? `?${query}` : ''}`, {
        signal: abortController.signal,
      });

      dispatch(slice.actions.getProductsSuccess(response?.data?.data));
      // Clear the abortController after successful request
      abortController = null;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else if (error.name === 'AbortError') {
        console.log('Request aborted:', error.message);
      } else {
        dispatch(slice.actions.hasError(error));
      }
    }
  };
}

// -------------------------------------------------------

export function getWishlistProducts(query) {
  return async (dispatch) => {
    dispatch(slice.actions.startProductsLoading());
    try {
      const response = await axiosInstance.get(`/wishlists${query && `?${query}`}`);
      dispatch(slice.actions.getWishlistProductsSuccess(response?.data?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProductDetail(slug) {
  return async (dispatch) => {
    dispatch(slice.actions.startProductDetailLoading());
    try {
      const response = await axiosInstance.get(`/products/slug/${slug}`);
      dispatch(slice.actions.getProductDetailSuccess(response?.data?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductVariation(slug) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(`/products/slug/${slug}/variations`);
      dispatch(slice.actions.getProductVariationSuccess(response?.data?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(slug) {
  return async (dispatch) => {
    dispatch(slice.actions.startProductDetailLoading());
    try {
      const index = initialState.products.findIndex((data) => data.slug === slug);
      dispatch(slice.actions.getProductSuccess(initialState.products[index]));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductCategories(name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/products-categories/all');
      dispatch(slice.actions.getProductCategoriesSuccess(response?.data?.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductBrands(name) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/brands/all');
      dispatch(slice.actions.getProductBrandsSuccess(response?.data?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductColors() {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/colors/all');
      dispatch(slice.actions.getProductColorsSuccess(response?.data?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function handleWalletCheckBox(state) {
  return async (dispatch) => {
    dispatch(slice.actions.handleWalletAmountState(state));
  };
}
export function handleBonusCheckBox(state) {
  return async (dispatch) => {
    dispatch(slice.actions.handleBonusAmountState(state));
  };
}
export function updateBonusAmount(state) {
  return async (dispatch) => {
    dispatch(slice.actions.updateBonus(state));
  };
}
export function updateWalletAmount(state) {
  return async (dispatch) => {
    dispatch(slice.actions.updateWallet(state));
  };
}
export function updateCouponCode(state) {
  return async (dispatch) => {
    dispatch(slice.actions.updateCoupon(state));
  };
}
