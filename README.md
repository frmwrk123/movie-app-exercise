# Movie App

Welcome to the Movie App project!  
The Movie App is supposed to let you search a movie database and Twitter messages. Our developers already built the UI, but the database services are not finished. Your job is to replace the dummy queries in the corresponding JavaScript files with decent query implementations.

## Setup

To set up your development environment, do the following:

1. **Install** the project dependencies:
```
npm install
```
If you are working on your own notebook, you might want to install [NPM](https://nodejs.org/en/download/) first ;-)
1. **Locally deploy** the app:
```
npm run dev
```
This will spin up a local webserver with live reload and hot module replacement (HMR). You can see the app at [http://localhost:3000](http://localhost:3000). Whenever you save a change, it will automatically refresh.

## Getting to Work

Now it's time to start coding. Open the files `src/js/MovieService.js`, `src/js/TweetService.js` and `src/js/CommentService.js` in your editor of choice and replace the dummy query implementations to make the app fully functional.

The following subsections will help you understand how the data is structured.

### Data Structure

Every object in a Baqend database has the following properties. You can use these properties in queries and for sorting, just like any other property. These properties are:
* **id**: a unique object identifier, e.g. `"/db/MovieComment/2cb3df1f-9887-4161-a1ce-1d5ef15d4f32"` for a movie comment
* **version**: the number, initially `1`
* **acl**: an object defining read and write access; `null` for all objects in our application
* **createdAt**: the server-side time at which the object was *created*, e.g. `"2017-05-27T10:29:58.685Z"`
* **updatedAt**: the server-side time at which the object was *updated the last time*, e.g. `"2017-05-27T10:29:58.685Z"`

Regarding our application, there are three collections in the database: `Movie`, `MovieComment` and `Tweet`. To get an idea of how you could query those collections, take a look at the three sample objects below. They illustrate the structure of our main collections (mandatory properties omited for clarity):

**Sample movie:**

```
{
  "actors": [
    "Alderman, Ted",
    "Rourke, Mickey"
  ],
  "genre": [
    "action",
    "adventure",
    "sci-fi"
  ],
  "movie": true,
  "plot": "He is a man made of iron.\t Anonymous",
  "rating": 7.0,
  "releases": [
    {
      "country": "Germany",
      "date": {
        "$date": 1.2730968E12
      }
    },
    {
      "country": "Japan",
      "date": {
        "$date": 1.2762072E12
      }
    }
  ],
  "runtime": "124",
  "title": "Iron Man 2",
  "votes": 165291,
  "year": "2010"
}
```

**Sample movie comment:**

**Note:** The author's user object can be referenced in the `user` attribute. 

```
{
  "movie": "/db/Movie/1a005236-981f-4306-b811-705dadc11e34",
  "username": "Wolle",
  "user": { ... }, // the authoring user
  "text": "Best film ever!!11eleven"
}
```

**Sample twitter message:**

**Note:** The `text` attribute is the lowercase version of `tweet.text`! (This enables more efficient case-insensitive filtering.)

```
{
"tweetid": "868407240671824216",
"text": "hey, i like iron man!", // tweet message in lowercase letters
"url": "https://twitter.com/sometweet",
    "user": {
        "screen_name": "Wolle",
        "name": "wolfman88",
        "followers_count": 6.0,
        "friends_count": 2.0,
        "statuses_count": 1.0,
        ...
    },
    "tweet": {
        "text": "Hey, I like Iron Man!",
        "created_at": "Sat May 27 10:03:15 +0000 2017",
        "id": 8.6840724067111322E17,
        "id_str": "868407240671113216",
        "display_text_range": [0.0, 140.0],
        "source": "<a href=\"https://dlvrit.com/\" rel=\"nofollow\">dlvr.it</a>",
        "truncated": true,
        "user": { ... },
        "is_quote_status": false,
        "extended_tweet": { ... },
        "retweet_count": 0.0,
        "favorite_count": 0.0,
        ...
    },
    "permanent": null
}
```

### Querying the Data

There are **two different ways to specify queries**: First, you can provide native [MongoDB queries](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors) like so:

```
var query = db.Movie.find()
  .where({ 'name': 'Bob' }) // MongoDB query
  .sort({ 'age': 1 }) // MongoDB sort object
  .offset(10)
  .limit(10);
```

As an alternative using the [Baqend Query Builder](https://www.baqend.com/guide/topics/queries/), you can also plug your query object together by chaining calls:

```
var query = db.Movie.find()
  .equal('name', 'Bob')
  .ascending('age')
  .offset(10)
  .limit(10);
```

For support, please get in touch with one of our tutors. If you have Baqend-related questions, feel free to ask via [StackOverflow](https://stackoverflow.com/questions/tagged/baqend?sort=newest).

Now have fun coding :-)


## Optional Tasks

When you're done with the queries, you don't have to be idle! Below, you can find a few ideas for additional things to do:

### Bringing it Online

If you want to share your app with the world, you can publish it like this:

1. **Build** the app in folder `dist`, ready for deployment:
```
npm run build
```
1. **Register a free app** by visiting [https://dashboard.baqend.com/register](https://dashboard.baqend.com/register) and *creating* an account. Make sure to *assign a password* to your account, so that you can log in using the command-line interface. (By default, there will be no password, if you register via OAuth.)  
1. **Log into your app** using your credentials:
```
npm run baqend login
```
Just provide email and password when asked.
1. **Deploy** your app online:
```
npm baqend deploy <app-name> -f dist/
```
This will upload all your files. Users can find your app at `https://<app-name>.app.baqend.com/`.  
To update your files, simply fire the command again.

### User Login

As you might have noticed, the user management has not been implemented, yet. To enable user login and logout in your application, implement the missing functionality in `src/js/components/Login.js`. To make these features actually useful, you can **associate comments with user accounts** on creation and [restrict write access to the current user](https://www.baqend.com/guide/topics/user-management/#setting-object-permissions). Thus, users will be able to edit their own comments, but not those of other users.

### Collaboration, Server-Side Code, Custom Real-Time Collections & More

In this exercise, you worked a populated database with a predefined schema. If you want to play around with real-time queries on your own data in your own app, come talk to us and we will **upgrade your account**!
