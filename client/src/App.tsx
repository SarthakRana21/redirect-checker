import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./components/Home"
import LoginPage from "./components/pages/Login.page"
import RegisterPage from "./components/pages/Register.page"
import Dashboard from "./components/pages/Dashboard.page"

function App() {

  return (
    <>
     <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        
     </BrowserRouter>
    </>
  )
}

export default App
