# AggreGATOR

This program will log, update and browse RSS feeds.

## Commands

### Create new user
Usage: register [username]  
Adds a username.

### Login
Usage: login [username]  
Changes the current user. Must already have been created using the resgister command.

### Users
Usage: users  
Displays a list of the registered users and indicates the user that is currently logged in.

### Add Feed
Usage: addfeed [name] [url]  
Adds a new RSS feed to the database with a custom name.

### Feeds
Usage: feeds  
Displays a list of all feeds in the database.

### Follow
Usage: follow [url]   
Follows the feed for the current user. Feed must already be added with addfeed.

### Unfollow
Usage: unfollow [url]  
Removes the feed for the current user.

### Following
Usage: following  
Displays a list of all feeds followed by the current user.

### Aggregate
Usage: agg [update interval (number followed by ms, s, m or h)]   
Starts an infinite loop that will fetch data for all followed feeds. Use ctrl-c to terminate.

### Browse
Usage: browse [max number to display (optional number 1-50, defaults to 2)]  
Displays most recent posts for all followed feeds. Data must first be fetched using the agg command.

### Reset
Useage: reset  
Deletes all data including users and feeds.