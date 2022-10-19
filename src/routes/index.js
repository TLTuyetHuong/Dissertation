const tinTucRouter = require('./tintucs');
const siteRouter = require('./site');
const duLichRouter = require('./dulich');
const tourRouter = require('./tour');
const adminRouter = require('./admin');
const khamPhaRouter = require('./khampha');
const leHoiRouter = require('./lehoi');

function route(app) {
    app.use('/le-hoi', leHoiRouter);
    app.use('/du-lich', duLichRouter);
    app.use('/tin-tuc', tinTucRouter);
    app.use('/kham-pha', khamPhaRouter);
    app.use('/tour', tourRouter);
    app.use('/admin', adminRouter);
    app.use('/', siteRouter);
}

module.exports = route;
