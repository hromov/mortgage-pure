'use strict';
import { httpRequest } from "./xhr.js";

const server_path = 'https://back-dot-mortgage-test-347507.lm.r.appspot.com/banks';

const bankSelector = document.querySelector('#bank_selector');
const infoBlock = document.querySelector('#info');

const loan = document.querySelector('#loan');
const down = document.querySelector('#down');

let banksList = [];
let selectedBankIndex = null;

const getBanks = () => {
    httpRequest('GET', server_path, null)
        .then(resp => {
            const banks = Array.from(resp);
            banksList = banks;
            console.log(banksList)
            pushBanks(banks)
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

const calcMonthly = (p, r, n) => {
    const top = p * (r / 12) * Math.pow(1 + r/12, n);
    const bot = Math.pow(1 + r/12, n) - 1;
    return Math.round(top / bot);
}

const updateInfoTitle = () => {
    const infoTitle = document.createElement('h2');
    const coloredBankName = document.createElement('span');
    console.log(banksList);
    coloredBankName.innerText = banksList[selectedBankIndex].name;
    coloredBankName.className = 'colored c-text';
    infoTitle.innerText = 'Info for the ';
    infoTitle.appendChild(coloredBankName);
    infoBlock.innerHTML = '';
    infoBlock.appendChild(infoTitle);

    const monthlyInfo = document.createElement('p');
    const selectedBank = banksList[selectedBankIndex];
    const loanAmount = loan.value - down.value;
    monthlyInfo.innerText = `Monthly payment is $${calcMonthly(loanAmount, selectedBank.interest, selectedBank.term)}`;
    
    infoBlock.appendChild(monthlyInfo);

    const bankInfo = document.createElement('p');
    bankInfo.innerText = `Loan term is ${selectedBank.term}. Interest rate is ${selectedBank.interest * 100}%`

    infoBlock.appendChild(bankInfo);
}

bankSelector.addEventListener('click', () => {
    selectedBankIndex = bankSelector.value;
    updateInfoTitle();
});

getBanks();