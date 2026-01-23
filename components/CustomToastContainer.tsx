"use client";

import { useTheme } from "next-themes";
import { ToastContainer, Bounce } from "react-toastify";

const CustomToastContainer = () => {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      limit={3}
      transition={Bounce}
      theme={theme}
      pauseOnHover
      pauseOnFocusLoss={false}
      newestOnTop={true}
      closeOnClick
      autoClose={4000}
    />
  );
};

export default CustomToastContainer;
