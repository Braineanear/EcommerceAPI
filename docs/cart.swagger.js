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
                          type: 'object',
                          properties: {
                            _id: {
                              type: 'string',
                              example: '611f6385628e64b6ff96393c'
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                                example:
                                  'https://res.cloudinary.com/dknma8cck/image/upload/v1629447042/EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7%2C14InchUHD%2C1TBSSD%2C16GBRAM%2CIntegratedIntelIrisXeGraphics%2CWindows-ShadowBlack/ivz6pdoeo61hwbe5fos4.webp'
                              }
                            },
                            imagesId: {
                              type: 'array',
                              items: {
                                type: 'string',
                                example:
                                  'EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7,14InchUHD,1TBSSD,16GBRAM,IntegratedIntelIrisXeGraphics,Windows-ShadowBlack/ivz6pdoeo61hwbe5fos4'
                              }
                            },
                            price: {
                              type: 'integer',
                              example: 3100
                            },
                            quantity: {
                              type: 'integer',
                              example: 49
                            },
                            sold: {
                              type: 'integer',
                              example: 10
                            },
                            isOutOfStock: {
                              type: 'boolean',
                              example: false
                            },
                            ratingsAverage: {
                              type: 'integer',
                              example: 4.5
                            },
                            ratingsQuantity: {
                              type: 'integer',
                              example: 0
                            },
                            mainImage: {
                              type: 'string',
                              example:
                                'https://res.cloudinary.com/dknma8cck/image/upload/v1629447044/EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7%2C14InchUHD%2C1TBSSD%2C16GBRAM%2CIntegratedIntelIrisXeGraphics%2CWindows-ShadowBlack/kxrk6ijsf0osjxnnyuq2.webp'
                            },
                            mainImageId: {
                              type: 'string',
                              example:
                                'EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7,14InchUHD,1TBSSD,16GBRAM,IntegratedIntelIrisXeGraphics,Windows-ShadowBlack/kxrk6ijsf0osjxnnyuq2'
                            },
                            description: {
                              type: 'string',
                              example:
                                '1- Brand: Lenovo\n2- Dimensions: 319.5 x 216.7 x 15.3-16.5 mm\n3- Weight: 1.44 kg \n4- Operating system: Windows10 Home\n5- Hard Disk Capacity: 1 TB \n6- Hard Disk Interface: SSD\n7- Memory capacity: 16GB\n8- 11th Generation Intel Core i7 Processor\n9- Processor Number:  i7-1185G7 \n10- Number of Cores: 4\n11- Max Turbo Frequency: 4.8GHz\n12- 14 inches UHD (3840x2160) IPS 500nits\n13- Touchscreen:10-point Multi-touch\n14- Camera: 720P\n15- Graphic Card: Integrated Intel Iris Xe Graphics\n'
                            },
                            name: {
                              type: 'string',
                              example:
                                'Lenovo Yoga 9 14ITL5 Laptop - Intel Core i7-1185G7, 14 Inch UHD, 1TB SSD, 16 GB RAM, Integrated Intel Iris Xe Graphics, Windows - Shadow Black'
                            },
                            category: {
                              type: 'object',
                              properties: {
                                _id: {
                                  type: 'string',
                                  example: '611ed87e7ae59e944d27920a'
                                },
                                name: {
                                  type: 'string',
                                  example: 'Laptop'
                                },
                                description: {
                                  type: 'string',
                                  example:
                                    "This category contains all products related to Laptops, it's components and accessories"
                                },
                                image: {
                                  type: 'string',
                                  example:
                                    'https://res.cloudinary.com/dknma8cck/image/upload/v1629411453/EcommerceAPI/Category/Laptop/hqbknfppz8src5szz2w9.webp'
                                }
                              }
                            },
                            priceDiscount: {
                              type: 'integer',
                              example: 15
                            },
                            color: {
                              type: 'string',
                              example: 'Black'
                            },
                            size: {
                              type: 'string',
                              example: 'Large'
                            },
                            seller: {
                              type: 'object',
                              properties: {
                                _id: {
                                  type: 'string',
                                  example: '611f62e28fa5d0a76cefbc96'
                                },
                                name: {
                                  type: 'string',
                                  example: 'Ali Yasser'
                                },
                                email: {
                                  type: 'string',
                                  example: 'mle.ali.yasser@gmail.com'
                                },
                                companyName: {
                                  type: 'string',
                                  example: 'Souq'
                                },
                                address: {
                                  type: 'string',
                                  example: 'Cairo - Egypt'
                                },
                                phone: {
                                  type: 'string',
                                  example: '01541258221'
                                },
                                profileImage: {
                                  type: 'string',
                                  example:
                                    'https://res.cloudinary.com/dknma8cck/image/upload/v1629446881/EcommerceAPI/Users/AliYasser/kfexgexhxzleszejxrkn.webp'
                                }
                              }
                            },
                            createdAt: {
                              type: 'string',
                              example: '2021-08-20T08:10:45.242Z'
                            },
                            updatedAt: {
                              type: 'string',
                              example: '2021-08-20T08:10:45.242Z'
                            },
                            slug: {
                              type: 'string',
                              example:
                                'lenovo-yoga-9-14itl5-laptop-intel-core-i7-1185g7-14-inch-uhd-1tb-ssd-16-gb-ram-integrated-intel-iris-xe-graphics-windows-shadow-black'
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
                          type: 'object',
                          properties: {
                            _id: {
                              type: 'string',
                              example: '611f6385628e64b6ff96393c'
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                                example:
                                  'https://res.cloudinary.com/dknma8cck/image/upload/v1629447042/EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7%2C14InchUHD%2C1TBSSD%2C16GBRAM%2CIntegratedIntelIrisXeGraphics%2CWindows-ShadowBlack/ivz6pdoeo61hwbe5fos4.webp'
                              }
                            },
                            imagesId: {
                              type: 'array',
                              items: {
                                type: 'string',
                                example:
                                  'EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7,14InchUHD,1TBSSD,16GBRAM,IntegratedIntelIrisXeGraphics,Windows-ShadowBlack/ivz6pdoeo61hwbe5fos4'
                              }
                            },
                            price: {
                              type: 'integer',
                              example: 3100
                            },
                            quantity: {
                              type: 'integer',
                              example: 49
                            },
                            sold: {
                              type: 'integer',
                              example: 10
                            },
                            isOutOfStock: {
                              type: 'boolean',
                              example: false
                            },
                            ratingsAverage: {
                              type: 'integer',
                              example: 4.5
                            },
                            ratingsQuantity: {
                              type: 'integer',
                              example: 0
                            },
                            mainImage: {
                              type: 'string',
                              example:
                                'https://res.cloudinary.com/dknma8cck/image/upload/v1629447044/EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7%2C14InchUHD%2C1TBSSD%2C16GBRAM%2CIntegratedIntelIrisXeGraphics%2CWindows-ShadowBlack/kxrk6ijsf0osjxnnyuq2.webp'
                            },
                            mainImageId: {
                              type: 'string',
                              example:
                                'EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7,14InchUHD,1TBSSD,16GBRAM,IntegratedIntelIrisXeGraphics,Windows-ShadowBlack/kxrk6ijsf0osjxnnyuq2'
                            },
                            description: {
                              type: 'string',
                              example:
                                '1- Brand: Lenovo\n2- Dimensions: 319.5 x 216.7 x 15.3-16.5 mm\n3- Weight: 1.44 kg \n4- Operating system: Windows10 Home\n5- Hard Disk Capacity: 1 TB \n6- Hard Disk Interface: SSD\n7- Memory capacity: 16GB\n8- 11th Generation Intel Core i7 Processor\n9- Processor Number:  i7-1185G7 \n10- Number of Cores: 4\n11- Max Turbo Frequency: 4.8GHz\n12- 14 inches UHD (3840x2160) IPS 500nits\n13- Touchscreen:10-point Multi-touch\n14- Camera: 720P\n15- Graphic Card: Integrated Intel Iris Xe Graphics\n'
                            },
                            name: {
                              type: 'string',
                              example:
                                'Lenovo Yoga 9 14ITL5 Laptop - Intel Core i7-1185G7, 14 Inch UHD, 1TB SSD, 16 GB RAM, Integrated Intel Iris Xe Graphics, Windows - Shadow Black'
                            },
                            category: {
                              type: 'object',
                              properties: {
                                _id: {
                                  type: 'string',
                                  example: '611ed87e7ae59e944d27920a'
                                },
                                name: {
                                  type: 'string',
                                  example: 'Laptop'
                                },
                                description: {
                                  type: 'string',
                                  example:
                                    "This category contains all products related to Laptops, it's components and accessories"
                                },
                                image: {
                                  type: 'string',
                                  example:
                                    'https://res.cloudinary.com/dknma8cck/image/upload/v1629411453/EcommerceAPI/Category/Laptop/hqbknfppz8src5szz2w9.webp'
                                }
                              }
                            },
                            priceDiscount: {
                              type: 'integer',
                              example: 15
                            },
                            color: {
                              type: 'string',
                              example: 'Black'
                            },
                            size: {
                              type: 'string',
                              example: 'Large'
                            },
                            seller: {
                              type: 'object',
                              properties: {
                                _id: {
                                  type: 'string',
                                  example: '611f62e28fa5d0a76cefbc96'
                                },
                                name: {
                                  type: 'string',
                                  example: 'Ali Yasser'
                                },
                                email: {
                                  type: 'string',
                                  example: 'mle.ali.yasser@gmail.com'
                                },
                                companyName: {
                                  type: 'string',
                                  example: 'Souq'
                                },
                                address: {
                                  type: 'string',
                                  example: 'Cairo - Egypt'
                                },
                                phone: {
                                  type: 'string',
                                  example: '01541258221'
                                },
                                profileImage: {
                                  type: 'string',
                                  example:
                                    'https://res.cloudinary.com/dknma8cck/image/upload/v1629446881/EcommerceAPI/Users/AliYasser/kfexgexhxzleszejxrkn.webp'
                                }
                              }
                            },
                            createdAt: {
                              type: 'string',
                              example: '2021-08-20T08:10:45.242Z'
                            },
                            updatedAt: {
                              type: 'string',
                              example: '2021-08-20T08:10:45.242Z'
                            },
                            slug: {
                              type: 'string',
                              example:
                                'lenovo-yoga-9-14itl5-laptop-intel-core-i7-1185g7-14-inch-uhd-1tb-ssd-16-gb-ram-integrated-intel-iris-xe-graphics-windows-shadow-black'
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
                          type: 'object',
                          properties: {
                            _id: {
                              type: 'string',
                              example: '611f6385628e64b6ff96393c'
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                                example:
                                  'https://res.cloudinary.com/dknma8cck/image/upload/v1629447042/EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7%2C14InchUHD%2C1TBSSD%2C16GBRAM%2CIntegratedIntelIrisXeGraphics%2CWindows-ShadowBlack/ivz6pdoeo61hwbe5fos4.webp'
                              }
                            },
                            imagesId: {
                              type: 'array',
                              items: {
                                type: 'string',
                                example:
                                  'EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7,14InchUHD,1TBSSD,16GBRAM,IntegratedIntelIrisXeGraphics,Windows-ShadowBlack/ivz6pdoeo61hwbe5fos4'
                              }
                            },
                            price: {
                              type: 'integer',
                              example: 3100
                            },
                            quantity: {
                              type: 'integer',
                              example: 49
                            },
                            sold: {
                              type: 'integer',
                              example: 10
                            },
                            isOutOfStock: {
                              type: 'boolean',
                              example: false
                            },
                            ratingsAverage: {
                              type: 'integer',
                              example: 4.5
                            },
                            ratingsQuantity: {
                              type: 'integer',
                              example: 0
                            },
                            mainImage: {
                              type: 'string',
                              example:
                                'https://res.cloudinary.com/dknma8cck/image/upload/v1629447044/EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7%2C14InchUHD%2C1TBSSD%2C16GBRAM%2CIntegratedIntelIrisXeGraphics%2CWindows-ShadowBlack/kxrk6ijsf0osjxnnyuq2.webp'
                            },
                            mainImageId: {
                              type: 'string',
                              example:
                                'EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7,14InchUHD,1TBSSD,16GBRAM,IntegratedIntelIrisXeGraphics,Windows-ShadowBlack/kxrk6ijsf0osjxnnyuq2'
                            },
                            description: {
                              type: 'string',
                              example:
                                '1- Brand: Lenovo\n2- Dimensions: 319.5 x 216.7 x 15.3-16.5 mm\n3- Weight: 1.44 kg \n4- Operating system: Windows10 Home\n5- Hard Disk Capacity: 1 TB \n6- Hard Disk Interface: SSD\n7- Memory capacity: 16GB\n8- 11th Generation Intel Core i7 Processor\n9- Processor Number:  i7-1185G7 \n10- Number of Cores: 4\n11- Max Turbo Frequency: 4.8GHz\n12- 14 inches UHD (3840x2160) IPS 500nits\n13- Touchscreen:10-point Multi-touch\n14- Camera: 720P\n15- Graphic Card: Integrated Intel Iris Xe Graphics\n'
                            },
                            name: {
                              type: 'string',
                              example:
                                'Lenovo Yoga 9 14ITL5 Laptop - Intel Core i7-1185G7, 14 Inch UHD, 1TB SSD, 16 GB RAM, Integrated Intel Iris Xe Graphics, Windows - Shadow Black'
                            },
                            category: {
                              type: 'object',
                              properties: {
                                _id: {
                                  type: 'string',
                                  example: '611ed87e7ae59e944d27920a'
                                },
                                name: {
                                  type: 'string',
                                  example: 'Laptop'
                                },
                                description: {
                                  type: 'string',
                                  example:
                                    "This category contains all products related to Laptops, it's components and accessories"
                                },
                                image: {
                                  type: 'string',
                                  example:
                                    'https://res.cloudinary.com/dknma8cck/image/upload/v1629411453/EcommerceAPI/Category/Laptop/hqbknfppz8src5szz2w9.webp'
                                }
                              }
                            },
                            priceDiscount: {
                              type: 'integer',
                              example: 15
                            },
                            color: {
                              type: 'string',
                              example: 'Black'
                            },
                            size: {
                              type: 'string',
                              example: 'Large'
                            },
                            seller: {
                              type: 'object',
                              properties: {
                                _id: {
                                  type: 'string',
                                  example: '611f62e28fa5d0a76cefbc96'
                                },
                                name: {
                                  type: 'string',
                                  example: 'Ali Yasser'
                                },
                                email: {
                                  type: 'string',
                                  example: 'mle.ali.yasser@gmail.com'
                                },
                                companyName: {
                                  type: 'string',
                                  example: 'Souq'
                                },
                                address: {
                                  type: 'string',
                                  example: 'Cairo - Egypt'
                                },
                                phone: {
                                  type: 'string',
                                  example: '01541258221'
                                },
                                profileImage: {
                                  type: 'string',
                                  example:
                                    'https://res.cloudinary.com/dknma8cck/image/upload/v1629446881/EcommerceAPI/Users/AliYasser/kfexgexhxzleszejxrkn.webp'
                                }
                              }
                            },
                            createdAt: {
                              type: 'string',
                              example: '2021-08-20T08:10:45.242Z'
                            },
                            updatedAt: {
                              type: 'string',
                              example: '2021-08-20T08:10:45.242Z'
                            },
                            slug: {
                              type: 'string',
                              example:
                                'lenovo-yoga-9-14itl5-laptop-intel-core-i7-1185g7-14-inch-uhd-1tb-ssd-16-gb-ram-integrated-intel-iris-xe-graphics-windows-shadow-black'
                            }
                          }
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
                          type: 'object',
                          properties: {
                            _id: {
                              type: 'string',
                              example: '611f6385628e64b6ff96393c'
                            },
                            images: {
                              type: 'array',
                              items: {
                                type: 'string',
                                example:
                                  'https://res.cloudinary.com/dknma8cck/image/upload/v1629447042/EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7%2C14InchUHD%2C1TBSSD%2C16GBRAM%2CIntegratedIntelIrisXeGraphics%2CWindows-ShadowBlack/ivz6pdoeo61hwbe5fos4.webp'
                              }
                            },
                            imagesId: {
                              type: 'array',
                              items: {
                                type: 'string',
                                example:
                                  'EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7,14InchUHD,1TBSSD,16GBRAM,IntegratedIntelIrisXeGraphics,Windows-ShadowBlack/ivz6pdoeo61hwbe5fos4'
                              }
                            },
                            price: {
                              type: 'integer',
                              example: 3100
                            },
                            quantity: {
                              type: 'integer',
                              example: 49
                            },
                            sold: {
                              type: 'integer',
                              example: 10
                            },
                            isOutOfStock: {
                              type: 'boolean',
                              example: false
                            },
                            ratingsAverage: {
                              type: 'integer',
                              example: 4.5
                            },
                            ratingsQuantity: {
                              type: 'integer',
                              example: 0
                            },
                            mainImage: {
                              type: 'string',
                              example:
                                'https://res.cloudinary.com/dknma8cck/image/upload/v1629447044/EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7%2C14InchUHD%2C1TBSSD%2C16GBRAM%2CIntegratedIntelIrisXeGraphics%2CWindows-ShadowBlack/kxrk6ijsf0osjxnnyuq2.webp'
                            },
                            mainImageId: {
                              type: 'string',
                              example:
                                'EcommerceAPI/Products/LenovoYoga914ITL5Laptop-IntelCorei7-1185G7,14InchUHD,1TBSSD,16GBRAM,IntegratedIntelIrisXeGraphics,Windows-ShadowBlack/kxrk6ijsf0osjxnnyuq2'
                            },
                            description: {
                              type: 'string',
                              example:
                                '1- Brand: Lenovo\n2- Dimensions: 319.5 x 216.7 x 15.3-16.5 mm\n3- Weight: 1.44 kg \n4- Operating system: Windows10 Home\n5- Hard Disk Capacity: 1 TB \n6- Hard Disk Interface: SSD\n7- Memory capacity: 16GB\n8- 11th Generation Intel Core i7 Processor\n9- Processor Number:  i7-1185G7 \n10- Number of Cores: 4\n11- Max Turbo Frequency: 4.8GHz\n12- 14 inches UHD (3840x2160) IPS 500nits\n13- Touchscreen:10-point Multi-touch\n14- Camera: 720P\n15- Graphic Card: Integrated Intel Iris Xe Graphics\n'
                            },
                            name: {
                              type: 'string',
                              example:
                                'Lenovo Yoga 9 14ITL5 Laptop - Intel Core i7-1185G7, 14 Inch UHD, 1TB SSD, 16 GB RAM, Integrated Intel Iris Xe Graphics, Windows - Shadow Black'
                            },
                            category: {
                              type: 'object',
                              properties: {
                                _id: {
                                  type: 'string',
                                  example: '611ed87e7ae59e944d27920a'
                                },
                                name: {
                                  type: 'string',
                                  example: 'Laptop'
                                },
                                description: {
                                  type: 'string',
                                  example:
                                    "This category contains all products related to Laptops, it's components and accessories"
                                },
                                image: {
                                  type: 'string',
                                  example:
                                    'https://res.cloudinary.com/dknma8cck/image/upload/v1629411453/EcommerceAPI/Category/Laptop/hqbknfppz8src5szz2w9.webp'
                                }
                              }
                            },
                            priceDiscount: {
                              type: 'integer',
                              example: 15
                            },
                            color: {
                              type: 'string',
                              example: 'Black'
                            },
                            size: {
                              type: 'string',
                              example: 'Large'
                            },
                            seller: {
                              type: 'object',
                              properties: {
                                _id: {
                                  type: 'string',
                                  example: '611f62e28fa5d0a76cefbc96'
                                },
                                name: {
                                  type: 'string',
                                  example: 'Ali Yasser'
                                },
                                email: {
                                  type: 'string',
                                  example: 'mle.ali.yasser@gmail.com'
                                },
                                companyName: {
                                  type: 'string',
                                  example: 'Souq'
                                },
                                address: {
                                  type: 'string',
                                  example: 'Cairo - Egypt'
                                },
                                phone: {
                                  type: 'string',
                                  example: '01541258221'
                                },
                                profileImage: {
                                  type: 'string',
                                  example:
                                    'https://res.cloudinary.com/dknma8cck/image/upload/v1629446881/EcommerceAPI/Users/AliYasser/kfexgexhxzleszejxrkn.webp'
                                }
                              }
                            },
                            createdAt: {
                              type: 'string',
                              example: '2021-08-20T08:10:45.242Z'
                            },
                            updatedAt: {
                              type: 'string',
                              example: '2021-08-20T08:10:45.242Z'
                            },
                            slug: {
                              type: 'string',
                              example:
                                'lenovo-yoga-9-14itl5-laptop-intel-core-i7-1185g7-14-inch-uhd-1tb-ssd-16-gb-ram-integrated-intel-iris-xe-graphics-windows-shadow-black'
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
