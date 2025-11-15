import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './Router/Router'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './Provider/AuthProvider'
import FloatingChat from './componet/FloatingChat/FloatingChat'
import {  QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>

     <AuthProvider>
      <QueryClientProvider client={queryClient}>
      <div className="max-w-7xl p-2 md:p-0 mx-auto">
      <RouterProvider router={router} />
      <Toaster></Toaster>
      <FloatingChat></FloatingChat>
    </div>
    </QueryClientProvider>
   </AuthProvider>


  </StrictMode>,
)
