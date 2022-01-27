const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


/**
 * GET route template
 */
router.get('/', (req, res) => {
  console.log('In GET allUsers');
  const query = `SELECT 
                  "user".first_name AS first_name,
                  "user".last_name AS last_name,
                  "user".username AS email,
                  "user".role AS role
                  FROM "user"
                  ORDER BY last_name;`
  pool.query(query)
  .then( result => {
  res.send(result.rows);
  })
  .catch(err => {
  console.log('ERROR: GET allUsers', err);
  res.sendStatus(500)
  })
});


module.exports = router;