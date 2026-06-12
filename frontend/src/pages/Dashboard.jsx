import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import RoomHeader from "../components/dashboard/RoomHeader";
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
  const [selectedFanId, setSelectedFanId] = useState(null);
  const [motionAlert, setMotionAlert] = useState(null);

  // Lọc ra tất cả các thiết bị quạt
  const fanDevices = dbDevices.filter(d => 
    d.name?.toLowerCase().includes('fan') || 
    d.name?.toLowerCase().includes('quạt') || 
    d.name?.toLowerCase().includes('quat') || 
    d.feed_key?.toLowerCase().includes('fan')
  );

  const activeFanDevice = fanDevices.find(d => (d._id || d.id) === selectedFanId) || fanDevices[0];

  useEffect(() => {
    // Auto-clear motion alert after 8s
    if (motionAlert) {
      const timer = setTimeout(() => {
        setMotionAlert(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [motionAlert]);

  useEffect(() => {
    setTitle("");

    const fetchInitialData = async () => {
      try {
        const res = await apiClient.get('/devices');
        const json = res.data;
        const devices = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);

        setDbDevices(devices);

        // Thiết lập cảm biến ban đầu
        const initialSensors = {};
        devices.forEach(d => {
          if (d.type === 'Sensor' || d.feed_key?.includes('sensor')) {
            initialSensors[d.feed_key] = d.current_status;
          }
        });
        setSensorValues(initialSensors);
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

      // 2. Cập nhật thiết bị trong dbDevices một cách reactive
      setDbDevices(currentDevices => 
        currentDevices.map(d => {
          if (d.feed_key === data.feed) {
            return { ...d, current_status: data.value };
          }
          return d;
        })
      );
    });

    socket.on("alert", (data) => {
      console.log("[SOCKET ALERT]", data);
      if (data.type === 'motion') {
        setMotionAlert({
          message: data.message,
          timestamp: new Date(data.timestamp || new Date()),
          room: data.room || "Phòng khách"
        });
      }
    });

    return () => socket.disconnect();
  }, [setTitle, motionAlert]);

  // Đồng bộ trạng thái quạt và thiết bị khi dbDevices hoặc selectedFanId thay đổi
  useEffect(() => {
    if (activeFanDevice) {
      const speedData = Number(activeFanDevice.current_status);
      if (!isNaN(speedData) && speedData >= 10 && speedData <= 100) {
        setFanSpeed(Math.round(speedData / 10));
      } else if (activeFanDevice.current_status === 'ON') {
        setFanSpeed(5);
      } else {
        setFanSpeed(0);
      }
    }

    // Đồng bộ devicesState cho tất cả thiết bị điều khiển
    const newStates = {};
    dbDevices.forEach(d => {
      if (d.type !== 'Sensor') {
        const isFan = d.name?.toLowerCase().includes('fan') || 
                      d.name?.toLowerCase().includes('quạt') || 
                      d.name?.toLowerCase().includes('quat') || 
                      d.feed_key?.toLowerCase().includes('fan');
        if (isFan) {
          const speed = Number(d.current_status);
          newStates[d._id || d.id] = (!isNaN(speed) && speed > 0) || d.current_status === 'ON';
        } else {
          newStates[d._id || d.id] = d.current_status === 'ON';
        }
      }
    });
    setDevicesState(newStates);
  }, [dbDevices, selectedFanId]);

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

    if (activeFanDevice) {
      try {
        const scaledSpeed = speed * 10;
        await apiClient.post('/devices/control', {
          id: activeFanDevice._id || activeFanDevice.id,
          feedKey: activeFanDevice.feed_key,
          trangThai: scaledSpeed.toString()
        });
      } catch (err) {
        console.error("Lỗi điều khiển tốc độ quạt:", err);
      }
    } else {
      console.warn("Không tìm thấy thiết bị quạt đang kích hoạt để điều khiển");
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
        
        {/* Banner cảnh báo chuyển động real-time */}
        <RoomHeader temp={currentTemp} humidity={currentHumid} light={currentLight} username={userName} motionAlert={motionAlert} />
        <FanSpeedDial 
          fanSpeed={fanSpeed} 
          setFanSpeed={changeFanSpeed} 
          deviceName={activeFanDevice ? `${activeFanDevice.name} (${activeFanDevice.room || 'Chưa thiết lập phòng'})` : "Quạt chưa kết nối"} 
          fanDevices={fanDevices}
          activeFanId={activeFanDevice?._id || activeFanDevice?.id}
          onSelectFan={setSelectedFanId}
        />
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
