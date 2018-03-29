$(function() {

  //storing all the data in the model
  var model = {
    //the emails array is used for sending the newsletter
    emails: [],
    contacts:[],

    contactData: function(name, email) {
      this.name = name;
      this.email = email;
    },

    setContactData: function(name, email, boolean){
      model.contacts.push(new model.contactData(name, email));

      // if the checkbox was checked push email in the array for the newsletter
      if(boolean === true) {
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
    }

  };

  // build a bridge betweem model and view
  var control = {
    init: function() {
      view.init();
    },

    handleEmail: function(email) {
      model.setEmail(email);
    }
  };

  // here is everything related to the ui
  var view = { //eslint-disable-line

    init: function(){
      $('#subscribe-button').submit(view.submitEmail);
      $('#search-button').sumbit(view.search);
      $('#contact-button').sumbit(view.contactData);
      $('#comment-button').sumbit(view.comment);
    },

    submitEmail: function() {
      const subscribedEmail = $('#email-input');
      control.handleEmail(subscribedEmail);
      subscribedEmail.text('');
    },

    search: function() {

    },

    contact: function() {

    },

    comment: function() {

    }
  };
  control.init();
});