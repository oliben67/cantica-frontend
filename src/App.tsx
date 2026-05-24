import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Browse } from "@/pages/Browse";
import { CollectionDetail } from "@/pages/CollectionDetail";
import { Collections } from "@/pages/Collections";
import { NamespacePage } from "@/pages/NamespacePage";
import { PromptDetail } from "@/pages/PromptDetail";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/prompts/:namespace/:name" element={<PromptDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:namespace/:name" element={<CollectionDetail />} />
            <Route path="/:namespace" element={<NamespacePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
