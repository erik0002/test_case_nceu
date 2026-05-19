import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from './theme';
import { Layout } from './components/Layout/Layout';
import { TaskListPage } from './pages/TaskListPage/TaskListPage';
import { TaskDetailPage } from './pages/TaskDetailPage/TaskDetailPage';
import { TaskFormPage } from './pages/TaskFormPage/TaskFormPage';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<TaskListPage />} />
              <Route path="task/:id" element={<TaskDetailPage />} />
              <Route path="tasks/new" element={<TaskFormPage />} />
              <Route path="tasks/:id/edit" element={<TaskFormPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
