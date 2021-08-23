export const getAllUsers = {
  security: {
    jwt: []
  },
  tags: ['User'],
  description: 'This route allow you to get all users data',
  opeationId: 'getAllUsers',
  parameters: [
    {
      in: 'query',
      name: 'filter',
      type: 'string',
      example: 'admin',
      description:
        'This will filter all users and select only user that contain the word you insert and search in all user fields about this word'
    },
    {
      in: 'query',
      name: 'select',
      type: 'string',
      example: 'name, profileImage',
      description: 'Select only fields you want.'
    },
    {
      in: 'query',
      name: 'limit',
      type: 'string',
      example: '5',
      description:
        'Limit the number of users from for example 20 user to 5 users.'
    },
    {
      in: 'query',
      name: 'sort',
      type: 'string',
      example: 'name',
      description:
        'Sorting users according to specified field for example the name field.'
    },
    {
      in: 'query',
      name: 'page',
      type: 'string',
      example: '2',
      description:
        'When number of user is greater than 10 users, it divides into pages each page contain 10 users.'
    }
  ],
  responses: {
    200: {
      description: 'Get All Users',
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
                example: 'Users Found Successfully.'
              },
              users: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                      example: '611d08a62fc210a30ecfb75b'
                    },
                    role: {
                      type: 'string',
                      example: 'admin'
                    },
                    isEmailVerified: {
                      type: 'boolean',
                      example: true
                    },
                    favoriteProducts: {
                      type: 'array',
                      items: {
                        type: 'string',
                        example: '6123dab951ff329fed1bc794'
                      }
                    },
                    name: {
                      type: 'string',
                      example: 'Admin'
                    },
                    username: {
                      type: 'string',
                      example: 'admin'
                    },
                    email: {
                      type: 'string',
                      example: 'admin@ecommerce.com'
                    },
                    companyName: {
                      type: 'string',
                      example: ''
                    },
                    address: {
                      type: 'string',
                      example: 'Toukh - Egypt'
                    },
                    phone: {
                      type: 'string',
                      example: '11111111111'
                    },
                    profileImage: {
                      type: 'string',
                      example:
                        'https://res.cloudinary.com/dknma8cck/image/upload/v1629292710/EcommerceAPI/Users/admin/vt3wgvwvwv4s6d1e81lr.webp'
                    },
                    profileImageId: {
                      type: 'string',
                      example: 'EcommerceAPI/Users/admin/vt3wgvwvwv4s6d1e81lr'
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

export const getUser = {
  security: {
    jwt: []
  },
  tags: ['User'],
  description: "This route allow you to get users using it's ID",
  opeationId: 'getUser',
  parameters: [
    {
      in: 'path',
      name: 'id',
      type: 'integer',
      description: 'User ID'
    }
  ],
  responses: {
    200: {
      description: 'Get User',
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
                example: 'Found User Successfully.'
              },
              users: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    example: '611d08a62fc210a30ecfb75b'
                  },
                  role: {
                    type: 'string',
                    example: 'admin'
                  },
                  isEmailVerified: {
                    type: 'boolean',
                    example: true
                  },
                  favoriteProducts: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: '6123dab951ff329fed1bc794'
                    }
                  },
                  name: {
                    type: 'string',
                    example: 'Admin'
                  },
                  username: {
                    type: 'string',
                    example: 'admin'
                  },
                  email: {
                    type: 'string',
                    example: 'admin@ecommerce.com'
                  },
                  companyName: {
                    type: 'string',
                    example: ''
                  },
                  address: {
                    type: 'string',
                    example: 'Toukh - Egypt'
                  },
                  phone: {
                    type: 'string',
                    example: '11111111111'
                  },
                  profileImage: {
                    type: 'string',
                    example:
                      'https://res.cloudinary.com/dknma8cck/image/upload/v1629292710/EcommerceAPI/Users/admin/vt3wgvwvwv4s6d1e81lr.webp'
                  },
                  profileImageId: {
                    type: 'string',
                    example: 'EcommerceAPI/Users/admin/vt3wgvwvwv4s6d1e81lr'
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
