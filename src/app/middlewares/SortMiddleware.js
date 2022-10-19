export default function SortMiddleware(res, req, next) {
    res.locals._sort = {
        enabled: false,
        type: 'default'
    };

    if (res.query.hasOwnProperty('_sort')){
        Object.assign(res.locals._sort, {
            enabled: true,
            type: res.query.type,
            column: res.query.column
        });
    }


    next();
}