import "./App.css";

import React from "react";

import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import MapComponent from "./components/Map";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 60 * 8, // 8 hours
      },
    },
  });

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  return (
    <div className="App">
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <MapComponent />
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </div>
  );
}

export default App;
