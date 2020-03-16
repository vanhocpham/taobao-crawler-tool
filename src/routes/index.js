const router = require( "express" ).Router();




router.get('/404', ( req, res ) => {
  res.render('auth/404')
});

module.exports = router;