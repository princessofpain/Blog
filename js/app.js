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
      localStorage.setItem(name, `${name}`);
      localStorage.setItem(password, `${password}`);
    },

    getLogin: function() {
      let check = false;
      if(localStorage.getItem('name') === 'admin' && localStorage.getItem('password') === '12345') {
        check = true;
      }
      control.checkLogin(check);
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

    checkLogin: function(check) {
      if(check === true) {
        view.displayAdmin;
      }
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
      $('#admin-logout-button').click(view.logout);

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
      $('#select-occasion option[value='default']').attr('selected', true);
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
    },

    displayAdmin: function() {
      $('.admin').css('display', 'block');
    },

    logout: function() {}
  };
  control.init();
});