import React, { useState, useEffect } from 'react';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BusinessIcon from '@mui/icons-material/Business';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiToCall from '../../services/apiToCall';

const ListOfRestaurants = () => {
  const navigate = useNavigate();
  const [restaurantData, setRestaurantData] = useState([]);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch('https://m7kkjr68xi.execute-api.us-east-1.amazonaws.com/delop/restaurants');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data');
        }
        const data = await response.json();
        console.log('Received data from Lambda function:', data);

        // Convert relevant data to their appropriate types
        const formattedData = data.Items.map((item) => ({
          Review: item.Review,
          // Remove the "ImageUrl" property here
          Address: item.Address,
          RestaurantID: item.RestaurantID,
          RestaurantName: item.RestaurantName,
          OpeningHours: item.OpeningHours,
          ClosingHours: item.ClosingHours,
          foodMenu: [],
          isOpen: item.isOpen,
        }));

        const fetchImageUrls = async () => {
          const imageUrls = await Promise.all(
            formattedData.map(async (restaurant) => {
              try {
                const response = await fetch(`https://r2-image.s3.amazonaws.com/restaurants/restaurants/${restaurant.RestaurantID}/image.jpg`);
                if (!response.ok) {
                  throw new Error(`Failed to fetch image for restaurant ${restaurant.RestaurantID}`);
                }
                return URL.createObjectURL(await response.blob());
              } catch (error) {
                console.error(error);
                // Handle the error or provide a default image URL
                return 'default-image-url';
              }
            })
          );
          return imageUrls;
        };
        

        const imageUrls = await fetchImageUrls();

        for (let i = 0; i < formattedData.length; i++) {
          formattedData[i].ImageUrl = imageUrls[i];
        }

        console.log(formattedData);

        setRestaurantData(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRestaurantData();
  }, []);

  const handleShowMenu = (index) => {
    const updatedData = [...restaurantData];
    updatedData[index].showMenu = !updatedData[index].showMenu;
    const menuData = apiToCall.getMenuForRestaurant(updatedData[index].RestaurantID)
    updatedData[index].foodMenu = menuData;
    setRestaurantData(updatedData);
    navigate(`/food-menu/${updatedData[index].RestaurantID}`);
  };


  const handleReserveTable = (index) => {
    const userId = sessionStorage.getItem('userId');
    const restaurantId = restaurantData[index].RestaurantID;
    console.log(`Navigating to /book-restaurant/${restaurantId} with state:`, { userId, restaurantId });
    navigate(`/book-restaurant/${restaurantId}`, { state: { userId, restaurantId } });
  };


return (
  <div className="container mt-5">
    <h1 className="mb-4">Restaurant Information</h1>
    <div className="row">
      {restaurantData.map((restaurant, index) => (
        <div key={index} className="col-lg-4 mb-4">
          <div className={`card`}>
            <div className="card position-absolute end-0 p-2">
              <div className="card-text">{restaurant.isOpen ? 'Open' : 'Closed'}</div>
            </div>
            <img src={restaurant.ImageUrl || 'placeholder-image-url'} className="card-img-top" alt={restaurant.RestaurantName} />
            <div className="card-body">
              <h3 className="card-title mb-3">{restaurant.RestaurantName}</h3>
              <div className="card-text mb-3">Restaurant ID: {restaurant.RestaurantID}</div>
              <div className="card-text mb-3 d-flex align-items-center">
                <ScheduleIcon className='me-1'/> {restaurant.OpeningHours} - {restaurant.ClosingHours}
              </div>
              <div className="card-text mb-3 d-flex align-items-center">
                <BusinessIcon className='me-2'/> {restaurant.Address}
              </div>
              <div className="card-text mb-3 d-flex align-items-center">
                <StarBorderIcon className='me-2'/> {restaurant.Review}
              </div>
              <div className="button-group">
                <button onClick={() => handleShowMenu(index)} className="btn btn-primary" style={{ marginRight: '20px' }}>
                  {restaurant.showMenu ? 'Hide Menu' : 'Show Menu'}
                </button>
                <button onClick={() => handleReserveTable(index)} className="btn btn-primary">
                  Reserve Table
                </button>
              </div>
            </div>
            {restaurant.showMenu && (
              <ul className="list-group list-group-flush">
                {restaurant.foodMenu.map((menu, menuIndex) => (
                  <li key={menuIndex} className="list-group-item">
                    {menu.category} || {menu.price} || {menu.name} || {menu.item_id}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
};
export default ListOfRestaurants;


