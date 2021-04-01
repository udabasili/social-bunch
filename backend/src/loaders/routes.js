const routes = require('../api/routes')
const middlewares = require('../api/middlewares')
const rateLimit = require("express-rate-limit");


module.exports = function(app){
    app.use('/api/auth', routes.authRoute)
    app.use('/api/public', routes.publicRoute)
    app.use('/api/users/:userId', 
        middlewares.authHandler.protectedRoute,
        middlewares.authHandler.setCurrentUser,
        routes.userRoute
    )
    app.use('/api/all-users', routes.usersRoute)
    app.use(
        '/api/user/:userId',
        middlewares.authHandler.protectedRoute,
        middlewares.authHandler.setCurrentUser,
        routes.postRoute
    )
    app.use('/api/user/:userId/',
        middlewares.authHandler.setCurrentUser,
        middlewares.authHandler.protectedRoute,
        routes.eventRoute);
    app.use('/api/user/:userId/',
        middlewares.authHandler.setCurrentUser,
        middlewares.authHandler.protectedRoute,
        routes.groupRoute);
    app.use(
        '/api/user/:userId',
        middlewares.authHandler.protectedRoute,
        middlewares.authHandler.setCurrentUser,
        routes.commentRoute
    )
    app.use(
        '/api/user/:userId',
        middlewares.authHandler.protectedRoute,
        middlewares.authHandler.setCurrentUser,
        routes.messageRoute
    )
    app.use(
        '/api/user/:userId',
        middlewares.authHandler.protectedRoute,
        middlewares.authHandler.setCurrentUser,
        routes.notificationRoute
    )
    app.get('/api/verify-user/', middlewares.authHandler.confirmAuthentication)
    app.get('/api/refresh-token/:userId', middlewares.authHandler.refreshAccessToken)
    app.use(middlewares.errorHandler)
}