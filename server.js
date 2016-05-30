////////////////////
// SERVER SIDE JS //
////////////////////

// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/


/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// /*
//  * JSON API Endpoints
//  *
//  * The comments below give you an idea of the expected functionality
//  * that you need to build. These are basic descriptions, for more
//  * specifications, see the todosTest.js file and the outputs of running
//  * the tests to see the exact details. BUILD THE FUNCTIONALITY IN THE
//  * ORDER THAT THE TESTS DICTATE.
//  */
//
// app.get('/api/todos/search', function search(req, res) {
//   /* This endpoint responds with the search results from the
//    * query in the request. COMPLETE THIS ENDPOINT LAST.
//    */
// });
//
// app.get('/api/todos', function index(req, res) {
//   /* This endpoint responds with all of the todos
//    */
// });
//
// app.post('/api/todos', function create(req, res) {
//   /* This endpoint will add a todo to our "database"
//    * and respond with the newly created todo.
//    */
// });
//
// app.get('/api/todos/:id', function show(req, res) {
//   /* This endpoint will return a single todo with the
//    * id specified in the route parameter (:id)
//    */
// });
//
// app.put('/api/todos/:id', function update(req, res) {
//   /* This endpoint will update a single todo with the
//    * id specified in the route parameter (:id) and respond
//    * with the newly updated todo.
//    */
// });
//
// app.delete('/api/todos/:id', function destroy(req, res) {
//   /* This endpoint will delete a single todo with the
//    * id specified in the route parameter (:id) and respond
//    * with success.
//    */
// });

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('Server running on http://localhost:3000');
});
