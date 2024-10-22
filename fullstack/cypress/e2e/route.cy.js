describe('API tests', () => {
    const apiURL = 'http://localhost:3000/api';
    it ('should return an item', () => {
        cy.request(`${apiURL}/dust-data`)
        .its('status')
        .should('eq', 200);
    });

    it ('should post a new item', () => {
        cy.request('POST', `${apiURL}/recieve-data`, {
            device_id: 'dust-sensor-01',
            dust: 0.1
        })
        .its('status')
        .should('eq', 201);
    })

    it('should return a 404 for non-existent items', () => {
        const nonExistentId = 999;
        cy.request({
          url: `${apiUrl}/dust-data/${nonExistentId}`,
          failOnStatusCode: false // Prevent Cypress from failing the test on non-2xx status codes
        })
          .its('status')
          .should('eq', 404);
      });
})