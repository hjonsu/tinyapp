# Budget bit.ly: TinyApp!

You can say goodbye to long links with this fullstack application, built with Node and Express, that allows users to shorten any links they wish (à la bit.ly).

## Final Product
!["registration page"](#)
!["short url and edit page"](#)
!["urls page for logged in user"](#)

## Dependencies
* Node.js
* Express
* EJS
* bcrypt
* cookie-session

## Initial Config
1. Fork and clone the repo to your local machine
2. Install all dependencies (using npm install)
3. Start the app by running npm start from your terminal in the cloned repo.
4. Visit localhost:8080 on your browser and enjoy!

## Features
#### REGISTRATION AND LOGIN
With TinyApp, users must be logged in to create, view, and edit links. To create an account, click on register in the top right corner, enter your email and password, and you're all set.

#### CREATING NEW LINKS
To create a new short link, click on the create new URL navigation bar, where you will be prompted to enter a url.

#### EDITING AND DELETING LINKS
In the my URLS page, you can delete any of your links. You can also edit the long URL if you click on the edit button. Only the long URL will be altered, the short URL will remain the same.

#### USING YOUR SHORT URL
The path to use any short link is /u/shortURL. This will redirect you to the long URL. You can also visit the long URL by clicking on the short URL link on the edit page.