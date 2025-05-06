/// <reference types="cypress" />

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });
  
  it('добавляет ингредиенты в конструктор', () => {
    // Добавляем булку
    cy.get('[data-test=ingredient-card]').contains('булка').parents('[data-test=ingredient-card]').as('bun');
    
    // Добавляем начинку
    cy.get('[data-test=ingredient-card]').contains('Protostomia').parents('[data-test=ingredient-card]').as('filling');
    
    cy.get('@bun').find('button').click();
    cy.get('@filling').find('button').click();

    // Проверяем, что ингредиенты добавлены
    cy.get('[data-test=constructor-ingredient]', { timeout: 5000 }).should('exist');
    cy.get('[data-test=constructor-ingredient]').should('contain', 'Protostomia');
  });
    
  it('открывает и закрывает модалку ингредиента', () => {
    cy.get('[data-test=ingredient-card]').first().click();
    cy.get('[data-test=modal]').should('exist');
    cy.get('[data-test=modal-close]').click();
    cy.get('[data-test=modal]').should('not.exist');
  });

  it('открывает модалку с номером заказа', () => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
  
    // Переход на главную и ожидание загрузки
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    // Добавляем булку
    cy.get('[data-test=ingredient-card]').contains('булка').parents('[data-test=ingredient-card]').as('bun');
    
    // Добавляем начинку
    cy.get('[data-test=ingredient-card]').contains('Protostomia').parents('[data-test=ingredient-card]').as('filling');
    
    cy.get('@bun').find('button').click();
    cy.get('@filling').find('button').click();

    // Нажимаем на кнопку "Оформить заказ"
    cy.get('[data-test=order-button]').click();

    // Ожидаем успешного запроса и появление модалки с номером заказа
    cy.wait('@createOrder');
    cy.get('[data-test=order-number]').should('exist');
  });
    
  it('оформляем заказ и очищаем конструктор', () => {
    // Мокаем запросы
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
  
    // Переход на главную и ожидание загрузки
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  
    // Добавляем булку
    cy.get('[data-test=ingredient-card]').contains('булка').parents('[data-test=ingredient-card]').as('bun');
  
    // Добавляем начинку
    cy.get('[data-test=ingredient-card]').contains('Protostomia').parents('[data-test=ingredient-card]').as('filling');
  
    // Кликаем по кнопкам "Добавить"
    cy.get('@bun').find('button').click();
    cy.get('@filling').find('button').click();
  
    // Оформляем заказ
    cy.get('[data-test=order-button]').click();
  
    // Проверяем, что конструктор пуст
    cy.get('[data-test=constructor-ingredient]').should('not.exist');
  });
    
  it('закрывает модалку заказа и очищает конструктор', () => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    // Переход на главную и ожидание загрузки
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    // Добавляем булку и начинку
    cy.get('[data-test=ingredient-card]').contains('булка').parents('[data-test=ingredient-card]').as('bun');
    cy.get('[data-test=ingredient-card]').contains('Protostomia').parents('[data-test=ingredient-card]').as('filling');

    cy.get('@bun').find('button').click();
    cy.get('@filling').find('button').click();

    // Оформляем заказ
    cy.get('[data-test=order-button]').click();
    cy.wait('@createOrder');

    // Закрываем модалку
    cy.get('[data-test=modal-close]').click();

    // Проверяем, что ингредиенты удалены
    cy.get('[data-test=constructor-ingredient]').should('not.exist');
  });
});