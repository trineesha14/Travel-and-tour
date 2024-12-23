const express = require('express');
 const mongoose = require('mongoose');
 const bodyParser = require('body-parser');
 const path = require('path');
 const Schema = mongoose.Schema;
 const app = express();
 const port = process.env.PORT || 3000;
 mongoose.set('strictQuery', false);
 // Connect to your MongoDB instance (replace 'mongodb://localhost/mydatabase' with your MongoDB URL)
 mongoose.connect('mongodb://127.0.0.1:27017/contact', { useNewUrlParser: true, 
useUnifiedTopology: true });
 // Create a Mongoose model (schema)
 const User = mongoose.model('User', {
    name: String,
    email: String,
    phone: String,
    date: Number,
gender:String,
    address_1: String,
    address_2: String,
    country: String,
    city: Number,
    region:String,
    postal_code:Number
    




 });
 // Middleware for parsing form data
 app.use(bodyParser.urlencoded({ extended: true }));
 // Serve the HTML form
 app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
 });
 app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
   });
   app.get('/homepage', (req, res) => {
    res.sendFile(__dirname + '/homepage.html');
   });
  app.get('/delete', (req, res) => {
    res.sendFile(__dirname + '/delete.html');
   }); 
   app.get('/display', (req, res) => {
    res.sendFile(__dirname + '/display.html');
  });
  app.get('/displayall', (req, res) => {
    res.sendFile(__dirname + '/displayall.html');
  });
  app.get('/update', (req, res) => {
    res.sendFile(__dirname + '/update.html');
  });
 app.post('/signup', (req, res) => {
    const {     name,email,phone,date,address_1,address_2,country,city,region,postal_code} = req.body;
 // Create a new User document and save it to MongoDB
    const user = new User({    name,email,phone,date,address_1,address_2,country,city,region,postal_code});
    user.save()
    .then(() => {
    res.send(`<html>
     <body align="center">
     <h1>Data Saved Successfully.</h1><br>
     <button><a href="/">Back to log in<a><button>
     </head>
     </body>`);
    })
    .catch((err) => {
    console.error(err);
    res.status(500).send('Error saving data to MongoDB.');
    });
    });
    app.post('/login', (req, res) => {
        const { email, password } = req.body;
      
        User.findOne({ email, password }, (err, user) => {
          if (err || !user) {
            res.send('Invalid email or password');
          } else {
            res.sendFile(__dirname + '/homepage.html')
          }
        });
      });
    app.post('/delete', (req, res) => {
        const recordId = req.body.name;
        // Use Mongoose to delete the record by its ID using deleteOne
        User.deleteOne({name: recordId}, (err) => {
          if (err) {
            res.send('Error deleting record');
          } else {
            res.send(`<html>
      <head>
      <h1>Record Deleted Successfully.</h1><br>
      <button><a href="/homepage">Go Back</a></button>
      </head>
      </html>`);
          }
        });
      });
      app.post('/display', (req, res) => {
        const emailid = req.body.email;
        // Use Mongoose to find the specific record by its ID
        User.findOne({ email: emailid }, (err, user) => {
          if (err) {
            res.send('Error finding user');
          } else if (!user) {
            res.send('User not found');
          } else {
            res.send(`
            <html>
            <head>
            <title>Display Record</title>
            </head>
            <body align="center">
              <h1>Record Details</h1>
              <table border="2" align="center" cellspacing="6" cellpaddin="6">
                <tr>
                  <td>Full name</td>
                  <td>${user.name}</td>
                </tr>
                <tr>
                  <td>Email id</td>
                  <td>${user.email,    name,email,phone,date,address_1,address_2,country,city,region,postal_code}</td>
                </tr>
                <tr>
                  <td>Phone Number</td>
                  <td>${user.phone}</td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>${user.date}</td>
                </tr>
                <tr>
                  <td>Age</td>
                  <td>${user.address_1}</td>
                </tr>
                <tr>
                  <td>Pincode</td>
                  <td>${user.country}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>${user.postal_code}</td>
                </tr>
              </table><br>
              <button><a href="/homepage">Go Back</a></button><br><br>
            </body>
          </html>
            `);
          }
        });
      });
      app.post('/displayall', (req, res) => {
        User.find({}, (err, records) => {
          if (err) {
            res.send('Error fetching records');
          } else {
            res.send(`
            <html>
            <head>
              <title>All Records</title>
            </head>
            <body align="center">
              <h1>All Records</h1>
              <table align="center" border="2" cellpadding="3" cellspacing="6">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>EMail Id</th>
                        <th>Phone Number</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Pincode</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                ${records.map(record => `
                  <tr> 
                    <td>${record.name}</td>  
                    <td>${record.email}</td> 
                    <td>${record.phno}</td>
                    <td>${record.gender}</td>
                    <td>${record.age}</td>
                    <td>${record.pincode}</td>
                    <td>${record.address}</td>  
                  </tr>
                `).join('')}
                </tbody>
              </table>
              <br><br>
              <br>
              <button><a href="/homepage">Go Back</a></button>
            </body>
          </html>
            `);
          }
        });
      });
      app.post('/update', (req, res) => {
        const emailid = req.body.emailid;
        const address = req.body.address;
        const pincode = req.body.pincode;
        const phno = req.body.phno;
        // Use Mongoose to update the record by its ID using updateOne
        User.updateOne({email: emailid }, {address:address,pincode:pincode,phno:phno}, (err) => {
          if (err) {
            res.send('Error updating record');
          } else {
            res.send(`<html>
      <body align="center">
      <h1>Record Updated Successfully.</h1><br><br>
      <center><button><a href="/homepage">Go Back</a></button></center>
      </body>
      </html>`);
          }
        });
      });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        });