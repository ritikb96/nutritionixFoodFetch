const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Nutritionix API credentials
const NUTRITIONIX_API_ID = '4245b4d7'; // Replace with your Nutritionix App ID
const NUTRITIONIX_API_KEY = 'fed6a0c95b854d61abc0e8c0d7e2973d'; // Replace with your Nutritionix API Key

// Endpoint to search for a specific food item
app.get('/api/foods/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  try {
    // Make request to Nutritionix API
    const response = await axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
      params: { query: query },
      headers: {
        'x-app-id': NUTRITIONIX_API_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'x-remote-user-id': '0', // Default user ID as per Nutritionix documentation
      }
    });

    // Filter the response to only include exact matches
    const filteredFoods = response.data.common.filter(food => food.food_name.toLowerCase() === query.toLowerCase());

    if (filteredFoods.length === 0) {
      return res.status(404).json({ error: 'No matching food item found' });
    }

    // Extract food names to get detailed information
    const foodNames = filteredFoods.map(food => food.food_name).join(', ');

    // Make request to Nutritionix natural nutrients endpoint
    const nutrientsResponse = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      query: foodNames,
    }, {
      headers: {
        'x-app-id': NUTRITIONIX_API_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'x-remote-user-id': '0', // Default user ID as per Nutritionix documentation
      }
    });

    // Map the response data to extract relevant nutritional information
    const foods = nutrientsResponse.data.foods.map(food => ({
      food_name: food.food_name,
      serving_qty: food.serving_qty,
      serving_unit: food.serving_unit,
      serving_weight_grams: food.serving_weight_grams,
      nf_calories: food.nf_calories,
      nf_total_fat: food.nf_total_fat,
      nf_saturated_fat: food.nf_saturated_fat,
      nf_cholesterol: food.nf_cholesterol,
      nf_sodium: food.nf_sodium,
      nf_total_carbohydrate: food.nf_total_carbohydrate,
      nf_dietary_fiber: food.nf_dietary_fiber,
      nf_sugars: food.nf_sugars,
      nf_protein: food.nf_protein,
      nf_potassium: food.nf_potassium,
      nf_p: food.nf_p,
    }));

    res.json(foods);
  } catch (error) {
    console.error('Error fetching data from Nutritionix API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch data from Nutritionix API' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


//4245b4d7
//
//fed6a0c95b854d61abc0e8c0d7e2973d