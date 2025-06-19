import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./components/Home"
import LoginPage from "./components/pages/Login"

function App() {

  return (
    <>
     <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        
     </BrowserRouter>
    </>
  )
}

export default App
