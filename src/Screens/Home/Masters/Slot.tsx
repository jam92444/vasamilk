import { useEffect, useState } from "react";
import { Button } from "antd";
import { getUserToken } from "../../../Utils/Data";
import { getSlotsList, updateSlots } from "../../../Services/ApiService"; // You need to add updateSlot API call
import { useAuth } from "../../../Context/AuthContext";
import CustomTable from "../../../Components/UI/CustomTable";
import AppLoader from "../../../Components/UI/AppLoader";
import EditSlotForm from "../../../Modal/EditSlotForm"; // Make sure the path is correct
import "../../../Styles/pages/_slotmanage.scss";
import { toast } from "react-toastify";

interface SlotType {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  inventory_start_time: string | null;
  inventory_end_time: string | null;
  booking_end: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  status: number;
}

const Slot = () => {
  const { loading, setLoading } = useAuth();
  const [slotList, setSlotList] = useState<SlotType[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("token", getUserToken() || "");
      const res = await getSlotsList(formData);
      if (res.data.status === 1) {
        setSlotList(res.data.data);
      } else {
        console.info(res.data.msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleEdit = (slot: SlotType) => {
    setSelectedSlot(slot);
    setModalVisible(true);
  };

  const handleSave = async (data: {
    token: string;
    slot_id: number;
    name: string;
    inventory_end_time: string;
    start_time: string;
    end_time: string;
    booking_end: string;
  }) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("token", data.token);
      formData.append("slot_id", data.slot_id.toString());
      formData.append("name", data.name);
      formData.append("inventory_end_time", data.inventory_end_time);
      formData.append("start_time", data.start_time);
      formData.append("end_time", data.end_time);
      formData.append("booking_end", data.booking_end);

      const res = await updateSlots(formData); // Implement this API call in ApiService
      if (res.data.status === 1) {
        toast.success(res.data.msg);
        setModalVisible(false);
        setSelectedSlot(null);
        fetchSlots();
      } else {
        toast.info(res.data.msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
    },
    {
      title: "Booking End",
      dataIndex: "booking_end",
      key: "booking_end",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (status === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: SlotType) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="masters">
      {loading && <AppLoader message="Loading slots..." />}
      <aside className="management-title">SLOT MANAGEMENT</aside>

      <CustomTable
        columns={columns}
        data={slotList}
        className="custom-slot-table"
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />

      {modalVisible && selectedSlot && (
        <EditSlotForm
          visible={modalVisible}
          slot={selectedSlot}
          token={getUserToken() || ""}
          onCancel={() => setModalVisible(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Slot;
