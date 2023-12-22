import React, { useEffect, useState } from "react";
import { useParams, useLocation,useNavigate } from "react-router-dom";
import apiToCall from "../../../services/apiToCall";
import Card from "react-bootstrap/Card";
import PIZZA from "../../../assets/images/pizza.avif";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

export default function FoodMenuComponent(props) {
  const [selectedRestaurantName, setName] = useState("");
  const [selectedRestuarantId, setId] = useState("");
  const [tableReservationId, setTableReservationId] = useState("");
  const [data, setData] = useState([]);
  const [selectedOrder, setOrder] = useState([]);
  const {  restaurant_id } = useParams();
  const navigate = useNavigate();
  const restaurant_name = "ABC";
  const location = useLocation();
  const reservationId = location.state && location.state.reservationId;
  const timeSlot = location.state && location.state.timeSlot;
  const [openHours,setOpenHours] = useState(null)
  const [closeHours,setCloseHours] = useState(null)
  
 
  // const reservationId = "kjfkdsyfsjdlsud";

  useEffect(() => {
    if(timeSlot){
      
      var openHours1 = timeSlot.split("-")[0].split(":")[0]
      var closeHours1 = timeSlot.split("-")[1].split(":")[0]
      console.log(openHours1)
      console.log(closeHours1)
      setOpenHours(openHours1);
      setCloseHours(closeHours1);
    }
    setTableReservationId(reservationId);
    setOrder(sessionStorage.getItem("order")?JSON.parse(sessionStorage.getItem("order")):[])
    const callback = (data) => {
      setData(data);
    };
    apiToCall.getMenuForRestaurant(restaurant_id,callback);
    console.log(openHours)
  }, []);

  function handleReview(){
    // navigate("/review-food-order",{state:{order:sessionStorage.getItem("order")}})
    navigate("/review-food-order",{state:{order:JSON.parse(sessionStorage.getItem("order")),reservationId:reservationId,restaurant_id:restaurant_id}})
  }

  function updateOrder(type, item) {
    var currentstate = Object.assign([], selectedOrder);
    var index = currentstate.findIndex(
      (order) => order.item.item_id == item.item_id
    );
    switch (type) {
      case "increase": {
        if (index > -1) {
          currentstate[index].quantity += 1;
        } else {
          currentstate.push({
            item: item,
            quantity: 1,
          });
        }
        break;
      }
      case "decrease": {
        if (index > -1 && currentstate[index].quantity > 0) {
          currentstate[index].quantity -= 1;
        }
        if (currentstate[index].quantity == 0) {
          // currentstate.pop(index);
          currentstate.splice(index, 1);
        }
        break;
      }
    }
    // console.log(currentstate)
    sessionStorage.setItem("order", JSON.stringify(currentstate));
    setOrder(currentstate);
  }

  return (
    <div className="container mt-4" style={{display:"block"}}>
      <div>
        <div className="row">
          <div className="col-10">
            <div className="mb-3">
              <h2>
                <b>{restaurant_name}</b>
              </h2>
              <p>
                Address on the restaurant . 4/5 rating .{" "}
                <span>
                  <small style={{ color: "gray" }}>Open hours - Close hours</small>
                </span>
              </p>
              </div>
            </div>
          <div className="col-2">
            <button className="py-2" 
              onClick={handleReview}
              disabled={reservationId && sessionStorage.getItem("order")?false:true}
              style={{height:"40px"}}>
                Review Order
            </button>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="row">
          {data.data && data.data.length > 0
            ? data.data.map((item) => (
                <div className="col-4 mb-3">
                  <Card>
                    <Card.Body>
                      <div className="row">
                        <div className="col-8">
                          <Card.Title style={{ fontSize: "90%" }}>
                            {item.name}
                          </Card.Title>
                          <Card.Subtitle
                            className="mb-2 text-muted"
                            style={{ fontSize: "80%" }}
                          >
                            Category : {item.category?item.category:"General"}
                          </Card.Subtitle>
                          <Card.Text style={{ fontSize: "80%" }}>
                            {item.description
                              ? item.description
                              : "No description is available"}
                              <br/><span className="text-muted">Open hours : {item.open_hours}</span><br/>
                              <span className="text-muted">Close hours :  {item.close_hours}</span>
                          </Card.Text>
                        </div>
                        <div className="col-4">
                          <Card.Img height={"80px"} src={PIZZA} />
                        </div>
                      </div>

                      <Card.Text style={{ fontSize: "110%" }}>
                        <div style={{ float: "left", width: "25%" }}>
                          <InputGroup className="" size="sm">
                            <Button
                              disabled={reservationId && (openHours?(item.open_hours.split(":")[0]<openHours && item.open_hours.split(":")[0]<closeHours):true)?false:true}
                              variant="outline-dark"
                              id="decrease"
                              onClick={() => {
                                updateOrder("decrease", item);
                              }}
                            >
                              -
                            </Button>
                            {/* <p>{selectedOrder.findIndex(order=>order.item.item_id==item.item_id)>-1?selectedOrder[selectedOrder.findIndex(order=>order.item.item_id==item.item_id)].quantity:0}</p> */}
                            <Form.Control
                              aria-label="Example text with button addon"
                              aria-describedby="basic-addon1"
                              color="dark"
                              disabled={reservationId?true:true}
                              // dangerouslySetInnerHTML={selectedOrder.find  Index(order=>order.item.item_id==item.item_id)>-1?selectedOrder[selectedOrder.findIndex(order=>order.item.item_id==item.item_id)].quantity:0}
                              // defaultValue={selectedOrder.findIndex(order=>order.item.item_id==item.item_id)>-1?selectedOrder[selectedOrder.findIndex(order=>order.item.item_id==item.item_id)].quantity:0}
                              value={
                                selectedOrder.findIndex(
                                  (order) => order.item.item_id == item.item_id
                                ) > -1
                                  ? selectedOrder[
                                      selectedOrder.findIndex(
                                        (order) =>
                                          order.item.item_id == item.item_id
                                      )
                                    ].quantity
                                  : 0
                              }
                            />
                            <Button
                              disabled={reservationId && (openHours?(item.open_hours.split(":")[0]<openHours && item.open_hours.split(":")[0]<closeHours):true)?false:true}
                              variant="outline-dark"
                              id="increase"
                              onClick={() => {
                                updateOrder("increase", item);
                              }}
                            >
                              +
                            </Button>
                          </InputGroup>
                        </div>
                        <p
                          style={{ float: "right" }}
                          className="mb-0 mt-2"
                          mr-2
                        >
                          <b>{item.price}</b>
                        </p>
                        <br/>
                        {openHours? item.open_hours.split(":")[0]<openHours && item.open_hours.split(":")[0]<closeHours?""
                          :<small style={{marginLeft:"-25%",marginTop:"10px"}} className="text-danger">Item not available at the selected slot</small>:""}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))

            : "Loading menu . . ."}
        </div>
      </div>
    </div>
  );
}
