$(function() {

  //storing all the data in the model
  var model = {
    //the emails array is used for sending the newsletter
    emails: [],
    contacts:[],
    comments: [],

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

    setLocalStorageForComments: function(comment, name, number) {
      localStorage.setItem(`comment ${number}`, comment);
      localStorage.setItem(`name ${number}`, name);
    },

    getLocalStorageData: function() {
      for(let i = 0; i < localStorage.length; i++) {
        model.comments.push(localStorage.getItem(localStorage.key(i)));
      }
      control.setStorageData(model.comments);
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

    handleComment: function(comment, name, number) {
      model.setCommentData(comment, name, number);
    },

    getSafedData: function() {
      model.getLocalStorageData();
    },

    setStorageData: function(storedData) {
      view.appendStorageData(storedData);
    }
  };

  // here is everything related to the ui
  var view = {

    init: function() {
      $('#subscribe-button').click(view.submitEmail);
      $('#search-button').click(view.submitSearch);
      $('#contact-button').click(view.submitContactData);
      $('#send-comment').click(view.submitComment);

      control.getSafedData();
    },

    submitEmail: function() {
      control.handleEmail($('#email-input').val());
      $('#email-input').val('');
    },

    submitSearch: function() {
      // const searchValue = $('#search-input');

      // const searchResult = $('body').text().search(searchValue);
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
      $('.go-back').prepend(`<div class="comment"><p class="push-comment-name">${name}</p><p class="push-comment">${comment}</p></div>`);

      $('#comment-text').val('');
      $('#comment-name').val('');

      let numberOfComments;
      numberOfComments++;

      control.handleComment(comment, name, numberOfComments);
    },

    appendStorageData: function(storedData) {
      for(let i = 0; i < storedData.length; i++) {
        $('.go-back').prepend(`<div class="comment"><p class="push-comment-name">${storedData[i-1]}</p><p class="push-comment">${storedData[i]}</p></div>`);
      }
    }
  };
  control.init();
});