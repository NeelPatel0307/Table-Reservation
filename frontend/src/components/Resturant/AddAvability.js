import React, { useState } from 'react';

const AddAvability = () => {
  const [openingHours, setOpeningHours] = useState('');
  const [closingHours, setClosingHours] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming you dynamically get the restaurantId
      const updatedRestaurantId = 'R2'; // Replace with the actual restaurant ID

      const response = await fetch(`https://m7kkjr68xi.execute-api.us-east-1.amazonaws.com/delop/restaurants/updateTiming/${updatedRestaurantId}`,
    
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          OpeningHours: openingHours,
          ClosingHours: closingHours,
        }),
      });

      const data = await response.json();
      console.log('Response Data:', data);

      // Handle success
      setMessage('Opening and closing hours updated successfully!');
    } catch (error) {
      console.error('Error:', error);

      // Handle error
      setMessage('Error updating opening and closing hours. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
    <h2>Update Restaurant Timing</h2>
    <form onSubmit={handleFormSubmit}>
      <div className="mb-3">
        <label className="mr-2">
          Opening Hours:
          <input
            type="text"
            className="form-control"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
          />
        </label>
      </div>
      <div className="mb-3">
        <label>
          Closing Hours:
          <input
            type="text"
            className="form-control"
            value={closingHours}
            onChange={(e) => setClosingHours(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Update Timing
      </button>
    </form>
    {message && <div className="mt-3 alert alert-success">{message}</div>}
  </div>
  );
};

export default AddAvability;