import { useState } from 'react';
import AuthTest from './components/AuthTest';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-blue-500 text-white p-4 rounded">
        <h1>Trackii frontend</h1>
        <AuthTest />
      </div>
    </>
  )
}

export default App
