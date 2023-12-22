import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ShowReservations.css'; 

const ShowReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [foodReservations, setFoodReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const userId = sessionStorage.getItem('userId');
    const navigate = useNavigate();
    console.log('User ID:', userId);

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);

            const response = await axios.get('https://northamerica-northeast1-serverless-402317.cloudfunctions.net/get-reservation');
            console.log(response.data);
            const userReservations = response.data["data"].filter(reservation => reservation.user_id === userId);

            const foodResponse = await axios.get('https://z233ef7i4seoxhayvyoe6fidna0ninkn.lambda-url.us-east-1.on.aws/get-booked-meal/get-all');
            
            setFoodReservations(foodResponse.data.result)
           

            setReservations(userReservations);
            setLoading(false);
        };

        fetchReservations();
    }, []);

    const handleFoodOrder = (reservationId,restaurant_id,reservation_time) =>{
        console.log(reservationId)
        console.log(restaurant_id)
        navigate("/review-food-order",{state:{reservationId:reservationId,restaurant_id:restaurant_id,reservationTime:reservation_time}})
    }

    const handleCardClick = (reservationId) => {
        console.log('Clicked reservation with ID:', reservationId);
    };

    const handleEdit = (reservationId) => {
        const reservation = reservations.find(reservation => reservation.id === reservationId);
        navigate(`/editReservation/${reservationId}?reservation=${JSON.stringify(reservation)}`);
    };

    const handleDelete = async (reservationId) => {
        console.log('Deleting reservation with ID:', reservationId);
        const payload = {
            "reservation_id": reservationId,
        };
        
        const response = await axios.post(`https://northamerica-northeast1-serverless-402317.cloudfunctions.net/delete-reservation/}`, payload);
        console.log(response.data);
        if (response.data["status"] === "success") {
            alert(response.data["message"]);
        }
        setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    };

    return (
        <div className="container">
            {loading ? (
                <div className="loader">Loading...</div>
            ) : reservations.map(reservation => (
                <div className="reservation-card" onClick={() => handleCardClick(reservation.id)}>
                    <h2>{reservation.restaurant_name}</h2>
                    <p>Date: {reservation.date}</p>
                    <p>Time: {reservation.time}</p>
                    <p>Guests: {reservation.num_guests}</p>
                    <button className="mb-2" onClick={(e) => { e.stopPropagation(); handleEdit(reservation.reservation_id); }}>Edit reservation</button>
                    <button className="mb-2" onClick={(e) => { e.stopPropagation(); handleDelete(reservation.reservation_id); }}>Delete reservation</button>
                    <button  onClick={(e) => { e.stopPropagation(); handleFoodOrder(reservation.reservation_id,reservation.restaurant_id,reservation.time); }}>View Food Order</button>
                    {/* {
                        foodReservations.filter(item=>{
                            console.log(item.table_reservation_id==reservation.reservation_id)
                            return item.table_reservation_id==reservation.reservation_id
                        })?<button className="bg-primary" onClick={(e)=>{
                            e.stopPropagation();
                            editFoodOrder(reservation.reservation_id,"add",reservation.restaurant_id)
                        }}  >Add food order</button>
                            :
                        <button className='bg-warning' onClick={(e)=>{
                            e.stopPropagation();
                            editFoodOrder(reservation.reservation_id,"edit",reservation.restaurant_id)
                        }}>Update food order</button>
                    } */}
                </div>
            ))}
        </div>
    );
};

export default ShowReservations;