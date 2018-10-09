# servernode

# we need to Generate SSL and put this in the folder security
create folder security and do this in the CMD :
openssl genrsa -out localhost.key 2048
openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650 -subj /CN=localhost

description of OPENSSL :
req - utility used to request the certificate.
-x509 - tells the computer we want a self signed certificate and not to actually request one from a certificate authority.
-newkey - takes a paramater rsa:n-bits. It will generate a new key and certificate with RSA encryption of n-bits that are passed in. Here we are passing in the request for RSA of 2048 bits.
-key localhost.key  - puts out a key file that is the same name as the argument being passed to -key. In this case, we are generating a key file named localhost.key .
-out localhost.cert- puts out a file (in this case a certificate) with the name being passed to -out
-days XXX - how many days the certificate should be for. Defaults to 30 days.