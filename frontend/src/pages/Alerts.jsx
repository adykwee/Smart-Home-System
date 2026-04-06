import { useEffect } from "react";
import { usePage } from "../contexts/PageContext";

export default function Alerts() {
  const { setTitle } = usePage();

  useEffect(() => {
    setTitle("Quản lý cảnh báo");
  }, [setTitle]);

  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      <p>Khu vực Cảnh báo</p>
    </div>
  );
}
