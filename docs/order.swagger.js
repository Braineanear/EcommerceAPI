export const createNewOrder = {
  tags: ['Order'],
  description: 'This route allow logged in user/seller/admin create new order',
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
      description:
        'Create new order | paymentMethod: "card" | cardNumber: 4242424242424242 | expMonth: 4 | expYear: 2022 |g cvc: 247',
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

export const getAllOrders = {
  tags: ['Order'],
  description: 'This route allow logged in user/seller/admin get his orders',
  opeationId: 'createNewOrder',
  parameters: [
    {
      in: 'query',
      name: 'filter',
      type: 'string',
      example: 'card',
      description:
        'This will filter all orders and select only order that contain the word you insert and search in all user fields about this word'
    },
    {
      in: 'query',
      name: 'select',
      type: 'string',
      example: 'totalPrice',
      description: 'Select only fields you want.'
    },
    {
      in: 'query',
      name: 'limit',
      type: 'string',
      example: '5',
      description:
        'Limit the number of orders from for example 20 order to 5 orders.'
    },
    {
      in: 'query',
      name: 'sort',
      type: 'string',
      example: 'totalPrice',
      description:
        'Sorting orders according to specified field for example the name field.'
    },
    {
      in: 'query',
      name: 'page',
      type: 'string',
      example: '2',
      description:
        'When number of orders is greater than 10 orders, it divides into pages each page contain 10 orders.'
    }
  ],
  responses: {
    201: {
      description: 'Get all orders',
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
                example: 'Orders Found Successfully.'
              },
              orders: {
                type: 'array',
                items: {
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
  }
};
