$(function() {

  //storing all the data in the model
  var model = {
    //the emails array is used for sending the newsletter
    emails: [],
    contacts:[],

    contactData: function(name, email, occasion, message) {
      this.name = name;
      this.email = email;
      this.occasion = occasion;
      this.message = message;
    },

    setContactData: function(name, email, checkbox, occasion, message){
      model.contacts.push(new model.contactData(name, email, occasion, message));

      // if the checkbox was checked push email in the array for the newsletter
      if(checkbox.checked === true) {
        model.checkDoubleMail(email);
      }
    },

    setEmail: function(email){
      model.checkDoubleMail(email);
    },

    checkDoubleMail: function(email) {
      if(model.emails.includes(email) === false) {
        model.emails.push(email);
      }
    },

    setLocalStorageData: function(comment, name, title) {
      let numOfComments;
      for(let i = 0; i < localStorage.length; i++) {
        if((i+1) === localStorage.length) {
          numOfComments = i + 2;
        }
      }

      localStorage.setItem(`${numOfComments} c`, comment);
      localStorage.setItem(`${numOfComments} n`, name);
      localStorage.setItem(`${numOfComments} t`, title);
    },

    getLocalStorageData: function() {
      const storedData = localStorage;
      control.setStorageData(storedData);
    },

    setLogin: function(name, password) {
      localStorage.setItem('username', name);
      localStorage.setItem('key', password);
    },

    getLogin: function() {
      const username = localStorage.getItem('username');
      const key = localStorage.getItem('key');
      if(username === 'admin' && key === '12345') {
        control.loginTrue();
      } else {
        control.loginFalse();
      }
    }
  };

  // build a bridge between model and view
  var control = {
    init: function() {
      view.init();
    },

    handleEmail: function(email) {
      model.setEmail(email);
    },

    handleContactData: function(name, email, checkbox, occasion, message) {
      model.setContactData(name, email, checkbox, occasion, message);
    },

    handleComment: function(comment, name, title) {
      model.setLocalStorageData(comment, name, title);
    },

    getSafedData: function() {
      model.getLocalStorageData();
    },

    setStorageData: function(storedData) {
      view.appendStorageData(storedData);
    },

    keepLogin: function(name, password) {
      model.setLogin(name, password);
    },

    checkLogin: function() {
      model.getLogin();
    },  

    loginTrue: function() {
      view.displayAdmin();
    },

    loginFalse: function() {
      view.hideAdmin();
    }
  };

  // here is everything related to the ui
  var view = {

    init: function() {
      $('#subscribe-button').click(view.submitEmail);
      $('#search-button').click(view.submitSearch);
      $('#contact-button').click(view.submitContactData);
      $('#send-comment').click(view.submitComment);
      $('#admin-login-button').click(view.login);
      $('#admin-logout-button').click(view.hideAdmin);
      $('#admin-button').click(view.displayAdminFunctions);

      control.getSafedData();
      control.checkLogin();
    },

    submitEmail: function() {
      control.handleEmail($('#email-input').val());
      $('#email-input').val('');
    },

    submitSearch: function() {
      // const searchValue = $('#search-input');

      // const searchResult = $('body').text.search(searchValue);
    },

    submitContactData: function() {
      const occasion = $('#select-occasion option:selected');

      control.handleContactData($('#contact-name').val(), $('#contact-email').val(),
        $('#checkbox-newsletter'), occasion, $('#contact-text'));

      $('#contact-name').val('');
      $('#contact-email').val('');
      $('#checkbox-newsletter').checked;
      $('#select-occasion option').removeAttr('selected');
      $('#select-occasion option[value="default"]').attr('selected', true); 
      $('#contact-text').val('');
    },

    submitComment: function() {
      const comment = $('#comment-text').val();
      const name = $('#comment-name').val();
      const title = $('title').text();

      $('.go-back').prepend(`<div class='comment'><p class='push-comment-name'>${name}</p><p class='push-comment'>${comment}</p></div>`);

      control.handleComment(comment, name, title);

      $('#comment-text').val('');
      $('#comment-name').val('');
    },

    appendStorageData: function(storedData) {
      for(let i = 0; i < storedData.length; i++) {
        const comment = storedData.getItem(`${i} c`);
        const name = storedData.getItem(`${i} n`);
        const title = storedData.getItem(`${i} t`);

        if(title === $('title').text()) {
          $('.go-back').prepend(`<div class='comment'><p class='push-comment-name'>${name}</p><p class='push-comment'>${comment}</p></div>`);
        }
      }
    },

    login: function() {
      const name = $('#login-name').val();
      const password = $('#login-password').val();
      control.keepLogin(name, password);
      control.checkLogin();
      view.wrongLogIn();
    },

    displayAdmin: function() {
      $('.admin').css('display', 'block');
    },

    wrongLogIn: function() {
      const adminDisplayed = $('.admin').css('display');
      if(!(adminDisplayed === 'block')){
        $('.login').append('<p>Wrong username or password.</p>');
      }
    },

    hideAdmin: function() {
      $('.admin').css('display', 'none');
    },

    displayAdminFunctions: function() {
      if($('title').text() === 'Login' && $('.admin').children().length === 2) {
       $('.admin').append('<div class="no-delete-button"><p>The admin functions are only usable for deleting comments! </br> Please switch to an article and click again.</p></div>');
      } else if ($('#admin-delete').length === 0 && $('.admin').children().length === 2) {
        $('.admin').append('<button id="admin-delete">Delete comment(s)</button>');
        $('#admin-delete').click(view.deleteComments);

        for(let i = 0; i < $('.comment').length; i++) {
          $('.comment').attr('id', `${i}`);
          $('.push-comment-name').prepend(`<input type="radio" id="${i}">`);
        } 
      } else {
        $('#admin-delete').remove();
        $('input:radio').remove();
      }
    },

    deleteComments: function() {
      const inputs = $('input:radio').length;
      for(let i = 0; i < inputs; i++) {
        const radioButtonChecked = $(`${inputs[i]}:checked`);
        radioButtonChecked.remove();
        $(`.comment#${i}`).remove();
      }
    }
  };
  control.init();
});