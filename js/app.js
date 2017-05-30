App = Ember.Application.create();

App.Router.map(function() {
  this.resource('estructura');
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' })
  });
});

App.Store = DS.Store.extend({
    revision:12,
    adapter: 'DS.FixtureAdapter'
});

App.IndexRoute = Ember.Route.extend({
  redirect: function () {
    this.transitionTo('posts');
  }
});


App.PostsRoute = Ember.Route.extend({
    model: function() {
      return App.Post.find();
    }

});

App.PostsIndexRoute = Ember.Route.extend({
  redirect: function () {
    var posts = this.modelFor('posts');
    var post = posts.get('firstObject');

    if(!post)
    {
        console.log("LOADING bootstrap'ed DATA");
        DS.get('defaultStore').load(App.Post, bootstrap);
        post = App.Post.find(1);
    }

    this.transitionTo('post', post);
  }
});

App.PostController = Ember.ObjectController.extend({
    isEditing: false,
    edit: function()
    {
      this.set('isEditing',true);
    },
    doneEditing: function()
    {
      this.get('store').commit();
      this.set('isEditing',false);
    }

});

moment.lang('es',
{
  relativeTime: {
    past : 'hace %s',
    s : "unos segundos",
    m : "un minuto",
    mm : "%d minutos",
    h : "una hora",
    hh : "%d horas",
    d : "un día",
    dd : "%d días",
    M : "un mes",
    MM : "%d mes",
    y : "un año",
    yy : "%d años"
  }
});

Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});

//creamos objeto converter
//para pasar de markdown a HTML
var showdown = new Showdown.converter();

Ember.Handlebars.registerBoundHelper('markdown', function(input) {
  //devolvemos SafeString para que no escape el contenido HTML
  return new Ember.Handlebars.SafeString(showdown.makeHtml(input));
});

App.Post = DS.Model.extend({
    title: DS.attr('string'),
    author: DS.attr('string'),
    text: DS.attr('string'),
    publishedAt: DS.attr('date')
});

App.Post.FIXTURES = [{
    id:1,
    title: "Qué es ember.js",
    author: "JAM",
    publishedAt: new Date('30-05-2017'),
    text: "Es un javaScript frond-end framework diseñado para crear  sitios web con complejas y ricas interacciones de usuarios. Lo hace proporcionando a los desarrolladores muchas características que son esenciales para gestionar la complejidad en las aplicaciones web modernas, así como un conjunto de herramientas de desarrollo integrado que permite una iteración rápida"
},
{
    id:2,
    title: "Introducción al framework Ember.js",
    author: "JAM",
    publishedAt: new Date('30-05-2017'),
    text: "EmberJS es un framework preparado para programar de forma sencilla y elegante, lo que sus creadores definen como The Ember Way. Esto permite que se puedan hacer grandes desarrollos con pocas líneas de código, siempre y cuando nos adaptemos a las limitaciones del marco. El desarrollo de este framework se basa en el paradigma MVC (Model, View, Controller), y su uso combinado con otro framework llamado handlebars, permite desarrollar aplicaciones web de una forma increíblemente acelerada"
}];