const BASE_API = 'https://norma.nomoreparties.space/api/';

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
      cy.visit('http://localhost:4000', {
        onBeforeLoad(win) {
          win.localStorage.setItem('refreshToken', 'test-refresh-token');
        }
      });

      // Ждём загрузки ингредиентов
      cy.wait('@getIngredients');

      // Находим конструктор
      cy.get('[data-cy=constructor]').as('constructor');

      // Проверяем что список ингредиентов есть
      cy.get('[data-cy=ingredients-list]').should('exist');

      // Находим в списке первую булочку
      cy.get('[data-cy=ingredient-card]')
        .contains('Классическая булка')
        .closest('[data-cy=ingredient-card]')
        .as('bunCard');

      // Добавляем её по кнопке
      cy.get('@bunCard').find('button').click();

      // Проверяем, что булка появилась в конструкторе
      cy.get('@constructor').should('contain.text', 'Классическая булка');

      // Найдем начинку
      cy.get('[data-cy=ingredient-card]')
        .contains('Говяжья котлета')
        .closest('[data-cy=ingredient-card]')
        .as('ingredientCard');

      // Добавим начинку
      cy.get('@ingredientCard').find('button').click();

      // Проверим, что добавилась
      cy.get('@constructor').should('contain.text', 'Говяжья котлета');

      // Оформим заказ
      cy.get('@constructor').find('[data-cy=order-button]').click();

      // Подождем, пока оформится
      cy.wait('@postOrder');

      // Должен появится номер заказа
      cy.get('[data-cy=order-modal-number]').should('be.visible');

      // Он соотвествует данным заказа
      cy.fixture('order.json').then((order) => {
        const number = order.order.number;
        cy.get('[data-cy=order-modal-number]').should(
          'contain.text',
          String(number)
        );
      });

      // Закрываем кликом по оверлею
      cy.get('[data-cy=modal-overlay]').click({ force: true });

      // Модалка не показывается
      cy.get('[data-cy=order-modal-number]').should('not.exist');

      // В конструкторе нет ингредиентов
      cy.get('@constructor').should('not.contain.text', 'Классическая булка');
      cy.get('@constructor').should('not.contain.text', 'Говяжья котлета');
    });
  });

  context('Модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000');
      cy.wait('@getIngredients');
    });

    it('Открытие модального окна с описанием ингредиента и закрытие по оверлею', () => {
      // Пройдем по всем ингредиентам
      cy.fixture('ingredients.json').then((ingredientsResponse) => {
        const ingredients = ingredientsResponse.data;
        ingredients.forEach((ing: any) => {
          // Клик по карточке должен открыть модальное окно
          cy.get('[data-cy=ingredient-card]')
            .contains(ing.name)
            .closest('[data-cy=ingredient-card]')
            .click();
          // Окно видно
          cy.get('[data-cy=ingredient-modal]').should('be.visible');

          // Проверим, что в карточке есть все данные о ингредиенте
          cy.get('[data-cy=ingredient-modal]').within(() => {
            cy.contains(ing.name);
            cy.contains(ing.proteins);
            cy.contains(ing.fat);
            cy.contains(ing.carbohydrates);
            cy.contains(ing.calories);
          });

          // Закроем карточку кликом по оверлею
          cy.get('[data-cy=modal-overlay]').click({ force: true });
        });
      });
    });

    it('Открытие модального окна с описанием ингредиента и закрытие по крестику', () => {
      // Пройдем по всем ингредиентам
      cy.fixture('ingredients.json').then((ingredientsResponse) => {
        const ingredients = ingredientsResponse.data;
        ingredients.forEach((ing: any) => {
          // Клик по карточке должен открыть модальное окно
          cy.get('[data-cy=ingredient-card]')
            .contains(ing.name)
            .closest('[data-cy=ingredient-card]')
            .click();
          // Окно видно
          cy.get('[data-cy=ingredient-modal]').should('be.visible');

          // Проверим, что в карточке есть все данные о ингредиенте
          cy.get('[data-cy=ingredient-modal]').within(() => {
            cy.contains(ing.name);
            cy.contains(ing.proteins);
            cy.contains(ing.fat);
            cy.contains(ing.carbohydrates);
            cy.contains(ing.calories);
          });

          // Закроем по кнопке
          cy.get('[data-cy=ingredient-modal]')
            .closest('[data-cy=modal-ui]')
            .find('[data-cy=close-modal]')
            .click();
        });
      });
    });
  });
});
