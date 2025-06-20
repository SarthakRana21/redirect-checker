import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./components/Home"
import LoginPage from "./components/pages/Login.page"
import RegisterPage from "./components/pages/Register.page"
import ProfilePage from "./components/pages/Profile.page"

function App() {

  return (
    <>
     <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        
     </BrowserRouter>
    </>
  )
}

export default App
