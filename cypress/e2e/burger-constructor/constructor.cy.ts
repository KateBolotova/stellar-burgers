const BASE_API = 'https://norma.nomoreparties.space/api/';
const TEST_URL = 'http://localhost:4000';
const SELECTORS = {
  constructor: '[data-cy=constructor]',
  ingredientList: '[data-cy=ingredients-list]',
  ingredientCard: '[data-cy=ingredient-card]',
  orderButton: '[data-cy=order-button]',
  orderModalNumber: '[data-cy=order-modal-number]',
  modalOverlay: '[data-cy=modal-overlay]',
  ingredientModal: '[data-cy=ingredient-modal]',
  closeModal: '[data-cy=close-modal]',
  modalUi: '[data-cy=modal-ui]'
};

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Находит карточку ингредиента по тексту и возвращает её.
       * @example cy.findIngredientCard('Говяжья котлета').as('card')
       */
      findIngredientCard(name: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.addAll({
  findIngredientCard(name: string) {
    return cy
      .contains(SELECTORS.ingredientCard, name)
      .closest(SELECTORS.ingredientCard);
  }
});

describe('Burger Constructor E2E', () => {
  beforeEach(() => {
    // Фикстура для загрузки ингредиентов
    cy.intercept('GET', `${BASE_API}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    // Фикстура для авторизации пользователя
    cy.intercept('GET', `${BASE_API}/auth/user`, { fixture: 'user.json' }).as(
      'getUser'
    );
  });

  context('Работа с конструктором', () => {
    it('Полное оформление заказа', () => {
      // Настраиваем перехват оформления заказа
      cy.intercept('POST', `${BASE_API}/orders`, { fixture: 'order.json' }).as(
        'postOrder'
      );
      // После заказа обновляется список заказов пользователя, перехватим, чтобы не было ошибок
      cy.intercept('GET', `${BASE_API}/orders`, { fixture: 'orders.json' }).as(
        'getOrders'
      );
      // Устанвоим куки для авторизации при оформлении заказа
      cy.setCookie('accessToken', 'test-access-token');
      // И рефреш токен тоже заполним
      cy.visit(TEST_URL, {
        onBeforeLoad(win) {
          win.localStorage.setItem('refreshToken', 'test-refresh-token');
        }
      });

      // Ждём загрузки ингредиентов
      cy.wait('@getIngredients');

      // Находим конструктор
      cy.get(SELECTORS.constructor).as('constructor');

      // Проверяем что список ингредиентов есть
      cy.get(SELECTORS.ingredientList).should('exist');

      // Находим в списке первую булочку
      cy.findIngredientCard('Классическая булка').as('bunCard');

      // Добавляем её по кнопке
      cy.get('@bunCard').contains('Добавить').click();

      // Проверяем, что булка появилась в конструкторе
      cy.get('@constructor').should('contain.text', 'Классическая булка');

      // Найдем начинку
      cy.findIngredientCard('Говяжья котлета').as('ingredientCard');

      // Добавим начинку
      cy.get('@ingredientCard').contains('Добавить').click();

      // Проверим, что добавилась
      cy.get('@constructor').should('contain.text', 'Говяжья котлета');

      // Оформим заказ
      cy.get('@constructor').find(SELECTORS.orderButton).click();

      // Подождем, пока оформится
      cy.wait('@postOrder');

      // Должен появится номер заказа
      cy.get(SELECTORS.orderModalNumber).should('be.visible');

      // Он соотвествует данным заказа
      cy.fixture('order.json').then((order) => {
        const number = order.order.number;
        cy.get(SELECTORS.orderModalNumber).should(
          'contain.text',
          String(number)
        );
      });

      // Закрываем кликом по оверлею
      cy.get(SELECTORS.modalOverlay).click({ force: true });

      // Модалка не показывается
      cy.get(SELECTORS.orderModalNumber).should('not.exist');

      // В конструкторе нет ингредиентов
      cy.get('@constructor').should('not.contain.text', 'Классическая булка');
      cy.get('@constructor').should('not.contain.text', 'Говяжья котлета');
    });
  });

  context('Модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.visit(TEST_URL);
      cy.wait('@getIngredients');
    });

    it('Открытие модального окна с описанием ингредиента и закрытие по оверлею', () => {
      // Пройдем по всем ингредиентам
      cy.fixture('ingredients.json').then((ingredientsResponse) => {
        const ingredients = ingredientsResponse.data;
        ingredients.forEach((ing: any) => {
          // Клик по карточке должен открыть модальное окно
          cy.findIngredientCard(ing.name).click();
          // Окно видно
          cy.get(SELECTORS.ingredientModal).should('be.visible');

          // Проверим, что в карточке есть все данные о ингредиенте
          cy.get(SELECTORS.ingredientModal).within(() => {
            cy.contains(ing.name);
            cy.contains(ing.proteins);
            cy.contains(ing.fat);
            cy.contains(ing.carbohydrates);
            cy.contains(ing.calories);
          });

          // Закроем карточку кликом по оверлею
          cy.get(SELECTORS.modalOverlay).click({ force: true });
        });
      });
    });

    it('Открытие модального окна с описанием ингредиента и закрытие по крестику', () => {
      // Пройдем по всем ингредиентам
      cy.fixture('ingredients.json').then((ingredientsResponse) => {
        const ingredients = ingredientsResponse.data;
        ingredients.forEach((ing: any) => {
          // Клик по карточке должен открыть модальное окно
          cy.findIngredientCard(ing.name).click();
          // Окно видно
          cy.get(SELECTORS.ingredientModal).should('be.visible');

          // Проверим, что в карточке есть все данные о ингредиенте
          cy.get(SELECTORS.ingredientModal).within(() => {
            cy.contains(ing.name);
            cy.contains(ing.proteins);
            cy.contains(ing.fat);
            cy.contains(ing.carbohydrates);
            cy.contains(ing.calories);
          });

          // Закроем по кнопке
          cy.get(SELECTORS.ingredientModal)
            .closest(SELECTORS.modalUi)
            .find(SELECTORS.closeModal)
            .click();
        });
      });
    });
  });
});

// Чтобы работал declare global
export {};
