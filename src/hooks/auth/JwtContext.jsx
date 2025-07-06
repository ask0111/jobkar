"use client";
import PropTypes from "prop-types";
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import axios from "../../utils/axios";
import localStorageAvailable from "../../utils/localStorageAvailable";
import { setCompany, setSession, setUser } from "../../utils/session";
import { userEmailLogin, userRegister } from "../../api/user";
import axiosInstance from "../../utils/axios";

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  isError: null,
  user: null,
  companyID: null,
  isSignInAlertOpen: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INITIAL":
      return {
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        companyID: action.payload.companyID,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        companyID: action.payload.companyID,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        companyID: null,
      };
    case "ERROR":
      return {
        ...state,
        isError: action.payload.isError,
      };
    case "SIGN_IN_ALERT":
      return {
        ...state,
        isSignInAlertOpen: action.payload.isSignInAlertOpen,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext(null);

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const storageAvailable = localStorageAvailable();
  const { enqueueSnackbar } = useSnackbar();

  const initialize = useCallback(async () => {
    try {
      const accesstoken = storageAvailable
        ? localStorage.getItem("accesstoken")
        : "";
      const user = JSON.parse(localStorage.getItem("user"));
      const companyID = localStorage.getItem("company_id");
      console.log(companyID, "klcompany_id");
      if (accesstoken) {
        setSession(accesstoken);

        // const response = await axios.post("/api/validate-token");

        // const { user } = response.data;

        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: true,
            user,
            companyID,
          },
        });
      } else {
        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: "INITIAL",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(
    async (email, password) => {
      try {
        setIsLoading(true);
        const response = await userEmailLogin(email, password);
        if (response?.access_token) {
          const { access_token, data, company_id } = response;
          setSession(access_token);
          setUser(data);
          setCompany(company_id);
          enqueueSnackbar("Login Successful", { variant: "success" });
          router.push("/");

          dispatch({
            type: "LOGIN",
            payload: {
              isAuthenticated: true,
              user: data,
              companyID: company_id,
            },
          });
          dispatch({
            type: "SIGN_IN_ALERT",
            payload: {
              isSignInAlertOpen: false,
            },
          });
        }
      } catch (error) {
        enqueueSnackbar(error, { variant: "error" });
        if (error.message === "User not authorized to login") {
          router.push("/verify-email"); // Use router.push
        }
        dispatch({
          type: "ERROR",
          payload: {
            isError: error,
          },
        });
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar, router.push]
  );

  const register = useCallback(
    async (values) => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.post("/api/register", values);
        enqueueSnackbar(res?.data.message || "Verify your Email", {
          variant: "success",
        });
        router.push("/verify-email"); // Use router.push
      } catch (error) {
        console.error("Error fetches:", error);
        if (error?.error?.email) {
          enqueueSnackbar(error.error.email[0], { variant: "error" });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar, router.push]
  );

  const logout = useCallback(() => {
    axios.post("/api/logout");
    setSession(null);
    dispatch({
      type: "LOGOUT",
      payload: {
        isAuthenticated: false,
      },
    });
    router.push("/"); // Redirect to home on logout
  }, [router.push]);

  const setOpenSignInAlert = useCallback((value) => {
    dispatch({
      type: "SIGN_IN_ALERT",
      payload: {
        isSignInAlertOpen: value,
      },
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      companyID: state.companyID,
      isError: state.isError,
      isSignInAlertOpen: state.isSignInAlertOpen,
      method: "jwt",
      isLoading,
      login,
      register,
      logout,
      setOpenSignInAlert,
      initialize,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      state.companyID,
      state.isError,
      state.isSignInAlertOpen,
      isLoading,
      login,
      logout,
      register,
      setOpenSignInAlert,
      initialize,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
