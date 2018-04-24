// loading Facebook JavaScript SDK
$(document).ready(function() {
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.12';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
});

// loading Twitter for Websites
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://platform.twitter.com/widgets.js';
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, 'script', 'twitter-wjs'));


// web page functionality
$(function() {
  //storing all the data in the model
  var model = {
    setContactData: function(name, email, checkbox, occasion, message){
      const number = localStorage.length + 1;
      localStorage.setItem(`${number} name`, name);
      localStorage.setItem(`${number} email`, email);
      localStorage.setItem(`${number} newsletter`, checkbox);
      localStorage.setItem(`${number} occasion`, occasion);
      localStorage.setItem(`${number} message`, message);

      // if the checkbox was checked push email in the array for the newsletter
      if(checkbox === 1) {
        model.checkDoubleMail(email);
      }
    },

    setEmail: function(email){
      model.checkDoubleMail(email);
    },

    checkDoubleMail: function(email) {
      const number = localStorage.length + 1;
      const storageArray = Object.entries(localStorage);
      const emailIsNew = function(element) {
        return email != element;
      };

      if(storageArray.some(emailIsNew)) {
        localStorage.setItem(`${number} mail`, email);
      }
    },

    setLocalStorageData: function(comment, name, title, date, time) {
      let numOfComments = localStorage.length + 1;

      localStorage.setItem(`${numOfComments} c`, comment);
      localStorage.setItem(`${numOfComments} n`, name);
      localStorage.setItem(`${numOfComments} t`, title);
      localStorage.setItem(`${numOfComments} d`, date);
      localStorage.setItem(`${numOfComments} ti`, time);
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
    },

    deleteLoginData: function() {
      localStorage.removeItem('key');
      localStorage.removeItem('username');
    },

    getStorageEmails: function() {
      const regexpEmail = new RegExp(/\d+\smail/);
      let emails = [];

      for(const item in localStorage) {
        if(item.match(regexpEmail) != null) {
          emails.push(localStorage.getItem(item));
        }
      }

      control.handleEmailList(emails);
    },

    getStorageMessages: function() {
      const regexpMessage = new RegExp(/\d+\smessage/);
      const storageArray = Object.entries(localStorage);
      let localNumber;
      let allMessages = [];

      for(const item in localStorage) {
        if(item.match(regexpMessage) != null) {
          localNumber = item.slice(0,2);

          storageArray.forEach(function(dataPair){
            const keyNumber = dataPair[0].slice(0,2);
            if(keyNumber.match(localNumber) != null) {
              allMessages.push(dataPair[1]);
            }
          });
        }
      }
      control.handleMessageList(allMessages);
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

    handleComment: function(comment, name, title, date, time) {
      model.setLocalStorageData(comment, name, title, date, time);
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

    handleLogout: function() {
      model.deleteLoginData();
    },

    handleCommentDeletion: function(comments) {
      model.deleteComments(comments);
    },

    handleStorageEmails: function() {
      model.getStorageEmails();
    },

    handleEmailList: function(emails) {
      view.displayEmailList(emails);
    },

    handleStorageMessages() {
      model.getStorageMessages();
    },

    handleMessageList(messages) {
      view.displayMessageList(messages);
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
      $('#show-emails-button').click(view.displayEmails);
      $('#show-messages-button').click(view.displayMessages);

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
      const occasion = $('#select-occasion option:selected').val();
      const checkbox = $('#checkbox-newsletter:checked').length;
      const name = $('#contact-name').val();
      const email = $('#contact-email').val();
      const message = $('#contact-text').val();

      control.handleContactData(name, email, checkbox, occasion, message);

      $('#contact-name').val('');
      $('#contact-email').val('');
      $('#checkbox-newsletter').checked;
      $('#select-occasion').val('');
      $('#contact-text').val('');
    },

    submitComment: function() {
      const comment = $('#comment-text').val();
      const name = $('#comment-name').val();
      const title = $('title').text();
      const date = view.calculateDate();
      const time = view.calculateTime();

      if($('.comment').length === 0) {
        $('.comments').append(`<div class='comment'><p class='push-comment-name'>${name}</p><p class='push-comment'>${comment}</p><p class="date">Comment posted at ${date}, ${time}</p></div>`);
      } else {
        $('.comment:first').prepend(`<div class='comment'><p class='push-comment-name'>${name}</p><p class='push-comment'>${comment}</p><p class="date">Comment posted at ${date}, ${time}</p></div>`);
      }

      control.handleComment(comment, name, title, date, time);

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
      let minutes = now.getMinutes();
      let hours = now.getHours();

      if(hours < 10) {
        hours = `0${hours}`;
      }

      if(minutes < 10) {
        minutes = `0${minutes}`;
      }

      now = `${hours}:${minutes}`;
      return now;
    },

    appendStorageData: function(storedData) {
      for(let i = storedData.length; i > 0; i--) {
        const comment = storedData.getItem(`${i} c`);
        const name = storedData.getItem(`${i} n`);
        const title = storedData.getItem(`${i} t`);
        const date = storedData.getItem(`${i} d`);
        const time = storedData.getItem(`${i} ti`);

        if(title === $('title').text()) {
          $('.comments').append(`<div class='comment'><p class='push-comment-name'>${name}</p><p class='push-comment'>${comment}</p><p class="date">Comment posted at ${date}, ${time}</p></div>`);
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
      $('.login').last().remove();
      $('.admin').css('display', 'block');
      $('.admin-link').css('display', 'inherit');
      if($('title').text() === 'Login') {
        $('.admin').prepend('<p id="admin-message">Please change to the <a href="admin.html">admin area</a> or have a look at the <a href="allArticles.html">articles</a> to use the admin functions.</p>');
      }
    },

    wrongLogIn: function() {
      // const adminDisplayed = $('.admin').css('display');
      if($('.login').children().length === 5){
        $('.login').append('<p>Wrong username or password.</p>');
      }
    },

    hideAdmin: function() {
      $('.admin').css('display', 'none');
      $('input:radio').remove();
      $('.lists').css('display', 'none');
      $('admin-link').css('display', 'none');

      control.handleLogout();
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
    },

    displayEmails: function() {
      control.handleStorageEmails();
    },

    displayEmailList: function(emails) {
      $('#messages').remove();
      $('#mails').remove();
      $('.lists').append('<table id="mails"><tr><th>Emails</th></tr></table>');

      emails.forEach(function(mail) {
        $('#mails').append(`<tr><td>${mail}</td></tr>`);
      });
    },

    displayMessages: function() {
      control.handleStorageMessages();
    },

    displayMessageList: function(messages) {
      $('#mails').remove();
      $('#messages').remove();
      $('.lists').append('<table id="messages"><tr><th>Email</th><th>Message</th><th>Name</th><th>Newsletter</th><th>Occasion</th></tr></table>');

      for(let i = 0; i < messages.length; i++){
        $('#messages').append(`<tr><td>${messages[i]}</td>Message<td>${messages[i + 1]}</td><td>${messages[i + 2]}</td><td>${messages[i + 3]}</td><td>${messages[i + 4]}</td></tr>`);
        i = i + 4;
      }
    }
  };
  control.init();
});