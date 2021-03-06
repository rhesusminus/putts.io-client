const Model = require('objection').Model

class Game extends Model {
  static get tableName() {
    return 'Game'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 30 },
        shortDesc: { type: 'string', minLength: 1, maxLength: 255 },
        longDesc: { type: 'string' },
        image: { type: 'string' }
      }
    }
  }
}

module.exports = { Game }
