import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "./storage";
// slices
import productReducer from "./slices/product";
import user from "./slices/user";
import job from "./slices/job";

import globalReducer from "./slices/global";

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: ["user"],
};

export const productPersistConfig = {
  key: "product",
  storage,
  keyPrefix: "redux-",
  whitelist: ["sortBy", "checkout"],
};

const rootReducer = combineReducers({
  user: user,
  job: job,
});

export default rootReducer;
