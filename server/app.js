const express = require('express');
const cors = require('cors');
const foods = require('./routes/api/foods');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/foods', foods);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
