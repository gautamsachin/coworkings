module.exports = {
    api_paths: ['/api/v1/'],
    alert: {
        mail: {
            from: 'tstpremcoworkings@gmail.com'
        },
        smtpSetting: {
            host: "smtp.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
                user: "tstpremcoworkings@gmail.com",
                pass: "thinksys@123"
            },
            tls: {
                ciphers: 'SSLv3'
            }
        }
    },
    space_asset: {
        img_temp: 'space_images_temp',
        img_destination: 'space_images'
    }

} // currently no common settings