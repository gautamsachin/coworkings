var settings = {
    env: 'STG',
    PORT:4201,
    jwt_private_key: process.env.JWT_PRIVATE_KEY || 'B6190815CD99BDD2FDF4D81FCEABD95FFB1D3E5C'
    , encryption_key: process.env.ENCRYPTION_KEY || '062q1tjo2qtefulp1'
    , google: {
        clientId: process.env.GOOGLE_CLIENTID || '16224258704-muj6smjih774vhd7dtt8l22nf0vasulq.apps.googleusercontent.com'
    }
    , miscrosoft: {
        clientId: process.env.MS_CLIENTID || "1a9a6558-a87a-49ac-9e5b-4af5bfb4faae"
        , secret: process.env.MS_SECRET || "acmuHUiU9vCnBErEjqUXpyi"
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