const { users } = require("../fixtures/users")
const promisify = require('cypress-promise') 
const writeFileOptions = { encoding: 'utf-8', flag: 'a+' }

describe('Verify and save the number of Cards', () => {  

  users.forEach((user)=>{
    it('Verify if Tarjetas link is available', async () => {
      cy.visit('/')
      cy.login(user.username, user.password)
      cy.get('a[href*="/userCards/list"]').should('be.visible')          
      cy.get('a[href*="/userCards/list"]').click()
      cy.get('p').contains('Te mostramos info y estado de tus tarjetas').invoke('text').then((text) => {
        const splitText = text.split('(')
        const cardCount = splitText[1].replace('\)','').trim()
        cy.log(cardCount)
        cy.wrap(cardCount).as('cardCount')          
      })
      cy.writeFile('./users_cardCount.csv', `USER: ${user.username}; CARD_COUNT: ${ await promisify(cy.get('@cardCount'))}\n`, writeFileOptions)  
    });
  })
})

