import React from "react";

const AvailabilityCalendar = ({
  availability,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Availability
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(availability).map(
          ([day, slots]) => (
            <div
              key={day}
              className="border rounded-xl p-4"
            >
              <h3 className="font-bold capitalize">
                {day}
              </h3>

              {slots.map((slot, index) => (
                <p
                  key={index}
                  className="text-gray-600 mt-2"
                >
                  {slot.start} - {slot.end}
                </p>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;