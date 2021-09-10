export const getCart = {
  tags: ['Cart'],
  description: 'This route allow logged in user/seller/admin to get his cart',
  opeationId: 'getCart',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'en_MX'
    }
  ],
  responses: {
    200: {
      description: 'Get your cart items',
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
                example: 'Cart Found Successfully.'
              },
              cart: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    example: 'mle.mahmoud.yasser@gmail.com'
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                          example: '61221141f34a829cdf7ca542'
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
                  totalQuantity: {
                    type: 'integer',
                    example: 2
                  },
                  totalPrice: {
                    type: 'integer',
                    example: 6200
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
                example: 'No Cart Found For The User With This Email: {email}.'
              }
            }
          }
        }
      }
    }
  }
};

export const addItemsToCart = {
  tags: ['Cart'],
  description:
    'This route allow logged in user/seller/admin to add items to his cart',
  opeationId: 'addItemsToCart',
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
            productId: {
              type: 'string',
              required: true
            },
            quantity: {
              type: 'integer',
              required: true
            }
          }
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Add items to your cart',
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
                example: 'Item Added To Cart Successfully.'
              },
              cart: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    example: 'mle.mahmoud.yasser@gmail.com'
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                          example: '61221141f34a829cdf7ca542'
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
                  totalQuantity: {
                    type: 'integer',
                    example: 2
                  },
                  totalPrice: {
                    type: 'integer',
                    example: 6200
                  }
                }
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
              message: {
                type: 'string',
                example: 'Invalid Request'
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
                example: 'No Product Found With This ID: {productId}'
              }
            }
          }
        }
      }
    }
  }
};

export const increaseProductQuantityByOne = {
  tags: ['Cart'],
  description:
    'This route allow logged in user/seller/admin to increase product quantity by one',
  opeationId: 'increaseProductQuantityByOne',
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
            productId: {
              type: 'string',
              required: true
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Increase product quantity by one',
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
                example: 'Item Increased By One In Cart Successfully.'
              },
              cart: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    example: 'mle.mahmoud.yasser@gmail.com'
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                          example: '61221141f34a829cdf7ca542'
                        },
                        product: {
                          type: 'string',
                          example: '611f6385628e64b6ff96393c'
                        },
                        totalProductQuantity: {
                          type: 'integer',
                          example: 3
                        },
                        totalProductPrice: {
                          type: 'integer',
                          example: 9300
                        }
                      }
                    }
                  },
                  totalQuantity: {
                    type: 'integer',
                    example: 3
                  },
                  totalPrice: {
                    type: 'integer',
                    example: 9300
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
              message1: {
                type: 'string',
                example: 'No Product Found With This ID: {productId}'
              },
              message2: {
                type: 'string',
                example: 'No Cart Found For User With The Email: {email}'
              },
              message3: {
                type: 'string',
                example:
                  'No Product Found With This ID: {productId} In The Cart'
              }
            }
          }
        }
      }
    }
  }
};

export const reduceProductQuantityByOne = {
  tags: ['Cart'],
  description:
    'This route allow logged in user/seller/admin to reduce product quantity by one',
  opeationId: 'reduceProductQuantityByOne',
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
            productId: {
              type: 'string',
              required: true
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Reduce product quantity by one',
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
                example: 'Item Reduced By One In Cart Successfully.'
              },
              cart: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    example: 'mle.mahmoud.yasser@gmail.com'
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                          example: '61221141f34a829cdf7ca542'
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
                  totalQuantity: {
                    type: 'integer',
                    example: 2
                  },
                  totalPrice: {
                    type: 'integer',
                    example: 6200
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
              message1: {
                type: 'string',
                example: 'No Cart Found For User With The Email: {email}'
              },
              message2: {
                type: 'string',
                example:
                  'No Product Found With This ID: {productId} In The Cart'
              }
            }
          }
        }
      }
    }
  }
};

export const deleteProductFromCart = {
  tags: ['Cart'],
  description:
    'This route allow logged in user/seller/admin to delete product from cart',
  opeationId: 'deleteProductFromCart',
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
      description: 'Product ID'
    }
  ],
  responses: {
    200: {
      description: 'Delete Product From Cart',
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
                example: 'Item Deleted From Cart Successfully.'
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
                example: 'No Cart Found For The User With This Email: {email}'
              },
              message2: {
                type: 'string',
                example: 'No Product Found With This ID: {productId}'
              }
            }
          }
        }
      }
    }
  }
};

export const deleteCart = {
  tags: ['Cart'],
  description: 'This route allow logged in user/seller/admin to delete cart',
  opeationId: 'deleteCart',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    }
  ],
  responses: {
    200: {
      description: 'Delete Cart',
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
                example: 'Cart Deleted Successfully.'
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
                example: 'No Cart Found For The User With This Email: {email}'
              }
            }
          }
        }
      }
    }
  }
};
