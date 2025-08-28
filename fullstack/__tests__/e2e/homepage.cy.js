describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('loads the homepage', () => {
    cy.location('pathname').should('eq', '/');
    cy.get('nav').should('contain.text', 'Otago Polytechnic Weather Station');
    cy.get('nav').should('contain.text', 'ABOUT');
    cy.get('footer').should('be.visible');
  });

  it('shows 8 metric cards with labels', () => {
    const labels = [
      'Temperature',
      'Humidity',
      'Rain',
      'Wind',
      'CO2',
      'Gas',
      'Dust',
      'Air Pressure',
    ];

    labels.forEach((label) => {
      cy.contains(label).should('be.visible');
    });
  });

  it('navigates to a detail page when a card is clicked', () => {
    cy.contains('Temperature').click();
    cy.location('pathname').should('include', 'temperature');
    cy.contains('temperature data').should('exist');
    cy.go('back');
    cy.location('pathname').should('eq', '/');
  });

  it('navigates to About page', () => {
    cy.contains('ABOUT').click();
    cy.location('pathname').should('include', 'about');
    cy.contains('About the Project').should('exist');
    cy.go('back');    
  });
});
