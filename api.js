'use strict';

const server_path = 'https://back-dot-mortgage-test-347507.lm.r.appspot.com/banks';

const httpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url);

        xhr.responseType = 'json';

        if (data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.onload = () => {
            resolve(xhr.response);
        }

        xhr.onerror = () => {
            reject(xhr.reject);
        }

        xhr.send();
    });
    return promise;
}

export const getBanks = () => httpRequest('GET', server_path, null);