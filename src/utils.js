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
  },

  appendContent: (el) =>{
    $('#content').append(el);
  },

  resetContent: ()=> {
    $('#area').empty();
    $('#crime').empty();
    $('#postcode').empty();
    $('#broadband').empty();
    $('#mobile').empty();
    $('#politics').empty();
    $('#demographics').empty();
    $('#age').empty();
    $('#unemployment').empty();
    $('#income').empty();
  },

  setCrime: (el) =>{
    $('#crime').empty();
    $('#crime').append(el);
  },
  setPostcode: (el) =>{
    $('#postcode').empty();
    $('#postcode').append(el);
  },
  setArea: (el) =>{
    $('#area').empty();
    $('#area').append(el);
  },
  setBroadband: (el) =>{
    $('#broadband').empty();
    $('#broadband').append(el);
  },
  setMobile: (el) =>{
    $('#mobile').empty();
    $('#mobile').append(el);
  },
  setPolitics: (el) =>{
    $('#politics').empty();
    $('#politics').append(el);
  },
  setDemographics: (el) =>{
    $('#demographics').empty();
    $('#demographics').append(el);
  },
  setAge: (el) =>{
    $('#age').empty();
    $('#age').append(el);
  },
  setUnemployment: (el) =>{
    $('#unemployment').empty();
    $('#unemployment').append(el);
  },
  setIncome: (el) =>{
    $('#income').empty();
    $('#income').append(el);
  },

  openSidebar: () => {
    sidebar.open('home');
  },

  closeSidebar: () => {
    sidebar.close();
  }
}

  
