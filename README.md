# Foodie Friends

Team members: Chenyu Jiang, Yihe Xiong

## Data Model
In this app, we will use 4 collections: users, restaurants, reviews/posts, and meet-ups collections. All Ids will be automatically generated by the firestore database.

1. Users Collection
Purpose: Stores user information and preferences to personalize recommendations and keep track of user activities.
Fields:
- name: User's display name.
- email: User's email for login and notifications.
- profilePhoto: URL of the user's profile picture.

2. Restaurants Collection
Purpose: Holds restaurant information, including details fetched from an external API (like Yelp).
Fields:
- name: Name of the restaurant.
- location: Coordinates or address of the restaurant.
- rating: Average rating of the restaurant.
- reviews: Array of review reviewIds associated with this restaurant.
- photos: Array of image URLs showcasing the restaurant or its food.
- cuisineType: Cuisine type (e.g., Italian, Mexican) for filtering.
- contactInfo: Restaurant contact details (phone number, website).
- hours: Opening hours (if available from the API).

3. Reviews Collection
Purpose: Stores reviews written by users for specific restaurants.
Fields:
- userId: ID of the user who wrote the review (for linking to Users collection).
- restaurantId: ID of the restaurant being reviewed (for linking to Restaurants collection).
- rating: Star rating given by the user.
- reviewText: Text content of the review.
- photos: Array of image URLs if the user uploads meal photos.
- timestamp: Date and time when the review was created.
- likes: Count or array of userIds that liked this review for engagement tracking.

4. Meet-ups Collection
Purpose: Stores information about organized meetups, allowing users to connect with friends and arrange group dining events.
Fields:
- restaurantId: ID of the restaurant where the meetup is taking place (links to Restaurants collection).
- Owner: ID of the user who created the meetup (links to Users collection).
- dateTime: Date and time of the meetup.
- notes: Additional notes or comments about the meetup (e.g., "Celebrate John's birthday" or "Try the new sushi menu").
