'use strict'

const server_path = 'https://back-dot-mortgage-test-347507.lm.r.appspot.com/banks'

const httpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(method, url)

        xhr.responseType = 'json'

        if (data !== undefined) {
            xhr.setRequestHeader('Content-Type', 'application/json')
        }

        xhr.onload = () => {
            resolve(xhr.response)
        }

        xhr.onerror = () => {
            reject(xhr.reject)
        }

        xhr.send(JSON.stringify(data))
    })
    return promise
}

export function getBanks() {
    return httpRequest('GET', server_path, null)
}

export function saveBank(bank) {
    if (bank.id !== null) {
        return httpRequest('PUT', `${server_path}/${bank.id}`, bank)
    }
    return httpRequest('POST', server_path, bank)
}

export function deleteBank(id) {
    return httpRequest('DELETE', `${server_path}/${id}`, null)
}