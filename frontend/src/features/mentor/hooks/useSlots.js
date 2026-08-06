import { useState, useEffect } from "react";
import { schedulingService } from "../services/schedulingService";

export default function useSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewMode, setViewMode] = useState("Calendar"); // 'Calendar' or 'Table'
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingDetailsLoading, setBookingDetailsLoading] = useState(false);
  const [bookingDetailsError, setBookingDetailsError] = useState(null);
  
  // Dates for the mock week of Oct 23 - 27, 2023
  const [weekRange, setWeekRange] = useState({
    start: "Oct 23",
    end: "27",
    year: "2023",
    label: "Oct 23 - 27, 2023"
  });

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await schedulingService.getWeeklySlots();
      setSlots(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchBookingDetails = async (slotId) => {
    if (!slotId) return;
    try {
      setBookingDetailsLoading(true);
      setBookingDetailsError(null);
      const details = await schedulingService.getBookingDetails(slotId);
      // Inject slot time/day info if needed
      const slot = slots.find(s => s.id === slotId);
      setBookingDetails({
        ...details,
        slotId,
        time: slot?.time || details.time,
        duration: slot?.duration || details.duration,
        day: slot?.day || "Mon"
      });
      setSelectedSlotId(slotId);
    } catch (err) {
      setBookingDetailsError(err.message || "Failed to load booking details");
    } finally {
      setBookingDetailsLoading(false);
    }
  };

  const cancelBooking = async (slotId, bookingId) => {
    try {
      await schedulingService.cancelBooking(bookingId);
      // Update local slots list to set slot back to Available
      setSlots((prevSlots) =>
        prevSlots.map((s) =>
          s.id === slotId
            ? { ...s, status: "Available", student: undefined, studentId: undefined }
            : s
        )
      );
      // Reset details and close drawer
      setBookingDetails(null);
      setSelectedSlotId(null);
      return { success: true };
    } catch (err) {
      console.error("Failed to cancel booking", err);
      return { success: false, error: err.message };
    }
  };

  const addSlot = async (slotData) => {
    try {
      const newSlot = await schedulingService.addSlot(slotData);
      setSlots((prevSlots) => [...prevSlots, newSlot]);
      return { success: true, slot: newSlot };
    } catch (err) {
      console.error("Failed to add slot", err);
      return { success: false, error: err.message };
    }
  };

  const closeDrawer = () => {
    setSelectedSlotId(null);
    setBookingDetails(null);
  };

  return {
    slots,
    loading,
    error,
    viewMode,
    setViewMode,
    selectedSlotId,
    bookingDetails,
    bookingDetailsLoading,
    bookingDetailsError,
    weekRange,
    fetchBookingDetails,
    cancelBooking,
    addSlot,
    closeDrawer,
    refresh: fetchSlots
  };
}
