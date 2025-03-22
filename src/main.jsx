import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'
import App from './App.jsx'
import Sidebar from './sidebar.jsx'
import TopNavbar from './dashboard-top.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TopNavbar />
    <Sidebar />
  </StrictMode>,
)
