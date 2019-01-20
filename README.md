# SafaricomNodeStkPush
A Restful API to Trigger STK Push 💰💰 🤑🤑

**Sample Request**
  
  ``` 
  {
    "amount": "50",
    "accountReference": "test",
    "callBackURL": "http://callbackurl.com/callback",
    "description": "test",
    "phoneNumber": "254718532498"
  }       
  ```
**Using curl**  

```
Note: Replace PhoneNumber Field

  curl -X POST "https://safaricom-node-stk.herokuapp.com/api/v1/stkpush/process/" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"amount\": \"50\", \"accountReference\": \"test\", \"callBackURL\": \"https://ticketingrestapi.herokuapp.com/api/v2/callback/\", \"description\": \"test\", \"phoneNumber\": \"254718532419\"}"   

```

Reference: https://github.com/neshoj/safaricom-daraja-nodejs
