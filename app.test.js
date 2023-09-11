const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const { app, Person } = require("./app"); 

chai.use(chaiHttp);
const expect = chai.expect;

describe("API Tests", () => {
  beforeEach(async () => {
    await Person.deleteMany({});
  });

  describe("POST /api/people", () => {
    it("should create a new person", (done) => {
      chai
        .request(app)
        .post("/api/people")
        .send({ name: "John Doe" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("_id");
          expect(res.body.name).to.equal("John Doe");
          done();
        });
    });

    it("should return an error for invalid input", (done) => {
      chai
        .request(app)
        .post("/api/people")
        .send({ name: 123 }) // Invalid input
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equal("Name must be a string.");
          done();
        });
    });
  });

  describe("GET /api/people", () => {
    it("should get all people", (done) => {
      // Insert sample data into the database
      const johnDoe = new Person({ name: "John Doe" });
      johnDoe.save();

      chai
        .request(app)
        .get("/api/people")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });

    it("should filter people by name", (done) => {
      // Insert sample data into the database
      const johnDoe = new Person({ name: "John Doe" });
      const janeDoe = new Person({ name: "Jane Doe" });
      johnDoe.save();
      janeDoe.save();

      chai
        .request(app)
        .get("/api/people")
        .query({ name: "John" }) // Filter by name
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.lengthOf(1);
          expect(res.body[0].name).to.equal("John Doe");
          done();
        });
    });

    it("should return an error for invalid name filter", (done) => {
      chai
        .request(app)
        .get("/api/people")
        .query({ name: 123 }) // Invalid name filter
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equal("Name must be a string.");
          done();
        });
    });
  });

  describe("GET /api/people/:id", () => {
    it("should get a person by ID", () => {
      let savedPerson;

      // Insert a sample person into the database
      return new Person({ name: "John Doe" }).save().then((person) => {
        savedPerson = person;
        return chai
          .request(app)
          .get(`/api/people/${savedPerson._id}`)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("_id");
            expect(res.body.name).to.equal("John Doe");
          });
      });
    });

    it("should return an error for a non-existent ID", () => {
      const nonExistentId = "60aaf0c6c0356038a8888888"; // Non-existent ID
      return chai
        .request(app)
        .get(`/api/people/${nonExistentId}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal("Person not found.");
        });
    });
  });

  describe("PUT /api/people/:id", () => {
    it("should update a person by ID", () => {
      let savedPerson;

      // Insert a sample person into the database
      return new Person({ name: "John Doe" }).save().then((person) => {
        savedPerson = person;
        return chai
          .request(app)
          .put(`/api/people/${savedPerson._id}`)
          .send({ name: "Updated John Doe" })
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body.name).to.equal("Updated John Doe");
          });
      });
    });

    it("should return an error for a non-existent ID", () => {
      const nonExistentId = "60aaf0c6c0356038a8888888"; // Non-existent ID
      return chai
        .request(app)
        .put(`/api/people/${nonExistentId}`)
        .send({ name: "Updated John Doe" })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal("Person not found.");
        });
    });
  });

  describe("DELETE /api/people/:id", () => {
    it("should delete a person by ID", () => {
      let savedPerson;

      // Insert a sample person into the database
      return new Person({ name: "John Doe" }).save().then((person) => {
        savedPerson = person;
        return chai
          .request(app)
          .delete(`/api/people/${savedPerson._id}`)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body.name).to.equal("John Doe");
          });
      });
    });

    it("should return an error for a non-existent ID", () => {
      const nonExistentId = "60aaf0c6c0356038a8888888"; // Non-existent ID
      return chai
        .request(app)
        .delete(`/api/people/${nonExistentId}`)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal("Person not found.");
        });
    });
  });
});

after(async () => {
  await mongoose.connection.close();
  process.exit();
});
