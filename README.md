
#BestWishes
20-03-2020

#Members         :  Yash Sinha and Boby Tudu
#Mentor        :  Niranjan singh
#Instructor        :  Sundeep Charan Ramkumar
#Batch            :  Woodpecker

#Overview
The basic idea of this project is to     
Specifications
The system will be used by     three people, which are Admin, Provider, and User.
Complete CRUD operation is happening in venues
Unit testing is also applied in some routes
     
User can book various venues after login into their account
Only email verified  users are allowed to place order
Provider can post their venue with location and price and many other properties
Provider can remove and update their venue
     
Admin can remove users and providers after verifying themselves
User cannot be deleted if they have any booking
Same for provider, providers cannot be deleted if any venue related to provider is booked
User and provider will get email verification link in their email after registration to activate their account
     


#Technologies
The technologies that are going to be used for the project are as follows:

NodeJS: For building server and accessing the Database
ExpressJs  :  on top of NODE for writing less code at the server-side
Mongoose and Sequelize: As database base driver to connection with the database and node.
Multer  :  For uploading the venue images
MongoDB atlas and ElephantSQL  :  To store the data on cloud.
Nodemiler  :  For sending the mail
Heroku  : For Deployment fo the app  
Razorpay  : For Payment gateways.
Testing: JEST


#Modules
The system comprises of 3 major modules with their sub-modules as follows:
Admin:
     
Admin can delete
Users
Provider
     
Provider:


Providers are responsible for creating and deleting venues

Users:
 
Customers are referred as User here
They can book venue after login and make payment via razorpay api 
         
     



Routes:-
Request Type :- POST,    Route :-  /registeruser
    This route is for registration of user
    Required fields are:-
name 
email 
Password
For register as admin 


    
      2) Request Type :- POST,    Route :-  /loginuser
Login route for user
Required fields are:-
email
password

      3) Request Type :- POST,    Route :-  /logoutuser
Logout route for user
User have to place their jwt token in auth-token named header

      4) Request Type :- POST    Route :-  /forgotClient
    In order to reset their password user have to post their email in this route
    Required field:-
         - email
    
      5) Request Type :- POST   Route :- /resetClient/:token
    This route is available in reset email, so no need to type 
    User can post their new password to change their password
    Required fields:-
        -password
 
      6)    Request Type :- POST   Route :- /order
Route for placing/creating order
Required fields:-
auth-token in header
venueid
 
     7) Request Type :- GET    Route:-  /dashboard
    Router for getting all available venues for booking
    Pagination is available in this route
    For pagination
        -  /dashboard?page=1
        - /dashboard?page=2
    #in mongoose part pagination is not available in this route, pagination  is available in    search route


     8)  Request Type :- POST    Route:-  /search
Route for searching venues
Search feature will search from
location
name
review
category
    For search-
        - /search?search=hotel
- /search?search=new
- /search?search=mumbai



     9) Request Type :- DELETE    Route:-  /admin/removeuser/:id
    Route for admin to delete user
    Required fields:-
        - auth-token in header
        - id of user as req.params.id
    Condition:- user should not have any booking
    
     10) Request Type :- DELETE    Route:-  /admin/removeprovider/:id
    Route for admin to delete provider
    Required fields:-
auth-token in header
provider id as req.params.id
    Condition :- Provider should not have any venue that is booked

     11) Request Type :- POST    Route:-  /register
    Route for provider to register on this app
    Required fields:-
name
email
password
    
     12) Request Type :- POST    Route:-  /loginprovider
    Route for provider to login
    Required fields:-
email
Password


     13) Request Type :- post    Route:-  /forgotProvider
Route for provider to reset their password
Require fields:-
    -email

     14)  Request Type :- POST    Route:-  /logoutprovider
    Route for provider to logout

     15) Request Type :- POST     Route:-  /reset/:token
    Route for provider to post their new password
    This route is already present in password reset email
    Required fields:-
password

    16) Request Type :- POST    Route:-  /addvenue
Route for provider to post their venues
Required fields:-
venuename
location
charges
review
capacity
venueimg (image file)
category 
17) Request type:- DELETE, Route:- /provider/removevenue/:id
    Route for provider to delete their venues
    Required fields:-
auth-token in header
venueid as req.params.id
18) Reques type:- PATCH,        Route:- /provider/update/:id
    Route for provider to update their venue
    Required fields:- 
capacity
charges


Some instruction:-
1) for payment do not use local version of file, use heroku based app because   information exchange between http and https server is not allowed and because of that sometimes it will give error 
2) For unit testing go to folder unitTesting and type npm test
3) heroku link for postgres:-  https://project-bestwishes.herokuapp.com/
4) heroku payment app postgres:-https://project-bestwishes-client.herokuapp.com/
5)heroku link for mongo:- https://mongo-bestwishes.herokuapp.com/
6)heroku payment mongo:- http://mongo-bestwishes-client.herokuapp.com/
Which technology use by which person
7) Yash sinha- mongoose
8)boby tudu- sequelize
9)Github repo link:https://github.com/attainu/BestWishes.git
10) all the mongoose and elephantsql   email id and password is same
     Email:yashandbobyproject@gmail.com 
    password:y@sh@ndboby123
    




Conclusion
BESTWISHES IS A PLATFORM TO FIND OUT THE PERFECT VENUE FOR YOUR PERFECT DAY.IT SAVE TIME BY JUST SURFING THE WEBSITE AND GETTING ALL THE INFO AND BOOKING IT
         BEST WISHES TO YOU 
