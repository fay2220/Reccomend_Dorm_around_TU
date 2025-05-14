// pages/admin.js
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import NavbarWithSidebar from "@/components/NavbarWithSidebar";


function RequestCard({ request, onUpdate }) {
  const [status, setStatus] = useState(request.status);
  const [reply, setReply] = useState(request.message);

  return (
    <div className="mb-6 border-b pb-4">
      <p><strong>ผู้ใช้:</strong> {request.username}</p>
      <p><strong>โซน:</strong> {request.zone}</p>
      <p><strong>หอพัก:</strong> {request.dorm_name}</p>
      <p><strong>คำอธิบาย:</strong> {request.message}</p>

      <label className="block mt-2">สถานะ:</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      >
        <option value="รอดำเนินการ">รอดำเนินการ</option>
        <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
      </select>

      <label className="block mt-2">ข้อความตอบกลับ:</label>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />

      <button
        onClick={() => onUpdate(request.id, { status, message: reply })}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        บันทึก
      </button>
    </div>
  );
}

export default function AdminRequestPage() {
  const [requests, setRequests] = useState([]);
  const [mode, setMode] = useState("waiting");
  const [dorms, setDorms] = useState([]);
  const router = useRouter();
  const hasLoadedDorms = useRef(false);

  const fetchRequests = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request-interest/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched requests:", res.data);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const fetchDorms = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getAllDorm/`);
      console.log("Fetched dorms:", res.data);
      setDorms(res.data);
    } catch (err) {
      console.error(" Error fetching dorms:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchDorms();
  }, []);

  const token = typeof window !== "undefined" && localStorage.getItem("accessToken");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const isAdmin = decoded?.is_superuser;

  useEffect(() => {
    if (!isAdmin) {
      console.warn("ไม่ใช่แอดมิน! ย้อนกลับหน้าแรก");
      router.push("/");
    }
  }, [isAdmin, router]);

  const handleUpdate = async (id, updatedData) => {
    const token = localStorage.getItem("accessToken");
    const original = requests.find((r) => r.id === id); 
  
    const payload = {
      ...original,
      ...updatedData,     
    };
  
    try {
      console.log(`📝 PATCH request id=${id}:`, payload);
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/request-interest/${id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests(); // รีเฟรชหลังอัปเดต
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  useEffect(() => {
    const loadDormNames = async () => {
      const updated = await Promise.all(
        requests.map(async (r) => {
          try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dorm/${r.dorm_id}/`);
            return { ...r, dorm_name: res.data.name };
          } catch {
            return { ...r, dorm_name: "ไม่พบชื่อหอ" };
          }
        })
      );
      setRequests(updated);
    };

    if (requests.length > 0 && !hasLoadedDorms.current) {
      hasLoadedDorms.current = true;
      loadDormNames();
    }
  }, [requests]);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg.jpeg")' }}
    >
      <NavbarWithSidebar />
      <div className="p-6">
        <h1 className="text-center font-bold text-xl mb-4">คำร้องจากผู้ใช้</h1>

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => setMode("waiting")}
            className={`px-4 py-2 rounded ${mode === "waiting" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            waiting
          </button>
          <button
            onClick={() => setMode("complete")}
            className={`px-4 py-2 rounded ${mode === "complete" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            complete
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xl max-w-4xl mx-auto max-h-[500px] overflow-y-auto">
          {requests.length === 0 && <p className="text-center text-gray-500">ไม่มีคำร้อง</p>}
          {requests
            .filter((r) =>
              mode === "waiting" ? r.status !== "อนุมัติแล้ว" : r.status === "อนุมัติแล้ว"
            )
            .map((r) => (
              <RequestCard key={r.id} request={r} onUpdate={handleUpdate} />
            ))}
        </div>
      </div>
    </div>
  );
}
