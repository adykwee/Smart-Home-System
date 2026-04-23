import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import RoomHeader from "../components/dashboard/RoomHeader";
import QuickControls from "../components/dashboard/QuickControls";
import DialControl from "../components/dashboard/DialControl";
import DashboardDevices from "../components/dashboard/DashboardDevices";
import Members from "../components/dashboard/Members";
import PowerChart from "../components/dashboard/PowerChart";

// Mock Data for the chart
const chartData = [
  { name: 'Jan', value: 20 },
  { name: 'Feb', value: 30 },
  { name: 'Mar', value: 20 },
  { name: 'Apr', value: 45 },
  { name: 'May', value: 30 },
  { name: 'June', value: 75 }, // Peak
  { name: 'July', value: 40 },
  { name: 'Aug', value: 25 },
];

// Members avatars
const members = [
  { name: 'Scarlett', role: 'Admin', seed: 'Scarlett' },
  { name: 'Nariya', role: 'Full Access', seed: 'Nariya' },
  { name: 'Riya', role: 'Full Access', seed: 'Riya' },
  { name: 'Dad', role: 'Full Access', seed: 'Dad' },
  { name: 'Mom', role: 'Full Access', seed: 'Mom' },
];

import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

export default function Dashboard() {
  const { setTitle } = usePage();
  const [targetTemp, setTargetTemp] = useState(25);
  const [activeDevice, setActiveDevice] = useState('Temperature');
  const [sensorValues, setSensorValues] = useState({});
  const [devicesState, setDevicesState] = useState({});
  const [dbDevices, setDbDevices] = useState([]);

  useEffect(() => {
    setTitle(""); 
    
    // Fetch initial data from DB
    const fetchInitialData = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/v1/devices`);
        const devices = await res.json();
        setDbDevices(devices);
        
        const initialSensors = {};
        const initialActuators = {};
        
        devices.forEach(d => {
          if (d.type === 'Sensor' || d.feed_key.includes('sensor')) {
            initialSensors[d.feed_key] = d.current_status;
          } else {
            initialActuators[d.id || d._id] = d.current_status === 'ON';
          }
        });
        
        setSensorValues(initialSensors);
        setDevicesState(initialActuators);
      } catch (err) {
        console.error("Error fetching initial devices:", err);
      }
    };
    fetchInitialData();

    // Connect to Socket.io for real-time data
    const socket = io(SOCKET_URL);
    
    socket.on("realtime_data", (data) => {
      setSensorValues(prev => ({
        ...prev,
        [data.feed]: data.value
      }));
    });

    return () => socket.disconnect();
  }, [setTitle]);

  const toggleDevice = async (deviceId) => {
    const device = dbDevices.find(d => (d._id || d.id) === deviceId);
    if (!device) return;

    const newStatus = !devicesState[deviceId];
    
    try {
      // Gọi API điều khiển thật
      await fetch(`${SOCKET_URL}/api/v1/devices/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: deviceId,
          feedKey: device.feed_key,
          trangThai: newStatus ? 'ON' : 'OFF'
        })
      });

      setDevicesState(prev => ({ ...prev, [deviceId]: newStatus }));
    } catch (err) {
      console.error("Lỗi điều khiển thiết bị:", err);
    }
  };

  // Tìm giá trị nhiệt độ và độ ẩm để hiện lên Header
  const currentTemp = Object.entries(sensorValues).find(([k]) => k.toLowerCase().includes('temp') || k.toLowerCase().includes('nhiet'))?.[1];
  const currentHumid = Object.entries(sensorValues).find(([k]) => k.toLowerCase().includes('humid') || k.toLowerCase().includes('doam'))?.[1];

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8">
      
      {/* CỘT TRÁI (70%) */}
      <div className="flex-1 flex flex-col gap-8">
        <WelcomeBanner />
        <RoomHeader temp={currentTemp} humidity={currentHumid} />
        <QuickControls activeDevice={activeDevice} setActiveDevice={setActiveDevice} />
        <DialControl targetTemp={targetTemp} setTargetTemp={setTargetTemp} />
      </div>

      {/* CỘT PHẢI (30%) */}
      <div className="w-full xl:w-[380px] flex flex-col gap-6">
        <DashboardDevices 
          devicesState={devicesState} 
          toggleDevice={toggleDevice} 
          sensorValues={sensorValues} 
          dbDevices={dbDevices}
        />
        <Members members={members} />
        <PowerChart chartData={chartData} />
      </div>
    </div>
  );
}
