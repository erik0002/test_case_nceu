import type { Preview } from '@storybook/react-vite';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { theme } from '../src/theme';
import { createTestStore } from '../src/test/test-utils';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story) => {
      const store = createTestStore();
      return (
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MemoryRouter>
              <Story />
            </MemoryRouter>
          </ThemeProvider>
        </Provider>
      );
    },
  ],
};

export default preview;
