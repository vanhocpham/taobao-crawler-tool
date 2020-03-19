const router = require( "express" ).Router();
const CrawlController = require( "../controllers/crawlerImages.controller" );

router.post( "/download", CrawlController.index )

router.get('/404', ( req, res ) => {
  res.render('auth/404')
});
router.get('/', ( req, res ) => {
  res.render('index')
});

router.get('/test', ( req, res ) => {
  res.render('test')
});


module.exports = router;