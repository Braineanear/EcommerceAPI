export const getAllProducts = {
  security: {
    jwt: []
  },
  tags: ['Product'],
  description: 'This route allow you to get all products',
  opeationId: 'getAllProducts',
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
      example: 'flawless',
      description:
        'This will filter all products and select only products that contain the word you insert and search in all product fields about this word'
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
        'Limit the number of products from for example 20 product to 5 products.'
    },
    {
      in: 'query',
      name: 'sort',
      type: 'string',
      example: '-1, name',
      description:
        'Sorting products according to specified field for example the name field, and the number before the field name indicates the order of items: descending (-1) or ascending (1)'
    },
    {
      in: 'query',
      name: 'page',
      type: 'string',
      example: '2',
      description:
        'When number of products is greater than 10 products, it divides into pages each page contain 10 products.'
    }
  ],
  responses: {
    200: {
      description: 'Get All Products',
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
                example: 'Products Found Successfully.'
              },
              products: {
                type: 'array',
                items: {
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
                      type: 'string',
                      example: '611ed87e7ae59e944d27920a'
                    },
                    priceDiscount: {
                      type: 'integer',
                      example: 15
                    },
                    priceAfterDiscount: {
                      type: 'integer',
                      example: 2635
                    },
                    colors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: {
                            type: 'string',
                            example: '6145a457d495858ff0d6e8a2'
                          },
                          color: {
                            type: 'string',
                            example: 'Black'
                          }
                        }
                      }
                    },
                    sizes: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: {
                            type: 'string',
                            example: '6145a458d495858ff0d6e8a5'
                          },
                          size: {
                            type: 'string',
                            example: 'Large'
                          }
                        }
                      }
                    },
                    seller: {
                      type: 'string',
                      example: '611f62e28fa5d0a76cefbc96'
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
                example: 'No products found.'
              }
            }
          }
        }
      }
    }
  }
};

export const getProduct = {
  security: {
    jwt: []
  },
  tags: ['Product'],
  description: "This route allow you to specific product using it's ID",
  opeationId: 'getProduct',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
    {
      in: 'path',
      name: 'productId',
      type: 'integer',
      description: 'Product ID'
    }
  ],
  responses: {
    200: {
      description: 'Get Product',
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
                example: 'Product Found Successfully.'
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
                    type: 'string',
                    example: '611ed87e7ae59e944d27920a'
                  },
                  priceDiscount: {
                    type: 'integer',
                    example: 15
                  },
                  priceAfterDiscount: {
                    type: 'integer',
                    example: 2635
                  },
                  colors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                          example: '6145a457d495858ff0d6e8a2'
                        },
                        color: {
                          type: 'string',
                          example: 'Black'
                        }
                      }
                    }
                  },
                  sizes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                          example: '6145a458d495858ff0d6e8a5'
                        },
                        size: {
                          type: 'string',
                          example: 'Large'
                        }
                      }
                    }
                  },
                  seller: {
                    type: 'string',
                    example: '611f62e28fa5d0a76cefbc96'
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
                example: 'No product found with this ID.'
              }
            }
          }
        }
      }
    }
  }
};

