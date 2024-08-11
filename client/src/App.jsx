import React from 'react'
import axios from "axios"
import { useState,useEffect } from 'react'
import './App.css'

const App = () => {
  const [users, setUsers]=useState([]);
  const [filter, setFilter]=useState([]);
  const [isModalopen, setisModalopen] = useState(false);
  const [userData, setUserData] = useState({name:"",age:"",city:""});
  const getAllUsers = async () => {
    // try{
    //   const response = await axios.get('http://localhost:7930/users');
    //   console.log(response.data);
    //   setUsers(response.data);
      
    // }
    // catch(error)
    // {
    //     console.error(error);
    // }
    // }
     await axios.get("http://localhost:7930/users").then
     ((res)=>{
      console.log(res.data);
      setUsers(res.data);
      setFilter(res.data)
     }); 
  }
useEffect(()=>{
  getAllUsers();
},[])
  // Search function
  const handleSearchChange=(e)=>{
    const searchText = e.target.value.toLowerCase(); 
    const filteredUser = users.filter((user)=>user.name.toLowerCase().includes(searchText) || 
    user.city.toLowerCase().includes(searchText));
    setFilter(filteredUser);
  }
  const handleDelete = async (id) => {
       const isConformed = window.confirm("Are You Sure to delete the user:"); 
       if(isConformed)
        {
        await axios.delete(`http://localhost:7930/users/${id}`).then
        ((res)=>{
          setUsers(res.data);
          setFilter(res.data);
        });
       }   
  };
  //close model
  const handleClose = () => {
    setisModalopen(false);
    getAllUsers();
  }

// add user detail
const handleAddRecord=()=>{
  setUserData({name:"",age:"",city:""});
  setisModalopen(true);
}
//set data use edit
const handleData=(e)=>{
  setUserData({...userData, [e.target.name]:e.target.value});

};
//submit
const handleSubmit= async (e)=>{
  e.preventDefault();
  if(userData.id){
    await axios.patch(`http://localhost:7930/users/${userData.id}`,userData).then
  ((res)=>{
    console.log(res)
  })
  }
  else{
    await axios.post("http://localhost:7930/users",userData).then
    ((res)=>{
      console.log(res)
    })
  } 
  handleClose();
  setUserData({name:"",age:"",city:""});
};
//update user record
const updateUserRecord = (user) =>{
  setUserData(user);
  setisModalopen(true);
}

  return (
    <>
    <div className='container'>
        <h3>CRUD operation with react and nodejs</h3>
        <div className="inputs">
            <input type="search"  placeholder='enter text here' onChange={handleSearchChange}/>
            <button className='btn green' onClick={handleAddRecord} >Add Data</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              filter&&
              filter.map((user, index)=>{
              return(
              <tr key={user.id}>
              <td>{index+1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td><button className='btn green' onClick={()=>updateUserRecord(user)}>Edit</button></td>
              <td><button className='btn red' onClick={()=>handleDelete(user.id)}>Delete</button></td>
              </tr>
                )
              })
            }
          </tbody>
        </table>
        {
          isModalopen&&(
            <div className='modal'>
              <div className='modal-content'>
                <span className='close' onClick={handleClose}>&times;</span>
                <h2>{userData.id? "Update Record": "Add Record"}</h2>
                <div className='input-group'>
                  <label htmlFor='name'>Full Name:</label>
                  <input type='text' value={userData.name} name='name' id='name' onChange={handleData} />
                </div>
                <div className='input-group'>
                  <label htmlFor='age'>Age:</label>
                  <input type='number' value={userData.age} name='age' id='age' onChange={handleData} />
                </div>
                <div className='input-group'>
                  <label htmlFor='city'>City:</label>
                  <input type='text' value={userData.city} name='city' id='city' onChange={handleData} />
                </div>

                {/* // send toast message */}
                <button className='btn green'  onClick={handleSubmit}>{userData.id? "Update User": "Add User"}</button>
              </div>
            </div>
          )
        }
    </div>
    </>
  )
}

export default App