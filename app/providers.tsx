"use client";

import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/src/store";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        closeButton
        duration={3200}
        expand={false}
        position="top-right"
        richColors
        toastOptions={{
          classNames: {
            toast: "border border-slate-200 shadow-lg",
            title: "text-sm font-semibold",
            description: "text-sm",
          },
        }}
      />
    </Provider>
  );
}
