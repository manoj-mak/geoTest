import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [watchId, setWatchId] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [error, setError] = useState(null);

  const handleStart = () => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          console.log(position);
          if (!startPosition) {
            setStartPosition(position);
            setStartTime(new Date());
          } else {
            setEndPosition(position);
            setEndTime(new Date());
          }
        },
        (err) => {
          setError(err.message);
          alert(`ERROR(${err.code}): ${err.message}`);
        }
      );

      setWatchId(id);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleEnd = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setStartPosition(null);
      setEndPosition(null);
      calculateResults();
    }
  };

  const calculateResults = () => {
    if (startPosition && endPosition && startTime && endTime) {
      const distanceTravelled = calculateDistance(
        startPosition.coords,
        endPosition.coords
      );
      const timeTravelled = (endTime - startTime) / 1000; // in seconds
      const avgSpeed = distanceTravelled / timeTravelled; // in meters per second

      setDistance(distanceTravelled);
      setSpeed(avgSpeed);
    }
  };

  const calculateDistance = (coords1, coords2) => {
    const { latitude: lat1, longitude: lon1 } = coords1;
    const { latitude: lat2, longitude: lon2 } = coords2;

    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <div>
      <h1>Geolocation API</h1>
      {error && <p>{error}</p>}
      {!startPosition && <button onClick={handleStart}>Start Session</button>}
      {startPosition && !endPosition && (
        <button onClick={handleEnd}>End Session</button>
      )}

      <div>
        <h2>Results</h2>
        <p>Distance: {distance} meters</p>
        <p>Average Speed: {speed} m/s</p>
      </div>
    </div>
  );
};

export default App;
