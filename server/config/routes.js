var async = require('async');

module.exports = function(app, passport, auth) {


    //User Routes
    var users = require('../controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);

    //Setting up the users api

    app.get('/api/loggedin', function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });
    app.post('/api/login', passport.authenticate('local'), function(req, res) {
      // successful login, so update last login date
      req.user.last_login = new Date();
      req.user.save(function(err) {
          res.send(req.user);
      });

    });
    app.post('/api/logout', function(req, res) {
      req.logOut();
      res.send(200);
    });
    
    // the following line is used to bootstrap the first user in the database 
    //    which you get to by going to http://localhost:3000/signup then the line
    //    below should probably be removed so no one can create users again
    app.post('/users', users.create);
    
    app.get('/api/users', auth.requiresLogin, users.all); 
    app.post('/api/users', auth.requiresLogin, users.create);
    app.put('/api/users/:userId', auth.requiresLogin, users.update);
    app.get('/api/users/:userId', auth.requiresLogin, users.show);
    
    app.get('/users/me', users.me);
 
    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Client Routes
    var clients = require('../controllers/clients');
    app.get('/api/clients', clients.all);
    app.post('/api/clients', clients.create);
    app.get('/api/clients/:clientId', clients.show);
    app.put('/api/clients/:clientId', auth.requiresLogin, clients.update);

    // this will turn the clientId in the url paramenter into a client object in the req object (req.client)
    app.param('clientId', clients.client);   
    
    // Event Routes
    var events = require('../controllers/events');
    app.get('/api/clients/:clientId/events', events.all);
    app.post('/api/clients/:clientId/events', events.create);
    app.get('/api/clients/:clientId/events/:eventId', events.show);
    app.get('/api/events/:eventId', events.show);
   
    // UserLocation Routes
    var user_locations = require('../controllers/user_locations');
    app.get('/api/events/:eventId/user_locations', user_locations.all);
    app.post('/api/events/:eventId/user_locations', user_locations.create);
    app.get('/api/user_locations/:user_locationId', user_locations.show);
    app.put('/api/user_locations/:user_locationId', user_locations.update);
    app.del('/api/user_locations/:user_locationId', user_locations.destroy);
    app.param('user_locationId', user_locations.user_location);
    
    app.param('eventId', events.event);

    //LiteShow Routes
    //var liteshows = require('../controllers/liteshows');
    //app.get('/api/liteshows', liteshows.all);
    //app.get('/api/liteshows/:liteshowId', liteshows.show);
    //app.param('liteshowId', liteshows.liteshow);
    
    // Shows Routes
    var shows = require('../controllers/shows');
    app.get('/api/events/:eventId/shows', shows.all);
    app.get('/api/events/:eventId/shows/:showId', shows.show);
    app.get('/api/shows/:showId/user_locations/:user_locationId/liteshow', shows.user_liteshow);
    app.get('/api/shows/:showId/user_locations/:user_locationId/liteshow2', shows.user_liteshow2);
    app.put('/api/events/:eventId/shows/:showId', shows.update);
    
    app.param('showId', shows.show);
    
    //EventJoin Routes
    var event_joins = require('../controllers/event_joins');
    app.get('/api/shows/:showId/event_joins', event_joins.all);
    app.post('/api/user_locations/:user_locationId/event_joins', event_joins.create);
    app.get('/api/event_joins/:event_joinId', event_joins.show);
    app.put('/api/event_joins/:event_joinId', event_joins.update);
    
    app.param('event_joinId', event_joins.event_join);

    //Stadium Routes
    var stadiums = require('../controllers/stadiums');
    app.get('/api/stadiums', stadiums.all);
    app.post('/api/stadiums', stadiums.create);
    app.get('/api/stadiums/:stadiumId', stadiums.show);
    app.put('/api/stadiums/:stadiumId', stadiums.update);
    
    app.param('stadiumId', stadiums.stadium);
    
  
    //Home route
    var index = require('../controllers/index');
    app.get('/', index.render);

};
