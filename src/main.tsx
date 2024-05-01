import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import useStore from './useStore'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function bootstrap(Component: React.ElementType) {
  const root = ReactDOM.createRoot(document.getElementById('root')!)

  function App() {
    const syncFromChromeStorage = useStore((state) => state.syncFromChromeStorage)

    useEffect(() => {
      const handleMessage = (request: any, sender: any, sendResponse: any) => {
        console.log('Got message', request)
        if (request.action === "syncStorage") {
          syncFromChromeStorage()
        }
      }

      chrome.runtime.onMessage.addListener(handleMessage)

      return () => chrome.runtime.onMessage.removeListener(handleMessage)
    }, [])

    return (
      <ThemeProvider theme={darkTheme}>
        <Component />
      </ThemeProvider>
    )
  }

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

export default bootstrap