'use strict';

const Email = 'manager@whatthepitta.com';
const Password = 'whatthepitta';

const VegerunHost = 'localhost';
const VegerunPort = 5000;

const ApiPath = '/api';
const RestaurantApi = ApiPath + '/restaurants';

const TokenPath = ApiPath + '/token';
const HeartbeatPath = RestaurantApi + '/heartbeat';


const requestPromise = require('request-promise');

function createVegerunUri(path) {
    return 'http://' + VegerunHost + ':' + VegerunPort + path;
}

function createVegerunRequestPromise(uri, token, options) {
    return requestPromise({
        uri,
        method: options.method,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
}

let tokenPromise = requestPromise({
    uri: createVegerunUri(TokenPath),
    method: 'POST',
    form: {
        email: Email,
        password: Password
    },
    json: true
}).then(result => ({
    jwt: result.access_token,
    restaurantId: result.restaurant_id
}));

tokenPromise
    .then(result => {
        return createVegerunRequestPromise(
            createVegerunUri(HeartbeatPath + '/' + result.restaurantId),
            result.jwt,
            {
                method: 'POST'
            });
    })
    .then(() => {
        console.log('Heatbeat successful with restaurant id set');
    });

tokenPromise
    .then(result => {
        return createVegerunRequestPromise(
            createVegerunUri(HeartbeatPath),
            result.jwt,
            {
                method: 'POST'
            });
    })
    .then(() => {
        console.log('Heatbeat successful with restaurant id read from jwt');
    });