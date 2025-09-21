// client/async_get_all.js
const axios = require('axios');

async function getAll() {
  try {
    const res = await axios.get('http://localhost:5000/customer/');
    console.log("All books:", res.data);
  } catch (err) {
    console.error(err.message);
  }
}
getAll();
