# webapp-stats

Simple and light-weight webapp usage tracker. Currently only supporting **vue.js** and is meant to be used with **Vue router**.

*Simple usage statistics for you webapp - which urls/pages/routes did the user visit?*

## prerequisites
- setup a backend server and database that can store the data ([example backend setup in node/express and psql](https://github.com/johnkristijan/webapp-stats-backend))


## Install

```
npm install webapp-stats
```



## Usage

```
import webappStatTrack from 'webapp-stats'
...
router.beforeEach((to, from) => {
    const appId = "22c4c3f7-609d-4bd2-a239-8bebfc8b59e4"
    const urlPrefix = "https://backend.myserver.org";
    webappStatTrack(to, from, appId, urlPrefix)
})
```
The possible inputs to the webappStatTrack functions are:
- `to` (vue router object - required)
- `from` (vue router object required)
- `appId` (UUID for your app - obtained via the app registration API)
- `urlPrefix` server url prefix for the backend service that receives the stats ([example backend setup in node/express and psql](https://github.com/johnkristijan/webapp-stats-backend))
- `senderDebounceLimit` (local log list size buffer - default is 10)
- `username` (provide username if you want - default is 'anonymous')



## How to get an appId?

Register your app by doing an API call with the following query parameters.

```
https://backend.myserver.org/webapp-
stats-backend?type=register&app_name=JohnsApp&app_contact=john@gmail.com
```
Update the query parameters `app_name` and `app_contact` and run a GET request.
If successful, it will respond with HTTP status code 201 and an appId (UUID).



## What is being logged?

This is an example log entry:

```
{
    "app_id": "22c4c3f7-609d-4bd2-a239-8bebfc8b59e4",
    "from_path": "http://www.mywebpage.com/",
    "to_path": "http://www.mywebpage.com/about",
    "screen_width": "1920",
    "screen_height": "1080",
    "username": "anonymous",
    "timestamp": "2022-10-17T13:29:34.000Z",
    "ip_address": xxx.xxx.xxx.xxx
}
```



## So, how do I see the usage statistics?

That is simple, too.
Just make an API GET request to this url and add your webapp `app_id` as a query parameter, like this:

```
https://backend.myserver.org/webapp-stats-backend?type=get-stats&app_id=22c4c3f7-609d-4bd2-a239-8bebfc8b59e4
```
You will receive a list of all the log entries.



## Roadmap / coming features
- Add support for React
- Add support for usage outside vue router
- Add support for custom tracker to be used to track usage of specific funtions
- Provide a demo backend service that can be used for testing purposes
