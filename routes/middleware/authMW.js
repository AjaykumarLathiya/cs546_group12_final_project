async function authMW(req, res, next) {
    if (["/public", "/login"].some((publicPath) => req.path.startsWith(publicPath)) || req.path === "/") {
        next()
        return;
    }
    if (!req.session || (req.session && !req.session.objUser)) {
        res.redirect('/login')
        return;
    }
    req.objUser = req.session.objUser;
    next()
}

module.exports = authMW;