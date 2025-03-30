import { FaLock, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Create a CSS file for styling
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Login.css";
const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here (e.g., API call)
    try {
      const response = await axios.post(
        "https://hrm-backend-0s8j.onrender.com/api/auth/login",
        { name, password, location }
      );
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
      console.log(response.data);
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Start server ,please !");
      }
    }
  };
  //Thêm hàm tự lấy vị trí nhân viên

  const fetchCityName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const city =
        response.data.city ||
        response.data.locality ||
        response.data.principalSubdivision;
      setLocation(city); // Cập nhật vị trí
    } catch (error) {
      console.error("Error fetching city name:", error);
      setError("Không thể lấy tên thành phố.");
    }
  };

  useEffect(() => {
    document.body.classList.add("login-page");
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Chuyển đổi tọa độ thành tên thành phố (sử dụng API hoặc thư viện)
            fetchCityName(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            setError("Không thể lấy vị trí hiện tại.");
          }
        );
      } else {
        setError("Geolocation không được hỗ trợ trên trình duyệt này.");
      }
    };
    getLocation();
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1 className="poppins-bold">Đăng nhập</h1>
        {error && <p className="poppins-regular">{error}</p>}
        <div className="input-box">
          {/* <label htmlFor="name" className="poppins-semibold">
          </label> */}
          <input
            type="text"
            placeholder="Nhập username"
            required
            readOnly
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => e.target.removeAttribute("readonly")}
            value={name}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          {/* <label htmlFor="password" className="poppins-semibold">
          </label> */}
          <input
            type="password"
            placeholder=" Nhập mật khẩu"
            required
            readOnly
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => e.target.removeAttribute("readonly")}
            value={password}
          />
          <FaLock className="icon" />
        </div>
        {/* <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>
          <a href="#">Forgot Password</a>
        </div> */}
        <button type="submit" className="btn">
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
