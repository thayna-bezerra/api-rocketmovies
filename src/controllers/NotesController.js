const { response } = require('express');
const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const { title, description, tags, rating } = request.body;
    const { user_id } = request.params;

    const movie_note_id = await knex("movie_notes").insert({
      title, 
      description,
      rating,
      user_id
    });

    const tagsInsert = tags.map(name => {
      return{
        name, 
        movie_note_id,
        user_id
      }
    })

    await knex("movie_tags").insert(tagsInsert);

    response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags").where({ movie_note_id: id }).orderBy("name"); 

    return response.json({
      ...note,
      tags
    });
  }

  async delete(request, response){
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response){
    const {user_id} = request.query;

    const notes = await knex("movie_notes")
    .where({user_id})
    .orderBy("title");

    return response.json(notes);
  }
}

module.exports = NotesController;