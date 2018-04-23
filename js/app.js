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

    setLocalStorageData: function(comment, name, title, date) {
      let numOfComments = $('.comment').length;

      localStorage.setItem(`${numOfComments} c`, comment);
      localStorage.setItem(`${numOfComments} n`, name);
      localStorage.setItem(`${numOfComments} t`, title);
      localStorage.setItem(`${numOfComments} d`, date);
    },

    getLocalStorageData: function() {
      const storedData = localStorage;
      control.setStorageData(storedData);
    },

    deleteComments: function(comments) {
      const storageArray = Object.entries(localStorage);
      const regexpComment = new RegExp(/\d\sc/);
      let keysAllComments = [];
      let keysToDelete = [];

      for(let i = 0; i < storageArray.length; i++) {
        if(storageArray[i][0].match(regexpComment) != null) {
          keysAllComments.push(storageArray[i]);
        }
      }

      // delete the checked comments and push the keys into an array
      comments.forEach(function(comment) {
        keysAllComments.forEach(function(key) {
          if(comment === key[1]) {
            keysToDelete.push(key[0]);
            localStorage.removeItem(key[0]);
          }
        });
      });

      // identify and delete all entries of the localStorage that are related to the comment
      keysToDelete.forEach(function(key) {
        const keyNumber = key.slice(0, 1);
        storageArray.forEach(function(localKey){
          const localKeyNumber = localKey[0].slice(0,1);
          if(keyNumber === localKeyNumber) {
            localStorage.removeItem(localKey[0]);
          }
        });
      });
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

    handleComment: function(comment, name, title, date) {
      model.setLocalStorageData(comment, name, title, date);
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
    },

    handleCommentDeletion: function(comments) {
      model.deleteComments(comments);
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
      const date = view.calculateDate();
      const time = view.calculateTime();

      if($('.comment').length === 0) {
        $('.comments').append(`<div class='comment'><p class='push-comment-name'>${name}</p><p class='push-comment'>${comment}</p><p class="date">${date}</p></div>`);
      } else {
        $('.comment:first').prepend(`<div class='comment'><p class='push-comment-name'>${name}</p><p class='push-comment'>${comment}</p><p class="date">Comment posted at ${date}, ${time}</p></div>`);
      }

      control.handleComment(comment, name, title, date);

      $('#comment-text').val('');
      $('#comment-name').val('');
    },

    calculateDate: function() {
      let today = new Date();
      let day = today.getDate();
      let month = today.getMonth()+1; //January is 0!
      const year = today.getFullYear();

      if(day< 10) {
        day = '0' + day;
      }

      if(month < 10) {
        month = '0' + month;
      }

      today = `${day}.${month}.${year}`;
      return today;
    },

    calculateTime: function() {
      let now = new Date();
      let minute = now.getMinutes();
      let hour = now.getHours();

      if(hour < 10) {
        hour = '0' + hour;
      }

      if(minute < 10) {
        minute = '0' + minute;
      }

      now = `${hour}:${minute}`;
      return now;
    },

    appendStorageData: function(storedData) {
      for(let i = storedData.length; i > 0; i--) {
        const comment = storedData.getItem(`${i} c`);
        const name = storedData.getItem(`${i} n`);
        const title = storedData.getItem(`${i} t`);
        const date = storedData.getItem(`${i} d`);

        if(title === $('title').text()) {
          $('.comments').append(`<div class='comment'><p class='push-comment-name'>${name}</p><p class='push-comment'>${comment}</p><p class="date">Comment posted at ${date}</p></div>`);
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
      $('input:radio').remove();
    },

    displayAdminFunctions: function() {
      if($('title').text() === 'Login' && $('.admin').children().length === 2) {
        $('.admin').append('<div class="no-delete-button"><p>The admin functions are only usable for deleting comments! </br> Please switch to an article and click again.</p></div>');
      } else if ($('#admin-delete').length === 0 && $('.admin').children().length === 2) {
        $('.admin').append('<button id="admin-delete">Delete comment(s)</button>');
        $('#admin-delete').click(view.deleteComments);

        let comment = $('.comment').first();
        for(let i = 0; i < $('.comment').length; i++) {
          comment.attr('id', `${i}`);
          comment.first().prepend(`<input type="radio" id="${i}" class="radio">`);
          comment = comment.next();
        }
      } else {
        $('#admin-delete').remove();
        $('input:radio').remove();
      }
    },

    deleteComments: function() {
      const inputs = $('input:radio:checked');
      const commentNames = inputs.next();
      const commentTexts = commentNames.next();
      const parentInputs = inputs.parent();
      let comments = [];

      for (let commentText of commentTexts) {
        comments.push(commentText.innerHTML);
      }

      control.handleCommentDeletion(comments);

      parentInputs.remove();
    }
  };
  control.init();
});