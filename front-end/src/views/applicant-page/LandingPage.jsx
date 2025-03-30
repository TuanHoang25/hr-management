import { Routes, Route } from "react-router-dom";
import Navbar from "../../Landing/Navbar";
import Footer from "../../Landing/Footer";
import Home from "../../Landing/Home";
import About from "../../Landing/About";
import Work from "../../Landing/Work";
import Testimonial from "../../Landing/Hr";
import Contact from "../../Landing/Contact";
import "../../assets/css/LandingPage.css";
function LandingPage() {
  return (
    <div className="App">
      {/* Menu */}
      <Navbar />

      {/* Content */}
      <div className="content">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="hr" element={<Testimonial />} />
          <Route path="work" element={<Work />} />
          <Route path="contact" element={<Contact />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
