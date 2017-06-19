import {db} from 'baqend/realtime'

class TweetService {

    /**
     * Returns a comment stream for a movie
     * @param {Object} [movie] The reference to the movie object
     */
    streamMovieTweets(movie) {
        let query = db.Tweet.find()
            .where({'id': {'$exists': true}})
            .sort({'createdAt': -1})
            .limit(10);
        query.matches("text", new RegExp('^.*' + movie.title.toLowerCase()));
        return query.resultStream()
    }

    /**
     * Returns a comment stream for a movie
     * @param {Object} [args] The query arguments
     * @param {string} [args.type=prefix|keyword|followersOrFriends] The query type
     * @param {string} [args.parameter] The query parameter
     * @param {string} [args.limit=10] Max results
     */
    queryTweets(args) {
        let query = db.Tweet.find()
            .where({'id': {'$exists': true}})
            .sort({'createdAt': -1})
            .limit(Number(args.limit));

        switch (args.type) {
            case "prefix":
                query.matches("text", new RegExp("^" + args.parameter));
                break;
            case "keyword":
                query.matches("text", new RegExp("^.*" + args.parameter));
                break;
            case "followersOrFriends":
                query.where({ $or: [
                    { "user.followers_count": { $gt: Number(args.parameter) } },
                    { "user.friends_count": { $gt: Number(args.parameter) } }
                    ]
                });
                break;
        }

        return query.resultStream()
    }

}

export default new TweetService()
