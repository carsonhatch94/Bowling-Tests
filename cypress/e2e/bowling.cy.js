import strings from "../support/strings";
import { perfectGameData, zeroGameData, spareGameData } from '../support/testData';

describe('e2e smoke tests', () => {
  it('all elements load', () => {
    cy.visit(strings.homeUrl);
    cy.get('h1').contains(strings.title).should('be.visible');
    cy.get('h2').contains(strings.subtitle).should('be.visible');
    cy.get('.reset').should('have.text', strings.resetGame);
    cy.get('a')
      .contains(strings.viewSourceCode)
      .should('have.attr', 'target', '_blank')
      .should('have.attr', 'href', strings.githubUrl);
    verifyFrames();
    verifyScorePad();
  })

  it('can score perfect game', () => {
    cy.visit(strings.homeUrl);
    for (let i = 0; i < 12; i++) {
      cy.get('.strike').click();
    }
    verifyFrameScores(perfectGameData.frameRolls, perfectGameData.frameScores, perfectGameData.totalScore);
  });

  it('can score a zero game', () => {
    cy.visit(strings.homeUrl);
    for (let i = 0; i < 20; i++) {
      cy.get('.zero').click();
    }
    verifyFrameScores(zeroGameData.frameRolls, zeroGameData.frameScores, zeroGameData.totalScore);
  });

  it('can score a spare game', () => {
    cy.visit(strings.homeUrl);
    for (let i = 0; i < 21; i++) {
      if (i % 2 === 0) {
        cy.get('.nine').click();
      }
      else {
        cy.get('.one').click();
      }
    }
    verifyFrameScores(spareGameData.frameRolls, spareGameData.frameScores, spareGameData.totalScore);
  });
})

function verifyFrameScores(frameRolls, frameScores, total) {
  frameRolls.forEach((frame, index) => {
    if (index < 9) {
      cy.get('.frame').eq(index).find('.roll-1-score').should('have.text', frame.roll1);
      cy.get('.frame').eq(index).find('.roll-2-score').should('have.text', frame.roll2);
    }
    if (index === 9) {
      cy.get('.frame').eq(index).find('.roll-1-score').should('have.text', frame.roll1);
      cy.get('.frame').eq(index).find('.roll-2-score').should('have.text', frame.roll2);
      cy.get('.frame').eq(index).find('.roll-3-score').should('have.text', frame.roll3);
    }
  });

  frameScores.forEach((score, index) => {
    if (index < 10) {
      cy.get('.frame').eq(index).find(`.frame-${index + 1}-score`).should('have.text', score);
    } else {
      cy.get('.frame').eq(index).find('.total').should('have.text', total);
      cy.get('.score-button-container').should('not.be.visible');
    }
  });
}

function verifyFrames() {
  cy.get('.frame').should('have.length', 11);
  for (let i = 1; i <= 10; i++) {
    cy.get('.frame').eq(i - 1).find('.score-number').should('have.text', `${i}`);
  }

  cy.get('.frame').eq(10).find('.score-number').should('have.text', 'Total');
  cy.get('.total').should('have.text', '0');
}

function verifyScorePad() {
  const numberClasses = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'strike'];

  numberClasses.forEach((className) => {
    cy.get(`.${className}`).should('exist').and('be.visible');
  });
}
