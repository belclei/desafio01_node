const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
let countRequests = 0;

server.use((req, res, next) => {
  console.log(`Contagem atual de requisições: ${++countRequests}`);
  next();
});

function validateIfProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(element => element.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = projects.find(element => element.id == id);
  if (project) {
    return res
      .status(400)
      .json({ error: "There is another project with this id" });
  }

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
});

server.put("/projects/:id", validateIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(element => element.id == id);
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", validateIfProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(element => element.id == id);
  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", validateIfProjectExists, (req, res) => {
  const projectId = req.params.id;
  const { title } = req.body;

  const project = projects.find(element => element.id == projectId);
  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
