***Update Environment Variables***

Rename .env.example to .env

***You can keep the default as long as you do not change the default ports.***

    REACT_APP_SERVER_URL = "http://localhost:1337/"
    REACT_APP_CRON_SERVER_URL = "http://localhost:4000/"
    REACT_APP_AVATAR_URL = "http://localhost:1337"
    REACT_APP_Slack_Token = XXXXXXXXX

***PLEASE NOTE***

The REACT_APP_SERVER_URL and REACT_APP_CRON_SERVER_URL should end in a slash
REACT_APP_CRON_SERVER_URL is URL where the CRON is deployed.

***Install Dependencies**

    yarn install

***Launch App***

    yarn start

***The frontend by default will launch***

http://localhost:3000/

***You will want to register a new user***

http://localhost:3000/register
