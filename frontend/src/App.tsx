import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage';
import LearnEnglish from './pages/LearnEnglish';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/learn-english',
    element: <LearnEnglish />
  }
])

export default router;