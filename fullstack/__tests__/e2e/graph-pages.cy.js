describe('Weather Site Graph Pages', () => {
    const pages = [
      { path: 'http://localhost:3000/temperature', label: 'Temperature', unit: '°C', min: -20, max: 50 },
      { path: 'http://localhost:3000/rain', label: 'Rainfall', unit: 'mm', min: 0, max: 100 },
      { path: 'http://localhost:3000/pressure', label: 'Pressure', unit: 'hPa', min: 900, max: 1100 },
      { path: 'http://localhost:3000/wind', label: 'Wind', unit: 'm/s', min: 0, max: 150 },
      { path: 'http://localhost:3000/dust', label: 'Dust', unit: 'µg/m³', min: 0, max: 300 },
      { path: 'http://localhost:3000/humidity', label: 'Humidity', unit: '%', min: 0, max: 100 },
    ];
  
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
    });
  
    pages.forEach(({ path, label, unit, min, max }) => {
      it(`renders ${label} page and verifies chart, data, and range switching`, () => {
        // Navigate to page
        cy.visit(path);
  
        cy.contains(label).should('be.visible');
  
        // Check chart container renders
        cy.get('svg.recharts-surface').should('exist');
  
        // Check data points (dots) render
        cy.get('.recharts-dot.recharts-line-dot')
          .should('have.length.greaterThan', 0);
  
        // Check unit text exists on the page
        cy.contains(unit).should('exist');
  
        // Hover over the first data point to trigger tooltip
        cy.get('.recharts-dot.recharts-line-dot').first().trigger('mouseover');
  
        // Wait for tooltip and check the value range
        cy.get('.recharts-tooltip-item-value')
          .invoke('text')
          .then((text) => {
            const value = parseFloat(text);
            if (!isNaN(value)) {
              expect(value).to.be.within(min, max);
            }
          });
  
        // Test switching between Weekly and Monthly ranges
        ['Weekly', 'Monthly'].forEach((range) => {
          cy.contains(range).click();
          cy.wait(1000); // allow chart to refresh
          cy.get('.recharts-dot.recharts-line-dot')
            .should('have.length.greaterThan', 0);
        });
      });
    });
  });
  