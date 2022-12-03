const tinTucRouter = require('./tintucs');
const siteRouter = require('./site');
const duLichRouter = require('./dulich');
const tourRouter = require('./tour');
const adminTourRouter = require('./adminTour');
const adminRouter = require('./admin');
const khamPhaRouter = require('./khampha');
const leHoiRouter = require('./lehoi');
const hotelRouter = require('./hotel');

function route(app) {
    app.use('/le-hoi', leHoiRouter);
    app.use('/du-lich', duLichRouter);
    app.use('/tin-tuc', tinTucRouter);
    app.use('/kham-pha', khamPhaRouter);
    app.use('/tour', tourRouter);
    app.use('/khach-san', hotelRouter);
    app.use('/chu-tour', adminTourRouter);
    app.use('/admin', adminRouter);
    app.use('/', siteRouter);
}

module.exports = route;
