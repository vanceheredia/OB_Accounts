/* jshint esversion: 6, asi:true */

const noteRoutes = require('./note_routes');

module.exports = function(app, db) {
    noteRoutes(app, db);
}