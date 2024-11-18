describe('Weather Dashboard', () => {
    it('displays the current weather data', () => {
      // Visit the weather station page
      cy.visit('https://weather.op-bit.nz/');
  
      // Check that the page loads and contains specific weather data labels
      cy.contains('Temperature').should('exist');
      cy.contains('Humidity').should('exist');
      cy.contains('Wind').should('exist');
    
      cy.contains('Temperature') 
        .parent() 
        .find('.p.px-4.pb-2')  
        .should('not.be.empty');
    
      cy.contains('Humidity') 
        .parent()
        .find('.p.px-4.pb-2')
        .should('not.be.empty');
  
      cy.contains('Wind')
        .parent()
        .find('.p.px-4.pb-2')
        .should('not.be.empty'); 
    });
  
    it('shows the correct units for temperature', () => {
      // Visit the weather station page
      cy.visit('https://weather.op-bit.nz/');
    
      // Check that the temperature is displayed in Celsius
      cy.contains('Temperature')
        .parent()  
        .find('.p.px-4.pb-2')  
        .should('match', /-?\d+(\.\d+)? °C/); 
    });
  });
  