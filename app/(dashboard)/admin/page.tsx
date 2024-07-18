"use client";

import ManagePage from "./_components/manage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AdminPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ManagePage />
    </QueryClientProvider>
  );
};

export default AdminPage;
