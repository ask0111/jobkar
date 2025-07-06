

// ================= || USER API || ====================== //

import axiosInstance from "../utils/axios";



export function getValidUser() {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get("/validate-token")
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getValidRequestEmail(token) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`/reset-password/${token}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function userEmailLogin(email, password) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("/api/login", { email, password })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}



export function userRegister(values) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("/api/register", values)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function requestForgotPassword(values) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("/request-reset-password", values)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function userResetPassword(values) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .put("/reset-password", values)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function verifyUserOTP(values) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("/api/email-verify", values)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function sendUserOTP(values) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .put("/resend-verify-token", values)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function userUpdate(values) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .put(`/users/profile`, values)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function userChangePassword(values) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .put(`/users/change-password`, values)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function getUploadedImage(values) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/media`, values)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function wishlistApi(body) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("/wishlists", body)
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getWishlist(query) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`/wishlists${query}`)
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
