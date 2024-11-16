describe('Navigation', () => {
  it('should navigate to the home page and expand a graph', () => {
    // Visit the home page
    cy.visit(Cypress.env('baseUrl') || 'http://localhost:3000/');

    // Ensure the widgets are present and click them
    cy.get('.widget', { timeout: 10000 }).should('exist').click({ multiple: true });

    // Wait for the graph to render and verify its visibility
    cy.get('.recharts-surface', { timeout: 10000 }).should('be.visible');
  });
});
