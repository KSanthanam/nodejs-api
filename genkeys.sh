openssl genrsa -out challenge.rsa 1024
openssl rsa -in challenge.rsa -pubout > challenge.rsa.pub