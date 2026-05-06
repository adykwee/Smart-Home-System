import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import RoomHeader from "../components/dashboard/RoomHeader";
import QuickControls from "../components/dashboard/QuickControls";
import DialControl from "../components/dashboard/DialControl";
import DashboardDevices from "../components/dashboard/DashboardDevices";
import Members from "../components/dashboard/Members";
<<<<<<< Updated upstream
import PowerChart from "../components/dashboard/PowerChart";
=======
import DashboardLogs from "../components/dashboard/DashboardLogs";
import apiClient from "../services/api";
import { useAuth } from "../contexts/AuthContext";
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
// Members avatars
const members = [
  { name: 'Scarlett', role: 'Admin', seed: 'Scarlett' },
  { name: 'Nariya', role: 'Full Access', seed: 'Nariya' },
  { name: 'Riya', role: 'Full Access', seed: 'Riya' },
  { name: 'Dad', role: 'Full Access', seed: 'Dad' },
  { name: 'Mom', role: 'Full Access', seed: 'Mom' },
];

=======
>>>>>>> Stashed changes
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

export default function Dashboard() {
  const { setTitle } = usePage();
<<<<<<< Updated upstream
  const [targetTemp, setTargetTemp] = useState(25);
  const [activeDevice, setActiveDevice] = useState('Temperature');
  const [sensorValues, setSensorValues] = useState({});
  const [devicesState, setDevicesState] = useState({});
  const [dbDevices, setDbDevices] = useState([]);

  useEffect(() => {
=======
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
>>>>>>> Stashed changes
    setTitle(""); 
    
    // Fetch initial data from DB
    const fetchInitialData = async () => {
      try {
<<<<<<< Updated upstream
        const res = await fetch(`${SOCKET_URL}/api/v1/devices`);
        const devices = await res.json();
=======
        const res = await apiClient.get('/devices');
        const json = res.data;
        const devices = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
        
>>>>>>> Stashed changes
        setDbDevices(devices);
        
        const initialSensors = {};
        const initialActuators = {};
        
        devices.forEach(d => {
<<<<<<< Updated upstream
          if (d.type === 'Sensor' || d.feed_key.includes('sensor')) {
=======
          if (d.type === 'Sensor' || d.feed_key?.includes('sensor')) {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      await fetch(`${SOCKET_URL}/api/v1/devices/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: deviceId,
          feedKey: device.feed_key,
          trangThai: newStatus ? 'ON' : 'OFF'
        })
=======
      await apiClient.post('/devices/control', {
        id: deviceId,
        feedKey: device.feed_key,
        trangThai: newStatus ? 'ON' : 'OFF'
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        <WelcomeBanner />
        <RoomHeader temp={currentTemp} humidity={currentHumid} />
=======
        <WelcomeBanner username={userName} />
        <RoomHeader temp={currentTemp} humidity={currentHumid} username={userName} />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        <PowerChart chartData={chartData} />
=======
        <DashboardLogs />
>>>>>>> Stashed changes
      </div>
    </div>
  );
}
