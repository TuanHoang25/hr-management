import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid2,
  TextField,
  Button,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = "73799b7bfc14fcaa1bb64587a8468ad7";

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Giả sử bạn có một API để lấy thông tin người dùng đã đăng nhập
        const userResponse = await axios.get(
          "http://localhost:3000/api/auth/verify",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Lấy token từ localStorage
            },
          }
        );

        const employeeResponse = await axios.get(
          `http://localhost:3000/api/employee/${userResponse.data.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const location = employeeResponse.data.employees.location;
        fetchWeatherData(location);
      } catch (err) {
        setError("Không thể lấy thông tin nhân viên.", err);
        setLoading(false);
      }
    };

    const fetchWeatherData = async (location) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );
        setWeatherData(response.data);
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
        );
        setForecastData(forecastResponse.data.list.slice(0, 8)); // Lấy dữ liệu 24 giờ tới (mỗi 3 giờ)
        setError(null);
      } catch (err) {
        setError(
          "Không thể lấy dữ liệu thời tiết. Vui lòng kiểm tra lại.",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [apiKey]);

  const handleSearch = () => {
    const fetchWeatherData = async (location) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );
        setWeatherData(response.data);
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
        );
        setForecastData(forecastResponse.data.list.slice(0, 8)); // Lấy dữ liệu 24 giờ tới (mỗi 3 giờ)
        setError(null);
      } catch (err) {
        setError(
          "Không thể lấy dữ liệu thời tiết. Vui lòng kiểm tra lại.",
          err
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData(city);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  const chartData = {
    labels: forecastData.map(
      (item) => new Date(item.dt_txt).getHours() + ":00"
    ),
    datasets: [
      {
        label: "Khả năng mưa (%)",
        data: forecastData.map((item) => item.pop * 100), // Xác suất mưa (pop)
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        fill: true,
      },
    ],
  };
  const suggestions = () => {
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].main.toLowerCase();

    if (condition.includes("rain")) {
      return "Mang ô trước khi ra ngoài.";
    } else if (temp < 10) {
      return "Mặc áo khoác dày và khăn quàng cổ.";
    } else if (temp > 25) {
      return "Nên mặc áo phông và đội mũ.";
    }
    return "Thời tiết ổn định, tận hưởng ngày của bạn!";
  };
  return (
    <Card
      style={{
        maxWidth: 600,
        margin: "auto",
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardContent>
        <Grid2
          container
          spacing={2}
          alignItems="center"
          style={{ marginBottom: 20 }}
        >
          <Grid2 size={{ xs: 8 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Nhập thành phố"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 4 }}>
            <img
              src={weatherIconUrl}
              alt={weatherData.weather[0].description}
              style={{ width: "100%" }}
            />
          </Grid2>
          <Grid2 size={{ xs: 8 }}>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {weatherData.name}
            </Typography>
            <Typography variant="body1">
              <strong>Nhiệt độ:</strong> {weatherData.main.temp} °C
            </Typography>
            <Typography variant="body1">
              <strong>Độ ẩm:</strong> {weatherData.main.humidity} %
            </Typography>
            <Typography variant="body1">
              <strong>Tình trạng:</strong> {weatherData.weather[0].description}
            </Typography>
          </Grid2>
        </Grid2>
        <Typography variant="h6" style={{ marginTop: 20 }}>
          Gợi ý: {suggestions()}
        </Typography>
        <div style={{ marginTop: 20 }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Weather;
