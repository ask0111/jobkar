import axios from "./axios";

export const setSession = (accesstoken) => {
  if (accesstoken) {
    localStorage.setItem("accesstoken", accesstoken);
    axios.defaults.headers.common.Authorization = `Bearer ${accesstoken}`;
  } else {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common.Authorization;
  }
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    // localStorage.removeItem("accesstoken");
  }
};

export const setCompany = (company_id) => {
  if (company_id) {
    localStorage.setItem("company_id", company_id);
  } else {
    // localStorage.removeItem("accesstoken");
  }
};

