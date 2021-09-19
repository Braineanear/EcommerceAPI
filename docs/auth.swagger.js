export const signUp = {
  security: {
    jwt: []
  },
  tags: ['Auth'],
  description: 'This route allow you to sign up into the api',
  opeationId: 'signUp',
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
            },
            image: {
              type: 'string',
              format: 'image'
            }
          }
        }
      }
    }
  },
  responses: {
    201: {
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
                  },
                  _id: {
                    type: 'string',
                    example: '613395db169b2d0004ddc900'
                  },
                  discountCode: {
                    type: 'string',
                    example: ''
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
              },
              message3: {
                type: 'string',
                example:
                  'Password must be longer than 8 characters and contains letters, numbers, and symbols'
              },
              message4: {
                type: 'string',
                example: 'Role must be one of the following: user or seller'
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

export const signIn = {
  security: {
    jwt: []
  },
  tags: ['Auth'],
  description: 'This route allow you to login into the api',
  opeationId: 'signIn',
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
            email: {
              type: 'string',
              required: true
            },
            password: {
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
                example: 'User logged in successfully.'
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
                    example:
                      '$argon2i$v=19$m=4096,t=3,p=1$gdPMtw/fNAnUPooMTB4BdHfNMCdg8/2gqbfXUDJuw68$WLwxa/Ms09mUNMe3GzmEVCqzhyF+eJIhVdtn3KCKzi0'
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
                  },
                  _id: {
                    type: 'string',
                    example: '611d08a62fc210a30ecfb75b'
                  },
                  discountCode: {
                    type: 'string',
                    example: 'xvgVxIV0LJ'
                  }
                }
              },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                    example:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTFkMDU4NWYzODY2MDhlZjIzYzI3OGQiLCJpYXQiOjE2MjkyOTIwMjAsImV4cCI6MTYyOTI5MzgyMCwidHlwZSI6ImFjY2VzcyJ9.qGuYIZQBa2UkB5WkxSy29xNdMWpVlETuK3g7T4R5Fj8'
                  },
                  refreshToken: {
                    type: 'string',
                    example:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTFkMDU4NWYzODY2MDhlZjIzYzI3OGQiLCJpYXQiOjE2MjkyOTIwMjAsImV4cCI6MTYzMTg4NDAyMCwidHlwZSI6InJlZnJlc2gifQ.pxSceF4uGMlPxaQLjdUiaEdi3ejCxnWPtSApm7BdGCw'
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
                example: 'Please enter both email and password.'
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
                example: 'Incorrect email or password.'
              }
            }
          }
        }
      }
    }
  }
};

export const logout = {
  security: {
    jwt: []
  },
  tags: ['Auth'],
  description: 'This route allow you to logout from the api',
  opeationId: 'logout',
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
            refreshToken: {
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
      description: 'Logout from the api using you refresh token.',
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
                example: 'Logged out successfully.'
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
                example: 'Please login again!'
              }
            }
          }
        }
      }
    }
  }
};

export const generateTokens = {
  security: {
    jwt: []
  },
  tags: ['Auth'],
  description:
    'This route allow the user with a refresh token to regenerate tokens when the access token expires',
  opeationId: 'generateTokens',
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
            refreshToken: {
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
      description:
        'Regenerate tokens and use them to log into the system again.',
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
                example: 'Tokens generated successfully.'
              },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                    example:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTFkMDhhNjJmYzIxMGEzMGVjZmI3NWIiLCJpYXQiOjE2MjkyOTI3NzgsImV4cCI6MTYyOTI5NDU3OCwidHlwZSI6ImFjY2VzcyJ9.NpXEYDrETL3yZKMLUmAKYrfH1_a2mmoKagP0MPc6HFY'
                  },
                  refreshToken: {
                    type: 'string',
                    example:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTFkMDhhNjJmYzIxMGEzMGVjZmI3NWIiLCJpYXQiOjE2MjkyOTI3NzgsImV4cCI6MTYzMTg4NDc3OCwidHlwZSI6InJlZnJlc2gifQ.VG-vE3RyQi2SRdDNd_AeHH3Ue9OYtaEE2W_gfNTtE_Q'
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
                example: 'No user found.'
              },
              message2: {
                type: 'string',
                example: 'No token found.'
              }
            }
          }
        }
      }
    }
  }
};

export const forgotPassword = {
  security: {
    jwt: []
  },
  tags: ['Auth'],
  description:
    'This route allow you to send email with the reset password link to reset the password you forgot',
  opeationId: 'forgotPassword',
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
            email: {
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
      description:
        'A link is going now to be sent to you email to reset you password.',
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
                example: 'Reset Password Link Sent Successfully.'
              }
            }
          }
        }
      }
    }
  }
};

export const resetPassword = {
  security: {
    jwt: []
  },
  tags: ['Auth'],
  description:
    'This route allow you to reset you password using the token you received in you email',
  opeationId: 'resetPassword',
  parameters: [
    {
      in: 'header',
      name: 'Accept-Language',
      type: 'string',
      example: 'ar_MX'
    },
    {
      in: 'query',
      name: 'token',
      type: 'string',
      required: true
    }
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            password: {
              type: 'string',
              required: true
            },
            passwordConfirmation: {
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
      description: 'Reset you password using the reset token.',
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
                example: 'Password changed successfully.'
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
                example: 'No user found.'
              }
            }
          }
        }
      }
    }
  }
};

export const changePassword = {
  tags: ['Auth'],
  description: 'This route allow you to user to change his password',
  opeationId: 'changePassword',
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
            currentPassword: {
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
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Change password.',
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
                example: 'Password changed successfully.'
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
                example: 'Password and passwordConfirmation must be the same.'
              },
              message2: {
                type: 'string',
                example:
                  'This is not your password. Please enter the correct current password.'
              }
            }
          }
        }
      }
    }
  }
};
