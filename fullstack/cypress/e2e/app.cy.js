describe('Navigation', () => {
    it('should navigate to the home page and expand a graph', () => {
      // Start from the home page
      cy.visit('http://localhost:3000/')
   
      cy.get('a[href*="More"]').click()
   
      // The new page should contain a graph
      cy.get('h1').contains('widget expanded relative rounded-lg')
    })
  })