describe('Navigation', () => {
    it('should navigate to the home page and expand a graph', () => {
      // Start from the home page
      cy.visit('http://localhost:3000/');
  
      cy.get('.widget').click({multiple: true});
  
      // The new page should contain a graph
      cy.get('.recharts-surface');
    });
  });