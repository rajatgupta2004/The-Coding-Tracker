import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter,  RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import LeaderBoard from './pages/LeaderBoard'
import Analytics from './pages/Analytics'
import HowItWorks from './pages/HowItWorks'
import AddUser from './pages/AddUser'


const router = createBrowserRouter([
  {
    path:'/',
    element: <Layout/>,
    children:[
      {
        path:'/',
        element :<LeaderBoard></LeaderBoard>
      },
      {
        path:'/analytics',
        element :<Analytics/>
      },
      {
        path:'/howitworks',
        element :<HowItWorks/>
      },
      {
        path:'/adduser',
        element :<AddUser/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)

