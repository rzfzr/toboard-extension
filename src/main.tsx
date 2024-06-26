import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'

import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import useStore from './useStore'
import { CssBaseline } from '@mui/material'
import { light } from '@mui/material/styles/createPalette'


const themes = {
  'dark': createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ea1022',
      },
      secondary: {
        main: '#ea1022',
      },
      background: {
        default: '#262626',
      },
    },
  }),
  light: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#ea1022',
      },
      secondary: {
        main: '#ea1022',
      },
      background: {
        default: '#e0e0e0',
      },
    },
  })
}

function bootstrap(Component: React.ElementType) {
  const root = ReactDOM.createRoot(document.getElementById('root')!)

  function App() {
    const syncFromChromeStorage = useStore((state) => state.syncFromChromeStorage)
    const { selectedTheme, setEntries, setProjects, setWorkspaces } = useStore((state) => ({
      selectedTheme: state.theme,
      setEntries: state.setEntries,
      setProjects: state.setProjects,
      setWorkspaces: state.setWorkspaces
    }))

    useEffect(() => {
      syncFromChromeStorage()
      const handleMessage = (request: any, sender: any, sendResponse: any) => {
        switch (request.func) {
          case 'setWorkspaces':
            setWorkspaces(request.data)
            break
          case 'setProjects':
            setProjects(request.data)
            break
          case 'setEntries':
            setEntries(request.data)
            break
        }
      }
      chrome.runtime.onMessage.addListener(handleMessage)
      return () => chrome.runtime.onMessage.removeListener(handleMessage)
    }, [])

    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes[selectedTheme]}>
          <CssBaseline />
          <Component />
        </ThemeProvider>
      </StyledEngineProvider>
    )
  }

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

export default bootstrap