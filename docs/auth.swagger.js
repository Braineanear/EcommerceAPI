export const signUp = {
  tags: ['Auth'],
  description: 'This route allow to login into the api',
  opeationId: 'signIn',
  security: [
    {
      bearerAuth: []
    }
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              required: true
            },
            name: {
              type: 'string',
              required: true
            },
            email: {
              type: 'string',
              required: true
            },
            password: {
              type: 'string',
              required: true
            },
            passwordConfirmation: {
              type: 'string',
              required: true
            },
            role: {
              type: 'string',
              required: true,
              enum: ['admin', 'user', 'seller']
            },
            phone: {
              type: 'string'
            },
            address: {
              type: 'string'
            },
            companyName: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'User data with access token and refresh token',
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
                example:
                  'Account created successfull, please verify your email!'
              },
              user: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'admin'
                  },
                  username: {
                    type: 'string',
                    example: 'admin'
                  },
                  email: {
                    type: 'string',
                    example: 'admin@ecommerce.com'
                  },
                  password: {
                    type: 'string',
                    example: 'Admin_123456789'
                  },
                  passwordConfirmation: {
                    type: 'string',
                    example: 'Admin_123456789'
                  },
                  role: {
                    type: 'string',
                    example: 'admin'
                  },
                  isEmailVerified: {
                    type: 'boolean',
                    example: false
                  },
                  address: {
                    type: 'string',
                    example: 'Toukh - Egypt'
                  },
                  phone: {
                    type: 'string',
                    example: '01004468937'
                  },
                  companyName: {
                    type: 'string',
                    example: ''
                  },
                  profileImage: {
                    type: 'string',
                    example:
                      'https://res.cloudinary.com/dknma8cck/image/upload/v1629291909/EcommerceAPI/Users/admin/xxcrbfkwglqa5c5kay4u.webp'
                  },
                  profileImageId: {
                    type: 'string',
                    example: 'EcommerceAPI/Users/admin/xxcrbfkwglqa5c5kay4u'
                  }
                }
              },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                    example:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTFkMDU4NWYzODY2MDhlZjIzYzI3OGQiLCJpYXQiOjE2MjkyOTE5MDksImV4cCI6MTYyOTI5MzcwOSwidHlwZSI6ImFjY2VzcyJ9.Y-lxrp2xmLGR-pSxaqiq2A6QvcVOmqoX90aZ7y0gQgM'
                  },
                  refreshToken: {
                    type: 'string',
                    example:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTFkMDU4NWYzODY2MDhlZjIzYzI3OGQiLCJpYXQiOjE2MjkyOTE5MDksImV4cCI6MTYzMTg4MzkwOSwidHlwZSI6InJlZnJlc2gifQ.6uK5RpgM-OLjC-WxBFT8I7CuVRgfwV4IFXQ8khOZ43Q'
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

export const signIn = {};

export const logout = {};
