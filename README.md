resellerclub
============

NodeJS library for ResellerClub REST API

# Usage example:

```javascript
var ResellerClub = require('resellerclub');

// 3-parameter is true for test.httpapi.com server, false for httpapi.com
var rc = new ResellerClub ([your_userId], [your_key], true); 

//check for available domain
rc.domains.available({'domain-name':'mynewdomain','tlds':'com'},
  function(err, result){
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      // if it is available, register it
      if(result['mynewdomain.com'] && result['mynewdomain.com'].status == 'available'){
        // ~customer-id~ and ~contact-id~ should be retrieved from the Admin interface or by other api methods
        rc.domains.register(
          {'domain-name':'mynewdomain.com',
              'years':1, 'ns':['ns1.server.co','ns2.server.co'],
              'customer-id':~customer-id~,
              'contacts':~contacts~,
              'invoice-option':'NoInvoice'},
            function(err,result){
              if (err) {
                console.log(err);
              } else {
                if (result['actionstatus'] && result['actionstatus'] == 'Success'){
                  console.log('We are rocking!!!!');
                  process.exit(code=0);
                }
              }
            }
          );
        }
      }
    }
);

```
