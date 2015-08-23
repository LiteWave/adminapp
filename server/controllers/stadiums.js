/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Stadium = mongoose.model('Stadium'),
    _ = require('underscore');


/**
 * Find stadium by id
 */
exports.stadium = function (req, res, next, id)
{
  Stadium.load(id, function (err, stadium)
  {
    if (err) return next(err);
    if (!stadium) return next(new Error('Failed to load stadium ' + id));
    req.stadium = stadium;
    next();
  });
};

/**
 * 
 */
exports.create = function (req, res)
{
  var stadium = new Stadium(req.body);
  console.log('Stadium:Create:stadium.name=' + stadium.name);

  stadium.save(function (err)
  {
    console.log('Stadium:Create:err=' + err);
    if (err)
    {
      return res.send('stadiums', {
        errors: err.errors,
        stadium: stadium
      });
    }
    else
    {
      res.jsonp(stadium);
    }
  });
};

/**
 * Update a stadium
 */
exports.update = function (req, res)
{
  var stadium = req.stadium;
  stadium = _.extend(stadium, req.body);
  stadium.save(function (err)
  {
    res.jsonp(stadium);
  });
};


/**
 * Delete an stadium
 */
exports.destroy = function (req, res)
{
  var stadium = req.stadium;

  stadium.remove(function (err)
  {
    if (err)
    {
      res.render('error', {
        status: 400
      });
    } else
    {
      res.jsonp(stadium);
    }
  });
};

/**
 * Show a stadium
 */
exports.show = function (req, res)
{
  res.jsonp(req.stadium);
};

/**
 * Show a stadium by client id
 */
exports.showbyclient = function (req, res)
{
  Stadium.find({ _clientId: req.client._id }).exec(function (err, stadiums)
  {
    if (err)
    {
      res.render('error', {
        status: 404
      });
    } else
    {
      res.jsonp(stadiums);
    }
  });
};

/**
 * List of Stadiums 
 */
exports.all = function (req, res)
{
  Stadium.find().exec(function (err, stadiums)
  {
    if (err)
    {
      res.render('error', {
        status: 404
      });
    } else
    {
      res.jsonp(stadiums);
    }
  });
};