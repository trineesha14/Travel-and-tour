const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/reg', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
   firstname: String,
  lastname: String,
  email: String,
  pass: String,
  class: String,
  course: String,
});

const  bookingSchema = new mongoose.Schema({
   name: String,
    arrival: String,
    leaving:String,
    from: String,
to:String,
});
const User = mongoose.model('User', userSchema);

const booking = mongoose.model('booking', bookingSchema);



app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/1srpade.html');
});

app.post('/register', (req, res) => {
  const userData = {
     firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    pass: req.body.pass,
    class: req.body.class,
    course: req.body.course
  };

  User.create(userData, (err, user) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during registration');
    } else {
      // Redirect to login.html after successful registration
      res.redirect('/login');
    }
  });
});

app.post('/login', (req, res) => {
  const { email, pass } = req.body;

  User.findOne({ email, pass}, (err, user) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during login.');
    } else if (!user) {
      console.log('User not found in the database');
      res.send('Login failed. Invalid credentials. Please check your mobile number, password, and voter ID.');
    } else {
      console.log('Login successful');
      // Redirect to dashboard.html after successful login
      res.redirect('/mainpage.html');
    }
  });
});

// Serve login.html
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Serve home.html
app.get('/1srpade.html', (req, res) => {
  res.sendFile(__dirname + '/1srpade.html');
});

// Serve dashboard.html
app.get('/mainpage.html', (req, res) => {
  res.sendFile(__dirname + '/mainpage.html');
});
app.get('/display.html', (req, res) => {
    res.sendFile(__dirname + '/display.html');
  });

app.post('/display', (req, res) => {
        const email = req.body.email;
        // Use Mongoose to find the specific record by its ID
        User.findOne({email: email}, (err, user) => {
          if (err) {
            res.send('Error finding user');
          } else if (!user) {
            res.send('User not found');
          } else {
            res.send(`
            <html>
            <head>
            <title>Display Record</title>
<style>
body{
	    margin:2%;
		height:80%;
        background-image: url('https://img.freepik.com/premium-photo/travelers-looking-phu-tub-berk-mountain-with-mist-thailand_38810-7678.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1697068800&semt=ais');
		background-position: center;
	    background-repeat: no-repeat;
		background-size: cover;
	}
</style>

            </head>
            <body align="center">
              <h1>Record Details</h1>
              <table border="2" align="center" cellspacing="6" cellpadding="6">
                <tr>
                  <td>Firstname</td>
                  <td>${user.firstname}</td>
                </tr>
                <tr>
                  <td>Lastname</td>
                  <td>${user.lastname}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>${user.email}</td>
                </tr>
               
                <tr>
                  <td>Places</td>
                  <td>${user.class}</td>
                </tr>
                <tr>
                  <td>season</td>
                  <td>${user.course}</td>
                </tr>
          
              </table><br>
              <button><a href="/modify.html">Go Back</a></button><br><br>
            </body>
          </html>
            `);
          }
        });
      });
