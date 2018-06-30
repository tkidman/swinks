# Swinks

Swinks, the music link switcher, is a webservice that can convert links from Google Play Music to Spotify, and vice versa.  
It also features Slack integration: a Slack bot will automatically convert links for you when they are posted to a channel.

Try it out:

```
curl --header "Content-Type: application/json" \
 --request POST \
 --data '{"url":"https://play.google.com/music/m/Teksdpqhafhj3l2bhddvbhnlppq?t=Deadcrush_-_alt-J"}' \
 https://swinks.herokuapp.com/switch
```
