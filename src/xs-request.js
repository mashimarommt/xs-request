(function () {
    var xs = {};

    xs.config = {
        networkTimeout: 60000
    };

    var objectToQueryString = function (object) {
        var queryStringArray = [];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                queryStringArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(object[key]));
            }
        }
        return queryStringArray.join("&");
    };

    xs.request = function (object) {
        var url = object.url || "";
        var data = object.data || "";
        var header = object.header || {};
        var method = object.method || "GET";
        var dataType = object.dataType || "json";
        var responseType = object.responseType || "text";
        var success = object.success || null;
        var fail = object.fail || null;
        var complete = object.complete || null;

        var response = {};

        var xhr = new XMLHttpRequest();

        xhr.onerror = function () {
            response.errMsg = "request:fail";
            if (typeof fail === "function") {
                fail(response);
            }
            if (typeof complete === "function") {
                complete(response);
            }
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                response.errMsg = "request:ok";
                response.statusCode = xhr.status;
                if (dataType.toLowerCase() === "json") {
                    try {
                        response.data = JSON.parse(xhr.response);
                    } catch (e) {
                        response.data = xhr.response;
                    }
                } else {
                    response.data = xhr.response;
                }
                if (typeof success === "function") {
                    fail(response);
                }
                if (typeof complete === "function") {
                    complete(response);
                }
            }
        };

        xhr.ontimeout = function () {
            response.errMsg = "request:fail timeout";
            if (typeof fail === "function") {
                fail(response);
            }
            if (typeof complete === "function") {
                complete(response);
            }
        };

        if (url && typeof url === "string") {
            if (method.toUpperCase() === "GET") {
                if (data && typeof data === "object") {
                    xhr.open(method, url + "?" + objectToQueryString(data));
                } else {
                    xhr.open(method, url);
                }
                for (var key in header) {
                    if (header.hasOwnProperty(key)) {
                        xhr.setRequestHeader(key, header[key]);
                    }
                }
                if (responseType.toLowerCase() === "arraybuffer") {
                    xhr.responseType = "arraybuffer";
                }
                xhr.timeout = xs.config.networkTimeout;
                xhr.send();
            } else if (method.toUpperCase() === "HEAD" || method.toUpperCase() === "CONNECT" || method.toUpperCase() === "OPTIONS" || method.toUpperCase() === "TRACE") {
                xhr.open(method, url);
                xhr.timeout = xs.config.networkTimeout;
                xhr.send();
            } else if (method.toUpperCase() === "POST" || method.toUpperCase() === "PUT" || method.toUpperCase() === "PUT") {
                xhr.open(method, url);
                var contentType = "";
                for (var key in header) {
                    if (header.hasOwnProperty(key)) {
                        xhr.setRequestHeader(key, header[key]);
                        if (key.toLowerCase() === "content-type") {
                            if (header[key].toLowerCase().indexOf("application/x-www-form-urlencoded") > -1) {
                                contentType = "application/x-www-form-urlencoded";
                            } else if (header[key].toLowerCase().indexOf("multipart/form-data") > -1) {
                                contentType = "multipart/form-data";
                            }
                        }
                    }
                }
                if (data && typeof data === "string") {
                    if (responseType.toLowerCase() === "arraybuffer") {
                        xhr.responseType = "arraybuffer";
                    }
                    xhr.timeout = xs.config.networkTimeout;
                    xhr.send(data);
                } else if (data && data instanceof "ArrayBuffer") {
                    if (responseType.toLowerCase() === "arraybuffer") {
                        xhr.responseType = "arraybuffer";
                    }
                    xhr.timeout = xs.config.networkTimeout;
                    xhr.send(data);
                } else if (data && typeof data === "object") {
                    if (contentType === "application/x-www-form-urlencoded") {
                        xhr.send(objectToQueryString(data));
                    } else if (contentType === "multipart/form-data") {
                        var formData = new FormData();
                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                formData.append(encodeURIComponent(key), encodeURIComponent(data[key]));
                            }
                        }
                        if (responseType.toLowerCase() === "arraybuffer") {
                            xhr.responseType = "arraybuffer";
                        }
                        xhr.timeout = xs.config.networkTimeout;
                        xhr.send(formData);
                    } else {
                        if (responseType.toLowerCase() === "arraybuffer") {
                            xhr.responseType = "arraybuffer";
                        }
                        xhr.timeout = xs.config.networkTimeout;
                        xhr.send(JSON.stringify(data));
                    }
                } else {
                    if (responseType.toLowerCase() === "arraybuffer") {
                        xhr.responseType = "arraybuffer";
                    }
                    xhr.timeout = xs.config.networkTimeout;
                    xhr.send();
                }
            } else {
                if (typeof fail === "function") {
                    response.errMsg = "request:fail invalid method";
                    fail(response);
                }
                if (typeof complete === "function") {
                    response.errMsg = "request:fail invalid method";
                    complete(response);
                }
            }
        } else {
            if (typeof fail === "function") {
                response.errMsg = "request:fail invalid url";
                fail(response);
            }
            if (typeof complete === "function") {
                response.errMsg = "request:fail invalid url";
                complete(response);
            }
        }

        return xhr;
    };

    window.xs = xs;
})();
