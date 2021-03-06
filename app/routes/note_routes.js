/* jshint esversion: 6, asi:true */ 

var ObjectID = require('mongodb').ObjectID;
var swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

module.exports = function(app, db) {

    // swagger definition
    var swaggerDefinition = {
        info: {
            title: 'ANZ DEMO - API Developer ',
            version: '1.0.0',
            description: 'ANZ DEMO - Auto generated Swagger documentation for the Account Management API.  This is part of an E2E API DevOps Toolset demo',
        },
//        host: 'notabledemo.azurewebsites.net',
//      host: 'localhost:8080',
        host: 'api-cicd-anz-demo.azurewebsites.net',
        basePath: '/',
  };
  
  // options for the swagger docs
  var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./**/routes/*.js', './app/routes/notes_routes.js', 'note_routes.js'],// pass all in array 
  
    };
  
    // initialize swagger-jsdoc
    var swaggerSpec = swaggerJSDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/', (req, res) => {
        res.end(`
        <!doctype html>
        <html>
        <head>
        <style>
        #account-form{
            border-radius: 5px;
            background-color: #f2f2f2;
            padding: 50px;
         }
         .col-25 {
            float: center;
            width: 50%;
            margin: auto;}
          
          .l1{
             width: 30%;
            margin: auto;
            display: block;
            padding: 10px;
          
          }
          #title{
            text-align: center;
          }
            body{background-color: #53C4EF;}
            label {
                padding: 12px 12px 12px 0;
                display: inline-block;
              input[type=text]{
                  text-align:center;
                  display: block;
                  margin: 0 0 1em 0;
                  width: 90%; 
                  border: 1px solid #818181;
                  padding: 5px;
              }
              
             
              
              .b {
                  border: 2px solid blue;
                  background-color: lightblue;
                  padding: 10px;
                  text-align: center;
              }
        </style>
        </head>
        <body>
            
            <h1 id="title"> Create an account </h1><br /><br />

            <form id="account-form" class="col-25" action="/accounts" method="post">
                <label>Account Name:</label> <input class="l1" type="text" name="title" />
                <label>Account Number:</label> <input class="l1" type="text" name="body" />
                <label>Funds:</label> <input type="text" class="l1" name="funds" /><br />
                <button class="l1 b">Save</button>
            </form>
            
        </body>
        </html>
    `);
    })
    
/**
 * @swagger
 * definition:
 *   accounts:
 *     properties:
 *       title <Account Name>:
 *         type: string
 *       body <Account Number>:
 *         type: string
 *       funds <Account Funds>:
 *         type: integer
 */

    /**
     * @swagger
     * /accounts/{id}:
     *   get:
     *     tags:
     *       - account
     *     description: Returns a single account
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Username to use for login.
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: A single account object
     *         schema:
     *           $ref: '#/definitions/accounts'
     */
    app.get('/accounts/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};

        var output =  db.collection('notes').findOne(details, (err, item) => {
            if(err) {
                res.send({'error': 'An error has occurred'});
            } else {
                
                if (item == null || item == 'undefined') {
                    res.status(404);
                }
                res.json(item);
            }
        });
    });

    /**
     * @swagger
     * /accounts:
     *   get:
     *     tags:
     *       - account
     *     description: Returns all accounts
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All account objects
     *         schema:
     *           $ref: '#/definitions/accounts'
     */
    app.get('/accounts', (req, res) => {
        //calls the DB 'notes', gets a list of all the items, returns it to an array ant then stores it into docs as a JSON object
        var output = db.collection('notes').find().toArray(function(err, docs){
            if (err) {
                    console.log("In ERROR SECTION");
                    res.send(err);
                } else {
                    //db.close(); // this line cause the DB to have problems as we dont re-initiate the connection
                    console.log("going to return stuff");
                    res.json(docs);
                }
        });
    });

    /**
     * @swagger
     * /accounts:
     *   post:
     *     tags:
     *       - account
     *     description: Creates a new account
     *     produces:
     *       - application/json
     *     consumes:
     *       - application/x-www-form-urlencoded 
     *     parameters:    
     *       - name: title
     *         in: formData
     *         description: Account_Name
     *         required: true
     *         type: string
     *       - name: body
     *         in: formData
     *         description: Account_Number
     *         required: true
     *         type: string
     *       - name: funds
     *         in: formData
     *         description: Account_Funds
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Newly created account object
     *         schema:
     *           $ref: '#/definitions/accounts'
     */
    app.post('/accounts', (req, res) => {
        var output = "";
        const note = {text: req.body.body, title: req.body.title, funds: parseFloat(req.body.funds)};

//        console.log(req);
        output = db.collection('notes').insert(note, (err, result) => {
//            console.log("OUput of Post");
//            console.log(result);
            if(err) {
                res.status(500);
                res.send({'error': 'An error has occurred'});
            } else {
                res.status(200);
//                console.log(result.ops);
//                console.log(result.ops[0]._id);
//                console.log(result.insertedIds[0]);
                res.send({'ACCOUNT ID CREATED': result.insertedIds[0]});
            }
        });
    });

// Pasting in the Delete Function
    

    /**
     * @swagger
     * /accounts/{id}:
     *   delete:
     *     tags:
     *       - account
     *     description: Deletes an account
     *     produces:
     *       - application/json
     *     consumes:
     *       - application/x-www-form-urlencoded 
     *     parameters:
     *       - name: id
     *         description: Username to use for login.
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: String response indicating deletion success
     *         schema:
     *           $ref: '#/definitions/accounts'
     *       404:
     *         description: String response indicating user not found
     *         schema:
     *           $ref: '#/definitions/accounts'       
     *       500:
     *         description: String response indicating Internal Server Error
     *         schema:
     *           $ref: '#/definitions/accounts'       
     */
    app.delete('/accounts/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        let outcome = db.collection('notes').deleteOne(details, (err, item) => {
            if(err) {
                res.status(500);
                res.send({'ERROR': 'An error has occurred'});
            } else {
                if(item.deletedCount == 1){
                    res.status(200);
                    res.send({'ID ': 'has been deleted'});
                }else{
                    res.status(404);
                    res.send({'ERROR': 'Record not found'});
                }
            }
        });
    });

    /**
     * @swagger
     * /accounts/{id}:
     *   put:
     *     tags:
     *       - account
     *     description: Updates an exisiting account
     *     produces:
     *       - application/json
     *     consumes:
     *       - application/x-www-form-urlencoded 
     *     parameters:
     *       - name: id
     *         description: Username to use for login.
     *         in: path
     *         required: true
     *         type: string
     *       - name: title
     *         in: formData
     *         description: Account_Name
     *         required: true
     *         type: string
     *       - name: body
     *         in: formData
     *         description: Account_Number
     *         required: true
     *         type: string
     *       - name: funds
     *         in: formData
     *         description: Account_Funds
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: A single account object
     *         schema:
     *           $ref: '#/definitions/accounts'
     */
    app.put('/accounts/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
//        const note = {text: req.body.body, title: req.body.title};
        const note = {text: req.body.body, title: req.body.title, funds: parseFloat(req.body.funds)};

        db.collection('notes').update(details, note, (err, result) => {
            if(err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(note);
            }
        });
    });

    // serve swagger 
    app.get('/swagger.json', function(req, res) {   
        res.setHeader('Content-Type', 'application/json');   
        res.send(swaggerSpec); 
    });
};
