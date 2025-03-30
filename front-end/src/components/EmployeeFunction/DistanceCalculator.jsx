import { useState, useEffect } from "react";
import axios from "axios";

import {
  TextField,
  Card,
  CardContent,
  Typography,
  Grid2,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
import { FaCar, FaWalking, FaBus } from "react-icons/fa";

const DistanceCalculator = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [map, setMap] = useState(null); // State để lưu bản đồ Google Maps
  const [directionsRenderer, setDirectionsRenderer] = useState(null); // Để hiển thị đường đi
  const [transportMode, setTransportMode] = useState("driving");
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
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

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      // Khởi tạo bản đồ khi có currentLocation
      const initMap = () => {
        const mapInstance = new window.google.maps.Map(
          document.getElementById("map"),
          {
            zoom: 14,
            center: currentLocation,
          }
        );

        // Tạo marker cho currentLocation
        new window.google.maps.Marker({
          position: currentLocation,
          map: mapInstance,
          title: "Vị trí hiện tại",
        });

        setMap(mapInstance); // Lưu instance của bản đồ
      };
      initMap();
    }
  }, [currentLocation]);

  const handleInputChange = async (e) => {
    const query = e.target.value;
    const apiKey = "AlzaSyV6D1nLeQaIUDnfuPhI0O1Oz_9cdKYVJkZ";
    setDestination(query);
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${query}&location=${currentLocation.lat},${currentLocation.lng}&radius=50000&key=${apiKey}`
      );

      const predictions = response.data.predictions || [];
      setSuggestions(
        predictions.map((item) => ({
          id: item.place_id,
          description: item.description,
        }))
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const apiKey = "AlzaSyV6D1nLeQaIUDnfuPhI0O1Oz_9cdKYVJkZ";
    setDestination(suggestion.description);
    setSuggestions([]);

    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/place/details/json?place_id=${suggestion.id}&key=${apiKey}`
      );

      const location = response.data.result.geometry.location;
      setDestinationCoords({ lat: location.lat, lng: location.lng });

      // Tạo marker cho điểm đến trên bản đồ
      if (map) {
        new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          title: "Điểm đến",
        });
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const calculateDistance = async () => {
    if (!currentLocation || !destinationCoords) {
      setError("Vui lòng nhập điểm đến hợp lệ.");
      return;
    }

    const { lat: originLat, lng: originLng } = currentLocation;
    const { lat: destinationLat, lng: destinationLng } = destinationCoords;
    const apiKey = "AlzaSyV6D1nLeQaIUDnfuPhI0O1Oz_9cdKYVJkZ";

    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/directions/json?mode=${transportMode}&origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}&key=${apiKey}`
      );

      const data = response.data;
      if (data.routes.length > 0) {
        const route = data.routes[0];
        setDistance(route.legs[0].distance.text);
        setDuration(route.legs[0].duration.text);

        // Hiển thị tuyến đường trên bản đồ
        if (map) {
          if (directionsRenderer) {
            directionsRenderer.setMap(null); // Xóa tuyến đường cũ nếu có
          }

          const directionsService = new window.google.maps.DirectionsService();
          const newDirectionsRenderer =
            new window.google.maps.DirectionsRenderer();

          newDirectionsRenderer.setMap(map);
          setDirectionsRenderer(newDirectionsRenderer);

          directionsService.route(
            {
              origin: currentLocation,
              destination: destinationCoords,
              travelMode:
                window.google.maps.TravelMode[transportMode.toUpperCase()],
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                newDirectionsRenderer.setDirections(result);
              } else {
                console.error("Error rendering directions:", status);
              }
            }
          );
        }
      } else {
        setError("Không thể tính khoảng cách.");
      }
    } catch (error) {
      console.error("Error fetching distance:", error);
      setError("Có lỗi xảy ra khi tính khoảng cách.");
    }
  };

  return (
    <Grid2 container spacing={2} style={{ padding: "20px" }}>
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h4" gutterBottom>
          {error && <p style={{ color: "red" }}>{error}</p>}
          Tính Khoảng Cách
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Nhập điểm đến"
          value={destination}
          onChange={handleInputChange}
        />
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.place_id}
            style={{
              marginTop: "5px",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
            }}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <CardContent>
              <Typography>{suggestion.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <ToggleButtonGroup
          value={transportMode}
          exclusive
          onChange={(e, mode) => setTransportMode(mode)}
        >
          <ToggleButton value="driving">
            <FaCar /> Xe hơi
          </ToggleButton>
          <ToggleButton value="walking">
            <FaWalking /> Đi bộ
          </ToggleButton>
          <ToggleButton value="transit">
            <FaBus /> Xe buýt
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <Button variant="contained" color="primary" onClick={calculateDistance}>
          Tính Khoảng Cách
        </Button>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        {distance && (
          <Typography>
            <b>Khoảng cách:</b> {distance} - <b>Thời gian:</b> {duration}
          </Typography>
        )}
        <div id="map" style={{ height: "400px", width: "100%" }}></div>
      </Grid2>
    </Grid2>
  );
};

export default DistanceCalculator;
