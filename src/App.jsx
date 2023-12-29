import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [sessionInProgress, setSessionInProgress] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [prevLocation, setPrevLocation] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const [sessionEnd, setSessionEnd] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(null);

  let watchId;

  const startSession = () => {
    setSessionInProgress(true);
    setSessionStart(new Date());
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        if (prevLocation) {
          const newDistance = calculateDistance(prevLocation, newLocation);
          setDistance(distance + newDistance);
        }
        setPrevLocation(newLocation);
        setLocation(newLocation);
        setSpeed(position.coords.speed || 0);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const endSession = () => {
    setSessionInProgress(false);
    const endTime = new Date();
    setSessionEnd(endTime);
    const duration = endTime - sessionStart;
    setSessionDuration(duration);
    navigator.geolocation.clearWatch(watchId);
    setSpeed(0);
    setDistance(0);
    setLocation({ latitude: 0, longitude: 0 });
    setPrevLocation(null);
  };

  const calculateDistance = (start, end) => {
    const earthRadius = 6371; // Earth's radius in kilometers
    const { latitude: lat1, longitude: lon1 } = start;
    const { latitude: lat2, longitude: lon2 } = end;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  };

  const toRadians = (angle) => {
    return (angle * Math.PI) / 180;
  };

  return (
    <div>
      <h1>Geo Test</h1>
      {sessionInProgress ? (
        <div>
          <p>Current Speed: {speed.toFixed(2)} m/s</p>
          <p>Distance Travelled: {distance.toFixed(2)} km</p>
          <p>
            Current Location: Latitude {location.latitude}, Longitude{" "}
            {location.longitude}
          </p>
          <button onClick={endSession}>End Session</button>
        </div>
      ) : (
        <button onClick={startSession}>Start Session</button>
      )}
      {sessionStart && sessionEnd && (
        <div>
          <p>Session Start: {sessionStart.toLocaleString()}</p>
          <p>Session End: {sessionEnd.toLocaleString()}</p>
          <p>Session Duration: {sessionDuration / 1000} seconds</p>
        </div>
      )}
    </div>
  );
};

export default App;
