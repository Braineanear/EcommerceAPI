export const getAllUsers = {
  security: {
    jwt: []
  },
  tags: ['User'],
  description: 'This route allow you to get all users data',
  opeationId: 'getAllUsers',
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
      example: '-1, name',
      description:
        'Sorting users according to specified field for example the name field, and the number before the field name indicates the order of items: descending (-1) or ascending (1)'
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
                example: 'No Users Found'
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
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
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
              user: {
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
                example: 'No User Found With This ID: {id}'
              }
            }
          }
        }
      }
    }
  }
};

export const addUser = {
  tags: ['User'],
  description: 'This route allow only admin to add new user',
  opeationId: 'addUser',
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
            username: {
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
              required: true
            },
            image: {
              type: 'string',
              format: 'image',
              required: true
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
    201: {
      description: 'Add new user',
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
                example: 'Account Created Successfully.'
              },
              user: {
                type: 'object',
                properties: {
                  role: {
                    type: 'string',
                    example: 'user'
                  },
                  isEmailVerified: {
                    type: 'boolean',
                    example: false
                  },
                  favoriteProducts: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  },
                  _id: {
                    type: 'string',
                    example: '6123f6756874853c161ec5b9'
                  },
                  name: {
                    type: 'string',
                    example: 'armar'
                  },
                  username: {
                    type: 'string',
                    example: 'armar'
                  },
                  email: {
                    type: 'string',
                    example: 'armar@gmail.com'
                  },
                  companyName: {
                    type: 'string',
                    example: ''
                  },
                  phone: {
                    type: 'string',
                    example: ''
                  },
                  address: {
                    type: 'string',
                    example: ''
                  },
                  profileImage: {
                    type: 'string',
                    example:
                      'https://res.cloudinary.com/dknma8cck/image/upload/v1629746804/EcommerceAPI/Users/armar/cmt6rf3l45rs0lqaviq7.webp'
                  },
                  profileImageId: {
                    type: 'string',
                    example: 'EcommerceAPI/Users/armar/cmt6rf3l45rs0lqaviq7'
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
              message1: {
                type: 'string',
                example: 'Profile Image Is Required, Please Upload an Image'
              },
              message2: {
                type: 'string',
                example: 'All Fields Are Required'
              }
            }
          }
        }
      }
    },
    409: {
      description: 'Error: 409',
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
                example: 'Email Is Already Taken: {email}'
              }
            }
          }
        }
      }
    }
  }
};

export const updateUserDetails = {
  tags: ['User'],
  description:
    'This route allow logged in user to update his own profile details',
  opeationId: 'updateUserDetails',
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
            name: {
              type: 'string'
            },
            username: {
              type: 'string'
            },
            email: {
              type: 'string'
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
      description: 'Update user details',
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
                example: 'User Details Updated Successfully.'
              },
              user: {
                type: 'object',
                properties: {
                  role: {
                    type: 'string',
                    example: 'user'
                  },
                  isEmailVerified: {
                    type: 'boolean',
                    example: false
                  },
                  favoriteProducts: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  },
                  _id: {
                    type: 'string',
                    example: '6123f6756874853c161ec5b9'
                  },
                  name: {
                    type: 'string',
                    example: 'armar1'
                  },
                  username: {
                    type: 'string',
                    example: 'armar1'
                  },
                  email: {
                    type: 'string',
                    example: 'armar@gmail.com'
                  },
                  companyName: {
                    type: 'string',
                    example: ''
                  },
                  phone: {
                    type: 'string',
                    example: '12345678912'
                  },
                  address: {
                    type: 'string',
                    example: ''
                  },
                  profileImage: {
                    type: 'string',
                    example:
                      'https://res.cloudinary.com/dknma8cck/image/upload/v1629746804/EcommerceAPI/Users/armar/cmt6rf3l45rs0lqaviq7.webp'
                  },
                  profileImageId: {
                    type: 'string',
                    example: 'EcommerceAPI/Users/armar/cmt6rf3l45rs0lqaviq7'
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
                example:
                  'Cannot Update Password From Here, Please Go To Update Password Route'
              }
            }
          }
        }
      }
    },
    409: {
      description: 'Error: 409',
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
                example: 'This Email Is Already Taken: {email}'
              }
            }
          }
        }
      }
    }
  }
};

export const updateUserProfileImage = {
  tags: ['User'],
  description:
    'This route allow logged in user to update his own profile image',
  opeationId: 'updateUserProfileImage',
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
            image: {
              type: 'string',
              format: 'image',
              required: true
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Update user profile image',
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
                example: 'User Image Updated Successfully.'
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
                example: 'Profile Image Is Required, Please Upload an Image'
              }
            }
          }
        }
      }
    }
  }
};

export const deleteUser = {
  tags: ['User'],
  description:
    "This route allow only admin to delete user account using it's ID",
  opeationId: 'deleteUser',
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
      description: 'User ID'
    }
  ],
  responses: {
    200: {
      description: 'Delete user account',
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
                example: 'Account Deleted Successfully.'
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
                example: 'No User Found With This ID: {id}'
              }
            }
          }
        }
      }
    }
  }
};

export const deleteMyAccount = {
  tags: ['User'],
  description: 'This route allow logged in user to delete his account',
  opeationId: 'deleteMyAccount',
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
      description: 'Delete logged in user account',
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
                example: 'Your Account Deleted Successfully.'
              }
            }
          }
        }
      }
    }
  }
};
