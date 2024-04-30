import React from 'react'
import ReactDOM from 'react-dom/client'

function bootstrap(Component: React.ElementType) {
  //@ts-ignore
  console.log('bootstrapping', Component.displayName)
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  root.render(
    <React.StrictMode>
      <Component />
    </React.StrictMode>
  )
}

export default bootstrap