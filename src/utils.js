const $ = require('jquery');

module.exports = {

  setContentHeader: (title) => {
    $('#content-header').texy(title);
  },

  setContent: (el) => {
    $('#content').empty();
    $('#content').append(el);
  },

  getContentHeader: () => {
    return $('#content-header');
  },

  getContent: () => {
    return $('#content');
  }
}

  
