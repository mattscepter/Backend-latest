function isObject(value) {
    let type = typeof value
    return !!value && (type == 'object' || type == 'function')
}

function toObject(value) {
    return isObject(value) ? value : Object(value)
}

function createBaseFor(fromRight) {
    return function (object, iteratee, keysFunc) {
        let iterable = toObject(object),
            props = keysFunc(object),
            length = props.length,
            index = fromRight ? length : -1

        while (fromRight ? index-- : ++index < length) {
            let key = props[index]
            if (iteratee(iterable[key], key, iterable) === false) {
                break
            }
        }
        return object
    }
}

let baseFor = createBaseFor()

function keysIn(object) {
    if (object == null) {
        return []
    }
    if (!isObject(object)) {
        object = Object(object)
    }
    let length = object.length
    length =
        (length &&
            isLength(length) &&
            (isArray(object) || isArguments(object)) &&
            length) ||
        0

    let Ctor = object.constructor,
        index = -1,
        isProto = typeof Ctor == 'function' && Ctor.prototype === object,
        result = Array(length),
        skipIndexes = length > 0

    while (++index < length) {
        result[index] = index + ''
    }
    for (let key in object) {
        if (
            !(skipIndexes && isIndex(key, length)) &&
            !(
                key == 'constructor' &&
                (isProto || !hasOwnProperty.call(object, key))
            )
        ) {
            result.push(key)
        }
    }
    return result
}

function bindCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
        return identity
    }
    if (thisArg === undefined) {
        return func
    }
    switch (argCount) {
        case 1:
            return function (value) {
                return func.call(thisArg, value)
            }
        case 3:
            return function (value, index, collection) {
                return func.call(thisArg, value, index, collection)
            }
        case 4:
            return function (accumulator, value, index, collection) {
                return func.call(thisArg, accumulator, value, index, collection)
            }
        case 5:
            return function (value, other, key, object, source) {
                return func.call(thisArg, value, other, key, object, source)
            }
    }
    return function () {
        return func.apply(thisArg, arguments)
    }
}

function createForIn(objectFunc) {
    return function (object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
            iteratee = bindCallback(iteratee, thisArg, 3)
        }
        return objectFunc(object, iteratee, keysIn)
    }
}

const _ = {
    forIn: createForIn(baseFor)
}
module.exports = {
    _
}
