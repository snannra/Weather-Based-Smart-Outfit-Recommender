# Weather-Based-Smart-Outfit-Recommender

## Overview
The Weather-Based Smart Outfit Recommender is a full-stack web application that suggests outfits based on the current weather conditions of the user's location. Users can sign up, upload a profile picture, create and save outfits, and receive outfit recommendations tailored to the weather.

## Features
- **User Authentication**: Users can sign up, log in, and log out securely.
- **Profile Management**: Users can upload and update their profile picture.
- **Outfit Creation**: Users can create new outfits by specifying the outfit name, temperature range, weather type, and items included. An image of the outfit can also be uploaded.
- **Weather-Based Recommendations**: The app fetches the current weather based on the user's location and suggests appropriate outfits.
- **Outfit Display**: Recommended outfits are displayed with their images and details.

## Technologies Used
- **Frontend**: React.js, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer
- **Weather API**: OpenWeatherMap API

## Installation
### Prerequisites
- Node.js (v12 or higher)
- MongoDB

### Setup
1. **Clone the repository**:

`git clone https://github.com/yourusername/weather-based-outfit-recommender.git`

`cd weather-based-outfit-recommender`

2. **Install dependencies**:

`cd client`

`npm install`

`cd ../backend`

`npm install`

4. **Environment Variables**:
Create a `.env` file in the `backend` directory and add the following:

`MONGO_URI=your_mongodb_connection_string`

`JWT_SECRET=your_jwt_secret_key`

`WEATHER_API_KEY=your_openweathermap_api_key`

5. **Start the application**:
- **Backend**:

`cd backend`

`npm start`

- **Frontend**:

`cd client`

`npm start`

5. **Visit the application**:
Open your browser and go to `http://localhost:3000`.

## Usage
### Sign Up
1. Navigate to the Sign-Up page.
2. Enter your details including a profile image, and click "Sign Up".
3. You will be redirected to the Dashboard upon successful registration.
### Create an Outfit
1. On the Dashboard, click "Create New Outfit".
2. Fill in the outfit details such as name, temperature range, weather type, items, and upload an image.
3. Click "Create Outfit" to save it.
### View Outfit Recommendations
1. The Dashboard displays your profile information and the current weather.
2. Based on the weather, the app recommends outfits from your collection that match the weather conditions.
### Logout
1. Click the "Sign Out" button to log out of your account.

## API Endpoints
### Auth & User Management
- **`POST /api/outfits/signup`**: Register a new user.
- **`POST /api/outfits/login`**: Log in an existing user.
- **`GET /api/outfits/me`**: Get the logged-in user's data.

### Outfit Management
- **`POST /api/outfits/create-outfit`**: Create a new outfit.
- **`GET /api/outfits/outfits`**: Get recommended outfits based on the current weather.

## Weather
- **`GET /api/outfits/weather/:location`**: Get the weather data for a specific location.

# Contributing
If you wish to contribute to this project, please fork the repository and create a pull request. Feel free to open issues for any bugs or feature requests.

# Acknowledgements
- OpenWeatherMap for providing weather data.
- MongoDB and Mongoose for the database.
- Multer for handling file uploads.
- JWT for secure user authentication.
