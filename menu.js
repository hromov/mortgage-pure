'use strict'

const toggleButton = document.querySelector('#toggle-button')
const menu = document.querySelector('#menu')

toggleButton.addEventListener('click', () => menu.classList.toggle('active'))

menu.querySelector('.menu-links').addEventListener('click', () => menu.classList.remove('active'))