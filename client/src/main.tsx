import { StrictMode } from 'react'
import ReactDom from "react-dom/client"; 
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx';

ReactDom.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
