// let scrollValue = window.scrollY || window.pageYOffset

// const scrollbarWidth = window.innerWidth - document.body.offsetWidth + 'px'

export const onOpenModal = () => {
   const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth + 'px'
   document.body.style.paddingRight = scrollbarWidth
   document.body.classList.add('lock')
}

export const onCloseModal = () => {
   document.body.style.paddingRight = '0px'
   document.body.classList.remove('lock')
}
