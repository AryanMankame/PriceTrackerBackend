from twilio.rest import Client
import sys
client = Client("ACda95edb8364d2ec5593dea52638ec670","7a648c24bacff5ec692c4225dce91db9")
print(sys.argv[1])
client.messages.create(
    to = "+91"+sys.argv[1],
    from_= "+17577023420",
    body = "Hello I am twilio"
)