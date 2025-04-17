import 'react-toastify/dist/ReactToastify.css';

import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import App from './app';
import { store } from './redux/store';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';
// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    Component: () => (
      <Provider store={store}>
        <App>
          <Outlet />
          <ToastContainer />
        </App>
      </Provider>
    ),
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
