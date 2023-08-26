import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage';
import LearnEnglish from './pages/LearnEnglish';
import LearnEnglishSentence from './pages/LearnEnglishSentence';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/learn-english',
    element: <LearnEnglish />
  },
  {
    path: '/sentence-writing',
    element: <LearnEnglishSentence />
  }
])

export default router;