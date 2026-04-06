import { useEffect } from "react";
import { usePage } from "../contexts/PageContext";

export default function Users() {
  const { setTitle } = usePage();

  useEffect(() => {
    setTitle("Quản trị Người dùng");
  }, [setTitle]);

  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      <p>Khu vực Quản trị Người dùng</p>
    </div>
  );
}
