class _response {
    sendResponse = (res, data) => {
        try {
            if(data.code){
                res.status(data.code);
                delete data.code;
                res.send(data)
                return true
            }

            if(data === undefined){
                res.status(404)
                res.send({
                    status: false,
                    error: 'Not Found'
                })
                return false
            }

            res.status(data && data.status ? 200 : 500)
            res.send(data)
            return true

        }catch(error){
            console.error('SendResponse Helper Error: ', error)

            res.status(400).send({
                status: false,
                error
            })
            return false
        }
    }

    errorHandler = (err, req, res, next) => {
        if (err.code === "UnauthorizedError") {
            return res.status(401).send({
                status: false,
                error: "Invalid Token"
            })
        }

        return res.status(500).send({
            status: false,
            error: err.message
        })
    }
}

module.exports = new _response();