export const addProduct = {
  tags: ['Product'],
  description: 'This route allow only admin and seller to add new product',
  opeationId: 'addProduct',
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
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              required: true
            },
            description: {
              type: 'string',
              required: true
            },
            category: {
              type: 'string',
              required: true
            },
            price: {
              type: 'integer',
              required: true
            },
            priceDiscount: {
              type: 'integer',
              required: true
            },
            colors: {
              type: 'string',
              required: true,
              example: 'Red, Green, Blue'
            },
            sizes: {
              type: 'string',
              required: true,
              example: 'S, M, L'
            },
            quantity: {
              type: 'integer',
              required: true
            },
            sold: {
              type: 'integer',
              required: true
            },
            isOutOfStock: {
              type: 'boolean',
              required: true
            },
            mainImage: {
              type: 'string',
              format: 'image'
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                required: true
              }
            }
          }
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Add New Product',
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
                example: 'Product Created Successfully.'
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
                    type: 'string',
                    example: '611ed87e7ae59e944d27920a'
                  },
                  priceDiscount: {
                    type: 'integer',
                    example: 15
                  },
                  priceAfterDiscount: {
                    type: 'integer',
                    example: 2635
                  },
                  colors: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: '6145a457d495858ff0d6e8a2'
                    }
                  },
                  sizes: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: '6145a458d495858ff0d6e8a5'
                    }
                  },
                  seller: {
                    type: 'string',
                    example: '611f62e28fa5d0a76cefbc96'
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

export const top5Cheap = {
  security: {
    jwt: []
  },
  tags: ['Product'],
  description: 'This route allow you to get the top 5 cheapest products',
  opeationId: 'top5Cheap',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
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
        'Limit the number of products from for example 20 product to 5 products.'
    },
    {
      in: 'query',
      name: 'sort',
      type: 'string',
      example: '1, name',
      description:
        'Sorting products according to specified field for example the name field, and the number before the field name indicates the order of items: descending (-1) or ascending (1)'
    },
    {
      in: 'query',
      name: 'page',
      type: 'string',
      example: '2',
      description:
        'When number of products is greater than 10 products, it divides into pages each page contain 10 products.'
    }
  ],
  responses: {
    200: {
      description: 'Get Top 5 Cheapeast Products',
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
                example: 'Products Found Successfully.'
              },
              products: {
                type: 'array',
                items: {
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
                      type: 'string',
                      example: '611ed87e7ae59e944d27920a'
                    },
                    priceDiscount: {
                      type: 'integer',
                      example: 15
                    },
                    priceAfterDiscount: {
                      type: 'integer',
                      example: 2635
                    },
                    colors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: {
                            type: 'string',
                            example: '6145a457d495858ff0d6e8a2'
                          },
                          color: {
                            type: 'string',
                            example: 'Black'
                          }
                        }
                      }
                    },
                    sizes: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: {
                            type: 'string',
                            example: '6145a458d495858ff0d6e8a5'
                          },
                          size: {
                            type: 'string',
                            example: 'Large'
                          }
                        }
                      }
                    },
                    seller: {
                      type: 'string',
                      example: '611f62e28fa5d0a76cefbc96'
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
                example: 'No products found.'
              }
            }
          }
        }
      }
    }
  }
};

export const productStats = {
  tags: ['Product'],
  description:
    'This route allow only admin to get some statistics about products, ratings, categories, and price',
  opeationId: 'product-stats',
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
      description: 'Get Products Statistics',
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
                example: 'Product Statics.'
              },
              stats: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    'Number Of Products': {
                      type: 'integer',
                      example: 1
                    },
                    'Number Of Ratings': {
                      type: 'integer',
                      example: 0
                    },
                    'Average Rating': {
                      type: 'integer',
                      example: 4.5
                    },
                    'Average Price': {
                      type: 'integer',
                      example: 3100
                    },
                    'Minimum Price': {
                      type: 'integer',
                      example: 3100
                    },
                    'Maximum Price': {
                      type: 'integer',
                      example: 31
                    },
                    Quantity: {
                      type: 'integer',
                      example: 49
                    },
                    category: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          example: 'Laptop'
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
    }
  }
};

export const addProductColor = {
  tags: ['Product'],
  description: 'This route allow only admin or seller add new product color',
  opeationId: 'addProductColor',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
    {
      in: 'path',
      name: 'productId',
      type: 'integer',
      description: 'Product ID'
    }
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            color: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Add Product Color',
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
                example: 'Color added successfully.'
              },
              color: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    example: '6145e6f059b4c663fa7e0da2'
                  },
                  color: {
                    type: 'string',
                    example: 'Red'
                  },
                  product: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: '6145a457d495858ff0d6e89f'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    401: {
      description: 'Error: 401',
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
                example: 'Color already exists.'
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
                example: 'No product found with this ID.'
              }
            }
          }
        }
      }
    }
  }
};