app.get('/displayall', (req, res) => {
    res.sendFile(__dirname + '/displayall.html');
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
<style>
body{
	    margin:2%;
		height:80%;
        background-image: url('https://img.freepik.com/premium-photo/travelers-looking-phu-tub-berk-mountain-with-mist-thailand_38810-7678.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1697068800&semt=ais');
		background-position: center;
	    background-repeat: no-repeat;
		background-size: cover;
	}
</style>

            </head>
            <body align="center">
              <h1>All Records</h1>
              <table align="center" border="2" cellpadding="3" cellspacing="6">
                <thead>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                       
                        <th>Places</th>
                        <th>season</th>
            
                    </tr>
                </thead>
                <tbody>
                ${records.map(record => `
                  <tr> 
                    <td>${record.firstname}</td>  
                    <td>${record.lastname}</td> 
                    <td>${record.email}</td>
                   
                    <td>${record.class}</td>
                    <td>${record.course}</td>
                 
                  </tr>
                `).join('')}
                </tbody>
              </table>
              <br><br>
              <br>
              <button><a href="/modify.html">Go Back</a></button>
            </body>
          </html>
            `);
          }
        });
      });


app.post('/delete', (req, res) => {
  const { firstname, pass } = req.body;

  // Assuming you want to delete a user based on their username and password
  User.findOne({ firstname, pass }, (err, user) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during user deletion.');
    } else if (!user) {
      console.log('User not found in the database');
      res.send('User deletion failed. Invalid credentials. Please check your username, password');
    } else {
      const recordId = req.body.email;
User.deleteOne({ email: recordId }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting record');
    } else {
      if (result.deletedCount === 1) {
        console.log('Record deleted successfully');
        res.redirect('/modify.html');
      } else {
        console.log('Record not found');
        res.status(404).send('Record not found');
      }
    }
  });
    }
  });
});
app.get('/delete', (req, res) => {
  res.sendFile(__dirname + '/delete.html');
});

app.get('/update', (req, res) => {
    res.sendFile(__dirname + '/update.html');
  });

app.post('/update', (req, res) => {
        const firstname= req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const pass = req.body.pass;
        const userclass = req.body.class;
           const course = req.body.course;
        // Use Mongoose to update the record by its ID using updateOne
        User.updateOne({firstname:firstname,lastname:lastname }, {email:email,pass:pass,class:userclass,course:course}, (err) => {
          if (err) {
            res.send('Error updating record');
          } else {
            res.send(`<html>
      <body align="center">
      <h1>Record Updated Successfully.</h1><br><br>
      <center><button><a href="/modify.html">Go Back</a></button></center>

      </body>
      </html>`);
          }
        });
      });
app.post('/booking', (req, res) => {
  const bookingData = {
   name: req.body.name,
    arrival: req.body.arrival,
    leaving: req.body.leaving,
    from: req.body.from,
to:req.body.to,
  };

  booking.create(bookingData, (err, booking) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during booking');
    } else {
      // Redirect to login.html after successful registration
      res.redirect('/book.html');
    }
  });
});

app.post('/admin', (req, res) => {
    const adminUsername = req.body.username;
    const adminPassword = req.body.password;

    // Check if the provided username and password match the admin credentials
    if (adminUsername === 'trini' && adminPassword === 'trineesha') {
        res.redirect('/modify.html'); // Redirect to /modified.html if credentials match
    } else {
        // Handle incorrect credentials, e.g., show an error message or redirect to another page
        res.send('Invalid credentials. Please try again.'); // Example error response
    }
});
app.post('/updates', (req, res) => {
        const name= req.body.name;
        const arrival = req.body.arrival;
        const leaving = req.body.leaving;
        const from = req.body.from;
        const to = req.body.to;
          
        // Use Mongoose to update the record by its ID using updateOne
        booking.updateOne({name:name}, {arrival:arrival,leaving:leaving,from:from,to:to}, (err) => {
          if (err) {
            res.send('Error updating record');
          } else {
            res.send(`<html>
      <body align="center">
      <h1>Record Updated Successfully.</h1><br><br>
      <center><button><a href="/modify.html">Go Back</a></button></center>
      </body>
      </html>`);
          }
        });
      });
app.get('/updates', (req, res) => {
    res.sendFile(__dirname + '/updates.html');
  });

app.post('/deletes', (req, res) => {
        const recordId = req.body.name;
        // Use Mongoose to delete the record by its ID using deleteOne
        booking.deleteOne({name: recordId}, (err) => {
          if (err) {
            res.send('Error deleting record');
          } else {
            console.log('deleted successfully');
      res.redirect('/modify.html'); 
          }
        });
      });app.get('/deletes', (req, res) => {
  res.sendFile(__dirname + '/deletes.html');
});

app.post('/displays', (req, res) => {
        const name = req.body.name;
        // Use Mongoose to find the specific record by its ID
        booking.findOne({name: name}, (err, bookings) => {
          if (err) {
            res.send('Error finding user');
          } else if (!bookings) {
            res.send('User not found');
          } else {
            res.send(`
            <html>
            <head>
            <title>Display Record</title>
<style>
body{
	    margin:2%;
		height:80%;
        background-image: url('https://img.freepik.com/premium-photo/travelers-looking-phu-tub-berk-mountain-with-mist-thailand_38810-7678.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1697068800&semt=ais');
		background-position: center;
	    background-repeat: no-repeat;
		background-size: cover;
	}
</style>
            </head>
            <body align="center">
              <h1>Record Details</h1>
              <table border="2" align="center" cellspacing="6" cellpadding="6">
                <tr>
                  <td>name</td>
                  <td>${bookings.name}</td>
                </tr>
                <tr>
                  <td>arrival</td>
                  <td>${bookings.arrival}</td>
                </tr>
                <tr>
                  <td>leaving</td>
                  <td>${bookings.leaving}</td>
                </tr>
                <tr>
                  <td>from</td>
                  <td>${bookings.from}</td>
                </tr>
                <tr>
                  <td>to</td>
                  <td>${bookings.to}</td>
                </tr>
                
              </table><br>
              <button><a href="/modify.html">Go Back</a></button><br><br>
            </body>
          </html>
            `);
          }
        });
      });app.get('/displays.html', (req, res) => {
    res.sendFile(__dirname + '/displays.html');
  });

app.post('/displayalls', (req, res) => {
        booking.find({}, (err, records) => {
          if (err) {
            res.send('Error fetching records');
          } else {
            res.send(`
            <html>
            <head>
              <title>All Records</title>
<style>
body{
	    margin:2%;
		height:80%;
        background-image: url('https://img.freepik.com/premium-photo/travelers-looking-phu-tub-berk-mountain-with-mist-thailand_38810-7678.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1697068800&semt=ais');
		background-position: center;
	    background-repeat: no-repeat;
		background-size: cover;
	}
</style>

            </head>
            <body align="center">
              <h1>All Records</h1>
              <table align="center" border="2" cellpadding="3" cellspacing="6">
                <thead>
                    <tr>
                        <th>name</th>
                        <th>arrival</th>
                        <th>leaving</th>
                       
                        <th>from</th>
                        <th>to</th>
            
                    </tr>
                </thead>
                <tbody>
                ${records.map(record => `
                  <tr> 
                    <td>${record.name}</td>  
                    <td>${record.arrival}</td> 
                    <td>${record.leaving}</td>
                   
                    <td>${record.from}</td>
                    <td>${record.to}</td>
                 
                  </tr>
                `).join('')}
                </tbody>
              </table>
              <br><br>
              <br>
              <button><a href="/modify.html">Go Back</a></button>
            </body>
          </html>
            `);
          }
        });
      });

app.get('/displayalls', (req, res) => {
    res.sendFile(__dirname + '/displayalls.html');
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});