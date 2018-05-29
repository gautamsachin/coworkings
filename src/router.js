function createRouter(app) {
    var express = require('express');
    var routeHandler = require('./handlers')
    var config = require('./config');
    var router = express.Router();

    var { membership, company, fileHandler, instagram, facebook, serviceHandler, countryHandler, userLocationHandler, validationHandler } = routeHandler;

    var security = require('./security');
    var imageUpload = require('./utils/multer.config');

    router.post('/token', membership.token());
    router.post('/register', membership.register());

    router.get('/users', membership.authorize([security.claimTypes.admin]), routeHandler.company.list());


    router.get('/location/detect', userLocationHandler.detectLocation());
    router.get('/oauth/facebook', membership.authorize(['Admin', 'User']), routeHandler.facebook.process());
    router.get('/oauth/instagram', membership.authorize(), routeHandler.instagram.process());
    router.get('/countryList', countryHandler.list());

    router.get('/spaces', company.list());
    // preview route when creating (uploading images) space 
    router.get('/spaces/preview/user_:id/:image_name', routeHandler.instagram.previewV2('create'));
    // preview route for annonymouse user or edit
    router.get('/spaces/preview/space_:space_id/:image_name', routeHandler.instagram.previewV2('edit'));
    router.post('/spaces/upload_images/', membership.authorize([security.claimTypes.role_company]), imageUpload.single('space_image'), (req, res, next) => {
        let userId = req.user.identity._id;
        res.send({
            status: 200, data:
            {
                preview: `spaces/preview/user_${userId}/${req.file.filename}`,
                filename: req.file.filename
            }
        });
    });
    router.post('/spaces/create', membership.authorize([security.claimTypes.role_company]),validationHandler.validateSpaceData, company.create());
    router.get('/user/spaces', membership.authorize([security.claimTypes.role_company]), company.listUserSpace());
    router.get('/spaces/services', serviceHandler.getPerksAndFacities());
    router.post('/create_facility', serviceHandler.createFacility());
    router.post('/create_perk', serviceHandler.createPerk());
    router.get('/user/info',membership.authorize([security.claimTypes.role_company]), membership.getUser());
    router.put('/user',membership.authorize([security.claimTypes.role_company]), membership.updateUser())
    router.get('/spaces/search', company.searchSpaces());
    router.get('/spaces/:id', company.getById());
    router.post('/spaces/update/:id', membership.authorize([security.claimTypes.role_company]),validationHandler.validateSpaceData, company.update());
    router.get('/spaces_near', company.getNearByCompanies());
    router.delete('/spaces/:id', company.removeSpace());
    app.use(config.api_paths[0], router);
}

module.exports.inject = createRouter;
