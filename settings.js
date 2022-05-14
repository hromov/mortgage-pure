'use strict';

import { getBanks } from './api.js';

const banks_table = document.querySelector('#banks_table');

// const headerList = ['name', 'term', 'interest', 'min_down', 'max_loan']

class BanksTable {
    constructor(banks) {
        this.banks = Array.from(banks)
    }

    get() {
        console.log(this.banks)
        const table = document.createElement('table')
        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')
        let keys = [];
        if (this.banks.length > 0) {
            keys = Object.keys(this.banks[0])
            console.log(keys)
        }
        console.log(keys)
        const headerRow = document.createElement('tr')
        for (const key of keys) {
            headerRow.appendChild(this.getCell(key), true)
        }
        thead.appendChild(headerRow)
        for(const bank of this.banks) {
            const row = document.createElement('tr')
            keys.forEach(key => {
                const val = bank[key]
                const cell = this.getCell(val)
                row.appendChild(cell, false)
                if (key === 'id') {
                    row.className = `id-${val}`
                }
            })
            tbody.appendChild(row)
        }
        table.append(thead, tbody)
        return table
    }
    
    getCell(text, isHeader) {
        const cell = isHeader ? document.createElement('th') : document.createElement('td')
        const floatValue = parseFloat(text)
        const intValue = parseInt(text)
        if (floatValue && !intValue) {
            cell.innerText = `${floatValue * 100}%`
        } else {
            cell.innerText = text
        }
        return cell
    }    
}

let banksTable = null;

const init = () => {
    getBanks()
        .then(banks => {
            banksTable = new BanksTable(banks);
            const t = banksTable.get();
            banks_table.appendChild(t);

            console.log(banks);
        })
        .catch(err => console.log(err));
}

init();