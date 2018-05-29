var settings = {
    env: 'QA',
    PORT:4201,
    jwt_private_key: process.env.JWT_PRIVATE_KEY || '9E7D683223A4E4F38348784080823DF58C518D88'
    , encryption_key: process.env.ENCRYPTION_KEY || '062q1tjo2qtefulp1'
    , google: {
        clientId: process.env.GOOGLE_CLIENTID || '378253177522-ac3n148rg62ui415ain90c360dg4esmv.apps.googleusercontent.com'
    }
    , miscrosoft: {
        clientId: process.env.MS_CLIENTID || "597a1bce-04ef-4952-bdbb-0ccf875c7dc4"
        , secret: process.env.MS_SECRET || "23ZVNi9deahq8N0P23U7Nnd"
    }
    , db: {
        server: process.env.DB_SERVER || '10.101.10.36',
        port: process.env.DB_SERVER || 27017,
        name: process.env.DB_NAME || 'coworkings',
    }
    , alert: {
        mail: {
            to: ['kumar.rajat@thinksys.com','l.premchandra@thinksys.com']
        }
    }
}

module.exports = {
    settings: function () {
        // trying to expose readonly setting; //TODO not yet confirm
        return settings;
    }
}