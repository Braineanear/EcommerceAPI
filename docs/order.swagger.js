export const createNewOrder = {
  tags: ['Order'],
  description: 'This route allow lpgged in user/seller/admin create new order',
  opeationId: 'createNewOrder',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            shippingAddress: {
              type: 'object',
              properties: {
                address: {
                  type: 'string',
                  required: true
                },
                city: {
                  type: 'string',
                  required: true
                },
                country: {
                  type: 'string',
                  required: true
                },
                postalCode: {
                  type: 'string',
                  required: true
                }
              }
            },
            paymentMethod: {
              type: 'string',
              required: true
            },
            phone: {
              type: 'string',
              required: true
            },
            cardNumber: {
              type: 'string',
              required: true
            },
            expMonth: {
              type: 'integer',
              required: true
            },
            expYear: {
              type: 'integer',
              required: true
            },
            cvc: {
              type: 'string',
              required: true
            }
          }
        }
      }
    }
  },
  responses: {
    201: {
      description: 'create new order',
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
                example: 'Order Created Successfully.'
              },
              order: {
                type: 'object',
                properties: {
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                          example: '61251a32c34eabdac042b36f'
                        },
                        product: {
                          type: 'string',
                          example: '611f6385628e64b6ff96393c'
                        },
                        totalProductQuantity: {
                          type: 'integer',
                          example: 2
                        },
                        totalProductPrice: {
                          type: 'integer',
                          example: 6200
                        }
                      }
                    }
                  },
                  totalPrice: {
                    type: 'integer',
                    example: 6200
                  },
                  isPaid: {
                    type: 'boolean',
                    example: true
                  },
                  isDelivered: {
                    type: 'boolean',
                    example: false
                  },
                  taxPrice: {
                    type: 'integer',
                    example: 0
                  },
                  shippingPrice: {
                    type: 'integer',
                    example: 0
                  },
                  status: {
                    type: 'string',
                    example: 'Not Processed'
                  },
                  _id: {
                    type: 'string',
                    example: '61251a43c34eabdac042b374'
                  },
                  user: {
                    type: 'string',
                    example: '611d0cf2ab79f9bb0c388234'
                  },
                  paidAt: {
                    type: 'string',
                    example: '2021-08-24T16:11:47.502Z'
                  },
                  shippingAddress: {
                    type: 'object',
                    properties: {
                      address: {
                        type: 'string',
                        example: 'Toukh - Egypt'
                      },
                      city: {
                        type: 'string',
                        example: 'Toukh'
                      },
                      country: {
                        type: 'string',
                        example: 'Egypt'
                      },
                      postalCode: {
                        type: 'string',
                        example: '11311'
                      }
                    }
                  },
                  paymentMethod: {
                    type: 'string',
                    example: 'card'
                  },
                  phone: {
                    type: 'string',
                    example: '01004468937'
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
