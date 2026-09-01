import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./errors/ErrorBoundary";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { router } from "./routes/appRoutes";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Navbar />
          <RouterProvider router={router} />
        <Footer />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;