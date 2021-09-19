export const getAllOrders = {
  tags: ['Order'],
  description: 'This route allow logged in user/seller/admin get his orders',
  opeationId: 'getAllOrders',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
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
      example: '-1, totalPrice',
      description:
        'Sorting orders according to specified field for example the name field, and the number before the field name indicates the order of items: descending (-1) or ascending (1)'
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
                          selectedColor: {
                            type: 'object',
                            properties: {
                              _id: {
                                type: 'string',
                                example: '6146e63c1d67816c6f9d63c7'
                              },
                              color: {
                                type: 'string',
                                example: 'Red'
                              }
                            }
                          },
                          selectedSize: {
                            type: 'object',
                            properties: {
                              _id: {
                                type: 'string',
                                example: '6145a458d495858ff0d6e8a5'
                              },
                              color: {
                                type: 'string',
                                example: 'L'
                              }
                            }
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

export const getOrder = {
  tags: ['Order'],
  description:
    "This route allow logged in user/seller/admin get specific order using it's ID",
  opeationId: 'getOrder',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
    {
      in: 'path',
      name: 'id',
      type: 'integer',
      description: 'Order ID'
    }
  ],
  responses: {
    200: {
      description: "Get specific order using it's ID",
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
                example: 'Order found successfully.'
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
                        selectedColor: {
                          type: 'object',
                          properties: {
                            _id: {
                              type: 'string',
                              example: '6146e63c1d67816c6f9d63c7'
                            },
                            color: {
                              type: 'string',
                              example: 'Red'
                            }
                          }
                        },
                        selectedSize: {
                          type: 'object',
                          properties: {
                            _id: {
                              type: 'string',
                              example: '6145a458d495858ff0d6e8a5'
                            },
                            color: {
                              type: 'string',
                              example: 'L'
                            }
                          }
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
    },
    404: {
      description: 'Error: 404',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                example: 'Error'
              },
              message: {
                type: 'string',
                example: 'No order found.'
              }
            }
          }
        }
      }
    }
  }
};

export const createNewOrder = {
  tags: ['Order'],
  description: 'This route allow logged in user/seller/admin create new order',
  opeationId: 'createNewOrder',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'en_MX'
    }
  ],
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
                        selectedColor: {
                          type: 'object',
                          properties: {
                            _id: {
                              type: 'string',
                              example: '6146e63c1d67816c6f9d63c7'
                            },
                            color: {
                              type: 'string',
                              example: 'Red'
                            }
                          }
                        },
                        selectedSize: {
                          type: 'object',
                          properties: {
                            _id: {
                              type: 'string',
                              example: '6145a458d495858ff0d6e8a5'
                            },
                            color: {
                              type: 'string',
                              example: 'L'
                            }
                          }
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

export const orderStatus = {
  tags: ['Order'],
  description: 'This route allow logged in seller update order status',
  opeationId: 'orderStatus',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'en_MX'
    },
    {
      in: 'path',
      name: 'id',
      type: 'integer',
      description: 'Order ID'
    }
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              required: true,
              example:
                'Not Processed | Processing | Shipped | Delivered | Cancelled'
            }
          }
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Update order status',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                example: 'Success'
              },
              message1: {
                type: 'string',
                example: 'Order status updated successfully.'
              },
              message2: {
                type: 'string',
                example: 'Order cancelled successfully.'
              }
            }
          }
        }
      }
    },
    400: {
      description: 'Error: 400',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                example: 'Error'
              },
              message1: {
                type: 'string',
                example: 'All fields are required.'
              },
              message2: {
                type: 'string',
                example:
                  'Sorry by status must be one of the following: Not Processed, Processing, Shipped, Delivered, Cancelled.'
              }
            }
          }
        }
      }
    },
    404: {
      description: 'Error: 404',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                example: 'Error'
              },
              message1: {
                type: 'string',
                example: 'No order found'
              },
              message2: {
                type: 'string',
                example: 'No product found with this ID'
              }
            }
          }
        }
      }
    }
  }
};

export const cancelOrder = {
  tags: ['Order'],
  description:
    "This route allow logged in user/seller/admin cancel specific order using it's ID",
  opeationId: 'cancelOrder',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
    {
      in: 'path',
      name: 'id',
      type: 'integer',
      description: 'Order ID'
    }
  ],
  responses: {
    200: {
      description: "Cancel specific order using it's ID",
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
                example: 'Order cancelled successfully.'
              }
            }
          }
        }
      }
    },
    404: {
      description: 'Error: 404',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                example: 'Error'
              },
              message1: {
                type: 'string',
                example: 'No order found.'
              },
              message2: {
                type: 'string',
                example: 'No product found with this ID.'
              }
            }
          }
        }
      }
    }
  }
};
