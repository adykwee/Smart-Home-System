import { useEffect } from "react";
import { usePage } from "../contexts/PageContext";

export default function Schedules() {
  const { setTitle } = usePage();

  useEffect(() => {
    setTitle("Quản lý lịch trình");
  }, [setTitle]);

  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      <p>Khu vực Lịch trình</p>
    </div>
  );
}
