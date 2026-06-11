import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import RoomHeader from "../components/dashboard/RoomHeader";
import QuickControls from "../components/dashboard/QuickControls";
import FanSpeedDial from "../components/dashboard/FanSpeedDial";
import DashboardDevices from "../components/dashboard/DashboardDevices";
import Members from "../components/dashboard/Members";
import DashboardLogs from "../components/dashboard/DashboardLogs";
import SensorChart from "../components/dashboard/SensorChart";
import apiClient from "../services/api";
import { useAuth } from "../contexts/AuthContext";
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

  const [fanSpeed, setFanSpeed] = useState(0);
  const [sensorValues, setSensorValues] = useState({});
  const [devicesState, setDevicesState] = useState({});
  const [dbDevices, setDbDevices] = useState([]);

  useEffect(() => {
    setTitle("");

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
            const isFan = d.name?.toLowerCase().includes('fan') || 
                          d.name?.toLowerCase().includes('quạt') || 
                          d.name?.toLowerCase().includes('quat') || 
                          d.feed_key?.toLowerCase().includes('fan');
            if (isFan) {
              const speedData = Number(d.current_status);
              if (!isNaN(speedData) && speedData >= 10 && speedData <= 100) {
                const uiSpeed = Math.round(speedData / 10);
                setFanSpeed(uiSpeed);
                initialActuators[d._id || d.id] = true;
              } else if (d.current_status === 'ON') {
                setFanSpeed(5);
                initialActuators[d._id || d.id] = true;
              } else {
                setFanSpeed(0);
                initialActuators[d._id || d.id] = false;
              }
            } else {
              initialActuators[d._id || d.id] = d.current_status === 'ON';
            }
          }
        });

        setSensorValues(initialSensors);
        setDevicesState(initialActuators);
      } catch (err) {
        console.error("Error fetching initial devices:", err);
      }
    };
    fetchInitialData();

    const socket = io(SOCKET_URL);

    socket.on("realtime_data", (data) => {
      // 1. Cập nhật giá trị cảm biến
      setSensorValues(prev => ({
        ...prev,
        [data.feed]: data.value
      }));

      // 2. Cập nhật trạng thái thiết bị (ON/OFF) và Tốc độ quạt (nếu là số)
      // Tìm thiết bị có feed_key tương ứng trong dbDevices để lấy ID
      setDbDevices(currentDevices => {
        const device = currentDevices.find(d => d.feed_key === data.feed);
        if (device && device.type !== 'Sensor') {
          const isFan = device.name?.toLowerCase().includes('fan') || 
                        device.name?.toLowerCase().includes('quạt') || 
                        device.name?.toLowerCase().includes('quat') || 
                        device.feed_key?.toLowerCase().includes('fan');
          
          if (isFan) {
            const speedData = Number(data.value);
            if (!isNaN(speedData) && speedData >= 10 && speedData <= 100) {
              const uiSpeed = Math.round(speedData / 10);
              setFanSpeed(uiSpeed);
              setDevicesState(prev => ({ ...prev, [device._id || device.id]: true }));
            } else if (data.value === '0' || data.value.toUpperCase() === 'OFF') {
              setFanSpeed(0);
              setDevicesState(prev => ({ ...prev, [device._id || device.id]: false }));
            } else if (data.value.toUpperCase() === 'ON') {
              setFanSpeed(5);
              setDevicesState(prev => ({ ...prev, [device._id || device.id]: true }));
            }
          } else {
            const isON = data.value === '1' || data.value.toUpperCase() === 'ON';
            setDevicesState(prev => ({
              ...prev,
              [device._id || device.id]: isON
            }));
          }
        }
        return currentDevices;
      });
    });

    socket.on("alert", (data) => {
      console.log("[SOCKET ALERT]", data);
    });

    return () => socket.disconnect();
  }, [setTitle]);

  const toggleDevice = async (deviceId) => {
    const device = dbDevices.find(d => (d._id || d.id) === deviceId);
    if (!device) return;

    const newStatus = !devicesState[deviceId];

    try {
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

  const changeFanSpeed = async (speed) => {
    setFanSpeed(speed); // Cập nhật UI ngay lập tức
    
    // Tìm thiết bị quạt (tên chứa 'fan' hoặc 'quạt' hoặc 'quat', hoặc feed_key chứa 'fan')
    const fanDevice = dbDevices.find(d => 
      d.name.toLowerCase().includes('fan') || 
      d.name.toLowerCase().includes('quạt') || 
      d.name.toLowerCase().includes('quat') || 
      d.feed_key?.toLowerCase().includes('fan')
    );

    if (fanDevice) {
      try {
        const scaledSpeed = speed * 10;
        await apiClient.post('/devices/control', {
          id: fanDevice._id || fanDevice.id,
          feedKey: fanDevice.feed_key,
          trangThai: scaledSpeed.toString()
        });
        
        // Nếu tốc độ > 0, coi như ON, ngược lại coi như OFF
        setDevicesState(prev => ({ ...prev, [fanDevice._id || fanDevice.id]: speed > 0 }));
      } catch (err) {
        console.error("Lỗi điều khiển tốc độ quạt:", err);
      }
    } else {
      console.warn("Không tìm thấy thiết bị quạt trong CSDL để điều khiển");
    }
  };

  const currentTemp = Object.entries(sensorValues).find(([k]) => k.toLowerCase().includes('temp') || k.toLowerCase().includes('nhiet'))?.[1];
  const currentHumid = Object.entries(sensorValues).find(([k]) => k.toLowerCase().includes('humid') || k.toLowerCase().includes('doam'))?.[1];
  const currentLight = Object.entries(sensorValues).find(([k]) => k.toLowerCase().includes('light') || k.toLowerCase().includes('lux') || k.toLowerCase().includes('anhsang'))?.[1];

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8">

      {/* CỘT TRÁI (70%) */}
      <div className="flex-1 flex flex-col gap-8">
        <WelcomeBanner username={userName} />
        <RoomHeader temp={currentTemp} humidity={currentHumid} light={currentLight} username={userName} />
        <QuickControls dbDevices={dbDevices} />
        <FanSpeedDial fanSpeed={fanSpeed} setFanSpeed={changeFanSpeed} />
        <SensorChart />
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
