import React from 'react'
import ReactDOM from 'react-dom/client'

import { createTheme, ThemeProvider } from '@mui/material/styles'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function bootstrap(Component: React.ElementType) {
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <Component />
      </ThemeProvider>
    </React.StrictMode>
  )
}

export default bootstrap