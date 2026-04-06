import { useEffect } from "react";
import { usePage } from "../contexts/PageContext";

export default function DeviceStatus() {
  const { setTitle } = usePage();

  useEffect(() => {
    setTitle("Trạng thái thiết bị");
  }, [setTitle]);

  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      <p>Khu vực Trạng thái thiết bị</p>
    </div>
  );
}
