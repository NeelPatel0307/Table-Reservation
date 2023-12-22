import React,{useState,useEffect,useRef} from 'react';
import Card from 'react-bootstrap/Card';
import apiToCall from '../../services/apiToCall';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const ListMenuComponent = () =>{
    const [data,setData] = useState([])
    const [restaurantId,setrestaurantId] = useState("R2");
    const [showNewButton,setButton] = useState(true)
    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const descriptionRef = useRef(null);
    const fromTimeRef = useRef(null);
    const toTimeRef = useRef(null);
    const [itemIdToUpdate,setUpdateItem] = useState("");

    useEffect(()=>{
        // setrestaurantId("R2")
        const callback = (data) =>{
            console.log(data.data)
            setData(data.data.sort((a,b)=>{
                return a.name-b.name
            }))
        }
        apiToCall.getMenuForRestaurant(restaurantId,callback)
    },[])

    const editHandler = (item) =>{
       setButton(false)
        const priceElem = priceRef.current;
        const nameElem = nameRef.current;
        const descriptionElem = descriptionRef.current;
        const fromtimeElem = fromTimeRef.current;
        const toTimeElem = toTimeRef.current;
        if(priceElem && nameElem){
            priceElem.value = item.price;
            nameElem.value = item.name;
            descriptionElem.value = item.description
            fromtimeElem.value = item.open_hours;
            toTimeElem.value = item.close_hours
            setUpdateItem(item.item_id)
        }
    }

    const editItem = () =>{
        const priceElem = priceRef.current;
        const nameElem = nameRef.current;
        const descriptionElem = descriptionRef.current;
        const fromtimeElem = fromTimeRef.current;
        const toTimeElem = toTimeRef.current;
        if(priceElem && nameElem){
            var priceValue = priceElem.value;
            var nameValue = nameElem.value;
            var descriptionValue = descriptionElem.value;
            var datatoSend = {
                name:nameValue,
                item_id:itemIdToUpdate,
                restaurant_id:restaurantId,
                price:"$"+priceValue,
                description:descriptionValue,
                open_hours:fromtimeElem.value,
                close_hours:toTimeElem.value
            }
        }

        console.log(datatoSend)

        const callback = (datafromRespnse) =>{
            console.log(datafromRespnse.success)
            if(datafromRespnse.success){
                var currentItem = JSON.parse(JSON.stringify(data));
                var index = currentItem.findIndex(item=>item.item_id==itemIdToUpdate)
                currentItem[index] = {
                    name:nameValue,
                    item_id:itemIdToUpdate,
                    price:"$"+priceValue,
                    description:descriptionValue,
                    open_hours:fromtimeElem.value,
                    close_hours:toTimeElem.value
                }
                setData(currentItem)
                setUpdateItem(null);
                priceElem.value=null;
                nameElem.value=null;
                descriptionElem.value=null
                fromtimeElem.value=null;
                toTimeElem.value=null;
            }
        }
        apiToCall.editExistingItem(datatoSend,callback)
    }

    const addItem = () =>{
        const priceElem = priceRef.current;
        const nameElem = nameRef.current;
        const descriptionElem = descriptionRef.current;
        const fromtimeElem = fromTimeRef.current;
        const toTimeElem = toTimeRef.current;
        if(priceElem && nameElem){
            var priceValue = priceElem.value;
            var nameValue = nameElem.value;
            var descriptionValue = descriptionElem.value;
            var datatoSend = {
                name:nameValue,
                restaurant_id:restaurantId,
                price:"$"+priceValue,
                description:descriptionValue,
                open_hours:fromtimeElem.value,
                close_hours:toTimeElem.value
            }
            console.log(datatoSend)

            const callback = (datafromRespnse) =>{
                if(datafromRespnse.item_id){
                    var currentItem = data;
                    currentItem.push({
                        name:nameValue,
                        price:"$"+priceValue,
                        decription:descriptionValue,
                        item_id:datafromRespnse.item_id,
                        open_hours:fromtimeElem.value,
                        close_hours:toTimeElem.value
                    })
                    priceElem.value=null;
                    nameElem.value=null;
                    descriptionElem.value=null
                }
            }

            apiToCall.addFoodItem(datatoSend,callback)
        }
    }

    const deleteHandler = (item_id) =>{
        var dataToSend = {
            item_id:item_id,
            restaurant_id:restaurantId
        }

        const callback = (dataFromResponse) =>{
           if(dataFromResponse.success){
            var currentItem = JSON.parse(JSON.stringify(data));
            var newItem = currentItem.filter(item=>item.item_id!=item_id)
            setData(newItem)
           }
        }

        apiToCall.deleteItem(dataToSend,callback)
    }

    return(
        <div className='container mt-4' style={{display:"block"}}>
            <div className='row'>
                <div className='col-7' style={{maxHeight:"600px",overflowY:"auto"}}>
                    {data.length>0?data.map(item=>(
                        <div className='col'>
                            <Card className='my-2'>
                                <Card.Body className=''>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Subtitle className='text-muted mb-2' style={{fontSize:"90%"}}>
                                        {item.description?item.description:'No decription'}
                                    </Card.Subtitle>
                                    <Card.Text className='mb-0 fw-bold'>
                                      {item.price}
                                    </Card.Text>
                                    <small>Open Hours : {item.open_hours}</small><br/>
                                    <small>Close Hours : {item.close_hours}</small><br/>
                                    <Card.Link style={{cursor:"pointer"}} onClick={()=>{editHandler(item)}}>Edit</Card.Link>
                                    <Card.Link style={{cursor:"pointer"}} onClick={()=>{
                                        deleteHandler(item.item_id)
                                    }}>Delete</Card.Link>
                                </Card.Body>
                            </Card>
                        </div>
                        )):<Card.Body>Loading . . .</Card.Body>}
                    </div>
                    <div className='col-5' >
                            <Card.Body className='border px-2 py-2'>
                                <Form.Group md="4" controlId="name">
                                    <Form.Label>Item name</Form.Label>
                                    <Form.Control
                                        autoComplete='off'
                                        ref={nameRef}
                                        type="text"
                                        name="firstName" 
                                    />
                                    </Form.Group>
                                <Form.Group/>

                                <Form.Group md="4" controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        ref={descriptionRef}
                                        type="text"
                                        name="description" 
                                    />
                                    </Form.Group>
                                <Form.Group/>
                                <Form.Group md="4" controlId="price">
                                    {/* <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text> */}
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        ref={priceRef}
                                        type="text"
                                        name="price" 
                                    />
                                    </Form.Group>
                                <Form.Group/>
                                <label className='mt-2'>Available from : </label>
                                <select ref={fromTimeRef}>
                                    {Array.from({ length: 25 }, (_, index) => index).map(item=>(
                                        <option value={item+":00"}>{item+":00"}</option>
                                    ))}
                                </select>

                                <label className='ms-3'>Available to : </label>
                                <select ref={toTimeRef}>
                                    {Array.from({ length: 25 }, (_, index) => index).map(item=>(
                                        <option value={item+":00"}>{item+":00"}</option>
                                    ))}
                                </select>
                                {showNewButton?<button className='mt-5 float-end' onClick={addItem}>Add New Item </button>:
                                        <button className='mt-5 float-end' onClick={editItem}>Update Item Item</button>
                                    }
                            </Card.Body>
                    </div>
            </div>
            
        </div>
    )
}

export default ListMenuComponent;