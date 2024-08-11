const express = require('express');
const users = require('./sample.json');
const cors = require('cors');
const fs =require('fs')


const app = express();
const port =7930; 
app.use(express.json())
app.use(express.urlencoded())
app.use(cors({ 
    origin:'http://localhost:5173',
    methods:["POST","GET","PATCH","DELETE"],
}));
// app.use(cors());

// app.use(cors({origin:'http://localhost:5173'}));
app.get("/users",(req,res)=>{
    return res.json(users);
})
app.delete("/users/:id", (req,res)=>{
    let id = Number(req.params.id);
    console.log(id);
    let filtereduser = users.filter((user)=> user.id !== id);
    fs.writeFile("./sample.json",JSON.stringify(filtereduser),(err,data)=>
        {
        return res.json(filtereduser);
    });
});
// Add new user
app.post("/users",(req, res)=>{
    let {name, age, city} = req.body;
    if(!name || !age || !city){
        res.status(400).send({"message" : "all field required"});
    }
    let id=Date.now();
    users.push({id, name, age, city});
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>
        {
            return res.json({"message": "User Detail Added Sucessfully"});
    }); 
});
//update user
app.patch("/users/:id",(req, res)=>{
    let id =Number(req.params.id);
    let {name, age, city} = req.body;
    if(!name || !age || !city){
        res.status(400).send({"message" : "all field required"});
    }
   let index =users.findIndex((user)=>user.id == id);
   //splice array handling keyword "1"=represent remove 1 field (name) data 
   users.splice(index, 1, {...req.body})
    
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>
        {
            return res.json({"message": "User Detail update Sucessfully"});
    }); 
});
app.listen(port, (err)=>{
    if(err){
        console.log(`error occured`);
    }
    else{
        console.log(`server is running on port: ${port}`);
        }
});
