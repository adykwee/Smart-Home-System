import { useEffect } from "react";
import { usePage } from "../contexts/PageContext";

export default function Dashboard() {
  const { setTitle } = usePage();

  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);

  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      <p>Khu vực Dashboard (Dành cho dev implement bảng thống kê...)</p>
    </div>
  );
}
