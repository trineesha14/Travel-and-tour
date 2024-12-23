const express=require('express');
const  app=express();
const mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/AIDS_B",(err)=>{
if(err)
console.log("DB Not Connected-Error");
else
console.log("DB Connected");
});
const ns=new mongoose.Schema({
name:String,
age:Number,
rno:Number
});
const nm=new mongoose.model("records",ns);
nm.remove({name:'Chakri'}).then(function(){
console.log("Data deleted")
}).catch(function(error){
console.log(error)
});