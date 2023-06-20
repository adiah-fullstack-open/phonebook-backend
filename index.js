const cors = require("cors");
const express = require("express");

var morgan = require("morgan");

const app = express();

// Create tokens for stfff
// console.log(response.req.body);
// console.log(request.body);

morgan.token("postData", (req, res) => JSON.stringify(req.body));

// Create a function that logs the data if it's post
const loggingFunction = (tokens, req, res) => {
  let message = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
  // use Post data only if it's POST method
  if (req.method === "POST") {
    return `${message}  ${tokens.postData(req, res)}`;
  } else {
    return message;
  }
};

app.use(express.json());
app.use(cors());
app.use(morgan(loggingFunction));

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6723122",
  },
];

const checkDuplicates = (name) =>
  phonebook.filter((person) => person.name === name).length > 0;

app.get("/info", (request, response) => {
  const date = new Date();

  response.send(`
		<p>Phonebook has info for ${phonebook.length} people</p>

		<p>${date}</p>
	`);
});

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const id = Math.floor(Math.random() * 100000);
  return id;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing",
    });
  }

  if (checkDuplicates(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  phonebook = phonebook.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
