import {db} from 'baqend/realtime'

class MovieService {

    /**
     * Loads movie suggestions for the typeahead input
     * @param {string} [title] The movie title
     */
    loadMovieSuggestions(title) {
        //TODO
        let query = db.Movie.find()
            .where({'id': {'$exists': true}})
            .sort({'id': -1})
            .limit(10);

        return query.resultList((results) => results.map((result) => result.title));
    }

    /**
     * Loads a specific movie by title
     * @param {string} [title] The movie title
     */
    loadMovieByTitle(title) {
        let query = db.Movie.find()
            .where({'id': {'$exists': true}})
            .sort({'id': -1});
        query.equal("title", title);

        return query.singleResult();
    }

    /**
     * Queries movies filtered by the query arguments
     * @param {Object} [args] The query arguments
     * @param {string} [args.type=prefix|rating-greater|genre|genrePartialmatch|release|comments] The query type
     * @param {string} [args.parameter] The query parameter
     * @param {string} [args.limit=10] Max results
     */
    queryMovies(args) {
        let query = db.Movie.find()
            .where({'id': {'$exists': true}})
            .descending('id')
            .limit(Number(args.limit));
        let genres = args.parameter.split(",");

        switch (args.type) {
            case "prefix":
                if (args.parameter !== "")
                    query.matches("title", new RegExp('^' + args.parameter));
                break;
            case "rating-greater":
                if (args.parameter !== "")
                    query.greaterThan("rating", Number(args.parameter));
                break;
            case "genre":
                if (args.parameter !== "")
                    query.where({"genre": {"$all": genres} });
                break;
            case "genrePartialmatch":
                if (args.parameter !== "")
                    query.matches("genre", new RegExp('^' + args.parameter));
                break;
            case "release":
                // TODO
                if (args.parameter !== "") {
                    query.where(
                        {"$and": [
                            {"releases.country": args.parameter},
                            {"year": {"$lt" : "1950"}}
                            ]}
                    );
                }
                //query.lessThan("year", 1950);
                break;
            case "comments":
                let comments = db.MovieComment.find({"movie": 1})
                    .where({'id': {'$exists': true}})
                    .descending('createdAt');
                comments.equal("username", args.parameter);
                let interestingComments = comments.resultList();
                query.in("_id", interestingComments);
                //TODO
                break;
        }

        return query.resultList();
    }

}

export default new MovieService()
