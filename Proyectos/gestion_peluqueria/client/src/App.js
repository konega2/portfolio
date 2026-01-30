import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Componentes
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Servicios from './pages/Servicios';
import Citas from './pages/Citas';
import Calendario from './pages/Calendario';
import CalendarioDia from './pages/CalendarioDia';
import Gastos from './pages/Gastos';
import Inventario from './pages/Inventario';
import Caja from './pages/Caja';
import CajaPos from './pages/CajaPos';
import Proveedores from './pages/Proveedores';
import ProveedorDetalle from './pages/ProveedorDetalle';
import Empleados from './pages/Empleados';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#111827',
    },
    secondary: {
      main: '#7C3AED',
    },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F7F8FA',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'transparent',
      },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          color: '#111827',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 16px',
          '@media (max-width:600px)': {
            padding: '6px 12px',
            fontSize: '0.82rem',
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
          '@media (max-width:600px)': {
            minHeight: 56,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 8px',
          '@media (max-width:600px)': {
            margin: '2px 6px',
            paddingTop: 8,
            paddingBottom: 8,
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(124, 58, 237, 0.08)',
            color: '#4C1D95',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(124, 58, 237, 0.12)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#6B7280',
        },
        root: {
          '@media (max-width:600px)': {
            padding: '10px 8px',
            fontSize: '0.82rem',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          width: '100%',
          overflowX: 'auto',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            } 
          />
          
          {isAuthenticated ? (
            <Route path="/" element={<Layout onLogout={handleLogout} />}>
              <Route index element={<Dashboard />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="servicios" element={<Servicios />} />
              <Route path="citas" element={<Citas />} />
              <Route path="calendario" element={<Calendario />} />
              <Route path="calendario/dia/:fecha" element={<CalendarioDia />} />
              <Route path="gastos" element={<Gastos />} />
              <Route path="inventario" element={<Inventario />} />
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="proveedores/:id" element={<ProveedorDetalle />} />
              <Route path="empleados" element={<Empleados />} />
              <Route path="caja" element={<Caja />} />
              <Route path="caja/pos" element={<CajaPos />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
