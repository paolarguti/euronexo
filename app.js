var courses = new Vue({
  el: '#courses',
  delimiters: ['${','}'],
  data: {
    courses: [],
    activeCourse: {},
    currentPage: 1,
    perPage: 12,

    filters: {
      keywords: '',

      areas: [],

      cities: []
    },

    query: {
      keywords: '',

      areas: [],

      cities: []
    },

    show: {
      areas: false,
      cities: false
    }
  },

  computed: {
    filteredList: function() {
      if (!this.hasFilters) return this.courses;

      var q = this.query;

      return this.courses.filter(function(course) {
        return ( q.keywords.length === 0 || _.includes(q.keywords, course.course) )
            && _.includes(q.cities, course.city)
            && _.includes(q.areas, course.area);
      });
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
    },

    hasFilters: function() {
      return this.query.keywords.length || this.query.areas.length || this.query.cities.length;
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
      var cities = _.uniq(_.map(data, 'city')).sort()
      var areas = _.uniq(_.map(data, 'area')).sort();
      self.filters.cities = cities;
      self.query.cities = cities;
      self.filters.areas = areas;
      self.query.areas = areas;
    }
  }
});
