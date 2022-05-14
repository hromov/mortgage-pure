'use strict';
import { httpRequest } from "./xhr.js";

const server_path = 'https://back-dot-mortgage-test-347507.lm.r.appspot.com/banks';

const bankSelector = document.querySelector('#bank_selector');
const infoBlock = document.querySelector('#info');
const errorBlock = document.querySelector('#error_block');

const loanField = document.querySelector('#loan');
const downField = document.querySelector('#down');

let banksList = [];
let selectedBank = null;

class Bank {
    constructor(bank) {
        this.maxLoan = bank.max_loan;
        this.minDown = bank.min_down;
        this.term = bank.term;
        this.name = bank.name;
        this.rate = bank.interest;
    }

    getName() {
        return this.name;
    }

    toString() {
        return `Bank can provide you with loan up to $${this.maxLoan} for ${this.term} month. Minimal down is ${this.minDown * 100}%`
    }

    calcMonthly = (initialLoan) => {
        const top = initialLoan * (this.rate / 12) * Math.pow(1 + this.rate / 12, this.term);
        const bot = Math.pow(1 + this.rate / 12, this.term) - 1;
        return Math.round(top / bot);
    }

    checkLoan(loan, down) {
        if (down > loan) {
            return `It's not a loan when you give more then you take`;
        }
        if (loan > this.maxLoan) {
            return `Bank can give you only $${this.maxLoan}`;
        }
        const currentDown = loan * this.minDown
        if (down < currentDown) {
            return `To receive $${loan} minimal down is $${currentDown}`;
        }
        return '';
    }
}

const getBanks = () => {
    httpRequest('GET', server_path, null)
        .then(resp => {
            const banks = Array.from(resp);
            if (banks && banks.length) {
                banksList = banks;
                console.log(banksList);
                pushBanks(banks);
                selectedBank = new Bank(banksList[0]);
                updateInfoTitle();
            }
        })
        .catch(err => console.log(err));
}

const pushBanks = (banks) => {
    bankSelector.innerHTML = '';
    banks.forEach((bank, index) => {
        const option = document.createElement('option');
        option.value = bank.id;
        option.text = bank.name;
        option.className = 'option';
        if (index === 0) {
            option.selected = true;
        }
        bankSelector.appendChild(option);
    });
}

const coloredSpan = (text) => {
    const span = document.createElement('span');
    span.innerText = text;
    span.className = 'colored c-text';
    return span;
}

const updateInfoTitle = () => {
    infoBlock.innerHTML = '';
    errorBlock.innerText = '';

    const loan = Number(loanField.value);
    const down = Number(downField.value);

    const loanError = selectedBank.checkLoan(loan, down);
    if (loanError != '') {
        errorBlock.innerText = loanError;
    } else {
        const infoTitle = document.createElement('h2');
        const bankName = selectedBank.getName();
        const coloredBankName = coloredSpan(bankName);
        infoTitle.innerText = '';
        infoTitle.innerText = 'Info for the ';
        infoTitle.appendChild(coloredBankName);
        infoBlock.appendChild(infoTitle);

        const monthlyInfo = document.createElement('p');
        const initialLoan = loan - down;
        const montlyPayment = selectedBank.calcMonthly(initialLoan);
        monthlyInfo.innerText = `Monthly payment is $${montlyPayment}`;

        infoBlock.appendChild(monthlyInfo);

        const bankInfo = document.createElement('p');
        bankInfo.innerText = selectedBank.toString();

        infoBlock.appendChild(bankInfo);
    }
}

bankSelector.addEventListener('click', () => {
    selectedBank = new Bank(banksList[bankSelector.value]);
    updateInfoTitle();
});

loanField.addEventListener('keyup', () => {
    updateInfoTitle();
})

downField.addEventListener('keyup', () => {
    updateInfoTitle();
})

getBanks();