export const getAllReviews = {
  security: {
    jwt: []
  },
  tags: ['Review'],
  description: 'This route allow you to get all products reviews',
  opeationId: 'getAllReviews',
  parameters: [
    {
      in: 'path',
      name: 'id',
      type: 'integer',
      description: 'Product ID'
    },
    {
      in: 'query',
      name: 'select',
      type: 'string',
      example: 'name, image',
      description: 'Select only fields you want.'
    },
    {
      in: 'query',
      name: 'limit',
      type: 'string',
      example: '5',
      description:
        'Limit the number of reviews from for example 20 review to 5 reviews.'
    },
    {
      in: 'query',
      name: 'sort',
      type: 'string',
      example: 'name',
      description:
        'Sorting reviews according to specified field for example the name field.'
    },
    {
      in: 'query',
      name: 'page',
      type: 'string',
      example: '2',
      description:
        'When number of reviews is greater than 10 reviews, it divides into pages each page contain 10 reviews.'
    }
  ],

  responses: {
    200: {
      description: 'Get All Reviews',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                example: 'Success'
              },
              message: {
                type: 'string',
                example: 'Reviews Found Successfully.'
              },
              reviews: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                      example: '611f7236f4529300507723a2'
                    },
                    product: {
                      type: 'string',
                      example: '611f6385628e64b6ff96393c'
                    },
                    user: {
                      type: 'string',
                      example: '611f62e28fa5d0a76cefbc96'
                    },
                    review: {
                      type: 'string',
                      example: 'Amazing Product!!'
                    },
                    rating: {
                      type: 'integer',
                      example: 5
                    },
                    createdAt: {
                      type: 'string',
                      example: '2021-08-20T09:13:26.697Z'
                    },
                    updatedAt: {
                      type: 'string',
                      example: '2021-08-20T09:13:26.697Z'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
