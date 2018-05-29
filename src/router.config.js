var router = require('express').Router(),
    { createPromiseRoute } = require('./route.util');



module.exports = {
    get: (path, func) => router.get(path, createPromiseRoute(func)),
    post: (path, func) => router.post(path, createPromiseRoute(func)),
    use: (func) => router.use(createPromiseRoute(func)),
    router: router

}