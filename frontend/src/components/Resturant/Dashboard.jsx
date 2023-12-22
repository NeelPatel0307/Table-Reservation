import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Dashboard = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    const payload = {
      restaurant_id: "R2"
    };

    try {
      const response = await axios.post('https://us-central1-serverless-402317.cloudfunctions.net/get-reservation-by-rid', payload);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      console.log(response.data);
      const upcomingReservations = response.data.data.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        return reservationDate >= today;
      });

      setReservations(upcomingReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (reservation_id, status) => {
    const payload = {
      reservation_id,
      status
    };
    console.log(payload);

    try {
      const response = await axios.post('https://northamerica-northeast1-serverless-402317.cloudfunctions.net/status-change', payload);
      console.log(response.data);
      fetchReservations();
    } catch (error) {
      console.error('Error changing reservation status:', error);
    }
  };


  const handleAddTableClick = () => {
    navigate("/resturant/addtabledetails");
  };

  const handleAddAvabilityClick = () => {
    navigate("/resturant/addtimingdetails");
  };

  const handleHolisticClick = () => {
    navigate("/resturant/holisticview");
  };

  const handleMenuEdit = () =>{
    navigate("list-menu")
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">

      <h2>Resturant Dashboard</h2>
      <button onClick={handleAddTableClick} style={{"margin": "10px"}}>Add Table</button>
      <button onClick={handleAddAvabilityClick} style={{"margin": "10px"}}>Add Availability</button>
      <button onClick={handleMenuEdit} style={{"margin": "10px"}}>Edit Menu</button>
      <button onClick={handleHolisticClick} style={{"margin": "10px"}}>Holistic View</button>
      <h2>Upcoming Reservations</h2>
      <table className="table" style={{margin: '20px'}}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Allocated tables</th>
            <th>Status</th>
            <th>Additional Request</th>
            <th>Actions</th>
            <th>Update/Delete</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.date}</td>
              <td>{reservation.time}</td>
              <td>{reservation.table_ids[0]}</td>
              <td>{reservation.status}</td>
              <td>{reservation.additional_req}</td>
              <td>
                {reservation.status === 'pending' && (
                  <div>
                    <button className="btn btn-success" onClick={() => handleStatusChange(reservation.reservation_id, 'accepted')} style={{"margin": "7px"}}>Accept</button>
                    <button className="btn btn-danger" onClick={() => handleStatusChange(reservation.reservation_id, 'declined')} style={{"margin": "7px"}}>Decline</button>
                  </div>
                )}
              </td>
              <td>
              <button style={{margin: "7px"}} onClick={() => navigate(`editReservation/${reservation.reservation_id}?reservation=${JSON.stringify(reservation)}`)}>Update</button>
              <button onClick={async () => {
                const payload = {
                  "reservation_id": reservation.reservation_id,
                };

                const response = await axios.post(`https://northamerica-northeast1-serverless-402317.cloudfunctions.net/delete-reservation/}`, payload);
                console.log(response.data);
                if (response.data["status"] === "success") {
                  alert(response.data["message"]);
                  window.location.reload();
                }
              }}>Delete</button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;