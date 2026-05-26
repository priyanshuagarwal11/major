import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './styles/theme.css';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-shell">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;