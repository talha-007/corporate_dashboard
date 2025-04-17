import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { PublicRoute, ProtectedRoute } from './guards'; // update the path

const DashboardPage = lazy(() => import('src/pages/dashboard'));
const BlogPage = lazy(() => import('src/pages/blog'));
const EmployeePage = lazy(() => import('src/pages/user'));
const CorporatePage = lazy(() => import('src/pages/corporates'));
const SignInPage = lazy(() => import('src/pages/sign-in'));
const ProductsPage = lazy(() => import('src/pages/products'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

const NewEmployee = lazy(() => import('src/sections/user/view/new-employee'));
const EditEmployee = lazy(() => import('src/sections/user/view/edit-employee'));
const NewCorporate = lazy(() => import('src/sections/corporate/view/new-corporate'));
const EditCorporate = lazy(() => import('src/sections/corporate/view/edit-corporate'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'employees', element: <EmployeePage /> },
      { path: '/employees/new', element: <NewEmployee /> },
      { path: '/employees/edit/:id', element: <EditEmployee /> },
      { path: 'Corporates', element: <CorporatePage /> },
      { path: '/Corporates/new', element: <NewCorporate /> },
      { path: '/Corporates/edit/:id', element: <EditCorporate /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <PublicRoute>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </PublicRoute>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
