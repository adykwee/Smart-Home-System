import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import RoomHeader from "../components/dashboard/RoomHeader";
import QuickControls from "../components/dashboard/QuickControls";
import DialControl from "../components/dashboard/DialControl";
import DashboardDevices from "../components/dashboard/DashboardDevices";
import Members from "../components/dashboard/Members";
import DashboardLogs from "../components/dashboard/DashboardLogs";
import apiClient from "../services/api";
import { useAuth } from "../contexts/AuthContext";

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

import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

export default function Dashboard() {
  const { setTitle } = usePage();
  const { user } = useAuth();
  const userName = user?.username || "User";
  const userRole = user?.role || "Member";

  const [members, setMembers] = useState([
    { name: userName, role: userRole, seed: userName }
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get('/users');
        const users = res.data?.data || [];
        if (users.length > 0) {
          const formattedMembers = users.map(u => ({
            name: u.username,
            role: u.role,
            seed: u.username
          }));
          // Đưa user hiện tại lên đầu
          const currentUserIndex = formattedMembers.findIndex(u => u.name === userName);
          if (currentUserIndex > 0) {
            const currentUser = formattedMembers.splice(currentUserIndex, 1)[0];
            formattedMembers.unshift(currentUser);
          }
          setMembers(formattedMembers);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách user:", err);
      }
    };
    fetchUsers();
  }, [userName]);

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
        const res = await apiClient.get('/devices');
        const json = res.data;
        const devices = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
        
        setDbDevices(devices);
        
        const initialSensors = {};
        const initialActuators = {};
        
        devices.forEach(d => {
          if (d.type === 'Sensor' || d.feed_key?.includes('sensor')) {
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

    socket.on("alert", (data) => {
      console.log("[SOCKET ALERT]", data);
      alert(`⚠️ CẢNH BÁO: ${data.message}`);
    });

    return () => socket.disconnect();
  }, [setTitle]);

  const toggleDevice = async (deviceId) => {
    const device = dbDevices.find(d => (d._id || d.id) === deviceId);
    if (!device) return;

    const newStatus = !devicesState[deviceId];
    
    try {
      // Gọi API điều khiển thật
      await apiClient.post('/devices/control', {
        id: deviceId,
        feedKey: device.feed_key,
        trangThai: newStatus ? 'ON' : 'OFF'
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
        <WelcomeBanner username={userName} />
        <RoomHeader temp={currentTemp} humidity={currentHumid} username={userName} />
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
        <DashboardLogs />
      </div>
    </div>
  );
}
