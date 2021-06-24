<!-- PROJECT LOGO -->
<br />
<h1 align="center">
  <a href="https://github.com/Braineanear/EcommerceAPI">
    <img src="https://hackernoon.com/hn-images/1*lAR9Uh_gJ7dp23e0vhy5Hg.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">Ecommerce API</h3>
</h1>

<h4 align="center">An API for ecommerce works built using NodeJS & MongoDB</h4>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#deployed-version">Demo</a>
    </li>
    <li>
      <a href="#key-features">Key Features</a>
    </li>
    <li>
      <a href="#api-usage">API Usage</a>
    </li>
    <li>
      <a href="#deployment">Deployment</a>
    </li>
    <li>
      <a href="#build-with">Build With</a>
    </li>
    <li>
      <a href="#to-do">To Do</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li>
      <a href="#known-bugs">Known Bugs</a>
    </li>
    <li>
      <a href="#contributing">Contributing</a>
    </li>
    <li>
      <a href="#contact">Contact</a>
    </li>

  </ol>
</details>

## Deployed Version

Live demo (Feel free to visit) 👉 : </>

## Key Features

* Authentication and Authorization
  * Login & Logout & SignUp
* User
  * Create New User
  * Query Users
  * Query User Using It's ID
  * Update User Details Using It's ID
  * Update User Profile Image Using It's ID
  * Delete User Using It's ID
* Redis
  * Caching API Data
* SMS
  * Sending SMS Message with SignUp Verification Code
* Notification
  * Socket.IO Notifications
* Email Service
  * Sending Emails
* Cart Services
  * Add Product To Cart
  * Subtract Quantity From Product In Cart
  * Reduce Product Quantity By One
  * Increase Product Quantity By One
  * Get Cart
  * Delete Cart Item
  * Delete Cart
* Review Services
  * Create New Review
  * Query All Reviews
  * Query Review Using It's ID
  * Update Review Using It's ID
  * Delete Review Using It's ID
* Product Services
  * Query products
  * Query Product Using It's ID
  * Create new product
  * Update Product Details
  * Update Product Main Image
  * Update Product Images
  * Delete Product Using It's ID
  * Get Products Statics
* Order Services
  * Create New Order
  * Query Orders
  * Query Order Using It's ID
  * Cancel Order
* Category Services
  * Create New Category
  * Query Categories
  * Query Category Using It's ID
  * Update Category Details
  * Update Category Image
  * Delete Category

## API Usage

Check [Ecommerce API Documentation]() for more info.

## Deployment

The API is deployed with git into Heroku. Below are the steps taken:

```
git init
git add -A
git commit -m "Commit message"
```

## Built With

List of any major frameworks used to build the project.

* [NodeJS](https://nodejs.org/) - JS runtime environment
* [ExpressJS](https://expressjs.com/) - The NodeJS framework used
* [MongoDB](https://www.mongodb.com/) - NoSQL Database uses JSON-like documents with optional schemas
* [Mongoose](https://mongoosejs.com/) - Object Data Modeling (ODM) library for MongoDB and NodeJS
* [Argon2](https://www.npmjs.com/package/argon2) - Encryption & Decryption Algorithm
* [Vonage-Nexmo](https://www.vonage.com/communications-apis/) - Offers communications APIs
* [Cloudinary](https://cloudinary.com/) - Cloud-based service
* [Compression](https://www.npmjs.com/package/compression) - NodeJS compression middleware
* [Cors](https://www.npmjs.com/package/cors) - NodeJS package for providing a Connect/Express middleware that can be used to enable CORS with various options
* [Datauri](https://www.npmjs.com/package/datauri) - Create DataURI scheme easily
* [Dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a . env file into process. env
* [Rate Limiter](https://www.npmjs.com/package/express-rate-limit) - Basic IP rate-limiting middleware for Express
* [Helmet](https://www.npmjs.com/package/helmet) - Secure Express apps by setting various HTTP headers
* [Joi](https://www.npmjs.com/package/joi) - The most powerful schema description language and data validator for JavaScript
* [JWT](https://jwt.io/) - Compact URL-safe means of representing claims to be transferred between two parties
* [Method Override](https://www.npmjs.com/package/method-override) - Use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
* [Moment](https://momentjs.com/) - JavaScript library which helps is parsing, validating, manipulating and displaying date/time in JavaScript in a very easy way
* [Morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for NodeJS
* [Multer](https://www.npmjs.com/package/multer) - NodeJS middleware for handling multipart/form-data
* [Nodemailer](https://www.npmjs.com/package/nodemailer) - Easy as cake e-mail sending from your Node.js applications
* [Passport](http://www.passportjs.org/) - Express-compatible authentication middleware for NodeJS
* [Passport JWT](http://www.passportjs.org/packages/passport-jwt/) - Creates a new extractor that looks for the JWT in the given URL query parameter
* [Validator](https://www.npmjs.com/package/validator) - A library of string validators and sanitizers.
* [Winston](https://www.npmjs.com/package/winston) - A logger for just about everything.
* [XSS Clean](https://www.npmjs.com/package/xss-clean) - Middleware to sanitize user input

## To-do

* Using MicroServices with Event-Driven.

* Using TypeScript.

## Installation

You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the
dependencies by running
```
$ npm i
set your env variables
$ npm start
```

## Known Bugs
Feel free to email me at mle.mahmoud.yasser@gmail.com if you run into any issues or have questions, ideas or concerns.
Please enjoy and feel free to share your opinion, constructive criticism, or comments about my work. Thank you! 🙂

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- CONTACT -->
## Contact

Twitter - [@Mahmoud03203227](https://twitter.com/Mahmoud03203227)

Email - [mle.mahmoud.yasser@gmail.com]()

Facebook - [MahmoudYasserMLE](https://www.facebook.com/MahmoudYasserMLE/)

Project: [https://github.com/Braineanear/EcommerceAPI](https://github.com/Braineanear/EcommerceAPI)
