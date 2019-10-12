var courses = new Vue({
  el: '#courses',
  delimiters: ['${','}'],
  data: {
    courses: [],
    activeCourse: {},
    currentPage: 1,
    perPage: 12,
  },

  computed: {
    cities: function() {
      return _.uniq(_.map(this.courses, 'city'));
    },

    areas: function() {
      return _.uniq(_.map(this.courses, 'area'));
    },

    filteredList: function() {
      return this.courses;
    },

    startIndex: function() {
      return (this.currentPage - 1) * this.perPage;
    },

    endIndex: function() {
      var itemsCount = this.filteredList.length;
      var pageLastIndex = this.currentPage * this.perPage;
      return pageLastIndex < itemsCount ? pageLastIndex : itemsCount;
    },

    paginatedList: function() {
      return this.filteredList.slice(this.startIndex, this.endIndex);
    },

    pageCount: function() {
      return Math.ceil(this.filteredList.length / this.perPage);
    }
  },

  methods: {
    changePage: function(n) {
      // this.scrollIntoView('exhibitions');
      // this.setLoading(true);
      this.currentPage = n;
      // setTimeout(() => { this.setLoading(false); }, 500);
    },
    toggleModal: function(content) {
      this.activeCourse = content;
    }
  },

  created: function() {

    var self = this;
    var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/16C4SoPyq50yP2rLITPspAlAQLgDYBEK96Lf3Y1mVcQo/edit?usp=sharing';

    Tabletop.init( { key: publicSpreadsheetUrl,
                   callback: showInfo,
                   simpleSheet: true } )

    function showInfo(data, tabletop) {
      self.courses = data;
    }
  }
});
