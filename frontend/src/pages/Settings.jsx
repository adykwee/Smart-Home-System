import { useEffect } from "react";
import { usePage } from "../contexts/PageContext";

export default function Settings() {
  const { setTitle } = usePage();

  useEffect(() => {
    setTitle("Cài đặt hệ thống");
  }, [setTitle]);

  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      <p>Khu vực Cài đặt</p>
    </div>
  );
}
