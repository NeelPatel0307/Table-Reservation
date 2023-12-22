import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';
import Select from 'react-select';
import './RestaurantBooking.css'; // Import the CSS file

const RestaurantBookingComponent = ( props ) => {
  const { reservation_id } = useParams();
  const navigate = useNavigate();
  const reservationId = reservation_id
  const { currentUser } = useAuth();
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantId, setRestaurantId] = useState(null);

  const fetchRestaurantName = async (restaurantId) => {
    console.log('Fetching restaurant name for ID:', restaurantId);
    const response = await axios.get(`https://m7kkjr68xi.execute-api.us-east-1.amazonaws.com/delop/restaurants/${restaurantId}`);
    setRestaurantName(response.data.Item.RestaurantName);
  };


  const [formData, setFormData] = useState({
    currentUser: currentUser.uid,
    num_guests: 1,
    date: '',
    time: '',
    additional_req: '',
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [isEditingTime, setIsEditingTime] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => { 
    const fetchReservation = async () => {
      console.log('Fetching reservation with ID:', reservationId);
      const response = await axios.get(`https://northamerica-northeast1-serverless-402317.cloudfunctions.net/get-reservation`);
      console.log(reservationId, "a");
      console.log(response.data.data, "aa");
      const filteredReservations = response.data.data.filter(x => x.reservation_id === reservationId);
      console.log(filteredReservations);
      if (filteredReservations.length > 0) {
        const reservation = filteredReservations[0];
        console.log(reservation);
        setFormData({
          currentUser: currentUser.uid,
          num_guests: reservation.num_guests,
          date: reservation.date,
          time: reservation.time,
          additional_req: reservation.additional_req,
        });
        setRestaurantId(reservation.restaurant_id);
        fetchRestaurantName(reservation.restaurant_id);
      } else {
        console.error('No reservation found with ID:', reservationId);
        setFormData({
          currentUser: '',
          num_guests: '',
          date: '',
          time: '',
          additional_req: '',
        });
        setRestaurantId('');
        fetchRestaurantName('');
      }
    };
  
    fetchReservation();
  
  }, []);

  const [options, setOptions] = useState([]);
  const handleDateChange = async (event) => {
    const selectedDate = event.target.value;
    setFormData(prevState => ({ ...prevState, date: selectedDate }));
  
    const payload = {
      "restaurant_id": restaurantId,
      "date": selectedDate,
      "num_guests": Number(formData.num_guests),
    };
    console.log(payload);
  
    const response = await axios.post('https://us-central1-serverless-402317.cloudfunctions.net/get-available-slots', payload);
    console.log(response.data, "res");
    setTimeSlots(response.data.data.available_slots);
    console.log(timeSlots, "res1");
    if (Array.isArray(timeSlots)) {
      const newOptions = timeSlots.map(slot => ({ value: slot, label: slot }));
      setOptions(newOptions);
    } else {
      console.error('timeSlots is not an array:', timeSlots);
    }
    console.log(typeof timeSlots);
  };

  const handleSlotChange = (selectedSlot) => {
    setFormData(prevState => ({ ...prevState, time: selectedSlot.value }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const payload = {
      "reservation_id": reservationId,
      "date": formData.date,
      "time": formData.time,
      "num_guests": Number(formData.num_guests),
      "additional_req": formData.additional_req,
    };
    console.log(payload); 
  
    const response = await axios.post('https://northamerica-northeast1-serverless-402317.cloudfunctions.net/update-reservation', payload);
    console.log(response);
    if (response.status === 200) {
      alert(response.data.message);
      navigate('/showReservations');
    } else {
      alert('Failed to update reservation');
    }
  };

  return (
    <Container className="booking-container">
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2>Restaurant Booking</h2>
          <h3>{restaurantName}</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNumGuests">
              <Form.Label>Number of Guests</Form.Label>
              <Form.Control
                type="number"
                name="num_guests"
                value={formData.num_guests}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={formData.date} onChange={handleDateChange} />
            </Form.Group>

            <Form.Group controlId="formSlot">
              <Form.Label>Slot</Form.Label>
              <Select options={options} onChange={handleSlotChange} />
            </Form.Group>

        <Form.Group controlId="formAdditionalReq">
          <Form.Label>Additional Requirements</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="additional_req"
            value={formData.additional_req}
            onChange={handleChange}
          />
        </Form.Group>
        <br/>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Col>
  </Row>
</Container>
);
};

export default RestaurantBookingComponent;