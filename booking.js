const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port =  3001;

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/booking", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a Mongoose schema for the booking data
const bookingSchema = new mongoose.Schema({
  name: String,
  arrival: Date,
  leaving: Date,
  places: String,
});

const Booking = mongoose.model('Booking', bookingSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handle form submission
app.post('/booking', (req, res) => {
  // Extract data from the form submission
  const { name, arrival, leaving, places } = req.body;

  // Create a new booking document
  const newBooking = new Booking({
    name: name,
    arrival: arrival,
    leaving: leaving,
    places: places,
  });

  // Save the booking to MongoDB
  newBooking.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect after successfully saving the booking
      res.redirect('/1srpade.html');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
