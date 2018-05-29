var urlParser = require('url');

function _calculatePagingHandle(offset, limit, total) {

    function _calculatefirst() {
        if (offset > 0 && limit < total)
            return { offset: 0, limit: limit };
        return null;
    }

    function _calculatePrevious() {
        if (offset > 0 && limit < total)
            return { offset: offset - limit <= 0 ? 0 : offset - limit, limit: limit };
        return null;
    }

    function _calculateNext() {
        if (offset < total && limit < total && (offset + limit) < total) {
            var lastOffset = (total / limit) * limit;
            lastOffset = lastOffset < total ? lastOffset : lastOffset - limit;

            var nextOffset = offset + limit;
            nextOffset = nextOffset > lastOffset ? lastOffset : nextOffset;

            return { offset: nextOffset >= total ? total - 1 : nextOffset, limit: limit };
        }
        return null;
    }

    function _calculateLast() {
        if (offset < total && limit < total && (offset + limit) < total) {
            var lastOffset = (total / limit) * limit;
            return { offset: lastOffset < total ? lastOffset : lastOffset - limit, limit: limit };
        }
        return null;
    }

    return {
        first: _calculatefirst(),
        previous: _calculatePrevious(),
        next: _calculateNext(),
        last: _calculateLast()
    };

}


function calculatePaging(currentOffset, currentLimit, totalRecords, originalAbsoluteUrl) {
    var queryObj = urlParser.parse(originalAbsoluteUrl, true);
    queryObj.search = null;

    var handle = _calculatePagingHandle(currentOffset, currentLimit, totalRecords);

    var paging = {
        first: null,
        next: null,
        previous: null,
        last: null
    };
    if (handle.first != null) {
        queryObj.query.offset = handle.first.offset;
        queryObj.query.limit = handle.first.limit;
        paging.first = urlParser.format(queryObj);
    }
    if (handle.next != null) {
        queryObj.query.offset = handle.next.offset;
        queryObj.query.limit = handle.next.limit;
        paging.next = urlParser.format(queryObj);
    }
    if (handle.previous != null) {
        queryObj.query.offset = handle.previous.offset;
        queryObj.query.limit = handle.previous.limit;
        paging.previous = urlParser.format(queryObj);
    }
    if (handle.last != null) {
        queryObj.query.offset = handle.last.offset;
        queryObj.query.limit = handle.last.limit;
        paging.last = urlParser.format(queryObj);
    }

    return paging;
}


module.exports = {
    calculate: calculatePaging
};