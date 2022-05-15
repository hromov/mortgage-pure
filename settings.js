'use strict'

import { getBanks, saveBank, deleteBank } from './api.js'

const banks_table = document.querySelector('#banks_table')

const modal_container = document.querySelector('#modal_container')
const modal_inner = document.querySelector('#modal_inner')
const modal_field_name = modal_inner.querySelector('#name')
const modal_field_interest = modal_inner.querySelector('#interest')
const modal_field_max_loan = modal_inner.querySelector('#max_loan')
const modal_field_min_down = modal_inner.querySelector('#min_down')
const modal_field_term = modal_inner.querySelector('#term')

const save_button = modal_inner.querySelector('#save')
const delete_button = modal_inner.querySelector('#delete')
const add_button = document.querySelector('#add')

const errorBlock = document.querySelector('#error_block');

const class_prefix = 'bank_'

let banksTable

class BanksTable {
    constructor(banks) {
        this.banks = [...banks]
        this.currentBank = null
    }

    get() {
        const table = document.createElement('table')
        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')
        let keys = []
        if (this.banks.length > 0) {
            keys = Object.keys(this.banks[0])
        }
        const headerRow = document.createElement('tr')
        keys.forEach((key) => headerRow.appendChild(createCell(key, true)))
        
        thead.appendChild(headerRow)
        this.banks.forEach((bank) => {
            const row = document.createElement('tr')
            keys.forEach((key) => {
                const val = bank[key]
                const cell = createCell(val, false)
                row.appendChild(cell)
                if (key === 'id') {
                    row.className = `${class_prefix}${val}`
                    cell.className = 'id_col'
                    cell.title = val
                }
            })
            tbody.appendChild(row)
        })
        table.className = "mat-elevation-z8"
        table.append(thead, tbody)
        return table
    }

    changeBank(id) {
        if (id !== null) {
            this.currentBank = this.banks.filter((bank) => bank.id === id)[0]
            modal_field_interest.value = Math.round(this.currentBank.interest * 100)
            modal_field_name.value = this.currentBank.name
            modal_field_max_loan.value = this.currentBank.max_loan
            modal_field_min_down.value = Math.round(this.currentBank.min_down * 100)
            modal_field_term.value = this.currentBank.term
        } else {
            modal_field_interest.value = 10
            modal_field_name.value = 'New Bank Name'
            modal_field_max_loan.value = 100000
            modal_field_min_down.value = 30
            modal_field_term.value = 12
        }
        showModal()
    }

    saveCurrent() {
        const bank = {
            id: this.currentBank ? this.currentBank.id : null,
            name: modal_field_name.value,
            interest: parseFloat(modal_field_interest.value / 100),
            max_loan: parseInt(modal_field_max_loan.value),
            min_down: parseFloat(modal_field_min_down.value / 100),
            term: parseInt(modal_field_term.value),
        }
        saveBank(bank).then(() => document.location.reload(true)).catch((err) => showModalError(`Can't save bank error: ${err}`))
    }

    deleteCurrent() {
        if (this.currentBank !== undefined) {
            deleteBank(this.currentBank.id).then(() => document.location.reload(true)).catch((err) => showModalError(`Can't delete bank error: ${err}`))
        }  else {
            showModalError(`Bank has to be saved first`)
        }
        
    }
}

const createCell = (text, isHeader = false) => {
    const cell = isHeader ? document.createElement('th') : document.createElement('td')
    const floatValue = parseFloat(text)
    const intValue = parseInt(text, 10)
    if (floatValue > 0 && intValue === 0) {
        cell.innerText = `${Math.round(floatValue * 100)}%`
    } else {
        cell.innerText = text
    }
    return cell
}

const showModal = () => modal_container.classList.add('show')

modal_inner.addEventListener('click', (e) => e.stopImmediatePropagation())

modal_container.addEventListener('click', () => {
    if (confirm('All unsaved changes will be lost! Close the dialog?')) {
        modal_container.classList.remove('show')
    }
})

save_button.addEventListener('click', (e) => {
    e.preventDefault()
    banksTable.saveCurrent()
})

delete_button.addEventListener('click', (e) => {
    e.preventDefault()
    banksTable.deleteCurrent()
})

add_button.addEventListener('click', () => banksTable.changeBank(null))

const getBankID = (class_name) => class_name.replace(class_prefix, '')

const showModalError = (text) => errorBlock.innerText = text

const init = () => {
    getBanks()
        .then((banks) => {
            banksTable = new BanksTable(banks)
            const t = banksTable.get()
            banks_table.appendChild(t)
            const rows = t.querySelector('tbody').querySelectorAll('tr')
            rows.forEach((row) => row.addEventListener('click', () => {
                const bank_id = getBankID(row.className)
                banksTable.changeBank(bank_id)
            }))
        })
        .catch((err) => {
            if (confirm(`Critical error: ${err}. Try to reload the page?`)) {
                location.reload(true)
            }
        })
}

init()