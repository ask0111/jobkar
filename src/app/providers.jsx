"use client";

import { AuthProvider } from "../hooks/auth/JwtContext";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <Provider store={store}>{children}</Provider>
    </AuthProvider>
  );
}
