<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


The gateway is the communication point between our customers and our services. It is in charge of receiving requests, sending them to the corresponding services and returning the response to the customer.
Dev

1. Clone the repository
2. Install dependencies, run `npm install`
3. Create an `.env` file based on `env.template`
4. Run the microservices that are going to be consumed up.
5. Run project with `npm run start:dev`

## Nats
Run Nats server
```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```

