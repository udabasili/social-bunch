import "@/assets/sass/main.scss";
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css'
import { AppProvider } from "./providers/app";
import { AppRoutes } from "./route";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
