// frontend/src/components/ReservationPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ReservationPage.css';
import { useNavigate } from 'react-router-dom';

const ReservationPage = ({ restaurant_id, user_id }) => {
  const [date, setDate] = useState(null);
  const [guests, setGuests] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showButton,setShowButton] = useState(false)
  const [reservationId,setReservationId] = useState(null);

  const location = useLocation();
  const [userId, setUserId] = useState(location.state?.userId);
  const [restaurantId, setRestaurantId] = useState(location.state?.restaurantId);
  const navigate = useNavigate();
 console.log('User ID:', userId);
    console.log('Restaurant ID:', restaurantId);
  const handleDateChange = (date) => setDate(date);
  const handleGuestsChange = (event) => setGuests(event.target.value);
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
 };

 const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedSlot) {
        handleSlotSelection(selectedSlot);
    }
};


useEffect(() => {
    const fetchSlots = async () => {
        if (date && guests) {
            setLoading(true);

            const payload = {
                "restaurant_id": restaurantId,
                "date": date,
                "num_guests": Number(guests),
            };

            const response = await axios.post('https://us-central1-serverless-402317.cloudfunctions.net/get-available-slots', payload);
            setSlots(Array.isArray(response.data["data"]["available_slots"]) ? response.data["data"]["available_slots"] : "No slots available");
            console.log(response.data["data"]["available_slots"]);
            setLoading(false);
        }
    };

    fetchSlots();
}, [date, guests]);

const handleMenuBookingClick = () =>{
  navigate("/food-menu/"+restaurantId,{state:{reservationId:reservationId,timeSlot:selectedSlot}})

}

  const handleSlotSelection = async (slot) => {
    
    
    if (!userId) {
        console.error('userId is null');
        return;
      }
    const payload = {
        "date": date,
        "num_guests": Number(guests),
        "time": slot,
        "restaurant_id": restaurantId,
        "user_id": userId
    }
    // console.log(payload);
    const response = await axios.post('https://northamerica-northeast1-serverless-402317.cloudfunctions.net/add-reservation', payload);
    
    // console.log(response);
    if (response.status == 200) {
        alert('Reservation added successfully!');
        setReservationId(response.data.data.reservation_id)
        setShowButton(true);

        // navigate('/ShowReservations', { state: { userId } });
    }
    else {
        alert('Error adding reservation!');
    }
  };

  const handleSavedBooking = () =>{
    navigate("/ShowReservations")
  }

  return (
    <div className="reservation-form">
      <h2>Reservation Form</h2>
      <form>
        <div className="form-group">
          <label htmlFor="guests">Number of Guests:</label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={handleGuestsChange}
            style={{ width: '20%', marginTop: '10px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            min={getCurrentDate()}
            value={date || ""}
            onChange={(e) => handleDateChange(e.target.value)}
            style={{ width: '20%', marginTop: '10px'  }}
          />
        </div>

        {loading ? (
          <p>Loading time slots...</p>
        ) : slots.length > 0 ? (
          <div className="time-slots">
            {slots.map((timeSlot, index) => (
              <div key={index}>
                <li key={index} className={`slot-item ${timeSlot === selectedSlot ? 'selected' : ''}`} onClick={() => handleSlotClick(timeSlot)}>
                <input
                  type="radio"
                  id={`slots${index}`}
                  name="timeSlot"
                  value={timeSlot}
                  checked={selectedTime === timeSlot}
                  onChange={() => handleTimeChange(timeSlot)}
                />
                <label htmlFor={`timeSlot${index}`}>{timeSlot}</label>
                </li>
              </div>
            ))}
          </div>
        ) : null}

        <button onClick={handleSubmit} disabled={!selectedSlot} className='mx-3'>Submit</button>
        {showButton?
          <>
            <button className='me-3' onClick={handleMenuBookingClick}>Order food</button>
            <button onClick={handleSavedBooking}>View saved booking</button>
          </>:""}

      </form>
    </div>
  );
};

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = today.getDate();
    day = day < 10 ? `0${day}` : day;
    return `${year}-${month}-${day}`;
  };

export default ReservationPage;