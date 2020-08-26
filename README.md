# MagiReco GraphQL

Toy project to play with GraphQL. Used to become more or less familiar with it and draw personal conclusions, mostly listed below. Might update as I try out alternative solutions out of curiosity.
A sample running with the local resolver (from a json file) can be found here: [MagiReco GraphQL](https://magireco-char-api.sekiei.me/)

### Take away

When simply grabbing the data from a json file, there's no significant performance degradation observed from pulling the file into memory to have graphql return only the default fields. Any fields that do not take arguments can get by with the default resolvers.
When fetching data from a database, even if the filtering itself is done at root resolver level, if we're pulling the documents as they are from the databases that early on the only upside to using graphql is that the responses to the client will be lighter... and yet performance wise it doesn't change that on the server side we're still pulling in all irrelevant information from the database. This impact is even higher if we're using a remote database service.
In light of this, two solutions come to mind:

-   To look ahead in the request and project only the needed fields from the database when we make the request at the root resolver level. This is the approach taken in this project. The obvious upside is the fact it performs a single database round trip. Its largest downside is that if we have written resolvers that take in arguments for nested fields we might not have the needed fields available once the query processing gets there.
-   To omit larger fields from the request made at the root resolver level and fetch these at the corresponding field's resolver level. This is an alternate approach I might add here later. The upsides are added ease of testing at the resolver level, and the fact one doesn't have to worry about not having to keep track of whether fields might not be available down the road. The downsides are having to balance a larger amount of requests vs larger requests and the possibility of fetching duplicate data. These can be attenuated by using deduping libraries and caching solutions.

More improvements:

-   caching (maybe using Redis?)

### Authors

-   [Dusk252](https://github.com/Dusk252)
