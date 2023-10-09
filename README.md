# MIT BadBank Capstone Project

## Tables of contents
* [Description](#description)
* [Technologies](#technologies)
* [Roadmap](#roadmap)

## Description
Welcome! My name is Michael Rath and this is my BadBank capstone application that I completed as part of the MIT xPro coding course. This project is the final project in the course and a cummulationn of all the things we've learned about and been taught the last few mnoths. The specific purpose of this application is to act as a bank for users to log in or create an account, and to be able to withdraw or deposit funds to their account.

This project is an meant to act as a demonstration of a full stack application with the 3 typical application layers.

## Technologies
Project was written with
* JavaScript
* HTML/CSS
* Bootstrap v5.0

The project uses a react front end and an express server backend, which connects to a MongoDB database hosted from a docker container. Requests are made from the front end to the database through a data abstraction layer which contains the actual API's of the backend, as well as the interface which communicates with the database.

## Roadmap
* There are a lot of things I think can be improved on this project or features I'd like to add in the future.
- Different types of accounts (checking vs savings) and accoutns that properly accrue interest.
- The ability to transfer funds between different accounts.
* Improvements
  - Given the time contrainst of this project, I would like to go back and rewrite some of the data abstraction layer to ensure only necessary data is retrieved from the database, instead of   all data being pulled and then filtering on the client side.
