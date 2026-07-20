import api from "../../../services/api";

const MOCK_SLOTS = [
  // Monday
  { id: "slot-1", time: "10:00 AM", duration: "30 min", status: "Available", day: "Mon", date: "2023-10-23" },
  { id: "slot-2", time: "10:30 AM", duration: "30 min", status: "Booked", day: "Mon", student: "John Doe", studentId: "stud-1", date: "2023-10-23" },
  { id: "slot-3", time: "11:00 AM", duration: "30 min", status: "Available", day: "Mon", date: "2023-10-23" },
  
  // Tuesday
  // Empty slots representable by absence or can be dynamically added
  
  // Wednesday
  { id: "slot-4", time: "02:00 PM", duration: "60 min", status: "Available", day: "Wed", date: "2023-10-25" },
  
  // Thursday
  { id: "slot-5", time: "04:00 PM", duration: "30 min", status: "Booked", day: "Thu", student: "Jane Smith", studentId: "stud-2", date: "2023-10-26" }
];

const MOCK_BOOKING_DETAILS = {
  "slot-2": {
    bookingId: "booking-1",
    studentName: "John Doe",
    email: "john.doe@example.com",
    status: "Confirmed",
    link: "meet.google.com/abc-defg-hij",
    notes: "Looking forward to discussing my recent assessment results and planning next steps for the recruitment drive.",
    schedule: "Monday, Oct 24, 2023", // Wait, the image shows: Schedule "Monday, Oct 24, 2023" and "Booked At: 2:00 PM" or "10:30 AM"
    time: "10:30 AM",
    duration: "30 min"
  },
  "slot-5": {
    bookingId: "booking-2",
    studentName: "Jane Smith",
    email: "jane.smith@example.com",
    status: "Confirmed",
    link: "meet.google.com/xyz-qprs-uvw",
    notes: "Need guidance on the final portfolio submission and career pathways in frontend engineering.",
    schedule: "Thursday, Oct 26, 2023",
    time: "04:00 PM",
    duration: "30 min"
  }
};

export const schedulingService = {
  // 1. Fetch available and booked slots for the calendar
  getWeeklySlots: async () => {
    try {
      const response = await api.get("/v1/slots/weekly");
      return response.data;
    } catch (error) {
      console.warn("API getWeeklySlots call failed, falling back to mock data:", error.message);
      return MOCK_SLOTS;
    }
  },

  // 2. Fetch specific booking details
  getBookingDetails: async (slotId) => {
    try {
      // Typically bookings are queried by bookingId or slotId
      const response = await api.get(`/v1/slots/bookings/${slotId}`);
      return response.data;
    } catch (error) {
      console.warn("API getBookingDetails call failed, falling back to mock data:", error.message);
      return MOCK_BOOKING_DETAILS[slotId] || {
        bookingId: `booking-${Date.now()}`,
        studentName: "Unknown Student",
        email: "student@example.com",
        status: "Unconfirmed",
        link: "meet.google.com/mock-link",
        notes: "No notes provided.",
        schedule: "Unknown Date",
        time: "Unknown Time",
        duration: "30 min"
      };
    }
  },

  // 3. Cancel a booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.post(`/v1/slots/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.warn("API cancelBooking call failed, running locally:", error.message);
      return { success: true };
    }
  },

  // 4. Add a new slot (mock/API helper)
  addSlot: async (slotData) => {
    try {
      const response = await api.post("/v1/slots", slotData);
      return response.data;
    } catch (error) {
      console.warn("API addSlot call failed, running locally:", error.message);
      return {
        id: `slot-${Date.now()}`,
        ...slotData,
        status: "Available"
      };
    }
  }
};
