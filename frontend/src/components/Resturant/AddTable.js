import React, { useState } from 'react';

const AddTable = () => {
  const [tables, setTables] = useState([{ name: '', size: '' }]);
  const [message, setMessage] = useState('');

  const handleTableChange = (index, field, value) => {
    const newTables = [...tables];
    newTables[index][field] = value;
    setTables(newTables);
  };

  const handleAddTable = () => {
    setTables([...tables, { name: '', size: '' }]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedRestaurantId = 'R2'; // Replace with the actual restaurant ID

      // Convert array of tables to a map
      const tablesMap = tables.reduce((acc, table, index) => {
        acc[`table-${index + 1}`] = parseInt(table.size, 10);
        return acc;
      }, {});

      const response = await fetch(`https://m7kkjr68xi.execute-api.us-east-1.amazonaws.com/delop/restaurants/tables/${updatedRestaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tables: tablesMap }),
      });

      const data = await response.json();

      setMessage('Tables updated successfully!');
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error updating tables. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
    <h2 className="mb-4">Add Restaurant</h2>
    <form onSubmit={handleFormSubmit}>
      <h3>Tables:</h3>
      {tables.map((table, index) => (
        <div key={index} className="mb-3">
          <label className="mr-2">
            Table Name:
            <input
              type="text"
              className="form-control"
              value={table.name}
              onChange={(e) => handleTableChange(index, 'name', e.target.value)}
            />
          </label>
          <label>
            Table Size:
            <input
              type="text"
              className="form-control"
              value={table.size}
              onChange={(e) => handleTableChange(index, 'size', e.target.value)}
            />
          </label>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" onClick={handleAddTable}>
        Add Table
      </button>
      <br />
      <button type="submit" className="btn btn-primary mt-3">
        Submit
      </button>
    </form>
    {message && <div className="mt-3 alert alert-success">{message}</div>}
  </div>
  );
};

export default AddTable;
