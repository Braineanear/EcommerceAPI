export const addFavoriteProduct = {
  tags: ['Favorite'],
  description:
    'This route allow logged in user/seller/admin to add product to his favorite list',
  opeationId: 'addFavoriteProduct',
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
      description: 'Add Product Favorite List',
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
                example: 'Product added to favorite list successfully.'
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
                example: 'Product already exits.'
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
                example: 'No product found with this ID: {id}'
              }
            }
          }
        }
      }
    }
  }
};

export const getFavoriteList = {
  tags: ['Favorite'],
  description:
    'This route allow logged in user/seller/admin to get his favorite products list',
  opeationId: 'getFavoriteList',
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
      description: "Get Product's Favorite List",
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
                example: 'Favorite list successfully retrieved.'
              },
              favorite: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    example: '613a6902c5fcab984501f7ee'
                  },
                  user: {
                    type: 'string',
                    example: '611d0cf2ab79f9bb0c388234'
                  },
                  products: {
                    type: 'array',
                    items: {
                      example: '611f6385628e64b6ff96393c'
                    }
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
                example: 'No products on the favorite list found'
              }
            }
          }
        }
      }
    }
  }
};

export const deleteProductFromFavorite = {
  tags: ['Favorite'],
  description:
    'This route allow logged in user/seller/admin to delete product from favorite list',
  opeationId: 'deleteProductFromFavorite',
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
      description: 'Delete Product From Favorite List',
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
                example: 'Product deleted from favorite list successfully.'
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
                example: 'Product not found in favorite list.'
              }
            }
          }
        }
      }
    }
  }
};

export const checkProductInFavoriteList = {
  tags: ['Favorite'],
  description:
    'This route allow logged in user/seller/admin to check if product in favorite list',
  opeationId: 'checkProductInFavoriteList',
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
      description: 'Check if Product in Favorite List',
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
                example: 'Product in favorite list.'
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
                example: 'Product not found in favorite list.'
              }
            }
          }
        }
      }
    }
  }
};
