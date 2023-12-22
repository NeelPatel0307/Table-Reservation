import React,{useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { useLocation } from 'react-router-dom';
import apiToCall from '../../services/apiToCall';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ReviewFoodOrderComponent = () =>{
    const [orderList,setOrder] = useState([]);
    const [reservationId,setReservationId] = useState(null);
    const [restaurantId,setRestaurantId] = useState(null)
    const location = useLocation();
    const [docId,setDocId] = useState(null);
    // const order = location.state && location.state.order;
    const reservationIdFromRoute = location.state && location.state.reservationId;
    const restaurantid = location.state && location.state.restaurant_id;
    const reservationTime = location.state && location.state.reservationTime;
    const [slotHour,setOpenHours] = useState(null);
    const [closeHours,setCloseHours] = useState(null);
    // console.log(location.state)
    // const docId = location.state && location.state.docId;
    const [isExistingData,setIsExistingData] = useState(false);
    const navigate = useNavigate();
    
    useEffect(()=>{
        const performInit = async () =>{
            var resultItem = null
            var order = [];
                setReservationId(reservationIdFromRoute);
                setRestaurantId(restaurantid);
                // console.log(reservationId)
                // console.log(restaurantId)
            if(!(sessionStorage.getItem("order"))){
                console.log(order)
                const response = await axios.get('https://z233ef7i4seoxhayvyoe6fidna0ninkn.lambda-url.us-east-1.on.aws/get-booked-meal/get-all');
                resultItem = response.data.result.find(item=>{
                    return item.table_reservation_id==reservationIdFromRoute
                });
                console.log(resultItem)
                if(resultItem){
                    console.log(resultItem)
                    sessionStorage.setItem("docId",resultItem.doc_id)
                    var openHours = reservationTime.split("-")[0].split(":")[0]
                    setOpenHours(openHours)
                    var dataToSet = resultItem.order.map(item=>{
                        return {
                            item:{
                                item_id:item.item_id,
                                name:item.name,
                                price:item.price,
                            },
                            quantity:item.quantity
                        }
                    })
                    setOrder(dataToSet)
                    sessionStorage.setItem("order",JSON.stringify(dataToSet))
                }
            }
            else{
                console.log(JSON.parse(sessionStorage.getItem("order")))
                setOrder(JSON.parse(sessionStorage.getItem("order")))
            } 
        }
        performInit();
          
    },[])

    const submitOrder = () =>{
        console.log(orderList)
        var menu_order = orderList.map(item=>(
            {
                name:item.item.name,
                item_id:item.item.item_id,
                price:item.item.price,
                quantity:item.quantity
            }
        ))
        var dataToSend = {
            table_reservation_id:reservationId,
            menu_order:menu_order,
            restaurantId:restaurantId
        }

        console.log(dataToSend)

        const callback = (data) =>{
            if(data.msg){

                // setShowMsg(true)
                sessionStorage.removeItem("order")
                sessionStorage.removeItem("docId")
                navigate("/ShowReservations")
            }
        }

        console.log(sessionStorage.getItem("docId"))
        console.log(Boolean(sessionStorage.getItem("docId")))
        if(sessionStorage.getItem("docId")){
             dataToSend = {
                doc_id:sessionStorage.getItem("docId"),
                updated_order:menu_order,
                restaurantId:restaurantId
             }
            apiToCall.editExistingOrder(dataToSend,callback)
        }  
        else
            apiToCall.addOrder(dataToSend,callback)
            
    }

    const handleEdit = () =>{
        navigate("/food-menu/"+restaurantId,{state:{reservationId:reservationId}})
    }

    const handlePlaceOrder = () =>{
        navigate("/food-menu/"+restaurantId,{state:{reservationId:reservationId}})
    }

    const cancelOrder = async () =>{
        const response = await axios.delete("https://jhwwlonfkyttfprty2gcrmrxvu0judph.lambda-url.us-east-1.on.aws/delete-booked-meal/document-id/"+sessionStorage.getItem("docId"))
        sessionStorage.removeItem("docId");
        sessionStorage.removeItem("order")
        alert("Order deleted successfully")
        console.log(response)
        if(response.data.msg)
            navigate("/ShowResponses")
    }

    return(
        <div className='container' style={{margin:"5% auto",maxHeight:"600px",overflowY:"auto",display:"block"}}>
            <h3 className='text-center mb-3'>Review order</h3>
            {/* {showMsg?<h5 className='my-3 text-success text-center'>Succesfully added the food order</h5>:""} */}
            {orderList.length>0?<div style={{marginLeft:"25%"}}>
                <Card className='w-75'>
                    <Card.Body>
                        <ListGroup >
                            {orderList.length>0?orderList.map(orderItem=>(
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start">
                                    <div className="ms-2 me-auto">
                                        {/* <small className='text-muted'>{orderItem.item.category}</small><br/> */}
                                        <span className='fw-bold'>{orderItem.item.name}</span><br/>
                                        <small className='text-muted'>Quantity : {orderItem.quantity}</small>
                                    </div>
                                    <Badge bg="dark" className='mt-3 py-2 px-2 fw-bold' style={{fontSize:"110%"}} pill>
                                    {orderItem.item.price}
                                    </Badge>
                                </ListGroup.Item>
                            )):""}
                        </ListGroup>
                    </Card.Body>
                </Card>
                <div className=''>
                    {slotHour?(parseInt(slotHour)-1).toString()==new Date().getHours()?<button className='mt-4 bg-warning me-3' onClick={handleEdit}>Edit order</button>:
                        <button className='mt-4 bg-warning me-3' disabled={true}>Can edit only 1 hour before the time</button>
                    :<button className='mt-4 bg-warning me-3' onClick={handleEdit}>Edit order</button>}
                    {sessionStorage.getItem("docId")?
                    <button className='mt-4 bg-danger me-3' onClick={cancelOrder}>Cancel Order</button>:""}
                    
                    
                    <button className='mt-4 float-end' style={{marginRight:"25%"}} onClick={submitOrder}>Submit order</button>
                </div>
               
            </div>:<div style={{marginLeft:"25%"}}>
            <Card className='w-75'>
                    <Card.Body>
                        <p className='text-center'>No food order placed yet.</p>
                        <button className='text-center' onClick={handlePlaceOrder} style={{marginLeft:"40%"}}>Place order</button>
                    </Card.Body>
                </Card>
            </div>}
            
        </div>
    )
}

export default ReviewFoodOrderComponent;