define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Log a user in",
    "version": "1.0.0",
    "name": "PostLogin",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint logs a user into the site and generates an access token for them if successful.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"Content-Type: application/json\"\n     -d '{\"email\": \"josh@company.com\", \"password\": \"josh123\"}'\n     https://synergyims.me/api/auth/login",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email address of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The password of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The bearer token for the user to authenticate with.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "expires",
            "description": "<p>The epoch time of when the token expires.</p>"
          },
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "user",
            "description": "<p>Info about the new user.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidPassword",
            "description": "<p>The password provided did not match the password for the user.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>No user with the provided email was found in the database.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The caller must provide all the parameters and as the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/logout",
    "title": "Log a user out",
    "version": "1.0.0",
    "name": "PostLogout",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint logs a user out of the system and revokes their access token from being used further.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/auth/logout",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"Successfully revoked access token.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/register",
    "title": "Register a new company and user",
    "version": "1.0.0",
    "name": "PostRegister",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint registers a new user as owner along with creating a new company for that user.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"Content-Type: application/json\"\n     -d '{\"company_name\": \"Macrosoft\", \"address\": \"1280 Main St. W\", \"company_phone\": \"999-999-9999\", ...}'\n     https://synergyims.me/api/auth/register",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "company_name",
            "description": "<p>The name of the new company.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>The address of the new company.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "company_phone",
            "description": "<p>The phone number of the new company.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>The first name of the new user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>The last name of the new user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email address of the new user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The phone number of the new user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee_num",
            "description": "<p>The employee number of the new user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The password of the new user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The bearer token for the user to authenticate with.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "expires",
            "description": "<p>The epoch time of when the token expires.</p>"
          },
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "user",
            "description": "<p>Info about the new user.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The caller must provide all the parameters and as the correct type.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EmailAlreadyInUse",
            "description": "<p>The email address provided must be unique.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/verify",
    "title": "Verify a user's access token",
    "version": "1.0.0",
    "name": "PostVerify",
    "group": "Auth",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint verifies the validity of a user's access token.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/auth/verify",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "company_name",
            "description": "<p>The name of the user's registered company.</p>"
          },
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "permissions",
            "description": "<p>The permissions tree of the user's registered company.</p>"
          },
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "payload",
            "description": "<p>The decoded payload section of the user's provided access token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>The token provided by the user is either expired, revoked or invalid.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "delete",
    "url": "/brand/:id",
    "title": "Delete brand",
    "version": "1.0.0",
    "name": "DeleteBrand",
    "group": "Brand",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint deletes a brand.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/brand/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the brand.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"1 row successfully deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/brand/brand.js",
    "groupTitle": "Brand"
  },
  {
    "type": "get",
    "url": "/brand/:id",
    "title": "Get brand",
    "version": "1.0.0",
    "name": "GetBrand",
    "group": "Brand",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns a specific brand based on the given brand id.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/brand/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the brand.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The brand info.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/brand/brand.js",
    "groupTitle": "Brand"
  },
  {
    "type": "get",
    "url": "/brand",
    "title": "Get brands",
    "version": "1.0.0",
    "name": "GetBrands",
    "group": "Brand",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns the brands and their information that the user's company has stored.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     'https://synergyims.me/api/brand?limit=10&offset=0'",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>The number of entries to return (for pagination).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>The number of entries to offset the returned entries by (for pagination).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The list of brands.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/brand/brand.js",
    "groupTitle": "Brand"
  },
  {
    "type": "patch",
    "url": "/brand/:id",
    "title": "Update brand",
    "version": "1.0.0",
    "name": "PatchBrand",
    "group": "Brand",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint updates a brand with the provided information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PATCH\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"brand_name\": \"Apple\", \"description\": \"Expensive stuff!\"}'\n     https://synergyims.me/api/brand/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the brand.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brand_name",
            "description": "<p>The new name of the brand.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The new description of the brand.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"Successfully updated 1 row.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/brand/brand.js",
    "groupTitle": "Brand"
  },
  {
    "type": "post",
    "url": "/brand",
    "title": "Create brand",
    "version": "1.0.0",
    "name": "PostBrand",
    "group": "Brand",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint creates a brand with the provided information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"brand_name\": \"Apple\", \"description\": \"Expensive stuff!\"}'\n     https://synergyims.me/api/brand",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brand_name",
            "description": "<p>The name of the new brand.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The description of the new brand.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully inserted 1 row.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/brand/brand.js",
    "groupTitle": "Brand"
  },
  {
    "type": "delete",
    "url": "/category/:id",
    "title": "Delete category",
    "version": "1.0.0",
    "name": "DeleteCategory",
    "group": "Category",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint deletes a category.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/category/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the category.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"1 row successfully deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/category/category.js",
    "groupTitle": "Category"
  },
  {
    "type": "get",
    "url": "/category",
    "title": "Get Categories",
    "version": "1.0.0",
    "name": "GetCategories",
    "group": "Category",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns the categories and their information that the user's company has stored.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     'https://synergyims.me/api/category?limit=10&offset=0'",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>The number of entries to return (for pagination).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>The number of entries to offset the returned entries by (for pagination).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The list of categories.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/category/category.js",
    "groupTitle": "Category"
  },
  {
    "type": "get",
    "url": "/category/:id",
    "title": "Get category",
    "version": "1.0.0",
    "name": "GetCategory",
    "group": "Category",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns a specific category based on the given category id.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/category/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the category.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The category info.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/category/category.js",
    "groupTitle": "Category"
  },
  {
    "type": "patch",
    "url": "/category/:id",
    "title": "Update category",
    "version": "1.0.0",
    "name": "PatchCategory",
    "group": "Category",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint updates a category with the provided information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PATCH\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"category_name\": \"Laptops\", \"description\": \"A computer that fits on your lap.\"}'\n     https://synergyims.me/api/category/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the category.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category_name",
            "description": "<p>The new name of the category.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The new description of the category.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"Successfully updated 1 row.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/category/category.js",
    "groupTitle": "Category"
  },
  {
    "type": "post",
    "url": "/category",
    "title": "Create category",
    "version": "1.0.0",
    "name": "PostCategory",
    "group": "Category",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint creates a category with the provided information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"category_name\": \"Laptops\", \"description\": \"Are they supposed to have battery life?\"}'\n     https://synergyims.me/api/category",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category_name",
            "description": "<p>The name of the new category.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The description of the new category.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully inserted 1 row.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/category/category.js",
    "groupTitle": "Category"
  },
  {
    "type": "delete",
    "url": "/company",
    "title": "Delete company and its info",
    "version": "1.0.0",
    "name": "DeleteCompany",
    "group": "Company",
    "permission": [
      {
        "name": "Owner"
      }
    ],
    "description": "<p>This endpoint deletes the caller's company and its related information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/company",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"Successfully deleted company and its data.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/company/company.js",
    "groupTitle": "Company"
  },
  {
    "type": "get",
    "url": "/company/activity",
    "title": "Get company activity logs",
    "version": "1.0.0",
    "name": "GetActivity",
    "group": "Company",
    "permission": [
      {
        "name": "Owner"
      }
    ],
    "description": "<p>This endpoint returns the activity logs of the caller's company.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     'https://synergyims.me/api/company?limit=10&offset=0'",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sort_by",
            "description": "<p>The column to sort the data by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "desc",
            "defaultValue": "false",
            "description": "<p>Sort the data in descending order.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>The number of logs to return (for pagination).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>The number of entries to offset the returned entries by (for pagination).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The company activity logs.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/company/activity.js",
    "groupTitle": "Company"
  },
  {
    "type": "get",
    "url": "/company",
    "title": "Get company info",
    "version": "1.0.0",
    "name": "GetCompany",
    "group": "Company",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns information about the caller's company.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/company",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The company info.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/company/company.js",
    "groupTitle": "Company"
  },
  {
    "type": "get",
    "url": "/company/permissions",
    "title": "Get permissions tree",
    "version": "1.0.0",
    "name": "GetPermissions",
    "group": "Company",
    "permission": [
      {
        "name": "owner"
      }
    ],
    "description": "<p>This endpoint returns the permissions tree of the company. This tree is mostly used as a template for editing permissions.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/company/permissions",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The permissions tree.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/company/permissions.js",
    "groupTitle": "Company"
  },
  {
    "type": "patch",
    "url": "/company",
    "title": "Update company info",
    "version": "1.0.0",
    "name": "UpdateCompany",
    "group": "Company",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint updates information about the caller's company.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PATCH\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"address\": \"1280 Main St. W\", \"company_name\": \"Macrosoft\", \"phone\": \"999-999-9999\"}'\n     https://synergyims.me/api/company",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>The new address of the company.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "company_name",
            "description": "<p>The new name of the company.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The new phone number of the company.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"Successfully updated 1 row.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The caller must provide all the parameters and as the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/company/company.js",
    "groupTitle": "Company"
  },
  {
    "type": "patch",
    "url": "/company/permissions",
    "title": "Update permissions tree",
    "version": "1.0.0",
    "name": "UpdatePermissions",
    "group": "Company",
    "permission": [
      {
        "name": "owner"
      }
    ],
    "description": "<p>This endpoint returns the permissions tree of the company. This tree is mostly used as a template for editing permissions.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PATCH\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"brand\": {\"create\": {\"admin\": true, \"user\": true}, \"update\": {...}}}'\n     https://synergyims.me/api/company/permissions",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully updated company permissions.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidPermissionsTree",
            "description": "<p>The permissions tree must follow the exact structure.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/company/permissions.js",
    "groupTitle": "Company"
  },
  {
    "type": "delete",
    "url": "/product",
    "title": "Delete product",
    "version": "1.0.0",
    "name": "DeleteProduct",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint deletes a product.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/product/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"1 row successfully deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/product.js",
    "groupTitle": "Product"
  },
  {
    "type": "get",
    "url": "/product/:id",
    "title": "Get product",
    "version": "1.0.0",
    "name": "GetProduct",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns a specific product based on the given product id.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/product/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the product.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The product info.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/product.js",
    "groupTitle": "Product"
  },
  {
    "type": "get",
    "url": "/product",
    "title": "Get products",
    "version": "1.0.0",
    "name": "GetProducts",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns the products and their information that the user's company has stored.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     'https://synergyims.me/api/product?limit=10&offset=0'",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sort_by",
            "description": "<p>The column to sort the data by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "desc",
            "defaultValue": "false",
            "description": "<p>Sort the data in descending order.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>The number of entries to return (for pagination).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>The number of entries to offset the returned entries by (for pagination).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>A search string to return products by matching product names.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The list of products.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/product.js",
    "groupTitle": "Product"
  },
  {
    "type": "get",
    "url": "/product/snapshot/:id",
    "title": "Get snapshot",
    "version": "1.0.0",
    "name": "GetSnapshot",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns a specific inventory snapshot based on the given snapshot id.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/product/snapshot/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the snapshot.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The inventory snapshot.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/snapshot.js",
    "groupTitle": "Product"
  },
  {
    "type": "get",
    "url": "/product/snapshot",
    "title": "Get snapshots",
    "version": "1.0.0",
    "name": "GetSnapshots",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns the inventory snapshots for the caller's company.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     'https://synergyims.me/api/product/snapshot?limit=10&offset=0'",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sort_by",
            "description": "<p>The column to sort the data by.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "desc",
            "defaultValue": "false",
            "description": "<p>Sort the data in descending order.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>The number of logs to return (for pagination).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>The number of entries to offset the returned entries by (for pagination).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The list of snapshots.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/snapshot.js",
    "groupTitle": "Product"
  },
  {
    "type": "get",
    "url": "/product/stats/graph",
    "title": "Get inventory graph data",
    "version": "1.0.0",
    "name": "GetStatsGraph",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns graph data of the caller's company inventory.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/product/stats/graph",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "start",
            "description": "<p>The epoch time of the start of the desired dataset.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "end",
            "description": "<p>The epoch time of the end of the desired dataset.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The list of inventory graph data.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/stats.js",
    "groupTitle": "Product"
  },
  {
    "type": "post",
    "url": "/product/import",
    "title": "Import CSV of products",
    "version": "1.0.0",
    "name": "ImportProducts",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint creates products from the information of an imported CSV. The CSV headers must be exactly as follows: {item_name,description,price,quantity,serial_num}. Note that due to issues with Readable streams this endpoint will silently fail (i.e not import any products but report successful).</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -F \"csvFile=@/path/to/test.csv\"\n     https://synergyims.me/api/product/import",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "csvFile",
            "description": "<p>The CSV file to import.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "delimiter",
            "description": "<p>The delimiter used in the CSV file.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully imported CSV.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/product.js",
    "groupTitle": "Product"
  },
  {
    "type": "patch",
    "url": "/product",
    "title": "Update product",
    "version": "1.0.0",
    "name": "PatchProduct",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint updates a product with the provided information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"brand_id\": 32, \"category_id\": 12, \"item_name\": \"Gala Apple\", ...}'\n     https://synergyims.me/api/product",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "item_name",
            "description": "<p>The new name of the product.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The new description of the product.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "serial_num",
            "description": "<p>The new serial number of the product.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "price",
            "description": "<p>The new price of the product.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>The new quantity of the product.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "brand_id",
            "description": "<p>The id of the brand this product belongs to (set to 0 if none).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "category_id",
            "description": "<p>The id of the category this product belongs to (set to 0 if none).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "warehouse_id",
            "description": "<p>The id of the warehouse this product is stored at (set to 0 if none).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"Successfully updated 1 row.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/product.js",
    "groupTitle": "Product"
  },
  {
    "type": "post",
    "url": "/product",
    "title": "Create product",
    "version": "1.0.0",
    "name": "PostProduct",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint creates a product with the provided information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"brand_id\": 32, \"category_id\": 12, \"item_name\": \"Gala Apple\", ...}'\n     https://synergyims.me/api/product",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "item_name",
            "description": "<p>The name of the new product.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The description of the new product.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "serial_num",
            "description": "<p>The serial number of the new product.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "price",
            "description": "<p>The price of the new product.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>The quantity of the new product.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "brand_id",
            "description": "<p>The id of the brand this product belongs to (set to 0 if none).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "category_id",
            "description": "<p>The id of the category this product belongs to (set to 0 if none).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "warehouse_id",
            "description": "<p>The id of the warehouse this product is stored at (set to 0 if none).</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully inserted 1 row.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/product.js",
    "groupTitle": "Product"
  },
  {
    "type": "post",
    "url": "/product/snapshot",
    "title": "Create inventory snapshot",
    "version": "1.0.0",
    "name": "PostSnapshot",
    "group": "Product",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint creates a snapshot of the current inventory.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/product/snapshot",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully recorded inventory snapshot\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/product/snapshot.js",
    "groupTitle": "Product"
  },
  {
    "type": "delete",
    "url": "/user/:id",
    "title": "Delete user",
    "version": "1.0.0",
    "name": "DeleteUser",
    "group": "User",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint deletes a user.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/user/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user to delete.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"User successfully deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/:id",
    "title": "Get user",
    "version": "1.0.0",
    "name": "GetUser",
    "group": "User",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns a specific user based on the given user id.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/user/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The user's account info.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user",
    "title": "Get users",
    "version": "1.0.0",
    "name": "GetUsers",
    "group": "User",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns the users and their information for the caller's company.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     'https://synergyims.me/api/user?limit=10&offset=0'",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>The number of entries to return (for pagination).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>The number of entries to offset the returned entries by (for pagination).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The list of users.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "/user",
    "title": "Update user",
    "version": "1.0.0",
    "name": "PatchUser",
    "group": "User",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint updates the caller's account information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PATCH\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"account_type\": \"user\", \"first_name\": \"Josh\", ...}'\n     https://synergyims.me/api/user",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_type",
            "description": "<p>The type of account (must be &quot;admin&quot; or &quot;user&quot;, &quot;owner&quot; accounts cannot change this).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>The user's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>The user's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The user's email address (must be unique).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The user's phone number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee_num",
            "description": "<p>The user's employee number.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully updated user info.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "/user/:id",
    "title": "Update user by ID",
    "version": "1.0.0",
    "name": "PatchUserID",
    "group": "User",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint updates a user's account information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PATCH\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"account_type\": \"user\", \"first_name\": \"Josh\", ...}'\n     https://synergyims.me/api/user/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user's account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_type",
            "description": "<p>The type of account (must be &quot;admin&quot; or &quot;user&quot;).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>The user's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>The user's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The user's email address (must be unique).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The user's phone number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee_num",
            "description": "<p>The user's employee number.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully updated user info.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "/user/password",
    "title": "Update user's password",
    "version": "1.0.0",
    "name": "PatchUserPassword",
    "group": "User",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint updates the caller's user account password.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PATCH\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"password\": \"oldpassword\", \"new_password\": \"supersecret\"}'\n     https://synergyims.me/api/user/password",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The current password for the user's account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "new_password",
            "description": "<p>The new password for the user's account.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully updated user password.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidPassword",
            "description": "<p>The password provided did not match the password for the user.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "/user/:id",
    "title": "Update user's password by ID",
    "version": "1.0.0",
    "name": "PatchUserPasswordID",
    "group": "User",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint updates a user's account password.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PATCH\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"password\": \"supersecret\"}'\n     https://synergyims.me/api/user/87/password",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user's account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The new password for the user's account.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully updated user password.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user",
    "title": "Create user",
    "version": "1.0.0",
    "name": "PostUser",
    "group": "User",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint manually creates a new user for the caller's company.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"account_type\": \"user\", \"first_name\": \"Josh\", ...}'\n     https://synergyims.me/api/user",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account_type",
            "description": "<p>The type of account to create (must be &quot;admin&quot; or &quot;user&quot;).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>The user's first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>The user's last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The user's email address (must be unique).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The user's phone number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee_num",
            "description": "<p>The user's employee number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The user's account password.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully created company user.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/user/user.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/warehouse/:id",
    "title": "Delete warehouse",
    "version": "1.0.0",
    "name": "DeleteWarehouse",
    "group": "Warehouse",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint deletes a warehouse.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/warehouse/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the warehouse.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"1 row successfully deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/warehouse/warehouse.js",
    "groupTitle": "Warehouse"
  },
  {
    "type": "get",
    "url": "/warehouse/:id",
    "title": "Get warehouse",
    "version": "1.0.0",
    "name": "GetWarehouse",
    "group": "Warehouse",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns a specific warehouse based on the given warehouse id.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     https://synergyims.me/api/warehouse/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the warehouse.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The warehouse info.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/warehouse/warehouse.js",
    "groupTitle": "Warehouse"
  },
  {
    "type": "get",
    "url": "/warehouse",
    "title": "Get warehouses",
    "version": "1.0.0",
    "name": "GetWarehouses",
    "group": "Warehouse",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint returns the warehouses and their information that the user's company has stored.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     'https://synergyims.me/api/warehouse?limit=10&offset=0'",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>The number of entries to return (for pagination).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>The number of entries to offset the returned entries by (for pagination).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>The list of warehouses.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/warehouse/warehouse.js",
    "groupTitle": "Warehouse"
  },
  {
    "type": "patch",
    "url": "/warehouse/:id",
    "title": "Update warehouse",
    "version": "1.0.0",
    "name": "PatchWarehouse",
    "group": "Warehouse",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint updates a warehouse with the provided information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PATCH\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"warehouse_name\": \"Cold Room\", \"description\": \"Food chills here.\", ...}'\n     https://synergyims.me/api/warehouse/87",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the warehouse.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "warehouse_name",
            "description": "<p>The new name of the warehouse.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The new description of the warehouse.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The new phone number of the warehouse.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>The new address of the warehouses.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  success: true,\n  message: \"Successfully updated 1 row.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidID",
            "description": "<p>The provided id must be a valid number.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/warehouse/warehouse.js",
    "groupTitle": "Warehouse"
  },
  {
    "type": "post",
    "url": "/warehouse",
    "title": "Create warehouse",
    "version": "1.0.0",
    "name": "PostWarehouse",
    "group": "Warehouse",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>This endpoint creates a warehouse with the provided information.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST\n     -H \"authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E\"\n     -H \"Content-Type: application/json\"\n     -d '{\"warehouse_name\": \"Main Storehouse\", \"description\": \"Main warehouse for storage.\", ...}'\n     https://synergyims.me/api/warehouse",
        "type": "json"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Access token recieved upon authorization (prefixed with &quot;Bearer &quot;)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "warehouse_name",
            "description": "<p>The name of the new warehouse.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The description of the new warehouse.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The phone number of the new warehouse.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>The address of the new warehouses.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  success: true,\n  message: \"Successfully inserted 1 row.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidAccessToken",
            "description": "<p>A valid bearer token must be provided in the authorization header.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCompanyPermissions",
            "description": "<p>The user must have the correct permissions in their company.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrInvalidData",
            "description": "<p>The data provided must be of the correct type.</p>"
          }
        ]
      }
    },
    "filename": "server/routes/warehouse/warehouse.js",
    "groupTitle": "Warehouse"
  }
] });
