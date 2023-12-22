import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

const HolisticView = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [restaurantId, setRestaurantId] = useState('R2'); 
    const [responseData, setResponseData] = useState(null);
    const [monthData, setMonthData] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = async () => {
        const formattedDate = selectedDate.toISOString().split('T')[0];

        const payload = {
            restaurant_id: restaurantId,
            date: formattedDate
        };

        try {
      const response = await axios.post('https://northamerica-northeast1-serverless-402317.cloudfunctions.net/holistic_view_daily_weekly', payload);
      setResponseData(response.data);
      console.log(response.data.data);

      const month = selectedDate.getMonth() + 1; 
      const year = selectedDate.getFullYear();

      const payload1 = {
        restaurant_id: restaurantId,
        month: String(month),
        year: String(year)
    };

    console.log(payload1);
      const response1 = await axios.post('https://northamerica-northeast1-serverless-402317.cloudfunctions.net/holisitc_view_monthly', payload1);
      console.log(response1.data);
      setMonthData(response1.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <h2>Pick a Date</h2>
            <DatePicker selected={selectedDate} onChange={handleDateChange} dateFormat="yyyy-MM-dd" className="mb-3" />
            <button onClick={handleSubmit}>Submit</button>
            {responseData && (
                <div className="mt-3">
                    <h3>Daily</h3>
                    <div>
                        {Object.entries(responseData.data.daily.booked_tables_per_slot).map(([timeSlot, tables], index) => (
                            <p key={index}>{timeSlot}: {tables.join(', ')}</p>
                        ))}
                        <p>Total tables booked today: {Object.values(responseData.data.daily.booked_tables_per_slot).reduce((total, tables) => total + tables.length, 0)}</p>
                    </div>
                    <h3>Weekly</h3>
                    <div>
                        {Object.entries(responseData.data.weekly.booked_tables_per_slot).map(([timeSlot, tables], index) => (
                            <p key={index}>{timeSlot}: {tables.join(', ')}</p>
                        ))}
                        <p>Total tables booked this week: {Object.values(responseData.data.weekly.booked_tables_per_slot).reduce((total, tables) => total + tables.length, 0)}</p>
                    </div>
                    {monthData && (
                        <div>
                            <h3>Monthly</h3>
                            <div>
                                {Object.entries(monthData.data.monthly.booked_tables_per_slot).map(([timeSlot, tables], index) => (
                                    <p key={index}>{timeSlot}: {tables.join(', ')}</p>
                                ))}
                                <p>Total tables booked this month: {Object.values(monthData.data.monthly.booked_tables_per_slot).reduce((total, tables) => total + tables.length, 0)}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HolisticView;