export const addProductSize = {
  tags: ['Product'],
  description: 'This route allow only admin or seller add new product size',
  opeationId: 'addProductSize',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
    {
      in: 'path',
      name: 'productId',
      type: 'integer',
      description: 'Product ID'
    }
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            size: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Add Product Size',
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
                example: 'Size added successfully.'
              },
              color: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    example: '6145e6f059b4c663fa7e0da2'
                  },
                  size: {
                    type: 'string',
                    example: 'Large'
                  },
                  product: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: '6145a457d495858ff0d6e89f'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    401: {
      description: 'Error: 401',
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
                example: 'Size already exists.'
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
                example: 'No product found with this ID.'
              }
            }
          }
        }
      }
    }
  }
};

export const updateProductDetails = {
  tags: ['Product'],
  description:
    'This route allow only admin or seller to update product details',
  opeationId: 'updateProductDetails',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
    {
      in: 'path',
      name: 'productId',
      type: 'integer',
      description: 'Product ID'
    }
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            category: {
              type: 'string'
            },
            price: {
              type: 'integer'
            },
            priceDiscount: {
              type: 'integer'
            },
            quantity: {
              type: 'integer'
            },
            sold: {
              type: 'integer'
            },
            isOutOfStock: {
              type: 'boolean'
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Updated product details',
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
                example: 'Product details updated successfully.'
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
                example: 'No product found with this ID.'
              }
            }
          }
        }
      }
    }
  }
};

export const updateProductMainImage = {
  tags: ['Product'],
  description:
    'This route allow only seller or admin to update product main image [ mainImage ]',
  opeationId: 'updateProductMainImage',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'en_MX'
    },
    {
      in: 'path',
      name: 'productId',
      type: 'integer',
      description: 'Product ID'
    }
  ],
  requestBody: {
    required: true,
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            mainImage: {
              type: 'string',
              format: 'image'
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Updated product main image',
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
                example: 'Product main image updated successfully.'
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
                example: 'No product found with this ID.'
              }
            }
          }
        }
      }
    }
  }
};

export const updateProductImages = {
  tags: ['Product'],
  description:
    'This route allow only seller or admin to update product images [ images ]',
  opeationId: 'updateProductImages',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
    {
      in: 'path',
      name: 'productId',
      type: 'integer',
      description: 'Product ID'
    }
  ],
  requestBody: {
    required: true,
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            images: {
              type: 'string',
              format: 'image'
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Updated product images',
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
                example: 'Product images updated successfully.'
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
                example: 'Please select one or more image.'
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
                example: 'No product found with this ID.'
              }
            }
          }
        }
      }
    }
  }
};

export const deleteProduct = {
  tags: ['Product'],
  description:
    "This route allow logged in seller/admin to delete product using it's ID",
  opeationId: 'deleteProduct',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'en_MX'
    },
    {
      in: 'path',
      name: 'productId',
      type: 'integer',
      description: 'Product ID'
    }
  ],
  responses: {
    200: {
      description: "Delete product using it's ID",
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
                example: 'Product deleted successfully.'
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
                example: 'No product found with this ID.'
              }
            }
          }
        }
      }
    }
  }
};

export const deleteProductColor = {
  tags: ['Product'],
  description:
    "This route allow logged in seller/admin to delete product color using it's ID",
  opeationId: 'deleteProductColor',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'en_MX'
    },
    {
      in: 'path',
      name: 'productId',
      type: 'integer',
      description: 'Product ID'
    }
  ],
  responses: {
    200: {
      description: 'Delete Product Color',
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
                example: 'Product color deleted successfully.'
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
                example: 'No product found with this ID.'
              },
              message2: {
                type: 'string',
                example: 'Color does not exist.'
              }
            }
          }
        }
      }
    }
  }
};

export const deleteProductSize = {
  tags: ['Product'],
  description:
    "This route allow logged in seller/admin to delete product size using it's ID",
  opeationId: 'deleteProductSize',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'en_MX'
    },
    {
      in: 'path',
      name: 'productId',
      type: 'integer',
      description: 'Product ID'
    }
  ],
  responses: {
    200: {
      description: 'Delete product size',
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
                example: 'Size deleted successfully.'
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
                example: 'No product found with this ID.'
              },
              message2: {
                type: 'string',
                example: 'Size does not exist.'
              }
            }
          }
        }
      }
    }
  }
};
