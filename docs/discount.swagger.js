export const generateDiscountCode = {
  tags: ['Discount'],
  description: 'This route allow admin to generate new discount code',
  opeationId: 'generateDiscountCode',
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
            codeLength: {
              type: 'number',
              required: true
            },
            discountStart: {
              type: 'number',
              required: true
            },
            discountEnd: {
              type: 'number',
              required: true
            },
            availableStart: {
              type: 'number',
              required: true
            },
            availableEnd: {
              type: 'number',
              required: true
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Generate New Discount Code',
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
                example: 'Discount code generated successfully.'
              },
              discountCode: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    example: 'KqjNGwRsJY'
                  },
                  discount: {
                    type: 'number',
                    example: 7
                  },
                  available: {
                    type: 'number',
                    example: 41
                  },
                  _id: {
                    type: 'string',
                    example: '613a6fe36578caa1a2a7fd9d'
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
                example: 'All fields are required.'
              }
            }
          }
        }
      }
    }
  }
};

export const getAllDiscountCodes = {
  tags: ['Discount'],
  description: 'This route allow admin to get all discount codes',
  opeationId: 'getAllDiscountCodes',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'en_MX'
    },
    {
      in: 'query',
      name: 'filter',
      type: 'string',
      example: '8',
      description:
        'This will filter all discounts and select only discounts that contain the word you insert and search in all discount fields about this word'
    },
    {
      in: 'query',
      name: 'select',
      type: 'string',
      example: 'code',
      description: 'Select only fields you want.'
    },
    {
      in: 'query',
      name: 'limit',
      type: 'string',
      example: '5',
      description:
        'Limit the number of discounts from for example 20 discount to 5 discounts.'
    },
    {
      in: 'query',
      name: 'sort',
      type: 'string',
      example: '-1, code',
      description:
        'Sorting discounts according to specified field for example the code field, and the number before the field name indicates the order of items: descending (-1) or ascending (1)'
    },
    {
      in: 'query',
      name: 'page',
      type: 'string',
      example: '2',
      description:
        'When number of discounts is greater than 10 discounts, it divides into pages each page contain 10 discounts.'
    }
  ],
  responses: {
    200: {
      description: 'Get All Discount Codes',
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
                example: 'Discount codes found successfully.'
              },
              codes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                      example: '613a6fa16578caa1a2a7fd90'
                    },
                    code: {
                      type: 'string',
                      example: 'bbrgVdTh9i'
                    },
                    discount: {
                      type: 'number',
                      example: 8
                    },
                    available: {
                      type: 'number',
                      exmaple: 54
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
                example: 'No discount codes found'
              }
            }
          }
        }
      }
    }
  }
};

export const getDiscount = {
  tags: ['Discount'],
  description: 'This route allow user to get discount amount',
  opeationId: 'getDiscount',
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
      description: 'Get Discount',
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
                example: 'Discount found successfully.'
              },
              discount: {
                type: 'number',
                example: 25
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
                example: 'No discount codes found'
              }
            }
          }
        }
      }
    }
  }
};

export const deleteDiscountCode = {
  tags: ['Discount'],
  description: 'This route allow logged in admin to delete discount code',
  opeationId: 'deleteDiscountCode',
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
      description: 'Discount Code ID'
    }
  ],
  responses: {
    200: {
      description: 'Delete discount code',
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
                example: 'Discount code deleted successfully.'
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
                example: 'No discount code found.'
              }
            }
          }
        }
      }
    }
  }
};

export const verifyDiscountCode = {
  tags: ['Discount'],
  description: 'This route allow logged in user/seller to verify discount code',
  opeationId: 'verifyDiscountCode',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    }
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            discountCode: {
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
      description: 'Verify discount code',
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
                example: 'Discount code verification completed successfully.'
              },
              discount: {
                type: 'number',
                example: 29
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
                example: 'All fields are required.'
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
                example: 'No discount code found.'
              }
            }
          }
        }
      }
    }
  }
};

export const cancelDiscountCode = {
  tags: ['Discount'],
  description: 'This route allow logged in user to cancel discount code',
  opeationId: 'cancelDiscountCode',
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
      description: 'Cancel discount code',
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
                example: 'Discount code cancelled from order successfully.'
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
                example: 'No discount code found.'
              },
              message2: {
                type: 'string',
                example: 'No user found.'
              }
            }
          }
        }
      }
    }
  }
};
