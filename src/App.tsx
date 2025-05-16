import { useCallback, useState } from "react";
import { debounce } from "lodash";
import SearchBar from "./components/SearchBar";
import ImageGrid from "./components/ImageGrid";
import ErrorBoundary from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1hour
      retry: 1,  // Retry failed requests once
    },
  },
});

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 500),
    []
  );
  return (
    <>
    <QueryClientProvider client={queryClient}>
     <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl/6 font-bold text-center mb-8">Image Gallery</h1>
        <ErrorBoundary>
        <SearchBar onSearch={debouncedSearch}/>
        <ImageGrid searchQuery={searchQuery}/>
        </ErrorBoundary>
      </div>
     </div>
     </QueryClientProvider>
    </>
  )
}

export default App
