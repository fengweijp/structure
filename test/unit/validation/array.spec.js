const { attributes } = require('../../../src');
const { assertValid, assertInvalid } = require('../../support/validationMatchers');

describe('validation', () => {
  describe('Array', () => {
    describe('no validation', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: []
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is valid', () => {
          const user = new User({
            books: undefined
          });

          assertValid(user);
        });
      });
    });

    describe('required', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String,
          required: true
        }
      })(class User {});

      context('when value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: []
          });

          assertValid(user);
        });
      });

      context('when value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: undefined
          });

          assertInvalid(user, 'books');
        });
      });
    });

    describe('sparse array', () => {
      context('when array can not be sparse', () => {
        const User = attributes({
          books: {
            type: Array,
            itemType: String,
            sparse: false
          }
        })(class User {});

        context('when all items are defined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['Poetic Edda', 'Prose Edda']
            });

            assertValid(user);
          });
        });

        context('when some item is undefined', () => {
          it('is not valid and has errors set', () => {
            const user = new User({
              books: ['The Lusiads', undefined]
            });

            assertInvalid(user, 'books.1');
          });
        });
      });

      context('when array can be sparse', () => {
        const User = attributes({
          books: {
            type: Array,
            itemType: String,
            sparse: true
          }
        })(class User {});

        context('when all items are defined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['Poetic Edda', 'Prose Edda']
            });

            assertValid(user);
          });
        });

        context('when some item is undefined', () => {
          it('is valid', () => {
            const user = new User({
              books: ['The Lusiads', undefined]
            });

            assertValid(user);
          });
        });
      });
    });

    describe('nested validation', () => {
      const Book = attributes({
        name: {
          type: String,
          required: true
        }
      })(class Book {});

      const User = attributes({
        books: {
          type: Array,
          itemType: Book,
          required: true
        }
      })(class User {});

      context('when nested value is present', () => {
        it('is valid', () => {
          const user = new User({
            books: [
              new Book({ name: 'The Silmarillion' }),
              new Book({ name: 'The Lord of the Rings' })
            ]
          });

          assertValid(user);
        });
      });

      context('when nested value is not present', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              new Book({ name: 'The Hobbit' }),
              new Book({ name: undefined })
            ]
          });

          assertInvalid(user, 'books.1.name');
        });
      });
    });

    describe('minLength', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String,
          minLength: 2
        }
      })(class User {});

      context('when array has minimum length', () => {
        it('is valid', () => {
          const user = new User({
            books: [
              'The Name of the Wind',
              'The Wise Man\'s Fear'
            ]
          });

          assertValid(user);
        });
      });

      context('when array has minimum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              '1984'
            ]
          });

          assertInvalid(user, 'books');
        });
      });
    });

    describe('maxLength', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String,
          maxLength: 2
        }
      })(class User {});

      context('when array has less than maximum length', () => {
        it('is valid', () => {
          const user = new User({
            books: [
              'The Name of the Wind'
            ]
          });

          assertValid(user);
        });
      });

      context('when array has more than maximum length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              '1984',
              'The Game of Thrones',
              'Dragons of Ether'
            ]
          });

          assertInvalid(user, 'books');
        });
      });
    });

    describe('exactLength', () => {
      const User = attributes({
        books: {
          type: Array,
          itemType: String,
          exactLength: 2
        }
      })(class User {});

      context('when array has exactly the expected length', () => {
        it('is valid', () => {
          const user = new User({
            books: [
              'The Gunslinger',
              'The Drawing of the Three'
            ]
          });

          assertValid(user);
        });
      });

      context('when array has less than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              'The Wastelands'
            ]
          });

          assertInvalid(user, 'books');
        });
      });

      context('when array has more than exact length', () => {
        it('is not valid and has errors set', () => {
          const user = new User({
            books: [
              'Wizard and Glass',
              'The Wind Through the Keyhole',
              'Wolves of the Calla'
            ]
          });

          assertInvalid(user, 'books');
        });
      });
    });
  });
});
