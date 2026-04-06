import { useEffect } from "react";
import { usePage } from "../contexts/PageContext";

export default function Logs() {
  const { setTitle } = usePage();

  useEffect(() => {
    setTitle("Nhật ký hệ thống");
  }, [setTitle]);

  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      <p>Khu vực Nhật ký</p>
    </div>
  );
}
